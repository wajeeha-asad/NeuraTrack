import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
        remember_me: rememberMe,
      });

      if (!result.success) {
        toast.error(
          result.message ||
            "Unable to sign in. Please try again."
        );

        return;
      }

      toast.success(
        "Welcome back to NeuraTrack!"
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to sign in. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080B1A] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding */}

        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute inset-0 bg-gradient-to-br from-[#8093F1]/20 via-[#B388EB]/10 to-transparent" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">

            <div>
              <div className="flex items-center gap-3">

                <div className="mb-10">
                  <Logo />
                </div>

              </div>
            </div>

            <div className="max-w-lg">

              <h1 className="text-5xl font-bold leading-tight">
                Build better habits.
                <br />
                Learn with purpose.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Organize your learning journey,
                stay consistent, and turn your
                goals into progress.
              </p>

            </div>

            <p className="text-sm text-slate-500">
              Your learning journey, beautifully
              organized.
            </p>

          </div>

        </div>

        {/* Login */}

        <div className="flex items-center justify-center p-4 sm:p-6">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="mb-10">
                <Logo />
              </div>

            </div>

            <div className="mb-8">

              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-400">
                Sign in to continue your learning
                journey.
              </p>

            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-slate-600 focus:border-[#8093F1]/60"
                  />

                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 outline-none transition placeholder:text-slate-600 focus:border-[#8093F1]/60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* Remember / Forgot */}

              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowForgotPassword(
                      true
                    )
                  }
                  className="text-sm text-[#8093F1] hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] py-3.5 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            {/* Register */}

            <p className="mt-8 text-center text-sm text-slate-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-[#8093F1] hover:underline"
              >
                Create one
              </Link>

            </p>

          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11162F] p-4 sm:p-6">

            <h3 className="text-xl font-semibold">
              Forgot Password?
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Password recovery is not available yet.
              Please contact support if you need help
              accessing your account.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowForgotPassword(false)
              }
              className="mt-6 w-full rounded-xl bg-white/5 py-3 transition hover:bg-white/10"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
