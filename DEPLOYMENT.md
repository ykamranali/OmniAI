# Deployment

## Prerequisites

- A VPS (2 vCPU / 4 GB RAM minimum; 8 GB+ recommended if you'll run local
  Ollama models) with Docker Engine + Docker Compose v2 installed
- A domain name (optional, for TLS)

## 1. Clone and configure

```bash
git clone <your-fork-url> omni-agent
cd omni-agent
cp .env.example .env
```

Edit `.env` and set, at minimum:

- `JWT_SECRET_KEY`, `JWT_REFRESH_SECRET_KEY` — long random strings (`openssl rand -hex 32`)
- `POSTGRES_PASSWORD`, `MINIO_ROOT_PASSWORD` — strong passwords
- `LITELLM_MASTER_KEY` — a random string; this is the internal key the
  backend uses to authenticate to the LiteLLM gateway
- At least one of `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` /
  `DEEPSEEK_API_KEY`, or plan to rely solely on local Ollama models
- `CORS_ORIGINS`, `APP_URL`, `API_URL`, `NEXT_PUBLIC_API_URL`,
  `NEXT_PUBLIC_WS_URL` — update to your real domain once you have one

## 2. Bring the stack up

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

This starts: `nginx`, `frontend`, `backend`, `litellm`, `ollama`, `postgres`,
`redis`, `qdrant`, `minio`. The production overlay
(`docker-compose.prod.yml`) stops publishing datastore ports to the host —
only Nginx (80/443) is reachable externally — and adds conservative resource
limits per service.

The backend's entrypoint (`backend/scripts/entrypoint.sh`) waits for
Postgres and runs `alembic upgrade head` automatically on every start, so
migrations never need to be applied by hand for a fresh deploy.

## 3. Pull local models (optional but recommended)

```bash
docker compose exec ollama ollama pull llama3.1
docker compose exec ollama ollama pull qwen2.5-coder
```

This gives you a working system even with zero cloud API keys configured.

## 4. Put it behind TLS

The simplest path is Caddy or an external Certbot container in front of the
`nginx` service, or terminate TLS at a managed load balancer. If you want
Nginx itself to terminate TLS:

1. Drop your certificate + key into `nginx/certs/`.
2. Extend `nginx/nginx.conf` with a `listen 443 ssl;` server block pointing
   at those files.
3. Redirect port 80 → 443.

## 5. Health checks & restarts

Every service in `docker-compose.yml` defines a `healthcheck` and
`restart: unless-stopped`. Check status with:

```bash
docker compose ps
docker compose logs -f backend
```

## 6. Backups

- **Postgres**: `docker compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql`
- **MinIO**: mirror the `minio-data` volume, or use `mc mirror` against the MinIO API
- **Qdrant**: snapshot via its REST API (`POST /collections/omni_memory/snapshots`)

Automate these with cron + the `Makefile` targets, or your platform's
volume-snapshot tooling.

## 7. Updating

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Migrations run automatically on backend startup (step 2 above).

## Scaling notes

- The in-memory rate limiter (`app/core/middleware.py`) is per-replica; if
  you run multiple backend replicas behind Nginx, switch it to a
  Redis-backed limiter first.
- `docker-compose.prod.yml` resource limits are conservative starting
  points — profile and adjust for your actual load.
- LiteLLM and Ollama can be split onto a separate GPU-equipped host; just
  point `LITELLM_BASE_URL` / `OLLAMA_BASE_URL` at that host's address.
