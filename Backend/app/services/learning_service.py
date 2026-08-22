
from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.models import LearningPath, LearningSession, FocusSession, User


def path_to_dict(path: LearningPath) -> dict:
    sessions = list(path.sessions or [])
    total = sum(int(s.duration or 0) for s in sessions)
    completed = sum(int(s.duration or 0) for s in sessions if s.completed)
    return {
        "id": path.id,
        "title": path.title,
        "description": path.description,
        "category": path.category,
        "difficulty": path.difficulty,
        "deadline": path.deadline,
        "color": path.color,
        "sessions": [
            {
                "id": s.id,
                "title": s.title,
                "duration": s.duration,
                "completed": s.completed,
                "completed_at": s.completed_at.isoformat() if s.completed_at else None,
            }
            for s in sessions
        ],
        "totalMinutes": total,
        "completedMinutes": completed,
        "progress": round((completed / total) * 100) if total else 0,
    }


def get_paths(db: Session, user: User):
    return [path_to_dict(p) for p in db.scalars(
        select(LearningPath).where(LearningPath.user_id == user.id).order_by(LearningPath.created_at)
    ).all()]


def get_owned_path(db: Session, user: User, path_id: str):
    return db.scalar(select(LearningPath).where(LearningPath.id == path_id, LearningPath.user_id == user.id))


def create_path(db: Session, user: User, data):
    path = LearningPath(
        id=str(uuid4()), user_id=user.id, title=data.title, description=data.description,
        category=data.category, difficulty=data.difficulty, deadline=data.deadline, color=data.color
    )
    db.add(path)
    db.commit()
    db.refresh(path)
    return path_to_dict(path)


def update_path(db: Session, user: User, path_id: str, data):
    path = get_owned_path(db, user, path_id)
    if not path:
        return None
    for field in ("title", "description", "category", "difficulty", "deadline", "color"):
        value = getattr(data, field)
        if value is not None:
            setattr(path, field, value)
    db.commit()
    db.refresh(path)
    return path_to_dict(path)


def delete_path(db: Session, user: User, path_id: str):
    path = get_owned_path(db, user, path_id)
    if not path:
        return False
    db.delete(path)
    db.commit()
    return True


def add_session(db: Session, user: User, path_id: str, data):
    path = get_owned_path(db, user, path_id)
    if not path:
        return None
    session = LearningSession(id=str(uuid4()), path_id=path.id, title=data.title, duration=data.duration)
    db.add(session)
    db.commit()
    db.refresh(path)
    return path_to_dict(path)


def update_session(db: Session, user: User, path_id: str, session_id: str, data):
    path = get_owned_path(db, user, path_id)
    if not path:
        return None
    session = db.scalar(select(LearningSession).where(
        LearningSession.id == session_id, LearningSession.path_id == path_id
    ))
    if not session:
        return None
    if data.title is not None: session.title = data.title
    if data.duration is not None: session.duration = data.duration
    if data.completed is not None:
        session.completed = data.completed
        session.completed_at = datetime.now(timezone.utc).replace(tzinfo=None) if data.completed else None
    db.commit()
    db.refresh(path)
    return path_to_dict(path)


def delete_session(db: Session, user: User, path_id: str, session_id: str):
    path = get_owned_path(db, user, path_id)
    if not path:
        return None
    session = db.scalar(select(LearningSession).where(
        LearningSession.id == session_id, LearningSession.path_id == path_id
    ))
    if not session:
        return None
    db.delete(session)
    db.commit()
    db.refresh(path)
    return path_to_dict(path)


def complete_learning_session(db: Session, user: User, path_id: str, session_id: str):
    return update_session(db, user, path_id, session_id, type("Data", (), {"title": None, "duration": None, "completed": True})())
