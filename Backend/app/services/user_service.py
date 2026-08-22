from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import User
from app.schemas.user import (
    UpdateProfileRequest,
)


def update_user_profile(
    db: Session,
    user: User,
    data: UpdateProfileRequest,
) -> User:

    # ==========================================
    # USERNAME
    # ==========================================

    if data.username is not None:
        existing_username = db.scalar(
            select(User).where(
                User.username == data.username,
                User.id != user.id,
            )
        )

        if existing_username:
            raise ValueError(
                "This username is already taken."
            )

    # ==========================================
    # BASIC PROFILE
    # ==========================================

    if data.name is not None:
        user.name = data.name

    if data.username is not None:
        user.username = data.username

    if data.bio is not None:
        user.bio = data.bio

    if data.avatar is not None:
        user.avatar = data.avatar

    # ==========================================
    # ONBOARDING PREFERENCES
    # ==========================================

    if data.learning_goal is not None:
        user.learning_goal = data.learning_goal

    if data.daily_study_target is not None:
        user.daily_study_target = (
            data.daily_study_target
        )

    if data.preferred_category is not None:
        user.preferred_category = (
            data.preferred_category
        )

    # ==========================================
    # SAVE
    # ==========================================

    db.commit()
    db.refresh(user)

    return user