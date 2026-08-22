
import api from "./api";

export async function getDashboard() {
  return await api("/api/dashboard");
}
