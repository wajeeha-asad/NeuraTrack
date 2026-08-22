import api from "./api";

// Get the currently authenticated user's profile
export async function getMyProfile() {
  return await api("/api/auth/me");
}

// Update the currently authenticated user's profile
export async function updateMyProfile(profileData) {
  return await api("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}