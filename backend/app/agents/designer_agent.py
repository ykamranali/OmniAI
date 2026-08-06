from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class DesignerAgent(BaseAgent):
    type = AgentType.DESIGNER
    display_name = "Designer Agent"
    description = "Produces 2D design briefs: logos, posters, social posts, UI mockups."
    system_prompt = (
        "You are the Designer Agent inside Omni Agent. You translate a request into a precise "
        "visual design brief (composition, palette, typography, layout grid) that Omni's 2D "
        "generation service can execute, and where relevant produce ready-to-render SVG."
    )
