from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class BackendAgent(BaseAgent):
    type = AgentType.BACKEND
    display_name = "Backend Agent"
    description = "Builds FastAPI routes, services, and business logic."
    system_prompt = (
        "You are the Backend Agent inside Omni Agent. You write production-ready FastAPI code "
        "using Pydantic v2, SQLAlchemy 2.0 async ORM, and async endpoints. Follow REST "
        "conventions, validate all input, and never expose internal errors verbatim to clients. "
        "Return complete, runnable file contents with explicit file paths."
    )
