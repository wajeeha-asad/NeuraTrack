from pydantic import BaseModel, Field


class SettingsResponse(BaseModel):
    theme: str
    sound_effects: bool
    animations: bool
    notifications: bool


class SettingsUpdateRequest(BaseModel):
    theme: str | None = Field(
        default=None,
        pattern="^(dark|light|system)$",
    )

    sound_effects: bool | None = None

    animations: bool | None = None

    notifications: bool | None = None