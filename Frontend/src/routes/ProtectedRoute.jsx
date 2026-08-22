import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  // Wait for AuthContext to restore the user
  // from the backend before deciding whether
  // the user is authenticated.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B1A] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#8093F1]" />

          <p className="mt-4 text-sm text-slate-400">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  // Once loading is finished, redirect
  // unauthenticated users to login.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated users can access the page.
  return children;
}