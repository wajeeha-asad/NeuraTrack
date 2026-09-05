from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy import func, select
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

def create_achievement_notifications(
    db: Session,
    user: User,
    total_minutes: int,
    previous_level: int,
    previous_longest_streak: int,
    now: datetime,
):
    achievements = [
        (
            "first-session",
            "First Session",
            first_session_unlocked := (
                db.scalar(
                    select(FocusSession.id).where(
                        FocusSession.user_id == user.id
                    ).limit(1)
                )
                is not None
            ),
        ),
        (
            "seven-day-streak",
            "7-Day Streak",
            user.longest_streak >= 7,
        ),
        (
            "fifty-hours",
            "50 Hours Studied",
            total_minutes >= 50 * 60,
        ),
        (
            "level-up",
            "Level Up",
            user.level >= 5,
        ),
    ]

    # Only create notifications for achievements that have just become unlocked.
    newly_unlocked = []

    if first_session_unlocked:
        previous_sessions = db.scalar(
            select(FocusSession.id)
            .where(FocusSession.user_id == user.id)
            .limit(2)
        )
        # The current session is already in the database session,
        # so count the user's focus sessions to determine whether
        # this is the first one.
        session_count = db.scalar(
            select(func.count(FocusSession.id)).where(
                FocusSession.user_id == user.id
            )
        ) or 0

        if session_count == 1:
            newly_unlocked.append(("first-session", "First Session"))

    if previous_longest_streak < 7 <= user.longest_streak:
        newly_unlocked.append(("seven-day-streak", "7-Day Streak"))

    if total_minutes >= 50 * 60:
        previous_total = total_minutes
        # The caller will handle milestone detection for total study time.
        pass

    if previous_level < 5 <= user.level:
        newly_unlocked.append(("level-up", "Level Up"))

    for achievement_id, achievement_title in newly_unlocked:
        notification_type = f"achievement:{achievement_id}"

        already_notified = db.scalar(
            select(Notification.id).where(
                Notification.user_id == user.id,
                Notification.type == notification_type,
            ).limit(1)
        )

        if already_notified:
            continue

        db.add(
            Notification(
                user_id=user.id,
                title="Achievement Unlocked 🏆",
                message=f'You unlocked "{achievement_title}"! Keep up the great work.',
                type=notification_type,
                is_read=False,
                created_at=now,
            )
        )

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

    previous_level = user.level
    previous_longest_streak = user.longest_streak

    previous_total_minutes = (
        db.scalar(
            select(
                func.coalesce(
                    func.sum(FocusSession.duration),
                    0,
                )
            ).where(
                FocusSession.user_id == user.id
            )
        )
        or 0
    )
    
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

    total_minutes = previous_total_minutes + data.duration

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

            # Create notifications for newly unlocked achievements.
    if user.notifications:
        newly_unlocked = []

        if previous_total_minutes < 1 and total_minutes >= 1:
            newly_unlocked.append(
                ("first-session", "First Session")
            )

        if previous_longest_streak < 7 and user.longest_streak >= 7:
            newly_unlocked.append(
                ("seven-day-streak", "7-Day Streak")
            )

        if previous_total_minutes < 50 * 60 and total_minutes >= 50 * 60:
            newly_unlocked.append(
                ("fifty-hours", "50 Hours Studied")
            )

        if previous_level < 5 and user.level >= 5:
            newly_unlocked.append(
                ("level-up", "Level Up")
            )

        for achievement_id, achievement_title in newly_unlocked:
            notification_type = f"achievement:{achievement_id}"

            already_notified = db.scalar(
                select(Notification.id).where(
                    Notification.user_id == user.id,
                    Notification.type == notification_type,
                ).limit(1)
            )

            if already_notified:
                continue

            db.add(
                Notification(
                    user_id=user.id,
                    title="Achievement Unlocked 🏆",
                    message=f'You unlocked "{achievement_title}"! Keep up the great work.',
                    type=notification_type,
                    is_read=False,
                    created_at=now,
                )
            )

    db.commit()
    db.refresh(item)
    return serialize_focus(item, path)
