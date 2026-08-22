import { useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { z } from "zod";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import Logo from "@/components/common/Logo";

// ==================================================
// VALIDATION
// ==================================================

const registerSchema = z
  .object({
    name: z
      .string()
      .min(
        2,
        "Name must be at least 2 characters"
      )
      .max(
        100,
        "Name must be less than 100 characters"
      ),

    username: z
      .string()
      .min(
        3,
        "Username must be at least 3 characters"
      )
      .max(
        50,
        "Username must be less than 50 characters"
      )
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    email: z
      .string()
      .min(
        1,
        "Email is required"
      )
      .email(
        "Enter a valid email address"
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .max(
        128,
        "Password is too long"
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password"
      ),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",
      path: [
        "confirmPassword",
      ],
    }
  );

// ==================================================
// COMPONENT
// ==================================================

export default function Register() {
  const navigate = useNavigate();

  const {
    register: registerAccount,
  } = useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    passwordValue,
    setPasswordValue,
  ] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(
        registerSchema
      ),

    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ==================================================
  // PASSWORD STRENGTH
  // ==================================================

  const getPasswordStrength = () => {
    if (!passwordValue) {
      return {
        label: "",
        width: "0%",
      };
    }

    if (passwordValue.length < 8) {
      return {
        label: "Weak",
        width: "33%",
      };
    }

    if (
      !/[A-Z]/.test(
        passwordValue
      )
    ) {
      return {
        label: "Fair",
        width: "50%",
      };
    }

    if (
      /[A-Z]/.test(
        passwordValue
      ) &&
      /[0-9]/.test(
        passwordValue
      )
    ) {
      return {
        label: "Strong",
        width: "100%",
      };
    }

    return {
      label: "Good",
      width: "75%",
    };
  };

  const strength =
    getPasswordStrength();

  // ==================================================
  // SUBMIT
  // ==================================================

  const onSubmit = async (
    data
  ) => {
    const result =
      await registerAccount({
        name: data.name.trim(),

        username:
          data.username.trim(),

        email:
          data.email
            .trim()
            .toLowerCase(),

        password:
          data.password,

        confirm_password:
          data.confirmPassword,
      });

    if (!result.success) {
      toast.error(
        result.message ||
          "Unable to create your account."
      );

      return;
    }

    toast.success(
      "Account created successfully!"
    );

    // User is already authenticated
    // because the backend returned a JWT.
    navigate("/onboarding", {
      replace: true,
    });
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#080B1A] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ==========================================
            BRANDING
        ========================================== */}

        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute inset-0 bg-gradient-to-br from-[#8093F1]/20 via-[#B388EB]/10 to-transparent" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">

            <div className="flex items-center gap-3">

              <div className="mb-10">
                <Logo />
              </div>

            </div>

            <div className="max-w-lg">

              <h1 className="text-5xl font-bold leading-tight">
                Your learning journey
                starts here.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Build consistency,
                track your progress,
                and turn your
                learning goals into
                reality.
              </p>

            </div>

            <p className="text-sm text-slate-500">
              Start small. Stay
              consistent. Keep
              growing.
            </p>

          </div>

        </div>

        {/* ==========================================
            REGISTER FORM
        ========================================== */}

        <div className="flex items-center justify-center p-4 sm:p-6">

          <div className="w-full max-w-md">

            <div className="mb-8">

              <h2 className="text-2xl sm:text-3xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-slate-400">
                Start building your
                learning journey with
                NeuraTrack.
              </p>

            </div>

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="space-y-4"
            >

              {/* ====================================
                  NAME
              ==================================== */}

              <div>

                <label className="mb-2 block text-sm">
                  Name
                </label>

                <div className="relative">

                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    placeholder="Your name"
                    autoComplete="name"
                    {...register(
                      "name"
                    )}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 outline-none focus:border-[#8093F1]/60"
                  />

                </div>

                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {
                      errors.name
                        .message
                    }
                  </p>
                )}

              </div>

              {/* ====================================
                  USERNAME
              ==================================== */}

              <div>

                <label className="mb-2 block text-sm">
                  Username
                </label>

                <input
                  placeholder="username"
                  autoComplete="username"
                  {...register(
                    "username"
                  )}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 outline-none focus:border-[#8093F1]/60"
                />

                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">
                    {
                      errors
                        .username
                        .message
                    }
                  </p>
                )}

              </div>

              {/* ====================================
                  EMAIL
              ==================================== */}

              <div>

                <label className="mb-2 block text-sm">
                  Email
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register(
                      "email"
                    )}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 outline-none focus:border-[#8093F1]/60"
                  />

                </div>

                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {
                      errors.email
                        .message
                    }
                  </p>
                )}

              </div>

              {/* ====================================
                  PASSWORD
              ==================================== */}

              <div>

                <label className="mb-2 block text-sm">
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
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    {...register(
                      "password",
                      {
                        onChange:
                          (event) =>
                            setPasswordValue(
                              event
                                .target
                                .value
                            ),
                      }
                    )}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 outline-none focus:border-[#8093F1]/60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
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

                {passwordValue && (
                  <div className="mt-2">

                    <div className="h-1 overflow-hidden rounded-full bg-white/10">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
                        style={{
                          width:
                            strength.width,
                        }}
                      />

                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Password
                      strength:{" "}
                      {
                        strength.label
                      }
                    </p>

                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {
                      errors.password
                        .message
                    }
                  </p>
                )}

              </div>

              {/* ====================================
                  CONFIRM PASSWORD
              ==================================== */}

              <div>

                <label className="mb-2 block text-sm">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    {...register(
                      "confirmPassword"
                    )}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 outline-none focus:border-[#8093F1]/60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {
                      errors
                        .confirmPassword
                        .message
                    }
                  </p>
                )}

              </div>

              {/* ====================================
                  SUBMIT
              ==================================== */}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="w-full rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] py-3.5 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>

            {/* ======================================
                LOGIN LINK
            ====================================== */}

            <p className="mt-8 text-center text-sm text-slate-400">

              Already have an
              account?{" "}

              <Link
                to="/login"
                className="font-medium text-[#8093F1] hover:underline"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
}