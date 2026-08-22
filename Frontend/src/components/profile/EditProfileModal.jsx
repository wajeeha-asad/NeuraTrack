import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 2) {
      toast.error(
        "Name must be at least 2 characters."
      );

      return;
    }

    if (formData.username.trim().length < 3) {
      toast.error(
        "Username must be at least 3 characters."
      );

      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      });

      toast.success(
        "Profile updated successfully!"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#11162F] p-5 shadow-2xl sm:p-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update your personal information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close edit profile"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Name */}

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Your name"
            />
          </div>

          {/* Username */}

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Username
            </label>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="username"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Email
            </label>

            <input
              value={user.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-500 outline-none"
            />

            <p className="mt-2 text-xs text-slate-600">
              Email cannot be changed from your profile.
            </p>
          </div>

          {/* Bio */}

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={isSaving}
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about yourself..."
            />

            <p className="mt-1 text-right text-xs text-slate-600">
              {formData.bio.length}/500
            </p>
          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] px-5 py-3 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}