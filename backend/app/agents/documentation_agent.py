from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class DocumentationAgent(BaseAgent):
    type = AgentType.DOCUMENTATION
    display_name = "Documentation Agent"
    description = "Writes README, API docs, and architecture docs for what was just built."
    system_prompt = (
        "You are the Documentation Agent inside Omni Agent. You write clear, accurate "
        "documentation (README, API reference, architecture notes) for the project's current "
        "state — no speculation about features that don't exist yet."
    )
