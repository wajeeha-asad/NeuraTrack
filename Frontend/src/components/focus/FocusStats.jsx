import {
  Clock,
  Flame,
  Target,
} from "lucide-react";

export default function FocusStats({
  sessions,
}) {
  // Get today's date.
  const today =
    new Date().toDateString();

  // Only count sessions completed today.
  const todaysSessions =
    sessions.filter((session) => {
      if (!session.date) {
        return false;
      }

      return (
        new Date(
          session.date
        ).toDateString() === today
      );
    });

  // Focus session duration is stored
  // in MINUTES.
  const todaysFocusMinutes =
    todaysSessions.reduce(
      (total, session) =>
        total +
        Number(
          session.duration || 0
        ),
      0
    );

  return (
    <div className="grid gap-4 sm:grid-cols-3">

      {/* TODAY'S FOCUS */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">

        <Clock className="mb-4 text-blue-400" />

        <p className="text-sm text-slate-400">
          Today's Focus
        </p>

        <p className="mt-2 text-3xl font-bold">
          {todaysFocusMinutes}

          <span className="ml-1 text-sm text-slate-400">
            min
          </span>
        </p>

      </div>

      {/* TOTAL SESSIONS */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">

        <Flame className="mb-4 text-orange-400" />

        <p className="text-sm text-slate-400">
          Sessions
        </p>

        <p className="mt-2 text-3xl font-bold">
          {sessions.length}
        </p>

      </div>

      {/* FOCUS GOAL */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">

        <Target className="mb-4 text-green-400" />

        <p className="text-sm text-slate-400">
          Focus Goal
        </p>

        <p className="mt-2 text-3xl font-bold">
          120

          <span className="ml-1 text-sm text-slate-400">
            min
          </span>
        </p>

      </div>

    </div>
  );
}