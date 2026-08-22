import LearningCard from "./LearningCard";

export default function LearningGrid({
  paths,
  onDelete,
  onEdit,
  onView,
}) {
  if (paths.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
        <div className="text-center">

          <h3 className="text-xl font-semibold">
            No learning paths found
          </h3>

          <p className="mt-2 text-slate-400">
            Create your first learning path to get started.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {paths.map((path) => (

        <LearningCard
          key={path.id}
          path={path}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />

      ))}

    </div>
  );
}