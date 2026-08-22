from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
)

from app.db.models import User

from app.dependencies.auth import (
    get_current_user,
)

from app.dependencies.database import (
    get_database,
)

from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserResponse,
    ChangePasswordRequest,
)

from app.services.auth_service import (
    authenticate_user,
    register_user,
    change_user_password,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# ==================================================
# REGISTER
# ==================================================

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(
        get_database
    ),
):
    try:
        user = register_user(
            db,
            data,
        )

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
                "Email or username is already in use."
            ),
        )

    access_token = create_access_token(
        user.id
    )

    return AuthResponse(
        message="Registration successful.",
        access_token=access_token,
        user=user,
    )


# ==================================================
# LOGIN
# ==================================================

@router.post(
    "/login",
    response_model=AuthResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(
        get_database
    ),
):
    user = authenticate_user(
        db,
        data.email,
        data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    access_token = create_access_token(
        user.id
    )

    return AuthResponse(
        message="Login successful.",
        access_token=access_token,
        user=user,
    )


# ==================================================
# CURRENT USER
# ==================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


# ==================================================
# CHANGE PASSWORD
# ==================================================

@router.put(
    "/change-password",
)
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(
        get_database
    ),
):
    try:
        change_user_password(
            db=db,
            user=current_user,
            current_password=data.current_password,
            new_password=data.new_password,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return {
        "message": "Password changed successfully."
    }