import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function WeeklyStudyChart({
  sessions = [],
}) {
  const today = new Date();

  /*
   * Monday is the first day of the week.
   */

  const dayOfWeek = today.getDay();

  const mondayOffset =
    dayOfWeek === 0
      ? -6
      : 1 - dayOfWeek;

  const startOfWeek = new Date(today);

  startOfWeek.setDate(
    today.getDate() + mondayOffset
  );

  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = DAYS.map(
    (day, index) => {
      const targetDate = new Date(
        startOfWeek
      );

      targetDate.setDate(
        startOfWeek.getDate() + index
      );

      const dateKey =
        getLocalDateKey(targetDate);

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
              getLocalDateKey(sessionDate) ===
              dateKey
            );
          })
          .reduce(
            (total, session) =>
              total +
              Number(session.duration || 0),
            0
          );

      /*
       * Minutes → hours for display.
       */

      const hours =
        totalMinutes / 60;

      return {
        day,
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
          Weekly Study Hours
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Your study activity this week
        </p>
      </div>

      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={weeklyData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="day"
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

            <Bar
              dataKey="hours"
              fill="#7C5CFC"
              radius={[
                8,
                8,
                0,
                0,
              ]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}