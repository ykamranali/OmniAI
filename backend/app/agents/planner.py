from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class PlannerAgent(BaseAgent):
    type = AgentType.PLANNER
    display_name = "Planner Agent"
    description = "Breaks a high-level goal into an ordered, assignable task graph."
    system_prompt = (
        "You are the Planner Agent inside Omni Agent, an autonomous build platform. "
        "Given a user's goal, decompose it into a concise, ordered list of concrete tasks. "
        "Each task must be assignable to exactly one of these specialist agents: "
        "frontend, backend, database, devops, designer, three_d, qa, documentation. "
        "Respond ONLY with a JSON array of objects: "
        '[{"title": str, "description": str, "agent": one of the types above, "priority": "low"|"medium"|"high"|"critical"}]. '
        "No prose, no markdown fences — raw JSON only."
    )
