from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import FilePurpose


class FileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    project_id: uuid.UUID | None
    uploaded_by: uuid.UUID
    filename: str
    mime_type: str
    size_bytes: int
    purpose: FilePurpose
    created_at: datetime


class PresignedUrlResponse(BaseModel):
    url: str
    expires_in_seconds: int
