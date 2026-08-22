export default function SessionSelector({
  learningPaths,
  selectedPath,
  setSelectedPath,
  selectedSession,
  setSelectedSession,
}) {
  // -----------------------------------------------
  // ONLY SHOW PATHS WITH UNFINISHED SESSIONS
  // -----------------------------------------------

  const availablePaths =
    learningPaths.filter(
      (path) =>
        path.sessions?.some(
          (session) =>
            !session.completed
        )
    );

  // -----------------------------------------------
  // CURRENT PATH
  // -----------------------------------------------

  const currentPath =
    availablePaths.find(
      (path) =>
        String(path.id) ===
        String(selectedPath)
    );

  // -----------------------------------------------
  // AVAILABLE SESSIONS
  // -----------------------------------------------

  const availableSessions =
    currentPath?.sessions?.filter(
      (session) =>
        !session.completed
    ) || [];

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {/* ========================================= */}
      {/* LEARNING PATH */}
      {/* ========================================= */}

      <div className="space-y-2">

        <label className="text-sm font-medium text-slate-300">
          Learning Path
        </label>

        <select
          value={selectedPath || ""}
          onChange={(event) => {
            const pathId =
              event.target.value;

            setSelectedPath(pathId);

            // Clear old session selection.
            setSelectedSession("");
          }}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#151B45] px-4 text-sm text-white outline-none transition focus:border-[#8093F1] focus:ring-2 focus:ring-[#8093F1]/30"
        >

          <option value="">
            Select a learning path
          </option>

          {availablePaths.map(
            (path) => (
              <option
                key={path.id}
                value={path.id}
              >
                {path.title}
              </option>
            )
          )}

        </select>

      </div>

      {/* ========================================= */}
      {/* SESSION */}
      {/* ========================================= */}

      <div className="space-y-2">

        <label className="text-sm font-medium text-slate-300">
          Session
        </label>

        <select
          value={selectedSession || ""}
          onChange={(event) =>
            setSelectedSession(
              event.target.value
            )
          }
          disabled={
            !currentPath ||
            availableSessions.length === 0
          }
          className="h-12 w-full rounded-xl border border-white/10 bg-[#151B45] px-4 text-sm text-white outline-none transition focus:border-[#8093F1] focus:ring-2 focus:ring-[#8093F1]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {/* NO PATH SELECTED */}

          {!currentPath && (
            <option value="">
              Select a learning path first
            </option>
          )}

          {/* NO SESSIONS */}

          {currentPath &&
            availableSessions.length ===
              0 && (
              <option value="">
                No unfinished sessions
              </option>
            )}

          {/* AVAILABLE SESSIONS */}

          {availableSessions.map(
            (session) => (
              <option
                key={session.id}
                value={session.id}
              >
                {session.title} —{" "}
                {session.duration}{" "}
                {Number(
                  session.duration
                ) === 1
                  ? "minute"
                  : "minutes"}
              </option>
            )
          )}

        </select>

      </div>

    </div>
  );
}