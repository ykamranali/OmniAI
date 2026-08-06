from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import AgentType


class AgentCreate(BaseModel):
    workspace_id: uuid.UUID | None = None
    name: str
    type: AgentType = AgentType.CUSTOM
    description: str | None = None
    system_prompt: str = ""


class AgentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID | None
    name: str
    type: AgentType
    description: str | None
    system_prompt: str
    is_active: bool
    created_at: datetime


class OrchestrationRequest(BaseModel):
    project_id: uuid.UUID
    prompt: str
