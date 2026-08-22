
from pydantic import BaseModel, Field
from typing import Optional


class SessionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    duration: int = Field(ge=1)


class SessionUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=150)
    duration: Optional[int] = Field(default=None, ge=1)
    completed: Optional[bool] = None


class SessionResponse(BaseModel):
    id: str
    title: str
    duration: int
    completed: bool
    completed_at: Optional[str] = None

    model_config = {"from_attributes": True}


class PathCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5, max_length=500)
    category: str = Field(min_length=1, max_length=50)
    difficulty: str = Field(min_length=1, max_length=30)
    deadline: str = Field(min_length=1, max_length=10)
    color: str = Field(default="#8093F1", max_length=20)


class PathUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=100)
    description: Optional[str] = Field(default=None, min_length=5, max_length=500)
    category: Optional[str] = Field(default=None, min_length=1, max_length=50)
    difficulty: Optional[str] = Field(default=None, min_length=1, max_length=30)
    deadline: Optional[str] = Field(default=None, min_length=1, max_length=10)
    color: Optional[str] = Field(default=None, max_length=20)


class PathResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    deadline: str
    color: str
    sessions: list[SessionResponse]
    totalMinutes: int
    completedMinutes: int
    progress: int


class FocusSessionCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=150)
    duration: int = Field(ge=1)
    path_id: Optional[str] = None
    session_id: Optional[str] = None


class FocusSessionResponse(BaseModel):
    id: str
    subject: str
    duration: int
    date: str
    pathId: Optional[str] = None
    pathTitle: Optional[str] = None
    pathCategory: Optional[str] = None
    sessionId: Optional[str] = None
