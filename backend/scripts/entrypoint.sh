#!/bin/sh
# ==============================================================================
# Omni Agent — backend container entrypoint
# Waits for Postgres, applies migrations, then starts the app.
# ==============================================================================
set -e

echo "Waiting for database..."
python - << 'PYEOF'
import asyncio
import sys

import asyncpg

from app.core.config import settings


async def wait_for_db() -> None:
    # asyncpg wants a plain postgresql:// DSN, not the +asyncpg SQLAlchemy variant.
    dsn = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    for attempt in range(30):
        try:
            conn = await asyncpg.connect(dsn)
            await conn.close()
            print("Database is ready.")
            return
        except Exception as exc:  # noqa: BLE001
            print(f"  ...not ready yet ({attempt + 1}/30): {exc}")
            await asyncio.sleep(2)
    print("Database did not become ready in time.")
    sys.exit(1)


asyncio.run(wait_for_db())
PYEOF

echo "Applying migrations..."
alembic upgrade head

echo "Starting Omni Agent backend..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers "${UVICORN_WORKERS:-2}"
