from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.models import FocusSession, LearningPath, LearningSession, User
from app.services.notification_service import create_notification


def serialize_focus(item, path=None):
    return {
        "id": item.id, "subject": item.subject, "duration": item.duration,
        "date": item.date.isoformat() + ("Z" if item.date.tzinfo is None else ""),
        "pathId": item.path_id, "pathTitle": path.title if path else None,
        "pathCategory": path.category if path else None, "sessionId": item.learning_session_id,
    }


def get_focus_sessions(db: Session, user: User):
    items = db.scalars(select(FocusSession).where(FocusSession.user_id == user.id).order_by(FocusSession.date.desc())).all()
    paths = {p.id: p for p in db.scalars(select(LearningPath).where(LearningPath.user_id == user.id)).all()}
    return [serialize_focus(x, paths.get(x.path_id)) for x in items]


def record_focus_session(db: Session, user: User, data):
    path = None
    learning_session = None
    session_was_completed = False
    if data.path_id:
        path = db.scalar(select(LearningPath).where(LearningPath.id == data.path_id, LearningPath.user_id == user.id))
        if not path:
            raise ValueError("Learning path not found.")
    if data.session_id:
        learning_session = db.scalar(select(LearningSession).where(
            LearningSession.id == data.session_id,
            LearningSession.path_id == data.path_id,
        ))
        if not learning_session:
            raise ValueError("Learning session not found.")
        session_was_completed = learning_session.completed
        learning_session.completed = True
        learning_session.completed_at = datetime.utcnow()

    now = datetime.utcnow()
    previous_total_minutes = db.scalar(
        select(func.coalesce(func.sum(FocusSession.duration), 0)).where(FocusSession.user_id == user.id)
    ) or 0
    previous_session_exists = db.scalar(
        select(FocusSession.id).where(FocusSession.user_id == user.id).limit(1)
    ) is not None
    previous_level = user.level
    previous_streak = user.current_streak or 0

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
    user.xp += 50
    user.level = max(1, (user.xp // 250) + 1)

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

    if user.notifications:
        # Keep notification types short enough for both the old and new DB schema.
        create_notification(
            db, user,
            "Focus session completed 🎯",
            f"You completed {data.duration} minutes of {data.subject}. Great work!",
            f"fc:{item.id}",
            dedupe=False,
            created_at=now,
        )

        if learning_session and not session_was_completed:
            create_notification(
                db, user,
                "Learning session completed ✓",
                f"You completed “{learning_session.title}” in {path.title}. Nice work!",
                f"lc:{learning_session.id}",
                created_at=now,
            )
            db.flush()
            path_sessions = list(path.sessions or [])
            if path_sessions and all(s.completed for s in path_sessions):
                create_notification(
                    db, user,
                    "Learning path completed 🎉",
                    f"You completed the “{path.title}” learning path. Huge progress!",
                    f"lp:{path.id}",
                    created_at=now,
                )

        if previous_level < user.level:
            create_notification(
                db, user,
                "Level up unlocked ✨",
                f"You reached Level {user.level}. Your consistency is paying off!",
                f"lv:{user.level}",
                created_at=now,
            )

        for milestone in (3, 7, 14, 30, 50, 100):
            if streak >= milestone and previous_streak < milestone:
                create_notification(
                    db, user,
                    f"{milestone}-day streak 🔥",
                    f"You studied {milestone} days in a row. Keep the streak alive!",
                    f"sm:{milestone}",
                    created_at=now,
                )

        db.flush()
        today_minutes = sum(
            s.duration
            for s in db.scalars(select(FocusSession).where(FocusSession.user_id == user.id)).all()
            if s.date.date() == now.date()
        )
        target = user.daily_study_target or 120
        if today_minutes >= target:
            create_notification(
                db, user,
                "Daily goal achieved 🎯",
                f"You reached your {target}-minute study goal today. Excellent work!",
                f"dg:{now.date()}",
                created_at=now,
            )

        new_total = previous_total_minutes + data.duration
        achievement_rules = [
            (not previous_session_exists, "First Session", "You completed your first focus session. Welcome to NeuraTrack!"),
            (previous_streak < 7 <= streak, "7-Day Streak", "You reached a 7-day learning streak. Consistency unlocked!"),
            (previous_total_minutes < 50 * 60 <= new_total, "50 Hours Studied", "You crossed 50 hours of focused learning. Huge milestone!"),
            (previous_level < 5 <= user.level, "Level Up", "You reached Level 5. Your progress is adding up!"),
            (target > 0 and today_minutes - data.duration < target <= today_minutes, "Goal Crusher", "You completed today's study target. Goal crusher unlocked!"),
            (previous_total_minutes < 100 * 60 <= new_total, "Century Scholar", "You crossed 100 hours of focused learning. Incredible milestone!"),
        ]
        achievement_types = {
            "First Session": "a:first",
            "7-Day Streak": "a:seven",
            "50 Hours Studied": "a:fifty",
            "Level Up": "a:level",
            "Goal Crusher": "a:goal",
            "Century Scholar": "a:hundred",
        }
        for unlocked_now, title, message in achievement_rules:
            if unlocked_now:
                create_notification(
                    db, user,
                    f"Achievement unlocked 🏆 — {title}",
                    message,
                    achievement_types[title],
                    created_at=now,
                )

    db.commit()
    db.refresh(item)
    return serialize_focus(item, path)
