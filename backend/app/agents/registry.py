"""Maps AgentType -> concrete agent implementation."""
from __future__ import annotations

from app.agents.backend_agent import BackendAgent
from app.agents.base import BaseAgent
from app.agents.database_agent import DatabaseAgent
from app.agents.designer_agent import DesignerAgent
from app.agents.devops_agent import DevOpsAgent
from app.agents.documentation_agent import DocumentationAgent
from app.agents.frontend_agent import FrontendAgent
from app.agents.planner import PlannerAgent
from app.agents.qa_agent import QAAgent
from app.agents.three_d_agent import ThreeDAgent
from app.models.enums import AgentType

AGENT_REGISTRY: dict[AgentType, type[BaseAgent]] = {
    AgentType.PLANNER: PlannerAgent,
    AgentType.FRONTEND: FrontendAgent,
    AgentType.BACKEND: BackendAgent,
    AgentType.DATABASE: DatabaseAgent,
    AgentType.DEVOPS: DevOpsAgent,
    AgentType.DESIGNER: DesignerAgent,
    AgentType.THREE_D: ThreeDAgent,
    AgentType.QA: QAAgent,
    AgentType.DOCUMENTATION: DocumentationAgent,
}


def get_agent(agent_type: AgentType, model: str | None = None) -> BaseAgent:
    agent_cls = AGENT_REGISTRY.get(agent_type)
    if agent_cls is None:
        raise ValueError(f"No implementation registered for agent type: {agent_type}")
    return agent_cls(model=model)


def list_system_agents() -> list[dict]:
    return [
        {"type": t.value, "name": cls.display_name, "description": cls.description}
        for t, cls in AGENT_REGISTRY.items()
    ]
