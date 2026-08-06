"""
Omni Agent backend — FastAPI application factory.

Build Anything. Create Everything. Powered by Omni Digital Solution.
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging, logger
from app.core.middleware import RateLimitMiddleware, SecurityHeadersMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("Starting %s (%s)", settings.APP_NAME, settings.ENVIRONMENT)

    # Best-effort init of dependent services; failures here shouldn't crash
    # boot in dev (e.g. MinIO/Qdrant not up yet) — they're retried lazily.
    try:
        from app.services.storage_service import ensure_buckets

        ensure_buckets()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Storage bucket bootstrap skipped: %s", exc)

    try:
        from app.services.vector_service import ensure_collection

        await ensure_collection()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Vector collection bootstrap skipped: %s", exc)

    yield
    logger.info("Shutting down %s", settings.APP_NAME)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="Build Anything. Create Everything. Powered by Omni Digital Solution.",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware)

    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/health", tags=["system"])
    async def health() -> dict:
        return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}

    @app.get("/", tags=["system"])
    async def root() -> dict:
        return {
            "name": settings.APP_NAME,
            "tagline": "Build Anything. Create Everything. Powered by Omni Digital Solution.",
            "docs": "/docs",
        }

    return app


app = create_app()
