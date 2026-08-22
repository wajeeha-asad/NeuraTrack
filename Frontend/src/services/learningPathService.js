
import api from "./api";

export async function getLearningPaths() {
  return await api("/api/learning-paths");
}

export async function createLearningPath(path) {
  return await api("/api/learning-paths", {
    method: "POST",
    body: JSON.stringify({
      title: path.title,
      description: path.description,
      category: path.category,
      difficulty: path.difficulty,
      deadline: path.deadline,
      color: path.color || "#8093F1",
    }),
  });
}

export async function updateLearningPath(id, updates) {
  return await api(`/api/learning-paths/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteLearningPath(id) {
  return await api(`/api/learning-paths/${id}`, {
    method: "DELETE",
  });
}

export async function addSessionToLearningPath(pathId, sessionData) {
  return await api(`/api/learning-paths/${pathId}/sessions`, {
    method: "POST",
    body: JSON.stringify({
      title: sessionData.title,
      duration: Number(sessionData.duration),
    }),
  });
}

export async function updateSession(pathId, sessionId, updates) {
  return await api(`/api/learning-paths/${pathId}/sessions/${sessionId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteSession(pathId, sessionId) {
  return await api(`/api/learning-paths/${pathId}/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

export async function completeSession(pathId, sessionId) {
  return await api(`/api/learning-paths/${pathId}/sessions/${sessionId}/complete`, {
    method: "POST",
  });
}
