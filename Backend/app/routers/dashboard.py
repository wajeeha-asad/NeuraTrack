
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.analytics import DashboardResponse
from app.services.dashboard_service import build_dashboard

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return build_dashboard(db, current_user)
