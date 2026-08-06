"""
Import every model module here so Alembic's autogenerate and
`Base.metadata.create_all` see the full schema.
"""
from app.db.base import Base  # noqa: F401
from app.models.agent import Agent  # noqa: F401
from app.models.conversation import Conversation  # noqa: F401
from app.models.file import File  # noqa: F401
from app.models.generation import Generation  # noqa: F401
from app.models.memory import Memory  # noqa: F401
from app.models.message import Message  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.setting import Setting  # noqa: F401
from app.models.task import Task  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.workspace import Workspace, WorkspaceMember  # noqa: F401

__all__ = [
    "Base",
    "Agent",
    "Conversation",
    "File",
    "Generation",
    "Memory",
    "Message",
    "Project",
    "Setting",
    "Task",
    "User",
    "Workspace",
    "WorkspaceMember",
]
