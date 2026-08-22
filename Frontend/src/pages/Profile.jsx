import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileLevel from "../components/profile/ProfileLevel";
import ProfileStats from "../components/profile/ProfileStats";
import EditProfileModal from "../components/profile/EditProfileModal";

import { useAuth } from "../context/AuthContext";
import { getAnalytics } from "../services/analyticsService";

export default function Profile() {
  const {
    user,
    updateProfile,
  } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }, [user]);

  // Handle profile update
  const handleSaveProfile = async (
    updatedData
  ) => {
    const result =
      await updateProfile(
        updatedData
      );

    if (!result.success) {
      throw new Error(
        result.message ||
          "Failed to update profile."
      );
    }

    setIsEditOpen(false);
  };

  // Show loading state while
  // AuthContext restores the user
  if (!user) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-slate-400">
            Loading profile...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">

        {/* Profile Header */}

        <ProfileHeader
          user={user}
          onEdit={() =>
            setIsEditOpen(true)
          }
        />

        {/* Profile Content */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Column */}

          <div className="space-y-6 sm:space-y-8 lg:col-span-2">

            <ProfileOverview
              user={user}
            />

          </div>

          {/* Right Column */}

          <div className="h-fit">

            <ProfileLevel
              level={
                user.level ?? 1
              }
              xp={
                user.xp ?? 0
              }
            />

          </div>

        </div>

        {/* Study Statistics */}

        <div>

          <ProfileStats
            totalHours={(analytics?.sessions || []).reduce((sum, s) => sum + Number(s.duration || 0), 0) / 60}
            currentStreak={user.current_streak ?? 0}
            sessionsCompleted={analytics?.sessions?.length ?? 0}
            pathsCompleted={(analytics?.learningPaths || []).filter(p => Number(p.progress) >= 100).length}
          />

        </div>

      </div>

      {/* Edit Profile Modal */}

      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() =>
            setIsEditOpen(false)
          }
          onSave={
            handleSaveProfile
          }
        />
      )}

    </Layout>
  );
}