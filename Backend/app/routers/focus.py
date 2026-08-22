
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.learning import FocusSessionCreate, FocusSessionResponse
from app.services.focus_service import get_focus_sessions, record_focus_session

router = APIRouter(prefix="/api/focus", tags=["Focus"])


@router.get("/sessions", response_model=list[FocusSessionResponse])
def list_focus_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return get_focus_sessions(db, current_user)


@router.post("/sessions", response_model=FocusSessionResponse, status_code=status.HTTP_201_CREATED)
def create_focus_session(data: FocusSessionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    try:
        return record_focus_session(db, current_user, data)
    except ValueError as error:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(error))
