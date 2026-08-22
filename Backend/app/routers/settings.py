from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.settings import (
    SettingsResponse,
    SettingsUpdateRequest,
)
from app.services.settings_service import (
    get_user_settings,
    update_user_settings,
)


router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"],
)


@router.get(
    "",
    response_model=SettingsResponse,
)
def get_settings(
    current_user: User = Depends(
        get_current_user
    ),
):
    return get_user_settings(
        current_user
    )


@router.put(
    "",
    response_model=SettingsResponse,
)
def update_settings(
    data: SettingsUpdateRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_database),
):
    updated_user = update_user_settings(
        db,
        current_user,
        data,
    )

    return get_user_settings(
        updated_user
    )