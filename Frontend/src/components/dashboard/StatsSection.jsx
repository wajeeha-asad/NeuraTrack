import {
  BookOpen,
  Flame,
  Star,
  Target,
} from "lucide-react";

import StatCard from "./StatCard";
import MiniTrend from "./MiniTrend";

export default function StatsSection({ stats = {} }) {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      {/* STUDY HOURS */}
      <StatCard
        icon={BookOpen}
        title="Study Hours"
        value={stats.studyHours ?? 0}
        unit="hrs"
        subtitle={`+${stats.weekHours ?? 0} this week ↗`}
      >
        <MiniTrend />
      </StatCard>

      {/* CURRENT STREAK */}
      <StatCard
        icon={Flame}
        title="Current Streak"
        value={stats.currentStreak ?? 0}
        unit="days"
        subtitle="Keep it going! 🔥"
        subtitleColor="text-orange-400"
      >
        <MiniTrend />
      </StatCard>

      {/* XP */}
      <StatCard
        icon={Star}
        title="XP Earned"
        value={stats.xp ?? 0}
        unit="XP"
        subtitle={`Level ${stats.level ?? 1}`}
        subtitleColor="text-blue-400"
      >
        <MiniTrend />
      </StatCard>

      {/* WEEKLY GOAL */}
      <StatCard
        icon={Target}
        title="Weekly Goal"
        value={stats.weeklyGoal ?? 0}
        unit="%"
        subtitle="On Track 🎯"
        subtitleColor="text-green-400"
      >
        <MiniTrend />
      </StatCard>

    </section>
  );
}