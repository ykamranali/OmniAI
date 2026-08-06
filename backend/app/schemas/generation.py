from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models.enums import GenerationStatus, GenerationType


class GenerationCreate(BaseModel):
    workspace_id: uuid.UUID
    project_id: uuid.UUID | None = None
    type: GenerationType
    prompt: str


class GenerationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    project_id: uuid.UUID | None
    type: GenerationType
    status: GenerationStatus
    prompt: str
    result_storage_key: str | None
    error_message: str | None
    extra_metadata: dict[str, Any] | None
    created_at: datetime
