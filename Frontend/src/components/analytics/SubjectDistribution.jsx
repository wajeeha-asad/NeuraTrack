import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#7C5CFC",
  "#57CCF2",
  "#A855F7",
  "#F472B6",
  "#F59E0B",
  "#22C55E",
];

export default function SubjectDistribution({
  sessions = [],
}) {
  const categoryMinutes = {};

  sessions.forEach((session) => {
    /*
     * Prefer learning-path category.
     */
    const category =
      session.pathCategory ||
      session.category ||
      "Other";

    const minutes =
      Number(session.duration || 0);

    categoryMinutes[category] =
      (categoryMinutes[category] || 0) +
      minutes;
  });

  const totalMinutes =
    Object.values(categoryMinutes).reduce(
      (total, minutes) =>
        total + minutes,
      0
    );

  const totalHours =
    totalMinutes / 60;

  const data = Object.entries(
    categoryMinutes
  )
    .map(([name, minutes]) => {
      const hours = minutes / 60;

      return {
        name,

        hours: Number(
          hours.toFixed(1)
        ),

        value:
          totalMinutes > 0
            ? Math.round(
                (minutes /
                  totalMinutes) *
                  100
              )
            : 0,
      };
    })
    .sort(
      (a, b) =>
        b.hours - a.hours
    );

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7">

      {/* Header */}

      <div className="flex min-w-0 items-start justify-between gap-3">

        <div className="min-w-0">

          <h2 className="text-lg font-semibold sm:text-xl">
            Subject Distribution
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Where your study time goes
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 sm:h-11 sm:w-11">

          <PieChartIcon className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />

        </div>

      </div>

      {data.length === 0 ? (

        <div className="flex h-64 items-center justify-center px-4 text-center text-sm text-slate-400 sm:h-72">

          Complete a focus session to see your study distribution.

        </div>

      ) : (

        <>

          {/* Chart */}

          <div className="relative mt-4 h-60 w-full min-w-0 sm:h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="42%"
                  outerRadius="68%"
                  paddingAngle={3}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth={1}
                >

                  {data.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    background:
                      "#111936",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `${value}%`,
                    "Study Time",
                  ]}
                />

              </PieChart>

            </ResponsiveContainer>

            {/* Center text */}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

              <div className="max-w-[45%] text-center">

                <p className="text-2xl font-bold sm:text-3xl">
                  {totalHours.toFixed(1)}
                </p>

                <p className="text-[10px] leading-tight text-slate-400 sm:text-sm">
                  Total Study Hours
                </p>

              </div>

            </div>

          </div>

          {/* Legend */}

          <div className="mt-3 space-y-3">

            {data.map(
              (item, index) => (

                <div
                  key={item.name}
                  className="flex min-w-0 items-center justify-between gap-3"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3"
                      style={{
                        backgroundColor:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                    <span className="truncate text-xs text-slate-300 sm:text-sm">
                      {item.name}
                    </span>

                  </div>

                  <span className="shrink-0 text-right text-xs text-slate-400 sm:text-sm">
                    {item.value}% (
                    {item.hours} hrs)
                  </span>

                </div>

              )
            )}

          </div>

        </>

      )}

    </div>
  );
}