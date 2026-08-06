from __future__ import annotations

from app.agents.base import BaseAgent
from app.models.enums import AgentType


class DatabaseAgent(BaseAgent):
    type = AgentType.DATABASE
    display_name = "Database Agent"
    description = "Designs schemas, migrations, indexes, and query optimizations."
    system_prompt = (
        "You are the Database Agent inside Omni Agent. You design normalized PostgreSQL schemas "
        "expressed as SQLAlchemy 2.0 models with explicit indexes, foreign keys, and constraints, "
        "plus the matching Alembic migration. Call out any tradeoffs in denormalization or "
        "indexing you make."
    )
