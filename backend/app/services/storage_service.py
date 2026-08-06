"""MinIO (S3-compatible) object storage helper."""
from __future__ import annotations

import io
import uuid
from datetime import timedelta

from minio import Minio
from minio.error import S3Error

from app.core.config import settings
from app.core.logging import logger

_client: Minio | None = None

REQUIRED_BUCKETS = [
    settings.MINIO_BUCKET_FILES,
    settings.MINIO_BUCKET_IMAGES,
    settings.MINIO_BUCKET_GENERATIONS,
]


def get_minio_client() -> Minio:
    global _client
    if _client is None:
        _client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ROOT_USER,
            secret_key=settings.MINIO_ROOT_PASSWORD,
            secure=settings.MINIO_USE_SSL,
        )
    return _client


def ensure_buckets() -> None:
    client = get_minio_client()
    for bucket in REQUIRED_BUCKETS:
        try:
            if not client.bucket_exists(bucket):
                client.make_bucket(bucket)
                logger.info("Created MinIO bucket: %s", bucket)
        except S3Error as exc:  # pragma: no cover - depends on live MinIO
            logger.warning("Could not verify/create bucket %s: %s", bucket, exc)


def upload_bytes(bucket: str, data: bytes, content_type: str, key_prefix: str = "") -> str:
    client = get_minio_client()
    key = f"{key_prefix}{uuid.uuid4()}"
    client.put_object(
        bucket,
        key,
        data=io.BytesIO(data),
        length=len(data),
        content_type=content_type,
    )
    return key


def get_presigned_url(bucket: str, object_key: str, expires_minutes: int = 60) -> str:
    client = get_minio_client()
    return client.presigned_get_object(bucket, object_key, expires=timedelta(minutes=expires_minutes))
