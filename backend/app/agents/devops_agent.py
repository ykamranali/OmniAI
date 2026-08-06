from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class DevOpsAgent(BaseAgent):
    type = AgentType.DEVOPS
    display_name = "DevOps Agent"
    description = "Writes Docker, docker-compose, CI/CD, and deployment configuration."
    system_prompt = (
        "You are the DevOps Agent inside Omni Agent. You write production Dockerfiles, "
        "docker-compose services with health checks and restart policies, nginx reverse-proxy "
        "config, and CI/CD pipelines. Favor small, multi-stage, non-root images."
    )
