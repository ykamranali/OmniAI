"""
Application configuration.

Settings are loaded from environment variables (see .env.example at the repo
root). Uses pydantic-settings so every value is validated and typed.
"""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- General ---
    APP_NAME: str = "Omni Agent"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    DATABASE_URL: str = "postgresql+asyncpg://omni:omni@localhost:5432/omni_agent"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # --- Redis ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Qdrant ---
    QDRANT_URL: str = "http://localhost:6333"

    # --- MinIO / S3 ---
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ROOT_USER: str = "omni_admin"
    MINIO_ROOT_PASSWORD: str = "change_me"
    MINIO_USE_SSL: bool = False
    MINIO_BUCKET_FILES: str = "omni-files"
    MINIO_BUCKET_IMAGES: str = "omni-images"
    MINIO_BUCKET_GENERATIONS: str = "omni-generations"

    # --- Auth ---
    JWT_SECRET_KEY: str = "change_me_super_secret_key_min_32_chars"
    JWT_REFRESH_SECRET_KEY: str = "change_me_another_super_secret_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_OAUTH_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    # --- AI Gateway ---
    LITELLM_BASE_URL: str = "http://localhost:4000"
    LITELLM_MASTER_KEY: str = "sk-omni-master-key-change-me"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LOCAL_MODEL: str = "llama3.1"
    DEFAULT_MODEL: str = "gpt-4o-mini"

    # --- CORS / security ---
    CORS_ORIGINS: str = "http://localhost:3000"
    RATE_LIMIT_PER_MINUTE: int = 120
    SANDBOX_EXEC_ENABLED: bool = True
    SANDBOX_TIMEOUT_SECONDS: int = 15

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
