from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db.models import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
)


def register_user(
    db: Session,
    data: RegisterRequest,
) -> User:

    existing_email = db.scalar(
        select(User).where(
            User.email == data.email
        )
    )

    if existing_email:
        raise ValueError(
            "An account with this email already exists."
        )

    existing_username = db.scalar(
        select(User).where(
            User.username == data.username
        )
    )

    if existing_username:
        raise ValueError(
            "This username is already taken."
        )

    user = User(
        name=data.name,
        username=data.username,
        email=data.email,
        password_hash=hash_password(
            data.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:

    user = db.scalar(
        select(User).where(
            User.email == email
        )
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user


def change_user_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str,
) -> User:

    if not verify_password(
        current_password,
        user.password_hash,
    ):
        raise ValueError(
            "Current password is incorrect."
        )

    user.password_hash = hash_password(
        new_password
    )

    db.commit()
    db.refresh(user)

    return user

def create_user_token(
    user: User,
) -> str:

    return create_access_token(
        user.id
    )