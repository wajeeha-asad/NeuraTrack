import { Lock, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementCard({
  achievement,
  unlocked = false,
}) {
  return (
    <motion.div
      whileHover={
        unlocked
          ? {
              y: -5,
              scale: 1.01,
            }
          : {}
      }
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition-all ${
        unlocked
          ? "border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/5"
          : "border-white/5 bg-white/[0.02] opacity-50"
      }`}
    >

      {/* Achievement Icon */}

      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
          unlocked
            ? "bg-purple-500/20"
            : "bg-white/5 grayscale"
        }`}
      >
        {unlocked ? (
          achievement.icon
        ) : (
          <Lock className="h-7 w-7 text-slate-500" />
        )}
      </div>

      {/* Content */}

      <div className="mt-5">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-xl font-semibold">
              {achievement.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {achievement.description}
            </p>

          </div>

          {unlocked && (
            <div className="shrink-0 rounded-full bg-green-500/10 p-2">
              <Check className="h-4 w-4 text-green-400" />
            </div>
          )}

        </div>

        {/* Requirement */}

        {achievement.requirement && (
          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
            <p className="text-xs text-slate-500">
              Requirement
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {achievement.requirement}
            </p>
          </div>
        )}

        {/* Footer */}

        <div className="mt-6 flex items-center justify-between">

          <span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-slate-400">
            {achievement.category}
          </span>

          <span className="font-semibold text-purple-400">
            +{achievement.xp} XP
          </span>

        </div>

      </div>

      {/* Glow */}

      {unlocked && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
      )}

    </motion.div>
  );
}