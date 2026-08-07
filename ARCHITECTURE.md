# Architecture

## Overview

Omni Agent is a monorepo with two deployable services (frontend, backend)
plus six supporting infrastructure services, all orchestrated by Docker
Compose behind an Nginx reverse proxy.

```
                         ┌─────────────┐
                         │   Nginx     │  :80 / :443
                         └──────┬──────┘
                     ┌──────────┴──────────┐
                     │                     │
              ┌──────▼──────┐      ┌───────▼───────┐
              │  Frontend    │      │   Backend      │
              │  Next.js 15  │◄────►│   FastAPI      │
              │  :3000       │ REST │   :8000        │
              │              │  WS  │                │
              └──────────────┘      └───┬───┬───┬────┘
                                         │   │   │
                    ┌────────────────────┘   │   └────────────────────┐
                    │                         │                        │
             ┌──────▼──────┐          ┌───────▼───────┐        ┌───────▼───────┐
             │  Postgres   │          │  LiteLLM       │        │  MinIO         │
             │  (relational)│          │  gateway       │        │  (S3 storage)  │
             └─────────────┘          │  :4000         │        └────────────────┘
                    │                  └───┬───────┬───┘
             ┌──────▼──────┐               │       │
             │  Redis      │        ┌──────▼──┐ ┌──▼─────────┐
             │  (cache)    │        │ OpenAI/  │ │  Ollama    │
             └─────────────┘        │ Anthropic│ │  (local)   │
                                     │ /Google/ │ │  :11434    │
             ┌─────────────┐        │ DeepSeek │ └────────────┘
             │  Qdrant     │        └──────────┘
             │  (vectors)  │
             └─────────────┘
```

## Request flow: chat

1. The frontend opens a WebSocket to `backend:/api/v1/ws/chat/{conversation_id}`
   and sends `{token, content}`.
2. The backend authenticates the JWT, persists the user's message, then loads
   the conversation history from Postgres.
3. `app/services/llm_gateway.py` streams a chat completion from LiteLLM
   (`backend/litellm/config.yaml` maps friendly model names like
   `claude-sonnet` or `llama3.1` to the right upstream provider or Ollama).
4. Each token delta is forwarded to the client over the same WebSocket; the
   full response is persisted as an assistant message once streaming ends.

## Request flow: "build me a website"

1. The frontend calls `POST /api/v1/agents/orchestrate` with a project id and
   a natural-language goal.
2. `app/services/orchestrator.py` asks the **Planner Agent** to decompose the
   goal into a JSON task list, each tagged with the specialist agent
   (`frontend`, `backend`, `database`, `devops`, `designer`, `three_d`, `qa`,
   `documentation`) best suited to execute it.
3. Each item becomes a row in the `tasks` table — the project's shared task
   graph (`tasks.parent_task_id` supports hierarchical plans).
4. The UI's Tasks panel (right panel in the app shell) polls/updates this
   graph as work progresses; each specialist agent (`app/agents/*.py`) can be
   invoked against an individual task to produce its output.

## Data model

Eleven core tables plus one join table — see `backend/app/models/` for the
SQLAlchemy 2.0 definitions and `backend/alembic/` for migrations:

`users`, `workspaces`, `workspace_members`, `projects`, `conversations`,
`messages`, `files`, `tasks`, `memories`, `agents`, `generations`, `settings`.

Every table that scopes to a workspace or project is indexed on that foreign
key; `tasks` additionally indexes `parent_task_id` and `status` for fast task
graph queries, and `memories`/`settings` are indexed on `(scope, scope_id)`.

## Memory

Memory is scoped along four levels — `global`, `workspace`, `project`,
`conversation` — stored as JSON rows in Postgres (`memories` table) and
optionally embedded into Qdrant (`app/services/vector_service.py`) for
semantic recall across a workspace's history.

## AI layer

Every LLM call in the backend goes through `app/services/llm_gateway.py`,
which talks to LiteLLM's OpenAI-compatible API. This is deliberate: adding a
new provider, swapping a default model, or pointing everything at a local
Ollama model only ever requires editing `backend/litellm/config.yaml` — no
application code changes.

## Multi-agent system

`app/agents/base.py` defines `BaseAgent`; each of the nine specialist agents
subclasses it with a distinct system prompt (see `app/agents/registry.py`
for the full list). Agents are stateless — they take an instruction plus
optional context and return text/JSON output via the model gateway. The
orchestrator in `app/services/orchestrator.py` is the only place that turns
agent output into persisted state (tasks); this keeps agents easy to test
and swap independently.

## Security

- JWT access + refresh tokens (`app/core/security.py`), bcrypt password hashing
- Per-IP fixed-window rate limiting (`app/core/middleware.py`) — swap for a
  Redis-backed limiter if you scale past one backend replica
- Security headers (CSP-adjacent headers, HSTS in production) on every response
- CORS restricted to `CORS_ORIGINS`
- File uploads stream through MinIO, never touch the backend's local disk
- Secrets are only ever read from environment variables (`.env`, git-ignored)
