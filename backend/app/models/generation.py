from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import GenerationStatus, GenerationType

if TYPE_CHECKING:
    from app.models.project import Project


class Generation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A single AI generation job: a 2D image, a full website, a 3D scene, etc."""

    __tablename__ = "generations"
    __table_args__ = (
        Index("ix_generations_workspace_id", "workspace_id"),
        Index("ix_generations_project_id", "project_id"),
    )

    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    type: Mapped[GenerationType] = mapped_column(nullable=False)
    status: Mapped[GenerationStatus] = mapped_column(default=GenerationStatus.QUEUED, nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    result_storage_key: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    extra_metadata: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)

    project: Mapped["Project | None"] = relationship(back_populates="generations")
