import api from "./api";

export async function getAchievements() {
  return await api("/api/achievements");
}