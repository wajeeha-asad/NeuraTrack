import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Clock3,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const steps = [
  {
    title: "What's your main learning goal?",
    description:
      "Choose what you want to focus on. You can always change this later.",
    icon: Target,
  },
  {
    title: "How much time can you study each day?",
    description:
      "Set a realistic daily target to build a sustainable learning habit.",
    icon: Clock3,
  },
  {
    title: "What's your preferred category?",
    description:
      "Choose the area you'd like NeuraTrack to prioritize for you.",
    icon: BookOpen,
  },
];

const learningGoals = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description:
      "Build intelligent systems and learn AI technologies.",
    emoji: "🤖",
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Build modern websites and full-stack applications.",
    emoji: "💻",
  },
  {
    id: "dsa",
    title: "DSA & Problem Solving",
    description:
      "Strengthen algorithms, data structures, and logic.",
    emoji: "🧠",
  },
  {
    id: "data-science",
    title: "Data Science",
    description:
      "Explore data, statistics, and analytical thinking.",
    emoji: "📊",
  },
];

const studyTargets = [
  {
    id: "30-min",
    title: "30 Minutes",
    description: "A small but consistent start",
    value: 30,
  },
  {
    id: "1-hour",
    title: "1 Hour",
    description: "A balanced daily routine",
    value: 60,
  },
  {
    id: "2-hours",
    title: "2 Hours",
    description: "For serious progress",
    value: 120,
  },
  {
    id: "3-plus-hours",
    title: "3+ Hours",
    description: "For intensive learning",
    value: 180,
  },
];

const categories = [
  {
    id: "programming",
    title: "Programming",
    emoji: "👩‍💻",
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    emoji: "🤖",
  },
  {
    id: "web-development",
    title: "Web Development",
    emoji: "🌐",
  },
  {
    id: "data-science",
    title: "Data Science",
    emoji: "📈",
  },
  {
    id: "design",
    title: "Design",
    emoji: "🎨",
  },
  {
    id: "other",
    title: "Other",
    emoji: "✨",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();

  const { updateProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  const [answers, setAnswers] = useState({
    learningGoal: "",
    dailyStudyTarget: "",
    preferredCategory: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const currentData =
    currentStep === 0
      ? learningGoals
      : currentStep === 1
        ? studyTargets
        : categories;

  const selectedValue =
    currentStep === 0
      ? answers.learningGoal
      : currentStep === 1
        ? answers.dailyStudyTarget
        : answers.preferredCategory;

  // ==================================================
  // SELECT OPTION
  // ==================================================

  const handleSelect = (id) => {
    if (currentStep === 0) {
      setAnswers((previous) => ({
        ...previous,
        learningGoal: id,
      }));

      return;
    }

    if (currentStep === 1) {
      const selectedTarget =
        studyTargets.find(
          (target) => target.id === id
        );

      setAnswers((previous) => ({
        ...previous,
        dailyStudyTarget:
          selectedTarget?.value ?? "",
      }));

      return;
    }

    if (currentStep === 2) {
      setAnswers((previous) => ({
        ...previous,
        preferredCategory: id,
      }));
    }
  };

  // ==================================================
  // SAVE ONBOARDING DATA
  // ==================================================

  const saveOnboardingData = async () => {
    setIsSaving(true);

    try {
      const result = await updateProfile({
        learning_goal:
          answers.learningGoal,

        daily_study_target:
          answers.dailyStudyTarget,

        preferred_category:
          answers.preferredCategory,
      });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to save your onboarding preferences."
        );
      }

      toast.success(
        "Your NeuraTrack journey is ready! 🚀"
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to save onboarding data:",
        error
      );

      toast.error(
        error.message ||
          "Unable to save your onboarding preferences. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==================================================
  // NEXT
  // ==================================================

  const handleNext = async () => {
    if (!selectedValue) {
      toast.error(
        "Please select an option to continue."
      );

      return;
    }

    // Move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(
        (previous) => previous + 1
      );

      return;
    }

    // Final step → save everything
    await saveOnboardingData();
  };

  // ==================================================
  // BACK
  // ==================================================

  const handleBack = () => {
    if (currentStep > 0 && !isSaving) {
      setCurrentStep(
        (previous) => previous - 1
      );
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-[#080B1A] text-white">
      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#8093F1]/10 blur-[120px]" />

        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#B388EB]/10 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}

        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-5 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8093F1] to-[#B388EB] font-bold">
              N
            </div>

            <span className="font-semibold">
              NeuraTrack
            </span>
          </div>

          <span className="text-sm text-slate-500">
            Step {currentStep + 1} of{" "}
            {steps.length}
          </span>
        </header>

        {/* Progress */}

        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8093F1] to-[#B388EB]"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${
                ((currentStep + 1) /
                  steps.length) *
                100
              }%`,
            }}
            transition={{
              duration: 0.4,
            }}
          />
        </div>

        {/* Content */}

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          <div className="w-full max-w-3xl">
            {/* Step Header */}

            <div className="mb-10 text-center">
              <motion.div
                key={`icon-${currentStep}`}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8093F1]/20 to-[#B388EB]/20"
              >
                <StepIcon className="h-7 w-7 text-[#8093F1]" />
              </motion.div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {steps[currentStep].title}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-slate-400">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Options */}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.25,
                }}
                className={
                  currentStep === 0
                    ? "grid gap-4 sm:grid-cols-2"
                    : currentStep === 1
                      ? "grid gap-4 sm:grid-cols-2"
                      : "grid gap-4 sm:grid-cols-3"
                }
              >
                {currentData.map((item) => {
                  /*
                   * IMPORTANT:
                   *
                   * For study targets, selectedValue contains
                   * the numeric value (30, 60, 120, 180),
                   * while item.id contains strings such as
                   * "30-min" and "2-hours".
                   *
                   * Therefore we compare against item.value
                   * for step 2.
                   */
                  const optionValue =
                    currentStep === 1
                      ? item.value
                      : item.id;

                  const isSelected =
                    selectedValue ===
                    optionValue;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleSelect(
                          item.id
                        )
                      }
                      disabled={isSaving}
                      className={`relative rounded-3xl border p-6 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#8093F1] bg-[#8093F1]/10 shadow-lg shadow-[#8093F1]/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                      } ${
                        isSaving
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      {/* Selected */}

                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#8093F1]">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      {/* Emoji */}

                      {item.emoji && (
                        <div className="mb-5 text-3xl">
                          {item.emoji}
                        </div>
                      )}

                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={
                  currentStep === 0 ||
                  isSaving
                }
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition ${
                  currentStep === 0 ||
                  isSaving
                    ? "pointer-events-none opacity-0"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8093F1] to-[#B388EB] px-6 py-3 font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : currentStep ===
                      steps.length - 1
                    ? "Start Learning"
                    : "Continue"}

                {!isSaving &&
                  (currentStep ===
                  steps.length - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  ))}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}