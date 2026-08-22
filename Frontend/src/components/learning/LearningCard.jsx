import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import {
  Pencil,
  Trash2,
  Clock3,
  CalendarDays,
} from "lucide-react";

function formatMinutes(minutes = 0) {
  const total = Number(minutes) || 0;

  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  }

  return `${hours} ${hours === 1 ? "hr" : "hrs"} ${remainingMinutes} min`;
}

export default function LearningCard({
  path,
  onDelete,
  onEdit,
  onView,
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">

      {/* Color accent */}
      <div
        className="h-1.5 w-full"
        style={{
          background: path.color,
        }}
      />

      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
              {path.category}
            </span>

            <h2 className="mt-4 text-xl font-bold break-words">
              {path.title}
            </h2>

            <p className="mt-2 line-clamp-2 text-sm text-slate-400">
              {path.description}
            </p>
          </div>

        </div>

        {/* Progress */}
        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">
              Progress
            </span>

            <span className="font-semibold">
              {path.progress || 0}%
            </span>
          </div>

          <Progress
            value={path.progress || 0}
            className="h-2"
          />

        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">

          {/* Study Time */}
          <div className="min-w-0 rounded-2xl bg-white/[0.04] p-3">

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 size={14} />
              Study Time
            </div>

            <p className="mt-1 break-words font-semibold">
              {formatMinutes(path.completedMinutes)}{" "}
              /{" "}
              {formatMinutes(path.totalMinutes)}
            </p>

          </div>

          {/* Deadline */}
          <div className="min-w-0 rounded-2xl bg-white/[0.04] p-3">

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={14} />
              Deadline
            </div>

            <p className="mt-1 break-words font-semibold">
              {path.deadline}
            </p>

          </div>

        </div>

        {/* Difficulty */}
        <div className="mt-4 text-sm text-slate-400">
          Difficulty:{" "}
          <span className="text-white">
            {path.difficulty}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(path)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm transition hover:bg-white/10"
          >
            <Pencil size={16} />
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(path.id)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            aria-label="Delete learning path"
          >
            <Trash2 size={16} />
          </button>

          {/* View */}
          <Button
            onClick={() => onView(path)}
            className="h-10 w-full sm:flex-1"
          >
            View Sessions
          </Button>

        </div>

      </div>

    </div>
  );
}