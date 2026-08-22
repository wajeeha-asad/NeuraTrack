import {
  Clock,
  Flame,
  Target,
  BookOpen,
} from "lucide-react";

export default function ProfileStats({
  totalHours,
  currentStreak,
  sessionsCompleted,
  pathsCompleted,
}) {
  const stats = [
    {
      label: "Total Study Hours",
      value: totalHours,
      icon: Clock,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
    },
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: Flame,
      iconClass: "text-orange-400",
      bgClass: "bg-orange-500/10",
    },
    {
      label: "Sessions Completed",
      value: sessionsCompleted,
      icon: Target,
      iconClass: "text-green-400",
      bgClass: "bg-green-500/10",
    },
    {
      label: "Paths Completed",
      value: pathsCompleted,
      icon: BookOpen,
      iconClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
    },
  ];

  return (
    <div>

      {/* Section Header */}

      <div className="mb-5">

        <h2 className="text-xl font-semibold">
          Study Statistics
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your learning journey at a glance
        </p>

      </div>

      {/* Stats Grid */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20"
            >

              {/* Icon */}

              <div
                className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgClass}`}
              >
                <Icon
                  className={`h-5 w-5 ${stat.iconClass}`}
                />
              </div>

              {/* Value */}

              <p className="text-2xl font-bold text-white">
                {stat.value}
              </p>

              {/* Label */}

              <p className="mt-1 text-sm text-slate-400">
                {stat.label}
              </p>

            </div>
          );

        })}

      </div>

    </div>
  );
}