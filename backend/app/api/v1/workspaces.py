"""Workspace CRUD + membership routes."""
from __future__ import annotations

import re
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.enums import WorkspaceRole
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate, WorkspaceRead, WorkspaceUpdate

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("", response_model=list[WorkspaceRead])
async def list_workspaces(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Workspace]:
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
        .where(WorkspaceMember.user_id == user.id)
    )
    return list(result.scalars().all())


@router.post("", response_model=WorkspaceRead, status_code=201)
async def create_workspace(
    payload: WorkspaceCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Workspace:
    slug = re.sub(r"[^a-z0-9]+", "-", payload.name.lower()).strip("-") + f"-{uuid.uuid4().hex[:6]}"
    workspace = Workspace(name=payload.name, description=payload.description, slug=slug, owner_id=user.id)
    db.add(workspace)
    await db.flush()
    db.add(WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role=WorkspaceRole.OWNER))
    await db.commit()
    await db.refresh(workspace)
    return workspace


async def _get_owned_workspace(workspace_id: uuid.UUID, user: User, db: AsyncSession) -> Workspace:
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
        .where(Workspace.id == workspace_id, WorkspaceMember.user_id == user.id)
    )
    workspace = result.scalar_one_or_none()
    if workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceRead)
async def get_workspace(
    workspace_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Workspace:
    return await _get_owned_workspace(workspace_id, user, db)


@router.patch("/{workspace_id}", response_model=WorkspaceRead)
async def update_workspace(
    workspace_id: uuid.UUID,
    payload: WorkspaceUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Workspace:
    workspace = await _get_owned_workspace(workspace_id, user, db)
    if payload.name is not None:
        workspace.name = payload.name
    if payload.description is not None:
        workspace.description = payload.description
    await db.commit()
    await db.refresh(workspace)
    return workspace


@router.delete("/{workspace_id}", status_code=204)
async def delete_workspace(
    workspace_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    workspace = await _get_owned_workspace(workspace_id, user, db)
    if workspace.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete a workspace")
    await db.delete(workspace)
    await db.commit()
