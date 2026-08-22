
import api from "./api";

export async function getFocusSessions() {
  return await api("/api/focus/sessions");
}

export async function createFocusSession(data) {
  return await api("/api/focus/sessions", {
    method: "POST",
    body: JSON.stringify({
      subject: data.subject,
      duration: Number(data.duration),
      path_id: data.pathId ?? null,
      session_id: data.sessionId ?? null,
    }),
  });
}
