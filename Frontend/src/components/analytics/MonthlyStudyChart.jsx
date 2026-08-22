import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MonthlyStudyChart({
  sessions = [],
}) {
  const today = new Date();

  /*
   * Show the current month
   * + previous 6 months.
   */

  const monthlyData = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() -
          (6 - index),
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      /*
       * Duration = minutes.
       */

      const totalMinutes =
        sessions
          .filter((session) => {
            if (!session.date) {
              return false;
            }

            const sessionDate =
              new Date(session.date);

            return (
              sessionDate.getFullYear() ===
                year &&
              sessionDate.getMonth() ===
                month
            );
          })
          .reduce(
            (total, session) =>
              total +
              Number(session.duration || 0),
            0
          );

      /*
       * Minutes → hours.
       */

      const hours =
        totalMinutes / 60;

      return {
        month:
          date.toLocaleString(
            "default",
            {
              month: "short",
            }
          ),

        hours: Number(
          hours.toFixed(1)
        ),
      };
    }
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-xl">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Monthly Study Hours
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your long-term learning progress
        </p>
      </div>

      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={monthlyData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
              }}
            />

            <Tooltip
              contentStyle={{
                background: "#111936",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value) => [
                `${value} hrs`,
                "Study Time",
              ]}
            />

            <Line
              type="monotone"
              dataKey="hours"
              stroke="#57CCF2"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}