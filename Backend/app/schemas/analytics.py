from typing import Any

from pydantic import BaseModel


class DashboardUser(BaseModel):
    name: str


class DashboardResponse(BaseModel):
    user: DashboardUser
    stats: dict[str, Any]
    weeklyData: list[dict[str, Any]]
    recentSessions: list[dict[str, Any]]
    goals: list[dict[str, Any]]


class AnalyticsResponse(BaseModel):
    sessions: list[dict[str, Any]]
    learningPaths: list[dict[str, Any]]


class AchievementResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    xp: int
    category: str
    requirement: str
    unlocked: bool


class AchievementsResponse(BaseModel):
    xp: int
    level: int
    streak: int
    achievements: list[AchievementResponse]