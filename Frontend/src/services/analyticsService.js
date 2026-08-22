import api from "./api";

export async function getAnalytics() {
  return await api("/api/analytics");
}
