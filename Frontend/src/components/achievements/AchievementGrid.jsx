import AchievementCard from "./AchievementCard";

export default function AchievementGrid({
  achievements = [],
}) {
  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  const totalCount = achievements.length;

  return (
    <section>

      <div className="mb-6">

        <h2 className="text-2xl font-semibold">
          Your Achievements
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {unlockedCount} of {totalCount} unlocked
        </p>

      </div>

      {achievements.length === 0 ? (

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
          <p className="text-slate-400">
            No achievements available yet.
          </p>
        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={achievement.unlocked}
            />
          ))}

        </div>

      )}

    </section>
  );
}