from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models import User
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_database
from app.schemas.auth import UserResponse
from app.schemas.user import (
    UpdateProfileRequest,
)
from app.services.user_service import (
    update_user_profile,
)


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    data: UpdateProfileRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_database),
):
    try:
        updated_user = update_user_profile(
            db,
            current_user,
            data,
        )

        return updated_user

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unable to update profile. "
                "Please check your information."
            ),
        )