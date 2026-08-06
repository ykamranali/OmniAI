"""
Model gateway service.

Talks to LiteLLM's OpenAI-compatible endpoint, which in turn routes to
whichever upstream provider (OpenAI, Anthropic, Google, DeepSeek) or local
Ollama model was requested. This is the single choke point every other part
of the backend goes through to call an LLM, so swapping providers or adding
new ones only ever touches this file + backend/litellm/config.yaml.
"""
from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import logger

CHAT_COMPLETIONS_PATH = "/v1/chat/completions"
MODELS_PATH = "/v1/models"


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.LITELLM_MASTER_KEY}",
        "Content-Type": "application/json",
    }


async def list_models() -> list[dict[str, Any]]:
    async with httpx.AsyncClient(base_url=settings.LITELLM_BASE_URL, timeout=10.0) as client:
        try:
            resp = await client.get(MODELS_PATH, headers=_headers())
            resp.raise_for_status()
            return resp.json().get("data", [])
        except httpx.HTTPError as exc:
            logger.warning("Could not reach LiteLLM gateway for model list: %s", exc)
            return []


async def chat_completion(
    model: str,
    messages: list[dict[str, str]],
    temperature: float = 0.7,
    max_tokens: int | None = None,
) -> dict[str, Any]:
    """Non-streaming chat completion — used by agents that need a single result."""
    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "stream": False,
    }
    if max_tokens:
        payload["max_tokens"] = max_tokens

    async with httpx.AsyncClient(base_url=settings.LITELLM_BASE_URL, timeout=120.0) as client:
        resp = await client.post(CHAT_COMPLETIONS_PATH, headers=_headers(), json=payload)
        resp.raise_for_status()
        return resp.json()


async def stream_chat_completion(
    model: str,
    messages: list[dict[str, str]],
    temperature: float = 0.7,
) -> AsyncGenerator[str, None]:
    """
    Streaming chat completion. Yields raw content deltas (already decoded from
    the `data: {...}` SSE framing LiteLLM/OpenAI use) so callers can forward
    them straight over a WebSocket.
    """
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "stream": True,
    }

    async with httpx.AsyncClient(base_url=settings.LITELLM_BASE_URL, timeout=None) as client:
        async with client.stream(
            "POST", CHAT_COMPLETIONS_PATH, headers=_headers(), json=payload
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue
                data = line.removeprefix("data:").strip()
                if data == "[DONE]":
                    break
                try:
                    import orjson

                    chunk = orjson.loads(data)
                    delta = chunk["choices"][0]["delta"].get("content")
                    if delta:
                        yield delta
                except Exception:  # noqa: BLE001 - tolerate malformed keep-alive lines
                    continue
