export default function SettingsRow({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <Icon className="h-5 w-5 text-slate-300" />
        </div>

        <div>
          <p className="font-medium">
            {title}
          </p>

          {description && (
            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>

      </div>

      <div className="sm:shrink-0">
        {children}
      </div>

    </div>
  );
}