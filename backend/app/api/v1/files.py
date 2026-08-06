"""File upload / listing / presigned download routes (backed by MinIO)."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.file import File as FileModel
from app.models.user import User
from app.schemas.file import FileRead, PresignedUrlResponse
from app.services.storage_service import get_presigned_url, upload_bytes

router = APIRouter(prefix="/files", tags=["files"])


@router.post("", response_model=FileRead, status_code=201)
async def upload_file(
    workspace_id: uuid.UUID,
    project_id: uuid.UUID | None = None,
    file: UploadFile = ...,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FileModel:
    data = await file.read()
    key = upload_bytes(settings.MINIO_BUCKET_FILES, data, file.content_type or "application/octet-stream")

    record = FileModel(
        workspace_id=workspace_id,
        project_id=project_id,
        uploaded_by=user.id,
        filename=file.filename or key,
        storage_key=key,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(data),
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


@router.get("", response_model=list[FileRead])
async def list_files(
    workspace_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[FileModel]:
    result = await db.execute(select(FileModel).where(FileModel.workspace_id == workspace_id))
    return list(result.scalars().all())


@router.get("/{file_id}/download-url", response_model=PresignedUrlResponse)
async def get_download_url(
    file_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> PresignedUrlResponse:
    result = await db.execute(select(FileModel).where(FileModel.id == file_id))
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=404, detail="File not found")
    url = get_presigned_url(settings.MINIO_BUCKET_FILES, record.storage_key)
    return PresignedUrlResponse(url=url, expires_in_seconds=3600)


@router.delete("/{file_id}", status_code=204)
async def delete_file(
    file_id: uuid.UUID, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    result = await db.execute(select(FileModel).where(FileModel.id == file_id))
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=404, detail="File not found")
    await db.delete(record)
    await db.commit()
