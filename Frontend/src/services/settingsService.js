import api from "./api";

// ==================================================
// GET SETTINGS
// ==================================================

export async function getSettings() {
  const data =
    await api("/api/settings");

  // Cache notification preference
  if (
    data.notifications !==
    undefined
  ) {
    localStorage.setItem(
      "neuratrack-notifications",
      String(
        Boolean(data.notifications)
      )
    );
  }

  return data;
}

// ==================================================
// UPDATE SETTINGS
// ==================================================

export async function updateSettings(
  settings
) {
  const data =
    await api("/api/settings", {
      method: "PUT",
      body: JSON.stringify(
        settings
      ),
    });

  if (
    data.notifications !==
    undefined
  ) {
    localStorage.setItem(
      "neuratrack-notifications",
      String(
        Boolean(data.notifications)
      )
    );
  }

  return data;
}