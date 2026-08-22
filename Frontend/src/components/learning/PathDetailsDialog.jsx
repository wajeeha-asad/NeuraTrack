import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";

import AddSessionDialog from "./AddSessionDialog";

import {
  addSessionToLearningPath,
  deleteSession,
  completeSession,
} from "../../services/learningPathService";

import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

export default function PathDetailsDialog({
  open,
  onOpenChange,
  path,
  onPathUpdate,
}) {
  const [
    addSessionOpen,
    setAddSessionOpen,
  ] = useState(false);

  if (!path) {
    return null;
  }

  const sessions =
    path.sessions || [];

  async function handleAddSession(
    sessionData
  ) {
    try {
      const updatedPath =
        await addSessionToLearningPath(
          path.id,
          sessionData
        );

      onPathUpdate(updatedPath);

      toast.success(
        "Session added successfully!"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to add session."
      );
    }
  }

  async function handleDeleteSession(
    sessionId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this session?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const updatedPath =
        await deleteSession(
          path.id,
          sessionId
        );

      onPathUpdate(updatedPath);

      toast.success(
        "Session deleted."
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to delete session."
      );
    }
  }

  async function handleCompleteSession(
    sessionId
  ) {
    try {
      const updatedPath =
        await completeSession(
          path.id,
          sessionId
        );

      onPathUpdate(updatedPath);

      toast.success(
        "Session completed! 🎉"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to complete session."
      );
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-2xl overflow-y-auto border-white/10 bg-[#101633] text-white sm:w-full">

          <DialogHeader>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <DialogTitle className="break-words text-2xl">
                  {path.title}
                </DialogTitle>

                <DialogDescription className="mt-2 break-words text-slate-400">
                  {path.description}
                </DialogDescription>

              </div>

            </div>

          </DialogHeader>


          {/* Progress */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Overall Progress
              </span>

              <span className="font-semibold">
                {path.progress || 0}%
              </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8093F1] to-[#72DDF7] transition-all"
                style={{
                  width: `${path.progress || 0}%`,
                }}
              />

            </div>


            <p className="mt-2 text-xs text-slate-500">

              {path.completedMinutes || 0}{" "}
              minutes completed

              {" "}of{" "}

              {path.totalMinutes || 0}{" "}
              minutes

            </p>

          </div>


          {/* Sessions Header */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-lg font-semibold">
                Learning Sessions
              </h3>

              <p className="text-sm text-slate-400">

                {sessions.length}{" "}

                {sessions.length === 1
                  ? "session"
                  : "sessions"}

              </p>

            </div>


            <Button
              onClick={() =>
                setAddSessionOpen(true)
              }
              className="w-full bg-gradient-to-r from-[#8093F1] to-[#72DDF7] text-[#101633] sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />

              Add Session
            </Button>

          </div>


          {/* Sessions */}

          {sessions.length === 0 ? (

            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">

              <div className="mb-4 rounded-full bg-white/5 p-4">

                <Plus className="h-6 w-6 text-slate-400" />

              </div>


              <h4 className="font-semibold">
                No sessions yet
              </h4>


              <p className="mt-2 max-w-sm text-sm text-slate-400">

                Add your first learning session
                to start tracking your progress.

              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {sessions.map(
                (session) => (

                  <div
                    key={session.id}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex min-w-0 items-start gap-4">

                      {session.completed ? (

                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#72DDF7]" />

                      ) : (

                        <Circle className="mt-0.5 h-6 w-6 shrink-0 text-slate-500" />

                      )}


                      <div className="min-w-0">

                        <h4
                          className={`break-words font-medium ${
                            session.completed
                              ? "text-slate-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {session.title}
                        </h4>


                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                          <Clock className="h-3 w-3 shrink-0" />

                          {session.duration}{" "}

                          {session.duration === 1
                            ? "minute"
                            : "minutes"}

                        </div>

                      </div>

                    </div>


                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">

                      {!session.completed && (

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCompleteSession(
                              session.id
                            )
                          }
                        >
                          Complete
                        </Button>

                      )}


                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0 text-red-400 hover:bg-red-400/10 hover:text-red-300"
                        onClick={() =>
                          handleDeleteSession(
                            session.id
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </DialogContent>
      </Dialog>


      <AddSessionDialog
        open={addSessionOpen}
        onOpenChange={
          setAddSessionOpen
        }
        onAdd={handleAddSession}
      />

    </>
  );
}