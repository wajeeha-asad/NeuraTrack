import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Bell,
  Download,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";

import Layout from "../components/layout/Layout";

import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsSection from "../components/settings/SettingsSection";
import SettingsRow from "../components/settings/SettingsRow";
import SettingsToggle from "../components/settings/SettingsToggle";

import { useAuth } from "../context/AuthContext";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";

import { getAnalytics } from "../services/analyticsService";
import { getAchievements } from "../services/achievementService";

export default function Settings() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    changePassword,
  } = useAuth();

  // ==================================================
  // SETTINGS STATE
  // ==================================================

  const [notifications, setNotifications] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==================================================
  // PASSWORD STATE
  // ==================================================

  const [passwordDialogOpen, setPasswordDialogOpen] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  // ==================================================
  // LOAD SETTINGS
  // ==================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setNotifications(
          Boolean(data.notifications)
        );

        // Keep notification preference available
        // locally for simple in-app notification handling.
        localStorage.setItem(
          "neuratrack-notifications",
          String(Boolean(data.notifications))
        );
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        toast.error(
          error.message ||
            "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ==================================================
  // NOTIFICATIONS
  // ==================================================

  const handleNotificationsChange =
    async (value) => {
      const previousValue = notifications;

      setNotifications(value);

      localStorage.setItem(
        "neuratrack-notifications",
        String(value)
      );

      try {
        setSaving(true);

        await updateSettings({
          notifications: value,
        });

        if (value) {
          toast.success(
            "Notifications enabled."
          );
        } else {
          toast.success(
            "Notifications disabled."
          );
        }
      } catch (error) {
        console.error(
          "Failed to update notifications:",
          error
        );

        setNotifications(previousValue);

        localStorage.setItem(
          "neuratrack-notifications",
          String(previousValue)
        );

        toast.error(
          error.message ||
            "Failed to update notifications."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==================================================
  // PASSWORD CHANGE
  // ==================================================

  const handlePasswordChange =
    async (event) => {
      event.preventDefault();

      if (!currentPassword) {
        toast.error(
          "Enter your current password."
        );
        return;
      }

      if (newPassword.length < 8) {
        toast.error(
          "New password must be at least 8 characters."
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        toast.error(
          "New passwords do not match."
        );
        return;
      }

      try {
        setChangingPassword(true);

        const result =
          await changePassword({
            current_password:
              currentPassword,
            new_password:
              newPassword,
            confirm_password:
              confirmPassword,
          });

        if (!result.success) {
          toast.error(
            result.message ||
              "Failed to change password."
          );
          return;
        }

        toast.success(
          "Password changed successfully."
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordDialogOpen(false);
      } catch (error) {
        console.error(
          "Password change failed:",
          error
        );

        toast.error(
          error.message ||
            "Failed to change password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  // ==================================================
  // EXPORT DATA
  // ==================================================

  const handleExportData = async () => {
    try {
      toast.loading(
        "Preparing your data...",
        {
          id: "export-data",
        }
      );

      const [
        analytics,
        achievements,
        settings,
      ] = await Promise.all([
        getAnalytics(),
        getAchievements(),
        getSettings(),
      ]);

      const exportData = {
        exportedAt:
          new Date().toISOString(),

        user: user
          ? {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              bio: user.bio,
              joinDate: user.joinDate,
              level: user.level,
              xp: user.xp,
              current_streak:
                user.current_streak,
            }
          : null,

        settings: {
          notifications:
            Boolean(
              settings?.notifications
            ),
        },

        learningPaths:
          analytics?.learningPaths || [],

        focusSessions:
          analytics?.sessions || [],

        achievements: {
          xp: achievements?.xp ?? 0,
          level: achievements?.level ?? 1,
          streak: achievements?.streak ?? 0,
          items: achievements?.achievements || [],
        },

        message:
          "NeuraTrack data export",
      };

      const blob = new Blob(
        [
          JSON.stringify(
            exportData,
            null,
            2
          ),
        ],
        {
          type: "application/json",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "neuratrack-data.json";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success(
        "Your data has been exported.",
        {
          id: "export-data",
        }
      );
    } catch (error) {
      console.error(
        "Export failed:",
        error
      );

      toast.error(
        error.message ||
          "Failed to export your data.",
        {
          id: "export-data",
        }
      );
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to log out?"
      );

    if (!confirmed) return;

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-slate-400">
            Loading settings...
          </div>
        </div>
      </Layout>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <Layout>
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">

        <SettingsHeader />

        {/* ACCOUNT */}

        <SettingsSection
          title="Account"
          description="Manage your account and security."
        >
          <SettingsRow
            icon={UserRound}
            title="Update Profile"
            description="Change your name, username, and bio."
          >
            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Manage
            </button>
          </SettingsRow>

          <SettingsRow
            icon={KeyRound}
            title="Change Password"
            description="Update your account password."
          >
            <button
              type="button"
              onClick={() =>
                setPasswordDialogOpen(true)
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Change
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* DATA */}

        <SettingsSection
          title="Data"
          description="Manage your NeuraTrack data."
        >
          <SettingsRow
            icon={Download}
            title="Export Data"
            description="Download your learning data as a JSON file."
          >
            <button
              type="button"
              onClick={handleExportData}
              className="rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Export
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* PREFERENCES */}

        <SettingsSection
          title="Preferences"
          description="Control your NeuraTrack experience."
        >
          <SettingsRow
            icon={Bell}
            title="Notifications"
            description="Show in-app notifications for important actions."
          >
            <SettingsToggle
              checked={notifications}
              onChange={
                handleNotificationsChange
              }
              label="Toggle notifications"
            />
          </SettingsRow>
        </SettingsSection>

        {/* SAVE STATUS */}

        {saving && (
          <p className="text-right text-xs text-slate-500">
            Saving settings...
          </p>
        )}

        {/* LOGOUT */}

        <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold">
                Sign Out
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Sign out of your NeuraTrack account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>

          </div>
        </div>

      </div>

      {/* CHANGE PASSWORD DIALOG */}

      {passwordDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#11162F] p-6 shadow-2xl">

            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Enter your current password and choose a new one.
              </p>
            </div>

            <form
              onSubmit={
                handlePasswordChange
              }
              className="space-y-4"
            >

              {/* CURRENT PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current Password
                </label>

                <input
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[#8093F1]/60"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* NEW PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[#8093F1]/60"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[#8093F1]/60"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() => {
                    setPasswordDialogOpen(
                      false
                    );

                    setCurrentPassword("");

                    setNewPassword("");

                    setConfirmPassword("");
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
                  disabled={
                    changingPassword
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    changingPassword
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] px-4 py-3 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </Layout>
  );
}