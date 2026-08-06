"""Qdrant vector store helper used by the memory subsystem."""
from __future__ import annotations

import uuid
from typing import Any

from qdrant_client import AsyncQdrantClient, models

from app.core.config import settings

_client: AsyncQdrantClient | None = None

MEMORY_COLLECTION = "omni_memory"
VECTOR_SIZE = 1536  # matches text-embedding-3-small; adjust if you swap embedding models


def get_qdrant_client() -> AsyncQdrantClient:
    global _client
    if _client is None:
        _client = AsyncQdrantClient(url=settings.QDRANT_URL)
    return _client


async def ensure_collection() -> None:
    client = get_qdrant_client()
    collections = await client.get_collections()
    names = {c.name for c in collections.collections}
    if MEMORY_COLLECTION not in names:
        await client.create_collection(
            collection_name=MEMORY_COLLECTION,
            vectors_config=models.VectorParams(size=VECTOR_SIZE, distance=models.Distance.COSINE),
        )


async def upsert_memory_vector(point_id: str, vector: list[float], payload: dict[str, Any]) -> None:
    client = get_qdrant_client()
    await client.upsert(
        collection_name=MEMORY_COLLECTION,
        points=[models.PointStruct(id=point_id, vector=vector, payload=payload)],
    )


async def search_memory(vector: list[float], limit: int = 5, scope_filter: dict[str, Any] | None = None):
    client = get_qdrant_client()
    query_filter = None
    if scope_filter:
        query_filter = models.Filter(
            must=[models.FieldCondition(key=k, match=models.MatchValue(value=v)) for k, v in scope_filter.items()]
        )
    return await client.search(
        collection_name=MEMORY_COLLECTION, query_vector=vector, limit=limit, query_filter=query_filter
    )
