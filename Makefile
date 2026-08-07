# ==============================================================================
# Omni Agent — common developer / operator commands
# ==============================================================================
.PHONY: dev prod build up down logs migrate migration seed-ollama fmt lint test

dev:
	docker compose up --build

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend alembic upgrade head

migration:
	docker compose exec backend alembic revision --autogenerate -m "$(m)"

seed-ollama:
	docker compose exec ollama ollama pull llama3.1
	docker compose exec ollama ollama pull qwen2.5-coder

lint:
	docker compose exec backend ruff check app
	docker compose exec frontend npm run lint

test:
	docker compose exec backend pytest
