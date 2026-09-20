from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Notification, User


# Keep this compatible with the original production schema as well as the
# expanded model, so a notification can never break the parent action.
MAX_NOTIFICATION_TYPE_LENGTH = 50


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
    """Create an in-app notification while respecting the user's preference."""
    if not user.notifications:
        return None

    notification_type = str(notification_type)[:MAX_NOTIFICATION_TYPE_LENGTH]

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
