import {
  Clock,
  Flame,
  CheckCircle,
  BookOpen,
} from "lucide-react";

export default function AnalyticsStats({
  sessions = [],
  learningPaths = [],
}) {
  /*
   * Session duration is stored in MINUTES.
   */

  const totalMinutes = sessions.reduce(
    (total, session) =>
      total + Number(session.duration || 0),
    0
  );

  /*
   * Convert minutes → hours only for display.
   */

  const totalHours = totalMinutes / 60;

  /*
   * Unique study days.
   */

  const studyDays = new Set(
    sessions
      .map((session) => {
        if (!session.date) {
          return null;
        }

        return session.date.split("T")[0];
      })
      .filter(Boolean)
  );

  const uniqueStudyDays = studyDays.size;

  /*
   * Average study time per active day.
   */

  const averageDailyHours =
    uniqueStudyDays > 0
      ? totalHours / uniqueStudyDays
      : 0;

  /*
   * Completed learning paths.
   *
   * Backend provides progress directly.
   */

  const completedPaths = learningPaths.filter(
    (path) => Number(path.progress || 0) >= 100
  ).length;

  const stats = [
    {
      title: "Total Study Hours",
      value: totalHours.toFixed(1),
      unit: "hrs",
      icon: Clock,
      iconColor: "text-blue-400",
    },

    {
      title: "Average Daily Hours",
      value: averageDailyHours.toFixed(1),
      unit: "hrs",
      icon: Flame,
      iconColor: "text-orange-400",
    },

    {
      title: "Sessions Completed",
      value: sessions.length,
      unit: "",
      icon: CheckCircle,
      iconColor: "text-green-400",
    },

    {
      title: "Paths Completed",
      value: completedPaths,
      unit: "",
      icon: BookOpen,
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {stat.value}

                  {stat.unit && (
                    <span className="ml-2 text-sm font-medium text-slate-400">
                      {stat.unit}
                    </span>
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-3">
                <Icon
                  className={`h-6 w-6 ${stat.iconColor}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}