import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function LearningHeader({
  onCreateClick,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Learning Paths
        </h1>

        <p className="mt-2 text-slate-400">
          Organize your learning journey and track your progress.
        </p>
      </div>

      <Button
        onClick={onCreateClick}
        className="w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Learning Path
      </Button>

    </div>
  );
}