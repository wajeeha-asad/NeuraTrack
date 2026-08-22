
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.learning import PathCreate, PathUpdate, SessionCreate, SessionUpdate, PathResponse
from app.services.learning_service import (
    get_paths, create_path, update_path, delete_path, add_session,
    update_session, delete_session, complete_learning_session, get_owned_path
)

router = APIRouter(prefix="/api/learning-paths", tags=["Learning Paths"])


@router.get("", response_model=list[PathResponse])
def list_paths(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return get_paths(db, current_user)


@router.post("", response_model=PathResponse, status_code=status.HTTP_201_CREATED)
def create(data: PathCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    return create_path(db, current_user, data)


@router.patch("/{path_id}", response_model=PathResponse)
def update(path_id: str, data: PathUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = update_path(db, current_user, path_id, data)
    if not result: raise HTTPException(404, "Learning path not found.")
    return result


@router.delete("/{path_id}")
def remove(path_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    if not delete_path(db, current_user, path_id): raise HTTPException(404, "Learning path not found.")
    return {"message": "Learning path deleted successfully."}


@router.post("/{path_id}/sessions", response_model=PathResponse, status_code=status.HTTP_201_CREATED)
def add(path_id: str, data: SessionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = add_session(db, current_user, path_id, data)
    if not result: raise HTTPException(404, "Learning path not found.")
    return result


@router.patch("/{path_id}/sessions/{session_id}", response_model=PathResponse)
def update_session_route(path_id: str, session_id: str, data: SessionUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = update_session(db, current_user, path_id, session_id, data)
    if not result: raise HTTPException(404, "Learning session not found.")
    return result


@router.delete("/{path_id}/sessions/{session_id}", response_model=PathResponse)
def delete_session_route(path_id: str, session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = delete_session(db, current_user, path_id, session_id)
    if not result: raise HTTPException(404, "Learning session not found.")
    return result


@router.post("/{path_id}/sessions/{session_id}/complete", response_model=PathResponse)
def complete(path_id: str, session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = complete_learning_session(db, current_user, path_id, session_id)
    if not result: raise HTTPException(404, "Learning session not found.")
    return result
