# Contributing to Omni Agent

Thanks for considering a contribution — Omni Agent is fully open-source and
community improvements are welcome.

## Getting set up

See the **Local (non-Docker) development** section of the [README](./README.md),
or just run `docker compose up --build` for the full stack.

## Workflow

1. Fork the repo and create a branch off `main`: `git checkout -b feat/short-description`.
2. Make your change. Keep commits focused and use clear messages
   (`feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
3. Run the relevant checks locally before opening a PR:
   - Backend: `cd backend && python -m py_compile $(find app alembic -name "*.py") && pytest`
   - Frontend: `cd frontend && npm run lint && npm run build`
4. Open a pull request against `main` describing what changed and why.
   Link any related issue.

## Code style

- **Backend**: Python 3.12, type hints everywhere, async endpoints only,
  Pydantic v2 for all request/response models. Keep routers thin — business
  logic belongs in `app/services/`.
- **Frontend**: TypeScript strict mode, functional components, Tailwind
  utility classes over custom CSS where possible. Keep the dark/glass visual
  identity (`omni-glass`, `omni-gradient-*` utilities in `globals.css`)
  consistent across new UI.

## Adding a new agent

1. Create `backend/app/agents/your_agent.py` subclassing `BaseAgent` with a
   `type`, `display_name`, `description`, and `system_prompt`.
2. Register it in `backend/app/agents/registry.py`.
3. Add the matching value to `AgentType` in `backend/app/models/enums.py` if
   it's a new category (and generate an Alembic migration if that enum is
   already persisted in the database).

## Adding a new model provider

Providers are configured entirely in `backend/litellm/config.yaml` — add a
`model_list` entry pointing at the new provider and the corresponding API
key env var in `.env.example`. No application code changes needed.

## Reporting bugs / requesting features

Open a GitHub issue with steps to reproduce (for bugs) or the problem you're
trying to solve (for features). Screenshots/logs help a lot.

## Code of Conduct

Participation in this project is governed by our
[Code of Conduct](./CODE_OF_CONDUCT.md).
