"""Shared enum types used across ORM models."""
from __future__ import annotations

import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class WorkspaceRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class ProjectType(str, enum.Enum):
    GENERAL = "general"
    CODE = "code"
    WEBSITE = "website"
    DESIGN_2D = "design_2d"
    STUDIO_3D = "studio_3d"


class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class MessageRole(str, enum.Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    FAILED = "failed"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MemoryScope(str, enum.Enum):
    GLOBAL = "global"
    WORKSPACE = "workspace"
    PROJECT = "project"
    CONVERSATION = "conversation"


class AgentType(str, enum.Enum):
    PLANNER = "planner"
    FRONTEND = "frontend"
    BACKEND = "backend"
    DATABASE = "database"
    DEVOPS = "devops"
    DESIGNER = "designer"
    THREE_D = "three_d"
    QA = "qa"
    DOCUMENTATION = "documentation"
    CUSTOM = "custom"


class GenerationType(str, enum.Enum):
    IMAGE_2D = "image_2d"
    WEBSITE = "website"
    SCENE_3D = "scene_3d"
    CODE = "code"
    DOCUMENT = "document"


class GenerationStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class FilePurpose(str, enum.Enum):
    UPLOAD = "upload"
    GENERATION = "generation"
    AVATAR = "avatar"
    EXPORT = "export"


class SettingScope(str, enum.Enum):
    USER = "user"
    WORKSPACE = "workspace"
