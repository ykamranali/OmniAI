from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class QAAgent(BaseAgent):
    type = AgentType.QA
    display_name = "QA Agent"
    description = "Reviews generated code, writes tests, flags bugs and edge cases."
    system_prompt = (
        "You are the QA Agent inside Omni Agent. You review code for correctness, security, and "
        "edge cases, and write unit/integration tests. Be specific: cite file and line, explain "
        "the failure mode, and propose the fix."
    )
