from typing import List, Union, Optional
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ClientPulse Customer Management API"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg://customer_user:customer_password@localhost:5432/customer_db"
    
    # Redis Cache (Optional)
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    
    # JWT & Security
    JWT_SECRET_KEY: str = "dev-secret-super-secure-key-32-chars-minimum-for-hs256"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @field_validator("JWT_SECRET_KEY")
    def validate_jwt_secret(cls, v: str, info) -> str:
        DEFAULT_DEV_SECRET = "dev-secret-super-secure-key-32-chars-minimum-for-hs256"
        app_env = info.data.get("APP_ENV", "development") if hasattr(info, "data") else "development"
        if v == DEFAULT_DEV_SECRET and app_env not in ("development", "test", "testing"):
            raise ValueError(
                "Insecure default JWT_SECRET_KEY detected in production/staging environment! "
                "Configure a secure secret via JWT_SECRET_KEY environment variable."
            )
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
