import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "../ui/button";

export default function FocusTimer({
  selectedMinutes,
  onSessionComplete,
}) {
  const [timeLeft, setTimeLeft] = useState(
    Math.round(selectedMinutes * 60)
  );

  const [isRunning, setIsRunning] = useState(false);

  // Reset timer whenever selected session changes
  useEffect(() => {
    setTimeLeft(
      Math.round(selectedMinutes * 60)
    );

    setIsRunning(false);
  }, [selectedMinutes]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(interval);

          setIsRunning(false);

          // Session is finished
          onSessionComplete(
            Math.round(selectedMinutes)
          );

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isRunning,
    selectedMinutes,
    onSessionComplete,
  ]);

  // Convert seconds to HH:MM:SS
  const hours = Math.floor(
    timeLeft / 3600
  )
    .toString()
    .padStart(2, "0");

  const minutes = Math.floor(
    (timeLeft % 3600) / 60
  )
    .toString()
    .padStart(2, "0");

  const seconds = (
    timeLeft % 60
  )
    .toString()
    .padStart(2, "0");

  // Check if timer is at starting point
  const isTimerAtStart =
    timeLeft ===
    Math.round(selectedMinutes * 60);

  // Reset timer
  function resetTimer() {
    setIsRunning(false);

    setTimeLeft(
      Math.round(selectedMinutes * 60)
    );
  }

  // Start / Pause / Resume
  function toggleTimer() {
    if (timeLeft === 0) {
      return;
    }

    setIsRunning(
      (previous) => !previous
    );
  }

  return (
    <div className="flex flex-col items-center">

      {/* TIMER CIRCLE */}

      <div className="relative flex h-56 w-56 sm:h-64 sm:w-64 lg:h-80 lg:w-80 items-center justify-center rounded-full border-[12px] border-[#6F7CFF]/20">

        <div className="absolute inset-3 rounded-full border-4 border-[#7C5CFC] shadow-[0_0_60px_rgba(124,92,252,0.3)]" />

        <div className="relative z-10 text-center">

          <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {hours}:{minutes}:{seconds}
          </p>

          <p className="mt-3 text-slate-400">
            {isRunning
              ? "Focus in progress"
              : timeLeft === 0
                ? "Session completed 🎉"
                : "Ready to focus"}
          </p>

        </div>

      </div>

      {/* CONTROLS */}

      <div className="mt-8 flex w-full justify-center gap-3 sm:mt-10 sm:w-auto sm:gap-4">

        {/* START / PAUSE / RESUME */}

        <Button
          onClick={toggleTimer}
          disabled={timeLeft === 0}
          className="h-14 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] flex-1 px-5 sm:flex-none sm:px-8 text-base font-semibold hover:opacity-90"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />

              {isTimerAtStart
                ? "Start"
                : "Resume"}
            </>
          )}
        </Button>

        {/* RESET */}

        <Button
          onClick={resetTimer}
          variant="outline"
          className="h-14 rounded-2xl border-white/10 bg-white/5 px-5 hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

      </div>

    </div>
  );
}