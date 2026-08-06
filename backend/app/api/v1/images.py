"""Omni 2D Designer routes: logos, posters, flyers, business cards, social posts."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.enums import GenerationStatus, GenerationType
from app.models.generation import Generation
from app.models.user import User
from app.schemas.generation import GenerationCreate, GenerationRead
from app.services.image_service import generate_image
from app.services.storage_service import upload_bytes

router = APIRouter(prefix="/images", tags=["images"])


@router.post("/generate", response_model=GenerationRead, status_code=201)
async def create_image_generation(
    payload: GenerationCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Generation:
    generation = Generation(
        workspace_id=payload.workspace_id,
        project_id=payload.project_id,
        user_id=user.id,
        type=GenerationType.IMAGE_2D,
        prompt=payload.prompt,
        status=GenerationStatus.RUNNING,
    )
    db.add(generation)
    await db.commit()
    await db.refresh(generation)

    image_bytes = await generate_image(payload.prompt)
    if image_bytes is None:
        generation.status = GenerationStatus.FAILED
        generation.error_message = (
            "No image-capable model provider is configured. Set OPENAI_API_KEY (or another "
            "image-capable provider) in .env and restart the litellm service."
        )
    else:
        key = upload_bytes(settings.MINIO_BUCKET_IMAGES, image_bytes, "image/png")
        generation.status = GenerationStatus.COMPLETED
        generation.result_storage_key = key

    await db.commit()
    await db.refresh(generation)
    return generation


@router.get("", response_model=list[GenerationRead])
async def list_image_generations(
    workspace_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Generation]:
    result = await db.execute(
        select(Generation).where(
            Generation.workspace_id == workspace_id, Generation.type == GenerationType.IMAGE_2D
        )
    )
    return list(result.scalars().all())
