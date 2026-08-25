const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY =
  "neuratrack_access_token";

const REFRESH_TOKEN_KEY =
  "neuratrack_refresh_token";

const AUTH_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

function clearAuthenticationState() {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  );

  localStorage.removeItem(
    "neuratrack-user"
  );

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("neuratrack-auth-expired")
    );
  }
}

function getErrorMessage(data, status) {
  let errorMessage =
    `Request failed with status ${status}`;

  if (
    typeof data?.detail ===
    "string"
  ) {
    errorMessage = data.detail;
  } else if (
    Array.isArray(data?.detail)
  ) {
    errorMessage = data.detail
      .map((error) => {
        if (typeof error === "string") {
          return error;
        }

        return (
          error?.msg ||
          "Validation error"
        );
      })
      .join(", ");
  } else if (
    data?.detail &&
    typeof data.detail === "object"
  ) {
    errorMessage = Object.values(
      data.detail
    )
      .map((error) =>
        typeof error === "string"
          ? error
          : error?.msg ||
            JSON.stringify(error)
      )
      .join(", ");
  } else if (
    typeof data?.message ===
    "string"
  ) {
    errorMessage = data.message;
  }

  return errorMessage;
}

async function refreshAccessToken() {
  const refreshToken =
    localStorage.getItem(
      REFRESH_TOKEN_KEY
    );

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (
      !response.ok ||
      !data?.access_token
    ) {
      clearAuthenticationState();
      return null;
    }

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      data.access_token
    );

    return data.access_token;
  } catch (error) {
    console.error(
      "Failed to refresh authentication token:",
      error
    );

    clearAuthenticationState();
    return null;
  }
}

const api = async (
  endpoint,
  options = {}
) => {
  const makeRequest = async (token) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    return fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };

  let token = localStorage.getItem(
    ACCESS_TOKEN_KEY
  );

  let response = await makeRequest(
    token
  );

  // If the access token expired, transparently
  // refresh it and retry the original request once.
  const shouldRefresh =
    response.status === 401 &&
    !AUTH_ENDPOINTS.includes(endpoint);

  if (shouldRefresh) {
    const newAccessToken =
      await refreshAccessToken();

    if (!newAccessToken) {
      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }

    token = newAccessToken;

    response = await makeRequest(
      token
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    // Some successful/error responses may not contain JSON.
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        response.status
      )
    );
  }

  return data;
};

export default api;
