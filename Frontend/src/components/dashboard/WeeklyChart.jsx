import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function WeeklyChart({ data = [] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101633] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">Weekly Progress</h2>
        <div className="rounded-xl bg-white/5 px-4 py-3 text-sm">This Week</div>
      </div>
      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="hours" radius={[10, 10, 0, 0]} fill="#6F7CFF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
