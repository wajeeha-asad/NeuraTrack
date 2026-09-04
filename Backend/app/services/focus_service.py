from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import FocusSession, LearningPath, LearningSession, Notification, User


def serialize_focus(item, path=None):
    return {
        "id": item.id,
        "subject": item.subject,
        "duration": item.duration,
        "date": item.date.isoformat() + ("Z" if item.date.tzinfo is None else ""),
        "pathId": item.path_id,
        "pathTitle": path.title if path else None,
        "pathCategory": path.category if path else None,
        "sessionId": item.learning_session_id,
    }


def get_focus_sessions(db: Session, user: User):
    items = db.scalars(
        select(FocusSession)
        .where(FocusSession.user_id == user.id)
        .order_by(FocusSession.date.desc())
    ).all()
    paths = {
        p.id: p
        for p in db.scalars(
            select(LearningPath).where(LearningPath.user_id == user.id)
        ).all()
    }
    return [serialize_focus(x, paths.get(x.path_id)) for x in items]


def record_focus_session(db: Session, user: User, data):
    path = None
    learning_session = None

    if data.path_id:
        path = db.scalar(
            select(LearningPath).where(
                LearningPath.id == data.path_id,
                LearningPath.user_id == user.id,
            )
        )
        if not path:
            raise ValueError("Learning path not found.")

    if data.session_id:
        learning_session = db.scalar(
            select(LearningSession).where(
                LearningSession.id == data.session_id,
                LearningSession.path_id == data.path_id,
            )
        )
        if not learning_session:
            raise ValueError("Learning session not found.")

        learning_session.completed = True
        learning_session.completed_at = datetime.utcnow()

    now = datetime.utcnow()
    item = FocusSession(
        id=str(uuid4()),
        user_id=user.id,
        path_id=data.path_id,
        learning_session_id=data.session_id,
        subject=data.subject,
        duration=data.duration,
        category=path.category if path else None,
        date=now,
    )
    db.add(item)

    # XP: 50 per completed focus session. Level advances every 250 XP.
    user.xp += 50
    user.level = max(1, (user.xp // 250) + 1)

    # Streak is based on distinct study dates.
    dates = db.scalars(
        select(FocusSession.date)
        .where(FocusSession.user_id == user.id)
        .order_by(FocusSession.date.desc())
    ).all()
    study_dates = {d.date() for d in dates if d}
    study_dates.add(now.date())
    streak = 0
    cursor = now.date()
    while cursor in study_dates:
        streak += 1
        cursor -= timedelta(days=1)
    user.current_streak = streak
    user.longest_streak = max(user.longest_streak, streak)

    # Create a persistent in-app notification for the completed focus session.
    # Respect the user's existing notification preference.
    if user.notifications:
        notification = Notification(
            user_id=user.id,
            title="Focus session completed 🎯",
            message=f"You completed {data.duration} minutes of {data.subject}. Great work!",
            type="focus_completed",
            is_read=False,
            created_at=now,
        )
        db.add(notification)

    db.commit()
    db.refresh(item)
    return serialize_focus(item, path)
