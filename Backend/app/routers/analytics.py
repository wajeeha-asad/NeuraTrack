
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.analytics import AnalyticsResponse, AchievementsResponse
from app.services.analytics_service import analytics, achievements

router = APIRouter(prefix="/api", tags=["Analytics & Achievements"])

@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return analytics(db, current_user)

@router.get("/achievements", response_model=AchievementsResponse)
def get_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return achievements(db, current_user)
