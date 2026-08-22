import { Clock3 } from "lucide-react";

function formatMinutes(minutes = 0) {
  const total = Number(minutes) || 0;

  if (total < 60) {
    return `${total} ${
      total === 1 ? "min" : "mins"
    }`;
  }

  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${
      hours === 1 ? "hr" : "hrs"
    }`;
  }

  return `${hours} ${
    hours === 1 ? "hr" : "hrs"
  } ${remainingMinutes} min`;
}

export default function SessionHistory({
  sessions,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Session History
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your recent focus sessions
        </p>
      </div>

      <div className="space-y-4">

        {sessions.length === 0 ? (
          <p className="py-8 text-center text-slate-400">
            No sessions completed yet.
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white/[0.03] p-4"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">
                  <Clock3 className="text-purple-400" />
                </div>

                <div>
                  <p className="font-medium">
                    {session.subject}
                  </p>

                  <p className="text-sm text-slate-400">
                    {session.date}
                  </p>
                </div>

              </div>

              <span className="font-semibold text-purple-400">
                {formatMinutes(
                  session.duration
                )}
              </span>

            </div>
          ))
        )}

      </div>
    </div>
  );
}