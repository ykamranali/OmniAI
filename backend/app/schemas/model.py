from __future__ import annotations

from pydantic import BaseModel


class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    local: bool = False
    context_window: int | None = None


class ThreeSceneRequest(BaseModel):
    prompt: str
    project_id: str | None = None


class ThreeSceneResponse(BaseModel):
    scene: dict
