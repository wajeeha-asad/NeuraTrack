import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  changePassword as changePasswordRequest,
} from "../services/authService";

import {
  updateMyProfile,
} from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // RESTORE AUTHENTICATED USER
  // ==================================================

  useEffect(() => {
    const handleAuthenticationExpired = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener(
      "neuratrack-auth-expired",
      handleAuthenticationExpired
    );

    const restoreUser = async () => {
      const token = localStorage.getItem(
        "neuratrack_access_token"
      );

      // No token = user is not authenticated
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // The API layer automatically refreshes an expired
        // access token when a valid refresh token exists.
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

        // Keep localStorage synchronized
        localStorage.setItem(
          "neuratrack-user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Failed to restore authenticated user:",
          error
        );

        // Both tokens are cleared when the refresh token
        // is missing, invalid, or expired.
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();

    return () => {
      window.removeEventListener(
        "neuratrack-auth-expired",
        handleAuthenticationExpired
      );
    };
  }, []);

  // ==================================================
  // LOGIN
  // ==================================================

  const login = async (credentials) => {
    try {
      const data =
        await loginUser(credentials);

      if (!data?.user) {
        return {
          success: false,
          message:
            "Login succeeded but user data was not returned.",
        };
      }

      // Update React authentication state
      setUser(data.user);

      // Keep cached user synchronized
      localStorage.setItem(
        "neuratrack-user",
        JSON.stringify(data.user)
      );

      return {
        success: true,
        user: data.user,
        message:
          data.message ||
          "Login successful.",
      };
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Login failed.",
      };
    }
  };

  // ==================================================
  // REGISTER
  // ==================================================

  const register = async (userData) => {
    try {
      const data =
        await registerUser(userData);

      if (!data?.user) {
        return {
          success: false,
          message:
            "Registration succeeded but user data was not returned.",
        };
      }

      // Registration also authenticates the user
      // because the backend returns access + refresh tokens.
      setUser(data.user);

      // Keep cached user synchronized
      localStorage.setItem(
        "neuratrack-user",
        JSON.stringify(data.user)
      );

      return {
        success: true,
        user: data.user,
        message:
          data.message ||
          "Registration successful.",
      };
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Registration failed.",
      };
    }
  };

  // ==================================================
  // UPDATE PROFILE
  // ==================================================

  const updateProfile = async (
    profileData
  ) => {
    try {
      /*
       * This calls:
       *
       * PATCH /api/users/me
       *
       * It can now update both normal profile
       * information and onboarding preferences.
       */

      const updatedUser =
        await updateMyProfile(
          profileData
        );

      if (!updatedUser) {
        return {
          success: false,
          message:
            "Profile update succeeded but no user data was returned.",
        };
      }

      // Update React state immediately
      setUser(updatedUser);

      // Update cached user immediately
      localStorage.setItem(
        "neuratrack-user",
        JSON.stringify(updatedUser)
      );

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error(
        "Profile update failed:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Profile update failed.",
      };
    }
  };

  // ==================================================
  // CHANGE PASSWORD
  // ==================================================

  const changePassword = async (
    passwordData
  ) => {
    try {
      const response =
        await changePasswordRequest(
          passwordData
        );

      return {
        success: true,
        message:
          response?.message ||
          "Password changed successfully.",
      };
    } catch (error) {
      console.error(
        "Password change failed:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Failed to change password.",
      };
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = () => {
    logoutUser();

    setUser(null);
  };

  // ==================================================
  // CONTEXT
  // ==================================================

  return (
    <AuthContext.Provider
      value={{
        // Current authenticated user
        user,

        // Authentication actions
        login,
        register,
        logout,

        // Profile / onboarding
        updateProfile,

        // Password
        changePassword,

        // Authentication status
        isAuthenticated:
          Boolean(user),

        // Used while checking the JWT
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==================================================
// useAuth HOOK
// ==================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
