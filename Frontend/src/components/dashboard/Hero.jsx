import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  if (hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
}

export default function Hero({ user }) {
  const navigate = useNavigate();

  function handleStartFocus() {
    navigate("/focus");
  }

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "there";

  const greeting = getGreeting();

  return (
    <section className="relative min-h-[280px] overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#171E4A] via-[#10183B] to-[#1C1340] p-5 sm:p-6 lg:p-8">

      {/* Background Glow */}
      <div className="absolute -left-0 -top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="absolute -right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />

      <div className="relative flex flex-col items-center justify-between gap-10 lg:flex-row">

        <div className="w-full max-w-xl">

          <p className="text-slate-400">
            Welcome Back 👋
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">
            {greeting},
            <br />
            {userName}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Keep building your learning momentum.
            Stay consistent, focus on your goals,
            and make progress today.
          </p>

          <Button
            onClick={handleStartFocus}
            className="mt-8 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] w-full px-5 py-3 text-base sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Start Focus Session
          </Button>

        </div>

      </div>

    </section>
  );
}