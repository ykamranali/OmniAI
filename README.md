# Omni Agent

**Build Anything. Create Everything.**
*Powered by Omni Digital Solution.*

Omni Agent is an open-source, self-hostable autonomous agent platform. It combines
conversational chat, code generation, website building, 2D design, an interactive
3D studio, and a collaborating multi-agent system behind a single premium,
dark-themed interface — and it runs entirely on your own infrastructure.

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Status" src="https://img.shields.io/badge/status-active--development-orange.svg">
</p>

## What's inside

| Module | What it does |
|---|---|
| **Omni Chat** | Streaming, markdown-aware chat over any configured model, with per-conversation history and pinning. |
| **Omni Code** | In-browser Monaco editor for multi-file editing, wired for AI-assisted refactors. |
| **Omni Website Builder** | Guided briefs for corporate, e-commerce, SaaS, hotel, restaurant, and other site types, executed by the Frontend/Backend/DevOps agents. |
| **Omni 2D Designer** | Logos, posters, flyers, business cards, social posts, and UI mockups via a pluggable image-generation service. |
| **Omni 3D Studio** | The 3D Agent produces a declarative scene graph; a React Three Fiber canvas renders it live. |
| **Omni Agents** | Nine specialist agents (Planner, Frontend, Backend, Database, DevOps, Designer, 3D, QA, Documentation) that collaborate on a shared task graph. |
| **Omni Workspace** | Projects, files, tasks, and activity across every workspace you belong to. |
| **Omni Memory** | Scoped memory (global / workspace / project / conversation), backed by Postgres and, for semantic recall, Qdrant. |

## Tech stack

- **Frontend** — Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Monaco Editor, React Three Fiber
- **Backend** — FastAPI, Pydantic v2, SQLAlchemy 2.0 (async), Alembic, WebSockets
- **Data** — PostgreSQL, Redis, Qdrant (vectors), MinIO (S3-compatible object storage)
- **AI layer** — LiteLLM as an OpenAI-compatible gateway in front of OpenAI / Anthropic / Google / DeepSeek and local Ollama models
- **Infra** — Docker, Docker Compose, Nginx

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how these pieces fit together,
[`API.md`](./API.md) for the REST/WebSocket surface, and
[`DEPLOYMENT.md`](./DEPLOYMENT.md) for running this in production.

## Quick start (Docker)

```bash
git clone <your-fork-url> omni-agent
cd omni-agent
cp .env.example .env
# edit .env — at minimum set JWT_SECRET_KEY/JWT_REFRESH_SECRET_KEY and any
# model provider keys you have (OPENAI_API_KEY, ANTHROPIC_API_KEY, ...)

docker compose up --build
```

Then open:

- **App** — http://localhost:3000
- **API docs** — http://localhost:8000/docs
- **MinIO console** — http://localhost:9001

First run: pull at least one local model so chat works even with no cloud
keys configured:

```bash
docker compose exec ollama ollama pull llama3.1
```

## Local (non-Docker) development

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point DATABASE_URL etc. at local services
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Project layout

```
omni-agent/
├── frontend/          Next.js 15 app (UI, chat, 3D studio, code editor, ...)
├── backend/            FastAPI app (auth, chat, agents, storage, ...)
│   ├── app/
│   │   ├── agents/     The 9 specialist agent implementations
│   │   ├── api/v1/     REST + WebSocket routes
│   │   ├── models/     SQLAlchemy 2.0 models
│   │   ├── schemas/    Pydantic v2 schemas
│   │   └── services/   LiteLLM gateway, storage, vector search, orchestrator
│   └── alembic/         Database migrations
├── nginx/              Reverse proxy config
├── docker-compose.yml   Full local/production stack
└── docker-compose.prod.yml   Production hardening overrides
```

## Current status

This is an actively developed scaffold: authentication, workspaces/projects,
streaming chat, the task-graph multi-agent orchestrator, the 3D scene
generator, and the full Docker stack are implemented and working end to end.
The website builder and 2D designer UIs are wired to real backend endpoints;
the quality of what they produce depends entirely on which model provider(s)
you configure — bring your own OpenAI/Anthropic/Google keys, or run fully
offline against Ollama.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and our
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Issues and PRs welcome.

## License

MIT — see [`LICENSE`](./LICENSE).

---

Powered by Omni Digital Solution.
