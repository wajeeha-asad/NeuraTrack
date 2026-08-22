import { motion } from "framer-motion";

export default function StatCard({
  icon,
  title,
  value,
  unit,
  subtitle,
  subtitleColor = "text-green-400",
  children,
}) {
  const Icon = icon;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-2xl shadow-black/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#4F8CFF]">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="mt-2 text-2xl font-bold">
            {value}
            <span className="ml-2 text-lg font-normal text-slate-400">
              {unit}
            </span>
          </h2>

          <p className={`mt-3 text-sm ${subtitleColor}`}>
            {subtitle}
          </p>
        </div>

        <div className="mt-4 shrink-0 sm:mt-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}