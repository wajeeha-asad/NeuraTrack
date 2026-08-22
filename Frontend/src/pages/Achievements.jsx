import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import AchievementsHeader from "../components/achievements/AchievementsHeader";
import XPOverview from "../components/achievements/XPOverview";
import AchievementGrid from "../components/achievements/AchievementGrid";

import { getAchievements } from "../services/achievementService";

export default function Achievements() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const response = await getAchievements();
        setData(response);
      } catch (error) {
        toast.error(
          error.message || "Failed to load achievements."
        );
      }
    }

    loadAchievements();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
          Loading achievements...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10">
        <AchievementsHeader />

        <XPOverview
          xp={data.xp}
          level={data.level}
          streak={data.streak}
        />

        <AchievementGrid
          achievements={data.achievements}
        />
      </div>
    </Layout>
  );
}