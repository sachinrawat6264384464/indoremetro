import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.core.database import get_db, Base, engine
from app.core.exceptions import (
    MetroAPIException,
    metro_exception_handler,
    validation_exception_handler,
    format_success_response
)
from app.api.v1.router import api_v1_router
from seed_data import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure DB tables exist & seed data if needed
    try:
        print("Ensuring database tables and seeding initial data...")
        Base.metadata.create_all(bind=engine)
        seed()
    except Exception as e:
        print(f"Startup database initialization warning: {e}")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Indore Metro Complete Digital Web Platform REST API",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(MetroAPIException, metro_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Include API v1 Router
app.include_router(api_v1_router)

@app.get("/health", tags=["Health"])
def health_check():
    return format_success_response(
        data={"status": "healthy", "service": settings.APP_NAME, "version": "1.0.0"},
        message="Application health check OK"
    )

@app.get("/ready", tags=["Health"])
def readiness_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return format_success_response(
            data={"status": "ready", "database": "connected"},
            message="Application readiness check OK"
        )
    except Exception as e:
        return format_success_response(
            data={"status": "not_ready", "error": str(e)},
            message="Database connection failed"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
