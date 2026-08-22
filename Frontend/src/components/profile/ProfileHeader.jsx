import { Camera, Pencil } from "lucide-react";

export default function ProfileHeader({
  user,
  onEdit,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">

      {/* Background Glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-4 sm:gap-5">

          {/* Avatar */}

          <div className="group relative">

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#8093F1] to-[#B388EB] text-3xl font-bold text-white shadow-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name
                  ?.charAt(0)
                  .toUpperCase()
              )}
            </div>

            <button
              type="button"
              aria-label="Change profile picture"
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-[#151936] opacity-0 transition group-hover:opacity-100"
            >
              <Camera className="h-4 w-4" />
            </button>

          </div>

          {/* User Info */}

          <div className="min-w-0">

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="mt-1 text-slate-400">
              @{user.username}
            </p>

            <p className="mt-2 truncate text-sm text-slate-500">
              {user.email}
            </p>

          </div>

        </div>

        {/* Edit Button */}

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>

      </div>

    </div>
  );
}