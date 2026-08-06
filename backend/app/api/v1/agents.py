"""Agent catalog + orchestration trigger routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.registry import list_system_agents
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.agent import OrchestrationRequest
from app.schemas.task import TaskRead
from app.services.orchestrator import generate_task_graph

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("")
async def list_agents(user: User = Depends(get_current_user)) -> list[dict]:
    return list_system_agents()


@router.post("/orchestrate", response_model=list[TaskRead], status_code=201)
async def orchestrate(
    payload: OrchestrationRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list:
    """
    Kick off the multi-agent flow: Planner Agent decomposes `prompt` into a
    task graph for `project_id`. The created tasks are returned immediately;
    executing each task with its assigned specialist agent happens as a
    separate step (poll /tasks or drive it from the UI's task board).
    """
    return await generate_task_graph(payload.project_id, payload.prompt, db)
