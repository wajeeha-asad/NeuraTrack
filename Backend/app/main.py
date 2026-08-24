from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from app.db.database import engine
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.settings import router as settings_router
from app.routers.learning import router as learning_router
from app.routers.focus import router as focus_router
from app.routers.dashboard import router as dashboard_router
from app.routers.analytics import router as analytics_router


app = FastAPI(
    title="NeuraTrack API",
    description="Backend API for NeuraTrack learning tracker",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://neuratrack-three.vercel.app",

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# API ROUTERS
# =========================

app.include_router(
    auth_router
)

app.include_router(
    users_router
)

app.include_router(settings_router)
app.include_router(learning_router)
app.include_router(focus_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "NeuraTrack API is running 🚀"
    }


# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
        }


# =========================
# DATABASE HEALTH CHECK
# =========================

@app.get("/health/database")
def database_health_check():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT COUNT(*) FROM users")
            )

            user_count = result.scalar()

        return {
            "status": "healthy",
            "database": "connected",
            "users": user_count,
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
        }
