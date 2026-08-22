import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function NovaMessage({
  user,
  streak = 0,
  level = 1,
  progress = 0,
}) {
  const [index, setIndex] = useState(0);

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "there";

  const messages = useMemo(() => {
    const dynamicMessages = [
      `👋 Welcome back, ${userName}!`,
    ];

    if (streak > 0) {
      dynamicMessages.push(
        `🔥 Your ${streak}-day streak is alive!`
      );
    } else {
      dynamicMessages.push(
        "🔥 Start a study session and build your streak!"
      );
    }

    dynamicMessages.push(
      "📚 Ready for another study session?"
    );

    if (level > 1) {
      dynamicMessages.push(
        `🚀 You're currently on Level ${level}. Keep going!`
      );
    } else {
      dynamicMessages.push(
        "🚀 Complete study sessions to level up!"
      );
    }

    if (progress >= 80) {
      dynamicMessages.push(
        "⭐ You're very close to your weekly goal!"
      );
    } else if (progress >= 50) {
      dynamicMessages.push(
        "⭐ You're more than halfway to your weekly goal!"
      );
    } else {
      dynamicMessages.push(
        "⭐ Small progress every day becomes big success."
      );
    }

    return dynamicMessages;
  }, [userName, streak, level, progress]);

  useEffect(() => {
    setIndex(0);
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(
        (previousIndex) =>
          (previousIndex + 1) % messages.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="absolute -top-14 left-1/2 w-[calc(100vw-2rem)] max-w-xs sm:w-max -translate-x-1/2">

      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${messages[index]}`}
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.95,
          }}
          transition={{
            duration: 0.35,
          }}
          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3 text-sm text-white shadow-2xl backdrop-blur-xl"
        >
          {messages[index]}
        </motion.div>
      </AnimatePresence>

      {/* Bubble Tail */}
      <div className="-mt-1 mx-auto h-3 w-3 rotate-45 border-r border-b border-white/10 bg-white/10 backdrop-blur-xl" />

    </div>
  );
}