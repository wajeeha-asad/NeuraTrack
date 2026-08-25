import api from "./api";

const ACCESS_TOKEN_KEY =
  "neuratrack_access_token";

const REFRESH_TOKEN_KEY =
  "neuratrack_refresh_token";

function storeAuthenticationTokens(
  data
) {
  if (data?.access_token) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      data.access_token
    );
  }

  if (data?.refresh_token) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      data.refresh_token
    );
  }
}

// ==================================================
// REGISTER
// ==================================================

export async function registerUser(userData) {
  const data = await api(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );

  storeAuthenticationTokens(data);

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
  const data = await api(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  );

  storeAuthenticationTokens(data);

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
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
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
      ACCESS_TOKEN_KEY
    )
  );
}
