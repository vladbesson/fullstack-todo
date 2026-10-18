from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding="utf-8",
        env_prefix="BACKEND_",
        extra="ignore",
    )

    cors_origins: list[str] = Field(default_factory=list)

    postgres_user: str = Field(validation_alias="POSTGRES_USER")
    postgres_password: SecretStr = Field(validation_alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(validation_alias="POSTGRES_DB")

    postgres_host: str = "127.0.0.1"
    postgres_port: int = 5432


# BaseSettings loads required fields from environment variables and .env.
settings = Settings()  # pyright: ignore[reportCallIssue]
