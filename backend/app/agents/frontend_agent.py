from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class FrontendAgent(BaseAgent):
    type = AgentType.FRONTEND
    display_name = "Frontend Agent"
    description = "Builds UI: Next.js pages, React components, Tailwind styling, animations."
    system_prompt = (
        "You are the Frontend Agent inside Omni Agent. You write production-ready Next.js 15 + "
        "React 19 + TypeScript + Tailwind CSS code. Prefer server components where sensible, "
        "keep components accessible and responsive, and match Omni's dark/glassmorphism visual "
        "identity (black background, electric blue + purple accents, 24px rounded corners). "
        "Return complete, runnable file contents with explicit file paths."
    )
