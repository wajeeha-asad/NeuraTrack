import LottieImport from "lottie-react";
import { motion } from "framer-motion";
import novaAnimation from "../../assets/lottie/nova.json";

import NovaMessage from "./NovaMessage";

const Lottie = LottieImport.default || LottieImport;

// Fixed decorative particle positions.
// These must not be generated with Math.random() during render.
const particles = [
  { left: 34, top: 46 },
  { left: 118, top: 88 },
  { left: 206, top: 34 },
  { left: 276, top: 122 },
  { left: 74, top: 176 },
  { left: 164, top: 224 },
  { left: 292, top: 258 },
  { left: 236, top: 304 },
  { left: 48, top: 286 },
  { left: 136, top: 132 },
];

export default function Nova({ user, stats }) {
  return (
    <motion.div
      animate={{
        y: [-12, 12, -12],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        pointer-events-none
        absolute
        right-2
        top-4
        z-20
        hidden
        sm:block
      "
    >
      <NovaMessage
        user={user}
        streak={stats?.currentStreak ?? 0}
        level={stats?.level ?? 1}
        progress={stats?.weeklyGoal ?? 0}
      />

      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-3xl scale-125" />

      {/* Stars */}
      {[
        { top: 10, left: 40, size: 6 },
        { top: 60, left: 310, size: 5 },
        { top: 220, left: 360, size: 4 },
        { top: 120, left: 20, size: 5 },
        { top: 280, left: 90, size: 7 },
      ].map((star, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
          }}
          className="absolute rounded-full bg-cyan-300"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
        />
      ))}

      {/* Sparkles */}
      {[
        { top: 80, left: 250 },
        { top: 200, left: 300 },
        { top: 40, left: 170 },
        { top: 150, left: 380 },
      ].map((item, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-3, 3, -3],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
          }}
          className="absolute text-cyan-300 text-lg"
          style={{
            top: item.top,
            left: item.left,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-6, 6, -6],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.08,
          }}
          className="absolute h-2 w-2 rounded-full bg-cyan-300"
          style={{
            left: `${particle.left}px`,
            top: `${particle.top}px`,
          }}
        />
      ))}

      <Lottie
        animationData={novaAnimation}
        loop
        autoplay
        className="relative h-56 w-56 md:h-72 md:w-72 lg:h-[350px] lg:w-[350px]"
      />
    </motion.div>
  );
}