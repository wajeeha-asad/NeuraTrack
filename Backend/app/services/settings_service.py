from sqlalchemy.orm import Session

from app.db.models import User
from app.schemas.settings import SettingsUpdateRequest


def get_user_settings(
    user: User,
) -> dict:
    return {
        "theme": user.theme,
        "sound_effects": user.sound_effects,
        "animations": user.animations,
        "notifications": user.notifications,
    }


def update_user_settings(
    db: Session,
    user: User,
    data: SettingsUpdateRequest,
) -> User:

    if data.theme is not None:
        user.theme = data.theme

    if data.sound_effects is not None:
        user.sound_effects = data.sound_effects

    if data.animations is not None:
        user.animations = data.animations

    if data.notifications is not None:
        user.notifications = data.notifications

    db.commit()
    db.refresh(user)

    return user