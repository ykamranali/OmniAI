"""
2D generation service (Omni 2D Designer).

Modular by design: `generate_image` is the single seam other code calls.
Today it proxies to LiteLLM's OpenAI-compatible image endpoint when an
image-capable provider key is configured; swap this implementation to call
Stable Diffusion / ComfyUI / a local model without touching any caller.
"""
from __future__ import annotations

import httpx

from app.core.config import settings
from app.core.logging import logger

IMAGE_GENERATIONS_PATH = "/v1/images/generations"


async def generate_image(prompt: str, size: str = "1024x1024") -> bytes | None:
    """Returns raw image bytes, or None if no image provider is configured/reachable."""
    payload = {"prompt": prompt, "size": size, "n": 1, "response_format": "b64_json"}
    headers = {"Authorization": f"Bearer {settings.LITELLM_MASTER_KEY}"}

    async with httpx.AsyncClient(base_url=settings.LITELLM_BASE_URL, timeout=120.0) as client:
        try:
            resp = await client.post(IMAGE_GENERATIONS_PATH, headers=headers, json=payload)
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            logger.warning("Image generation unavailable: %s", exc)
            return None

    import base64

    data = resp.json().get("data", [])
    if not data or "b64_json" not in data[0]:
        return None
    return base64.b64decode(data[0]["b64_json"])
