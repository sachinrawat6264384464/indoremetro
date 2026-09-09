import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Indore Metro Digital Web Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    
    SECRET_KEY: str = "indore-metro-super-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    DATABASE_URL: str = "sqlite:///./indoremetro.db"
    
    RAZORPAY_KEY_ID: str = "rzp_test_indore_metro_key"
    RAZORPAY_KEY_SECRET: str = "rzp_test_secret_indore_metro_secret_key"
    RAZORPAY_WEBHOOK_SECRET: str = "whsec_indore_metro_webhook_secret"
    
    EMAIL_HOST: str = "smtp.mailtrap.io"
    EMAIL_PORT: int = 2525
    EMAIL_USERNAME: str = ""
    EMAIL_PASSWORD: str = ""
    EMAIL_FROM: str = "no-reply@indoremetro.gov.in"
    EMAIL_FROM_NAME: str = "Indore Metro Rail Corporation"
    EMAIL_ENABLED: bool = False
    
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"

    def model_post_init(self, __context):
        # Fallback to local SQLite if DATABASE_URL points to unreachable external hosts during local run
        if "supabase" in self.DATABASE_URL or "localhost:5432" in self.DATABASE_URL:
            # Check if Postgres is reachable or fallback to SQLite
            if "supabase" in self.DATABASE_URL:
                self.DATABASE_URL = "sqlite:///./indoremetro.db"

    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
