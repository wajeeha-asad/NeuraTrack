from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Notification, User


def create_notification(
    db: Session,
    user: User,
    title: str,
    message: str,
    notification_type: str,
    *,
    dedupe: bool = True,
    created_at: datetime | None = None,
):
    """Create an in-app notification while respecting the user's preference.

    For milestone/reminder notifications, the caller can encode a date or entity
    id into notification_type so the same reminder is not created repeatedly.
    """
    if not user.notifications:
        return None

    if dedupe:
        existing = db.scalar(
            select(Notification).where(
                Notification.user_id == user.id,
                Notification.type == notification_type,
            ).limit(1)
        )
        if existing:
            return existing

    notification = Notification(
        user_id=user.id,
        title=title,
        message=message,
        type=notification_type,
        is_read=False,
        created_at=created_at or datetime.utcnow(),
    )
    db.add(notification)
    return notification
