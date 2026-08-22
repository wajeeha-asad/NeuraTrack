import { Star, Trophy } from "lucide-react";

export default function ProfileLevel({
  level,
  xp,
}) {
  const xpPerLevel = 250;

  const currentLevelXP =
    xp % xpPerLevel;

  const progress =
    (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            Current Level
          </p>

          <div className="mt-2 flex items-center gap-3">

            <h2 className="text-3xl sm:text-4xl font-bold">
              {level}
            </h2>

            <div className="rounded-xl bg-yellow-500/10 p-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-purple-500/10 p-4">
          <Star className="h-7 w-7 text-purple-400" />
        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            XP Progress
          </span>

          <span className="text-purple-400">
            {currentLevelXP} / {xpPerLevel}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <p className="mt-3 text-xs text-slate-500">
          {xpPerLevel - currentLevelXP} XP needed for the next level
        </p>

      </div>

    </div>
  );
}