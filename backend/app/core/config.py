from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SupportAI API"
    environment: str = "development"
    frontend_url: str = "http://localhost:3000"
    # Empty until PostgreSQL is set up (Day 3)
    database_url: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()