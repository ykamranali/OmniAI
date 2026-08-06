"""
Chat routes: conversation/message CRUD (REST) plus a WebSocket endpoint that
streams model output token-by-token via the LiteLLM gateway.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import decode_token
from app.db.session import AsyncSessionLocal, get_db
from app.models.conversation import Conversation
from app.models.enums import MessageRole
from app.models.message import Message
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationRead,
    ConversationUpdate,
    MessageCreate,
    MessageRead,
)
from app.services.llm_gateway import stream_chat_completion

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/conversations", response_model=list[ConversationRead])
async def list_conversations(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Conversation]:
    result = await db.execute(
        select(Conversation).where(Conversation.user_id == user.id).order_by(Conversation.updated_at.desc())
    )
    return list(result.scalars().all())


@router.post("/conversations", response_model=ConversationRead, status_code=201)
async def create_conversation(
    payload: ConversationCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Conversation:
    conversation = Conversation(
        user_id=user.id, project_id=payload.project_id, title=payload.title, model=payload.model
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)
    return conversation


@router.patch("/conversations/{conversation_id}", response_model=ConversationRead)
async def update_conversation(
    conversation_id: uuid.UUID,
    payload: ConversationUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Conversation:
    conversation = await _get_conversation_or_404(conversation_id, user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(conversation, field, value)
    await db.commit()
    await db.refresh(conversation)
    return conversation


@router.delete("/conversations/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    conversation = await _get_conversation_or_404(conversation_id, user, db)
    await db.delete(conversation)
    await db.commit()


async def _get_conversation_or_404(conversation_id: uuid.UUID, user: User, db: AsyncSession) -> Conversation:
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id)
    )
    conversation = result.scalar_one_or_none()
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageRead])
async def list_messages(
    conversation_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Message]:
    await _get_conversation_or_404(conversation_id, user, db)
    result = await db.execute(
        select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    )
    return list(result.scalars().all())


@router.post("/conversations/{conversation_id}/messages", response_model=MessageRead, status_code=201)
async def add_message(
    conversation_id: uuid.UUID,
    payload: MessageCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Message:
    """Non-streaming fallback for clients that don't use the WebSocket (e.g. curl, mobile)."""
    conversation = await _get_conversation_or_404(conversation_id, user, db)
    message = Message(
        conversation_id=conversation.id, role=payload.role, content=payload.content, attachments=payload.attachments
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


# ---------------------------------------------------------------------------
# WebSocket streaming
# ---------------------------------------------------------------------------
@router.websocket("/ws/{conversation_id}")
async def chat_websocket(websocket: WebSocket, conversation_id: uuid.UUID) -> None:
    """
    Protocol:
      client -> {"token": "<jwt access token>", "content": "user message"}
      server -> {"type": "delta", "content": "..."} (repeated)
      server -> {"type": "done", "message_id": "..."}
      server -> {"type": "error", "detail": "..."}
    """
    await websocket.accept()

    try:
        init = await websocket.receive_json()
    except Exception:
        await websocket.close(code=4000)
        return

    payload = decode_token(init.get("token", ""), "access")
    if payload is None:
        await websocket.send_json({"type": "error", "detail": "Unauthorized"})
        await websocket.close(code=4001)
        return

    user_id = uuid.UUID(payload["sub"])

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user_id)
        )
        conversation = result.scalar_one_or_none()
        if conversation is None:
            await websocket.send_json({"type": "error", "detail": "Conversation not found"})
            await websocket.close(code=4004)
            return

        try:
            while True:
                user_content = init.get("content") if init else None
                if user_content is None:
                    init = await websocket.receive_json()
                    user_content = init.get("content", "")

                user_message = Message(conversation_id=conversation.id, role=MessageRole.USER, content=user_content)
                db.add(user_message)
                await db.commit()

                history_result = await db.execute(
                    select(Message)
                    .where(Message.conversation_id == conversation.id)
                    .order_by(Message.created_at)
                )
                history = [{"role": m.role.value, "content": m.content} for m in history_result.scalars().all()]

                full_response = ""
                async for delta in stream_chat_completion(conversation.model, history):
                    full_response += delta
                    await websocket.send_json({"type": "delta", "content": delta})

                assistant_message = Message(
                    conversation_id=conversation.id,
                    role=MessageRole.ASSISTANT,
                    content=full_response,
                    model=conversation.model,
                )
                db.add(assistant_message)
                await db.commit()
                await db.refresh(assistant_message)

                await websocket.send_json({"type": "done", "message_id": str(assistant_message.id)})
                init = None
        except WebSocketDisconnect:
            return
        except Exception as exc:  # noqa: BLE001
            await websocket.send_json({"type": "error", "detail": str(exc)})
            await websocket.close(code=1011)
