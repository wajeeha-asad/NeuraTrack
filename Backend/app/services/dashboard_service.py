from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import FocusSession, LearningPath, User
from app.services.focus_service import serialize_focus


def build_dashboard(db: Session, user: User):
    # ---------------------------------------------------------
    # Fetch user's dashboard data
    # ---------------------------------------------------------

    sessions = db.scalars(
        select(FocusSession)
        .where(FocusSession.user_id == user.id)
        .order_by(FocusSession.date.desc())
    ).all()

    paths = db.scalars(
        select(LearningPath)
        .where(LearningPath.user_id == user.id)
    ).all()

    # ---------------------------------------------------------
    # Time calculations
    # ---------------------------------------------------------

    total_minutes = sum(s.duration for s in sessions)

    today = datetime.utcnow().date()

    week_start = today - timedelta(days=today.weekday())

    week_minutes = sum(
        s.duration
        for s in sessions
        if s.date.date() >= week_start
    )

    today_minutes = sum(
        s.duration
        for s in sessions
        if s.date.date() == today
    )

    # ---------------------------------------------------------
    # Weekly chart
    # ---------------------------------------------------------

    weekly = []

    for i in range(7):
        d = week_start + timedelta(days=i)

        daily_minutes = sum(
            s.duration
            for s in sessions
            if s.date.date() == d
        )

        weekly.append(
            {
                "day": d.strftime("%a"),
                "hours": round(daily_minutes / 60, 1),
            }
        )

    # ---------------------------------------------------------
    # Recent sessions
    # ---------------------------------------------------------

    recent = []

    for s in sessions[:5]:
        path = next(
            (p for p in paths if p.id == s.path_id),
            None,
        )

        recent.append(
            serialize_focus(s, path)
        )

    # ---------------------------------------------------------
    # Goals
    # ---------------------------------------------------------

    target = user.daily_study_target or 120

    completed_paths = sum(
        1
        for p in paths
        if p.sessions and all(
            session.completed
            for session in p.sessions
        )
    )

    today_session_count = sum(
        1
        for s in sessions
        if s.date.date() == today
    )

    # ---------------------------------------------------------
    # User dashboard identity
    # ---------------------------------------------------------

    user_name = (
        getattr(user, "name", None)
        or getattr(user, "full_name", None)
        or getattr(user, "username", None)
        or user.email.split("@")[0]
    )

    # ---------------------------------------------------------
    # Final dashboard response
    # ---------------------------------------------------------

    return {
        "user": {
            "name": user_name,
        },

        "stats": {
            "studyHours": round(total_minutes / 60, 1),
            "weekHours": round(week_minutes / 60, 1),
            "currentStreak": user.current_streak or 0,
            "xp": user.xp or 0,
            "level": user.level or 1,
            "weeklyGoal": min(
                100,
                round(
                    (week_minutes / max(target * 7, 1))
                    * 100
                ),
            ),
        },

        "weeklyData": weekly,

        "recentSessions": recent,

        "goals": [
            {
                "title": "Complete 2 Study Sessions",
                "current": min(today_session_count, 2),
                "total": 2,
            },
            {
                "title": "Finish Learning Path",
                "current": completed_paths,
                "total": max(len(paths), 1),
            },
            {
                "title": "Reach Daily Study Target",
                "current": min(today_minutes, target),
                "total": target,
            },
        ],
    }