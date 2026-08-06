"""Lists models available through the LiteLLM gateway (cloud + local Ollama)."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.model import ModelInfo
from app.services.llm_gateway import list_models

router = APIRouter(prefix="/models", tags=["models"])

# Static fallback metadata (context window, friendly name) enriching whatever
# LiteLLM reports live, since /v1/models responses are often bare-bones.
_KNOWN_MODELS: dict[str, dict] = {
    "gpt-4o": {"name": "GPT-4o", "provider": "openai", "context_window": 128_000},
    "gpt-4o-mini": {"name": "GPT-4o mini", "provider": "openai", "context_window": 128_000},
    "claude-sonnet": {"name": "Claude Sonnet", "provider": "anthropic", "context_window": 200_000},
    "gemini-pro": {"name": "Gemini 1.5 Pro", "provider": "google", "context_window": 1_000_000},
    "deepseek-chat": {"name": "DeepSeek Chat", "provider": "deepseek", "context_window": 64_000},
    "llama3.1": {"name": "Llama 3.1 (local)", "provider": "ollama", "context_window": 128_000, "local": True},
    "codellama": {"name": "Code Llama (local)", "provider": "ollama", "context_window": 16_000, "local": True},
    "qwen2.5-coder": {"name": "Qwen 2.5 Coder (local)", "provider": "ollama", "context_window": 32_000, "local": True},
}


@router.get("", response_model=list[ModelInfo])
async def get_models(user: User = Depends(get_current_user)) -> list[ModelInfo]:
    live = await list_models()
    live_ids = {m.get("id") for m in live if m.get("id")}

    ids = live_ids or set(_KNOWN_MODELS.keys())
    models: list[ModelInfo] = []
    for model_id in ids:
        meta = _KNOWN_MODELS.get(model_id, {"name": model_id, "provider": "custom"})
        models.append(
            ModelInfo(
                id=model_id,
                name=meta.get("name", model_id),
                provider=meta.get("provider", "custom"),
                local=meta.get("local", False),
                context_window=meta.get("context_window"),
            )
        )
    return sorted(models, key=lambda m: (m.provider, m.id))
