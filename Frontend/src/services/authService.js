import api from "./api";

// ==================================================
// REGISTER
// ==================================================

export async function registerUser(userData) {
  const data = await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  // Save JWT returned by backend
  if (data.access_token) {
    localStorage.setItem(
      "neuratrack_access_token",
      data.access_token
    );
  }

  // Save authenticated user
  if (data.user) {
    localStorage.setItem(
      "neuratrack-user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

// ==================================================
// LOGIN
// ==================================================

export async function loginUser(credentials) {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Save JWT token
  if (data.access_token) {
    localStorage.setItem(
      "neuratrack_access_token",
      data.access_token
    );
  }

  // Save user data
  if (data.user) {
    localStorage.setItem(
      "neuratrack-user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

// ==================================================
// GET CURRENT USER
// ==================================================

export async function getCurrentUser() {
  return await api("/api/auth/me");
}

// ==================================================
// CHANGE PASSWORD
// ==================================================

export async function changePassword(
  passwordData
) {
  return await api(
    "/api/auth/change-password",
    {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }
  );
}

// ==================================================
// LOGOUT
// ==================================================

export function logoutUser() {
  localStorage.removeItem(
    "neuratrack_access_token"
  );

  localStorage.removeItem(
    "neuratrack-user"
  );
}

// ==================================================
// GET STORED USER
// ==================================================

export function getStoredUser() {
  const user = localStorage.getItem(
    "neuratrack-user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem(
      "neuratrack-user"
    );

    return null;
  }
}

// ==================================================
// CHECK AUTHENTICATION
// ==================================================

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem(
      "neuratrack_access_token"
    )
  );
}