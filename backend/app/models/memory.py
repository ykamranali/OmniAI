from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import MemoryScope

if TYPE_CHECKING:
    pass


class Memory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Scoped memory record. `scope_id` points at a workspace/project/conversation
    id depending on `scope` (null for GLOBAL). `embedding_id` optionally links
    to the corresponding vector stored in Qdrant for semantic recall.
    """

    __tablename__ = "memories"
    __table_args__ = (Index("ix_memories_scope", "scope", "scope_id"),)

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    scope: Mapped[MemoryScope] = mapped_column(default=MemoryScope.GLOBAL, nullable=False)
    scope_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)

    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    embedding_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
