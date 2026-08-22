export default function RecentSessions({
  sessions = [],
}) {
  function formatDate(date) {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    const today = new Date();

    const isToday =
      parsedDate.toDateString() ===
      today.toDateString();

    if (isToday) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      parsedDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101633] p-6">

      <div className="mb-6 flex items-center justify-between gap-3">

        <h2 className="min-w-0 truncate text-2xl font-semibold">
          Recent Sessions
        </h2>

        <span className="shrink-0 text-sm text-slate-400">
          Latest
        </span>

      </div>

      <div className="space-y-6">

        {sessions.length === 0 ? (

          <p className="text-sm text-slate-400">
            No focus sessions yet.
          </p>

        ) : (

          sessions.map((session) => (

            <div
              key={session.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="min-w-0">

                <h3 className="truncate font-semibold">
                  {session.subject}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {formatDate(session.date)}
                </p>

              </div>

              <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-purple-400">
                {session.duration} min
              </span>

            </div>

          ))
        )}

      </div>

    </div>
  );
}