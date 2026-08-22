import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import FocusTimer from "../components/focus/FocusTimer";
import FocusPresets from "../components/focus/FocusPresets";
import SessionHistory from "../components/focus/SessionHistory";
import FocusStats from "../components/focus/FocusStats";
import SessionSelector from "../components/focus/SessionSelector";

import {
  getLearningPaths,
} from "../services/learningPathService";

import {
  getFocusSessions,
  createFocusSession,
} from "../services/focusService";

export default function Focus() {
  // --------------------------------------------------
  // LEARNING PATHS
  // --------------------------------------------------

  const [learningPaths, setLearningPaths] = useState([]);
  const [pathsLoading, setPathsLoading] = useState(true);

  // --------------------------------------------------
  // FOCUS HISTORY
  // --------------------------------------------------

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // --------------------------------------------------
  // SELECTED PATH
  // --------------------------------------------------

  const [selectedPathId, setSelectedPathId] = useState("");

  // --------------------------------------------------
  // SELECTED SESSION
  // --------------------------------------------------

  const [selectedSessionId, setSelectedSessionId] = useState("");

  // --------------------------------------------------
  // FALLBACK TIMER PRESET
  // --------------------------------------------------

  const [selectedMinutes, setSelectedMinutes] = useState(25);

  // --------------------------------------------------
  // DUPLICATE SUBMISSION PROTECTION
  // --------------------------------------------------

  const completionInProgressRef = useRef(false);

  // --------------------------------------------------
  // LOAD LEARNING PATHS
  // --------------------------------------------------

  const loadLearningPaths = useCallback(async () => {
    try {
      setPathsLoading(true);

      const data = await getLearningPaths();

      setLearningPaths(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load learning paths:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load learning paths."
      );

      setLearningPaths([]);
    } finally {
      setPathsLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // LOAD FOCUS HISTORY
  // --------------------------------------------------

  const loadFocusSessions = useCallback(async () => {
    try {
      setSessionsLoading(true);

      const data = await getFocusSessions();

      setSessions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load focus sessions:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load focus history."
      );

      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadLearningPaths();
    loadFocusSessions();
  }, [
    loadLearningPaths,
    loadFocusSessions,
  ]);

  // --------------------------------------------------
  // CURRENT PATH
  // --------------------------------------------------

  const currentPath = useMemo(() => {
    return learningPaths.find(
      (path) =>
        String(path.id) ===
        String(selectedPathId)
    );
  }, [
    learningPaths,
    selectedPathId,
  ]);

  // --------------------------------------------------
  // CURRENT SESSION
  // --------------------------------------------------

  const currentSession = useMemo(() => {
    if (!currentPath) {
      return null;
    }

    return (
      currentPath.sessions?.find(
        (session) =>
          String(session.id) ===
            String(selectedSessionId) &&
          !session.completed
      ) || null
    );
  }, [
    currentPath,
    selectedSessionId,
  ]);

  // --------------------------------------------------
  // PATHS WITH UNFINISHED SESSIONS
  // --------------------------------------------------

  const pathsWithSessions = useMemo(() => {
    return learningPaths.filter(
      (path) =>
        path.sessions?.some(
          (session) =>
            !session.completed
        )
    );
  }, [learningPaths]);

  // --------------------------------------------------
  // INITIAL PATH + SESSION SELECTION
  // --------------------------------------------------

  useEffect(() => {
    if (learningPaths.length === 0) {
      setSelectedPathId("");
      setSelectedSessionId("");
      return;
    }

    const selectedPath =
      learningPaths.find(
        (path) =>
          String(path.id) ===
          String(selectedPathId)
      );

    // No path selected:
    // automatically select the first path
    // that still has an unfinished session.
    if (!selectedPath) {
      const firstPath =
        learningPaths.find((path) =>
          path.sessions?.some(
            (session) =>
              !session.completed
          )
        );

      if (!firstPath) {
        setSelectedPathId("");
        setSelectedSessionId("");
        return;
      }

      setSelectedPathId(firstPath.id);

      const firstSession =
        firstPath.sessions?.find(
          (session) =>
            !session.completed
        );

      setSelectedSessionId(
        firstSession?.id || ""
      );

      return;
    }

    // Check whether currently selected session
    // still exists and is unfinished.
    const selectedSession =
      selectedPath.sessions?.find(
        (session) =>
          String(session.id) ===
            String(selectedSessionId) &&
          !session.completed
      );

    // If current session is no longer available,
    // select the next unfinished session.
    if (!selectedSession) {
      const nextSession =
        selectedPath.sessions?.find(
          (session) =>
            !session.completed
        );

      setSelectedSessionId(
        nextSession?.id || ""
      );
    }
  }, [
    learningPaths,
    selectedPathId,
    selectedSessionId,
  ]);

  // --------------------------------------------------
  // PATH CHANGE
  // --------------------------------------------------

  function handlePathChange(pathId) {
    setSelectedPathId(pathId);

    const newPath =
      learningPaths.find(
        (path) =>
          String(path.id) ===
          String(pathId)
      );

    const firstSession =
      newPath?.sessions?.find(
        (session) =>
          !session.completed
      );

    setSelectedSessionId(
      firstSession?.id || ""
    );
  }

  // --------------------------------------------------
  // SESSION CHANGE
  // --------------------------------------------------

  function handleSessionChange(sessionId) {
    setSelectedSessionId(sessionId);
  }

  // --------------------------------------------------
  // SESSION COMPLETE
  // --------------------------------------------------

  async function handleSessionComplete(
    durationInMinutes
  ) {
    // Prevent duplicate POST requests.
    if (completionInProgressRef.current) {
      return;
    }

    completionInProgressRef.current = true;

    try {
      const duration =
        Number(durationInMinutes) ||
        Number(currentSession?.duration) ||
        Number(selectedMinutes) ||
        25;

      if (duration <= 0) {
        toast.error(
          "Invalid session duration."
        );
        return;
      }

      // ------------------------------------------------
      // STANDALONE FOCUS SESSION
      // ------------------------------------------------

      if (!currentSession) {
        const createdSession =
          await createFocusSession({
            subject: "Focus Session",
            duration,
            pathId: null,
            sessionId: null,
          });

        setSessions((previous) => [
          createdSession,
          ...previous,
        ]);

        toast.success(
          "Focus session completed! 🎉"
        );

        return;
      }

      // ------------------------------------------------
      // LEARNING PATH FOCUS SESSION
      // ------------------------------------------------

      const createdFocusSession =
        await createFocusSession({
          subject:
            currentSession.title,
          duration,
          pathId:
            currentPath.id,
          sessionId:
            currentSession.id,
        });

      setSessions((previous) => [
        createdFocusSession,
        ...previous,
      ]);

      // Refresh learning paths directly
      // from the backend/database.
      const updatedPaths =
        await getLearningPaths();

      setLearningPaths(
        Array.isArray(updatedPaths)
          ? updatedPaths
          : []
      );

      // Find the updated path.
      const updatedPath =
        updatedPaths.find(
          (path) =>
            String(path.id) ===
            String(currentPath.id)
        );

      // Select the next unfinished session.
      const nextSession =
        updatedPath?.sessions?.find(
          (session) =>
            !session.completed
        );

      if (nextSession) {
        setSelectedPathId(
          updatedPath.id
        );

        setSelectedSessionId(
          nextSession.id
        );
      } else {
        // All sessions in this path are complete.
        setSelectedPathId("");
        setSelectedSessionId("");
      }

      toast.success(
        "Session completed! 🎉"
      );
    } catch (error) {
      console.error(
        "Failed to complete focus session:",
        error
      );

      toast.error(
        error.message ||
          "Failed to save focus session."
      );
    } finally {
      completionInProgressRef.current = false;
    }
  }

  // --------------------------------------------------
  // TIMER DURATION
  // --------------------------------------------------

  const timerMinutes =
    currentSession
      ? Number(
          currentSession.duration || 0
        )
      : selectedMinutes;

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (
    pathsLoading ||
    sessionsLoading
  ) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#8093F1]" />

            <p className="text-slate-400">
              Loading Focus Session...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <Layout>
      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Focus Session
          </h1>

          <p className="mt-2 text-slate-400">
            Deep work starts here.
            Eliminate distractions
            and focus on what matters.
          </p>
        </div>

        {/* STATS */}

        <FocusStats
          sessions={sessions}
        />

        {/* MAIN CONTENT */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* TIMER */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-8 lg:col-span-2">

            <div className="mb-8">
              <p className="text-sm text-slate-400">
                Choose what you're
                working on
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Start a Focus Session
              </h2>
            </div>

            {/* NO LEARNING PATHS */}

            {learningPaths.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

                <h3 className="text-lg font-semibold">
                  No Learning Paths Yet
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  You can still use the
                  Focus Timer as a
                  standalone session.
                </p>

              </div>
            ) : pathsWithSessions.length === 0 ? (

              /* ALL SESSIONS COMPLETED */

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

                <h3 className="text-lg font-semibold">
                  All Learning Sessions
                  Completed 🎉
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  You can still use the
                  standalone Focus Timer
                  below.
                </p>

              </div>

            ) : (

              /* SESSION SELECTOR */

              <SessionSelector
                learningPaths={
                  learningPaths
                }
                selectedPath={
                  selectedPathId
                }
                setSelectedPath={
                  handlePathChange
                }
                selectedSession={
                  selectedSessionId
                }
                setSelectedSession={
                  handleSessionChange
                }
              />
            )}

            {/* TIMER */}

            <div className="mt-8 flex flex-col items-center">

              {/* FALLBACK PRESETS */}

              {!currentSession && (
                <>
                  <p className="mb-3 text-sm text-slate-400">
                    Focus Duration
                  </p>

                  <FocusPresets
                    selectedMinutes={
                      selectedMinutes
                    }
                    setSelectedMinutes={
                      setSelectedMinutes
                    }
                  />
                </>
              )}

              {/* CURRENT SESSION */}

              {currentSession && (
                <div className="mt-2 w-full max-w-md rounded-2xl border border-[#8093F1]/20 bg-[#8093F1]/10 px-6 py-4 text-center">

                  <p className="text-sm text-slate-400">
                    Current Session
                  </p>

                  <p className="mt-1 font-semibold text-[#72DDF7]">
                    {currentSession.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {currentPath?.title}
                    {" • "}
                    {currentSession.duration}{" "}
                    {Number(
                      currentSession.duration
                    ) === 1
                      ? "minute"
                      : "minutes"}
                  </p>

                </div>
              )}

              {/* TIMER */}

              <div className="mt-10">
                <FocusTimer
                  selectedMinutes={
                    timerMinutes
                  }
                  onSessionComplete={
                    handleSessionComplete
                  }
                />
              </div>

            </div>

          </div>

          {/* HISTORY */}

          <SessionHistory
            sessions={sessions}
          />

        </div>
      </div>
    </Layout>
  );
}