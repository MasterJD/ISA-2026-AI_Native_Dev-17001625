from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    environment: Literal["development", "production"] = "development"
    port: int = Field(default=8000, ge=1, le=65535)
    frontend_url: AnyHttpUrl
    gemini_api_key: SecretStr

    @model_validator(mode="after")
    def validate_environment_rules(self) -> "Settings":
        if self.environment == "production" and self.frontend_url.scheme != "https":
            raise ValueError("FRONTEND_URL must use HTTPS in production.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
