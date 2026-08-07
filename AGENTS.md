<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

The frontend uses Next.js 15 (App Router) with breaking changes from older
versions — APIs, conventions, and file structure may differ from your
training data. Read the relevant guide in `frontend/node_modules/next/dist/docs/`
before writing frontend code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project layout

Omni Agent is a monorepo:
- `frontend/` — Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- `backend/` — FastAPI + SQLAlchemy 2.0 (async) + Alembic, Python 3.12
- `docker-compose.yml` / `docker-compose.prod.yml` — full stack (Postgres,
  Redis, Qdrant, MinIO, LiteLLM, Ollama, Nginx)

See `README.md`, `ARCHITECTURE.md`, `API.md`, and `DEPLOYMENT.md` at the repo
root before making structural changes.
