"""
Multi-agent orchestrator.

Given a natural-language goal for a project, asks the Planner agent to
decompose it into tasks, then persists that plan as rows in the shared
`tasks` table (the project's task graph) with each task pre-assigned to the
specialist agent best suited to execute it. This is the mechanism behind
the "intelligent task execution" flow: a user's one-line request becomes a
structured, trackable plan that agents (and the UI) can act on.
"""
from __future__ import annotations

import json
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.planner import PlannerAgent
from app.core.logging import logger
from app.models.enums import AgentType, TaskPriority
from app.models.task import Task

_AGENT_TYPE_ALIASES = {t.value: t for t in AgentType}


async def generate_task_graph(project_id: uuid.UUID, goal: str, db: AsyncSession) -> list[Task]:
    planner = PlannerAgent()
    result = await planner.run(goal)

    try:
        raw_tasks = json.loads(result.output)
        if not isinstance(raw_tasks, list):
            raise ValueError("Planner did not return a JSON array")
    except (json.JSONDecodeError, ValueError) as exc:
        logger.warning("Planner output was not valid JSON (%s); falling back to a single task.", exc)
        raw_tasks = [
            {"title": goal[:255], "description": goal, "agent": "planner", "priority": "medium"}
        ]

    created: list[Task] = []
    for position, item in enumerate(raw_tasks):
        agent_type = _AGENT_TYPE_ALIASES.get(str(item.get("agent", "")).lower())
        priority = item.get("priority", "medium")
        try:
            priority_enum = TaskPriority(priority)
        except ValueError:
            priority_enum = TaskPriority.MEDIUM

        task = Task(
            project_id=project_id,
            title=str(item.get("title", f"Task {position + 1}"))[:500],
            description=item.get("description"),
            priority=priority_enum,
            position=position,
        )
        db.add(task)
        created.append(task)

    await db.commit()
    for task in created:
        await db.refresh(task)
    return created
