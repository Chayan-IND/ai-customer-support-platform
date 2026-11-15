from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SupportAI API"
    environment: str = "development"
    frontend_url: str = "http://localhost:3000"
    # Empty until PostgreSQL is set up (Day 3)
    database_url: str = ""

    # Authentication (Day 4)
    # No default on purpose: the app refuses to start if SECRET_KEY is missing in .env
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()