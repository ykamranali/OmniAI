from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import MessageRole


class ConversationCreate(BaseModel):
    project_id: uuid.UUID | None = None
    title: str = "New Chat"
    model: str = "gpt-4o-mini"


class ConversationUpdate(BaseModel):
    title: str | None = None
    pinned: bool | None = None


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID | None
    user_id: uuid.UUID
    title: str
    model: str
    pinned: bool
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    role: MessageRole = MessageRole.USER
    content: str = Field(min_length=1)
    attachments: list[dict[str, Any]] | None = None


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    role: MessageRole
    content: str
    model: str | None
    tokens_used: int | None
    attachments: list[dict[str, Any]] | None
    created_at: datetime
