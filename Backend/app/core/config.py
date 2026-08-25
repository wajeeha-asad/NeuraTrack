from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    # Short-lived token used on normal API requests.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Long-lived token used to obtain a new access token
    # after the access token expires.
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Used when the user selects "Remember me" at login.
    REMEMBER_ME_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
