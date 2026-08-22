import {
  CalendarDays,
  Mail,
  User,
} from "lucide-react";

function formatMemberSince(date) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileOverview({
  user = {},
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <h2 className="text-xl font-semibold">
        About You
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Your personal information
      </p>

      <div className="mt-6 space-y-5">

        {/* Bio */}

        <div>
          <p className="mb-2 text-sm text-slate-400">
            Bio
          </p>

          <p className="leading-relaxed text-slate-200">
            {user.bio || "No bio added yet."}
          </p>
        </div>

        {/* Username */}

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-purple-500/10 p-3">
            <User className="h-5 w-5 text-purple-400" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Username
            </p>

            <p className="mt-1 break-words">
              {user.username
                ? `@${user.username}`
                : "Not available"}
            </p>
          </div>

        </div>

        {/* Email */}

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-blue-500/10 p-3">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="mt-1 break-all">
              {user.email || "Not available"}
            </p>
          </div>

        </div>

        {/* Member Since */}

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-green-500/10 p-3">
            <CalendarDays className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Member Since
            </p>

            <p className="mt-1">
              {formatMemberSince(user.created_at)}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}