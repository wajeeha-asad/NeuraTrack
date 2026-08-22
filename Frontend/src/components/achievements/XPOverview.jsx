import {
  Trophy,
  Flame,
  Star,
} from "lucide-react";

export default function XPOverview({
  xp = 0,
  level = 1,
  streak = 0,
}) {
  /*
    Current backend progression:
    250 XP per level.

    Example:
    300 XP
    Level 2
    = 50 / 250 XP into current level
  */
  const xpPerLevel = 250;

  const currentLevelXP = xp % xpPerLevel;

  const progress =
    (currentLevelXP / xpPerLevel) * 100;

  const remainingXP =
    xpPerLevel - currentLevelXP;

  return (
    <div className="grid gap-6 md:grid-cols-3">

      {/* TOTAL XP */}

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-6 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-400">
              Total XP
            </p>

            <p className="mt-2 text-4xl font-bold">
              {xp}
            </p>
          </div>

          <div className="rounded-2xl bg-purple-500/20 p-4">
            <Star className="text-purple-400" />
          </div>

        </div>

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-slate-400">
              Level {level}
            </span>

            <span className="text-purple-400">
              {currentLevelXP}/{xpPerLevel} XP
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="mt-3 text-xs text-slate-500">
            {remainingXP} XP until Level {level + 1}
          </p>

        </div>

      </div>

      {/* CURRENT LEVEL */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-400">
              Current Level
            </p>

            <p className="mt-2 text-4xl font-bold">
              {level}
            </p>

          </div>

          <div className="rounded-2xl bg-yellow-500/10 p-4">
            <Trophy className="text-yellow-400" />
          </div>

        </div>

        <p className="mt-6 text-sm text-slate-400">
          Keep learning to unlock the next level.
        </p>

      </div>

      {/* STREAK */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-400">
              Current Streak
            </p>

            <p className="mt-2 text-4xl font-bold">

              {streak}

              <span className="ml-2 text-lg text-slate-400">
                days
              </span>

            </p>

          </div>

          <div className="rounded-2xl bg-orange-500/10 p-4">
            <Flame className="text-orange-400" />
          </div>

        </div>

        <p className="mt-6 text-sm text-orange-400">
          Keep the fire alive! 🔥
        </p>

      </div>

    </div>
  );
}