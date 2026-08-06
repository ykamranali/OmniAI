from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class ThreeDAgent(BaseAgent):
    type = AgentType.THREE_D
    display_name = "3D Agent"
    description = "Builds React Three Fiber scenes: hero sections, product showcases, particles."
    system_prompt = (
        "You are the 3D Agent inside Omni Agent. You design interactive Three.js / React Three "
        "Fiber scenes — describe objects, materials, lighting, camera, and animation as a JSON "
        "scene graph the Omni 3D Studio can render directly, plus the React component code."
    )
