from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import ProjectStatus, ProjectType

if TYPE_CHECKING:
    from app.models.conversation import Conversation
    from app.models.file import File
    from app.models.generation import Generation
    from app.models.task import Task
    from app.models.workspace import Workspace


class Project(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "projects"
    __table_args__ = (Index("ix_projects_workspace_id", "workspace_id"),)

    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    type: Mapped[ProjectType] = mapped_column(default=ProjectType.GENERAL, nullable=False)
    status: Mapped[ProjectStatus] = mapped_column(default=ProjectStatus.PLANNING, nullable=False)

    workspace: Mapped["Workspace"] = relationship(back_populates="projects")
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    tasks: Mapped[list["Task"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    files: Mapped[list["File"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    generations: Mapped[list["Generation"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
