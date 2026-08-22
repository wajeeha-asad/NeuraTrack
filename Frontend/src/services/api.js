const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const api = async (
  endpoint,
  options = {}
) => {
  const token = localStorage.getItem(
    "neuratrack_access_token"
  );

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    // Some successful/error responses may not contain JSON.
    data = null;
  }

  if (!response.ok) {
    let errorMessage =
      `Request failed with status ${response.status}`;

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

    throw new Error(errorMessage);
  }

  return data;
};

export default api;