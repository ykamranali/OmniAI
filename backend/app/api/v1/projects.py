"""Project CRUD routes."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.project import Project
from app.models.user import User
from app.models.workspace import WorkspaceMember
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])


async def _assert_workspace_member(workspace_id: uuid.UUID, user: User, db: AsyncSession) -> None:
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id
        )
    )
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=403, detail="Not a member of this workspace")


@router.get("", response_model=list[ProjectRead])
async def list_projects(
    workspace_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Project]:
    await _assert_workspace_member(workspace_id, user, db)
    result = await db.execute(select(Project).where(Project.workspace_id == workspace_id))
    return list(result.scalars().all())


@router.post("", response_model=ProjectRead, status_code=201)
async def create_project(
    payload: ProjectCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Project:
    await _assert_workspace_member(payload.workspace_id, user, db)
    project = Project(
        workspace_id=payload.workspace_id,
        created_by=user.id,
        name=payload.name,
        description=payload.description,
        type=payload.type,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def _get_project_or_404(project_id: uuid.UUID, user: User, db: AsyncSession) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    await _assert_workspace_member(project.workspace_id, user, db)
    return project


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(
    project_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Project:
    return await _get_project_or_404(project_id, user, db)


@router.patch("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: uuid.UUID,
    payload: ProjectUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Project:
    project = await _get_project_or_404(project_id, user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    project = await _get_project_or_404(project_id, user, db)
    await db.delete(project)
    await db.commit()
