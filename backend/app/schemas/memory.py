from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models.enums import MemoryScope


class MemoryCreate(BaseModel):
    scope: MemoryScope = MemoryScope.GLOBAL
    scope_id: uuid.UUID | None = None
    key: str
    value: dict[str, Any]


class MemoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID | None
    scope: MemoryScope
    scope_id: uuid.UUID | None
    key: str
    value: dict[str, Any]
    created_at: datetime
