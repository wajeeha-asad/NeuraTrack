import { Progress } from "../ui/progress";

export default function GoalCard({ goals = [] }) {
  const calculateGoalProgress = (goal) => {
    if (!goal.total || goal.total <= 0) {
      return 0;
    }

    return Math.min(
      (Number(goal.current || 0) / Number(goal.total)) * 100,
      100
    );
  };

  const overallProgress = goals.length
    ? Math.round(
        goals.reduce(
          (sum, goal) => sum + calculateGoalProgress(goal),
          0
        ) / goals.length
      )
    : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101633] p-6">
      <h2 className="mb-6 text-2xl font-semibold">
        Today's Goals
      </h2>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 truncate text-slate-400">
            Overall Progress
          </span>

          <span className="shrink-0 font-semibold text-white">
            {overallProgress}%
          </span>
        </div>

        <Progress
          value={overallProgress}
          className="h-3"
        />
      </div>

      {/* Individual Goals */}
      <div className="space-y-5">
        {goals.length === 0 ? (
          <p className="text-sm text-slate-400">
            No goals available today.
          </p>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgress(goal);

            return (
              <div key={goal.title} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm">
                    {goal.title}
                  </span>

                  <span
                    className={`shrink-0 whitespace-nowrap text-sm ${
                      progress >= 100
                        ? "text-green-400"
                        : "text-slate-400"
                    }`}
                  >
                    {goal.current}/{goal.total}
                  </span>
                </div>

                <Progress value={progress} />
              </div>
            );
          })
        )}
      </div>

      {/* Footer Message */}
      <p className="mt-8 text-center text-lg font-semibold text-purple-400">
        {overallProgress >= 100
          ? "All goals complete! 🎉"
          : "Keep going! 🚀"}
      </p>
    </div>
  );
}