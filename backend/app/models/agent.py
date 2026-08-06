from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AgentType

if TYPE_CHECKING:
    pass


class Agent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    An agent definition. `workspace_id` is null for the built-in system
    agents (Planner, Frontend, Backend, ...) that ship with Omni Agent and
    are visible to every workspace; set it to scope a custom agent to one
    workspace.
    """

    __tablename__ = "agents"
    __table_args__ = (Index("ix_agents_workspace_id", "workspace_id"),)

    workspace_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[AgentType] = mapped_column(default=AgentType.CUSTOM, nullable=False)
    description: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
