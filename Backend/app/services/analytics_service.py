from datetime import datetime

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.models import FocusSession, LearningPath, User
from app.services.focus_service import serialize_focus
from app.services.learning_service import path_to_dict


ACHIEVEMENTS = [
    (
        "first-session",
        "First Session",
        "Complete your first focus session.",
        "🏅",
        50,
        "Focus",
        "Complete 1 session",
    ),
    (
        "seven-day-streak",
        "7-Day Streak",
        "Study consistently for 7 days.",
        "🔥",
        100,
        "Consistency",
        "Reach a 7-day streak",
    ),
    (
        "fifty-hours",
        "50 Hours Studied",
        "Complete 50 hours of focused learning.",
        "🚀",
        250,
        "Milestone",
        "Study for 50 hours",
    ),
    (
        "level-up",
        "Level Up",
        "Reach Level 5.",
        "⭐",
        150,
        "Progress",
        "Reach Level 5",
    ),
    (
        "goal-crusher",
        "Goal Crusher",
        "Complete your daily study target.",
        "🎯",
        200,
        "Goals",
        "Complete today's study target",
    ),
    (
        "hundred-hours",
        "Century Scholar",
        "Complete 100 hours of focused learning.",
        "💎",
        500,
        "Milestone",
        "Study for 100 hours",
    ),
]


def analytics(db: Session, user: User):
    paths = db.scalars(
        select(LearningPath).where(
            LearningPath.user_id == user.id
        )
    ).all()

    sessions = db.scalars(
        select(FocusSession)
        .where(FocusSession.user_id == user.id)
        .order_by(FocusSession.date.desc())
    ).all()

    return {
        "sessions": [
            serialize_focus(
                session,
                next(
                    (
                        path
                        for path in paths
                        if path.id == session.path_id
                    ),
                    None,
                ),
            )
            for session in sessions
        ],
        "learningPaths": [
            path_to_dict(path)
            for path in paths
        ],
    }


def achievements(db: Session, user: User):
    # ==================================================
    # TOTAL STUDY TIME
    # ==================================================

    total_minutes = (
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

    # ==================================================
    # FIRST SESSION
    # ==================================================

    first_session_exists = (
        db.scalar(
            select(FocusSession.id)
            .where(
                FocusSession.user_id == user.id
            )
            .limit(1)
        )
        is not None
    )

    # ==================================================
    # TODAY'S STUDY TIME
    # ==================================================
    #
    # FocusSession.date is stored using datetime.utcnow().
    # We therefore compare against today's UTC date,
    # matching the way focus sessions are recorded.
    #
    # duration is stored in minutes.
    # daily_study_target is also stored in minutes.
    # ==================================================

    today = datetime.utcnow().date()

    today_completed_minutes = (
        db.scalar(
            select(
                func.coalesce(
                    func.sum(FocusSession.duration),
                    0,
                )
            ).where(
                FocusSession.user_id == user.id,
                func.date(FocusSession.date) == today,
            )
        )
        or 0
    )

    # ==================================================
    # DAILY GOAL
    # ==================================================

    daily_target = user.daily_study_target or 0

    goal_crusher_unlocked = (
        daily_target > 0
        and today_completed_minutes >= daily_target
    )

    # ==================================================
    # ACHIEVEMENT STATUS
    # ==================================================

    unlocked = {
        "first-session": first_session_exists,

        "seven-day-streak":
            user.longest_streak >= 7,

        "fifty-hours":
            total_minutes >= 50 * 60,

        "level-up":
            user.level >= 5,

        "goal-crusher":
            goal_crusher_unlocked,

        "hundred-hours":
            total_minutes >= 100 * 60,
    }

    # ==================================================
    # RESPONSE
    # ==================================================

    return {
        "xp": user.xp,
        "level": user.level,
        "streak": user.current_streak,
        "achievements": [
            {
                "id": achievement_id,
                "title": title,
                "description": description,
                "icon": icon,
                "xp": xp,
                "category": category,
                "requirement": requirement,
                "unlocked": unlocked[
                    achievement_id
                ],
            }
            for (
                achievement_id,
                title,
                description,
                icon,
                xp,
                category,
                requirement,
            ) in ACHIEVEMENTS
        ],
    }