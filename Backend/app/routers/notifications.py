from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update, func
from sqlalchemy.orm import Session

from app.db.models import Notification, User, LearningPath, FocusSession
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.notification import NotificationResponse, UnreadCountResponse
from app.services.notification_service import create_notification

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


def _create_time_sensitive_reminders(db: Session, user: User):
    if not user.notifications:
        return
    now = datetime.utcnow()
    today = now.date()
    paths = db.scalars(select(LearningPath).where(LearningPath.user_id == user.id)).all()
    for path in paths:
        try:
            deadline = datetime.strptime(path.deadline, "%Y-%m-%d").date()
        except (TypeError, ValueError):
            continue
        days_left = (deadline - today).days
        if 0 <= days_left <= 3:
            if days_left == 0:
                message = f"“{path.title}” is due today. Finish your remaining work!"
            elif days_left == 1:
                message = f"“{path.title}” is due tomorrow. You still have time—keep going!"
            else:
                message = f"“{path.title}” is due in {days_left} days. Stay on track!"
            create_notification(db, user, "Learning path deadline approaching ⏳", message, f"deadline:{path.id}:{deadline.isoformat()}", created_at=now)

    if user.current_streak > 0:
        studied_today = db.scalar(select(FocusSession.id).where(
            FocusSession.user_id == user.id, func.date(FocusSession.date) == today
        ).limit(1)) is not None
        if not studied_today:
            create_notification(db, user, "Your streak is ending 🔥",
                                f"You're on a {user.current_streak}-day streak. Start a focus session today to keep it alive!",
                                f"streak_warning:{today.isoformat()}", created_at=now)
    db.commit()


@router.get("", response_model=list[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    _create_time_sensitive_reminders(db, current_user)
    return list(db.scalars(select(Notification).where(Notification.user_id == current_user.id)
                           .order_by(Notification.created_at.desc()).limit(50)).all())


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    _create_time_sensitive_reminders(db, current_user)
    count = db.scalar(select(func.count(Notification.id)).where(
        Notification.user_id == current_user.id, Notification.is_read.is_(False)
    ))
    return {"count": count or 0}


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    notification = db.scalar(select(Notification).where(Notification.id == notification_id, Notification.user_id == current_user.id))
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    notification.is_read = True
    db.commit(); db.refresh(notification)
    return notification


@router.patch("/read-all")
def mark_all_notifications_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_database)):
    result = db.execute(update(Notification).where(
        Notification.user_id == current_user.id, Notification.is_read.is_(False)
    ).values(is_read=True))
    db.commit()
    return {"message": "All notifications marked as read.", "updated": result.rowcount}
