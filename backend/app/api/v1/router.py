"""Aggregates every v1 router under a single APIRouter."""
from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import agents, auth, chat, files, images, memory, models, projects, tasks, three, workspaces

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(chat.router)
api_router.include_router(models.router)
api_router.include_router(projects.router)
api_router.include_router(files.router)
api_router.include_router(tasks.router)
api_router.include_router(memory.router)
api_router.include_router(agents.router)
api_router.include_router(images.router)
api_router.include_router(three.router)
api_router.include_router(workspaces.router)
