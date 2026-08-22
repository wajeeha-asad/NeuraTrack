from datetime import datetime

from pydantic import BaseModel, Field


class UpdateProfileRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
    )

    bio: str | None = Field(
        default=None,
        max_length=500,
    )

    avatar: str | None = Field(
        default=None,
        max_length=500,
    )

    # Onboarding preferences
    learning_goal: str | None = Field(
        default=None,
        max_length=100,
    )

    daily_study_target: int | None = Field(
        default=None,
        ge=1,
    )

    preferred_category: str | None = Field(
        default=None,
        max_length=100,
    )


class UserProfileResponse(BaseModel):
    id: int
    name: str
    username: str
    email: str

    avatar: str | None = None
    bio: str | None = None

    learning_goal: str | None = None
    daily_study_target: int | None = None
    preferred_category: str | None = None

    level: int
    xp: int
    current_streak: int
    longest_streak: int

    # Account creation date
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }