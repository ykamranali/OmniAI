"""Scoped memory routes (global / workspace / project / conversation)."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.enums import MemoryScope
from app.models.memory import Memory
from app.models.user import User
from app.schemas.memory import MemoryCreate, MemoryRead

router = APIRouter(prefix="/memory", tags=["memory"])


@router.get("", response_model=list[MemoryRead])
async def list_memory(
    scope: MemoryScope,
    scope_id: uuid.UUID | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Memory]:
    query = select(Memory).where(Memory.scope == scope, Memory.user_id == user.id)
    if scope_id is not None:
        query = query.where(Memory.scope_id == scope_id)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.post("", response_model=MemoryRead, status_code=201)
async def upsert_memory(
    payload: MemoryCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Memory:
    result = await db.execute(
        select(Memory).where(
            Memory.user_id == user.id,
            Memory.scope == payload.scope,
            Memory.scope_id == payload.scope_id,
            Memory.key == payload.key,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.value = payload.value
        await db.commit()
        await db.refresh(existing)
        return existing

    memory = Memory(
        user_id=user.id, scope=payload.scope, scope_id=payload.scope_id, key=payload.key, value=payload.value
    )
    db.add(memory)
    await db.commit()
    await db.refresh(memory)
    return memory


@router.delete("/{memory_id}", status_code=204)
async def delete_memory(
    memory_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    result = await db.execute(select(Memory).where(Memory.id == memory_id, Memory.user_id == user.id))
    memory = result.scalar_one_or_none()
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    await db.delete(memory)
    await db.commit()
