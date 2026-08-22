import { CalendarDays } from "lucide-react";

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const LEVELS = [
  "bg-white/5",
  "bg-purple-950",
  "bg-purple-800",
  "bg-purple-600",
  "bg-purple-400",
];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function StudyHeatmap({
  sessions = [],
}) {
  const today = new Date();

  /*
   * Store total study minutes for each
   * calendar date.
   */
  const activityMinutes = {};

  sessions.forEach((session) => {
    if (!session.date) {
      return;
    }

    const dateKey =
      session.date.split("T")[0];

    const minutes =
      Number(session.duration || 0);

    activityMinutes[dateKey] =
      (activityMinutes[dateKey] || 0) +
      minutes;
  });

  /*
   * Start the heatmap on Monday.
   */

  const currentDay =
    today.getDay();

  const mondayOffset =
    currentDay === 0
      ? 6
      : currentDay - 1;

  const currentMonday =
    new Date(today);

  currentMonday.setDate(
    today.getDate() -
      mondayOffset
  );

  currentMonday.setHours(
    0,
    0,
    0,
    0
  );

  /*
   * Go back 21 weeks so we have
   * 22 weeks total.
   */

  const startDate =
    new Date(currentMonday);

  startDate.setDate(
    currentMonday.getDate() -
      21 * 7
  );

  /*
   * Build 22 weeks.
   */

  const weeks = [];

  for (
    let week = 0;
    week < 22;
    week++
  ) {
    const weekDays = [];

    for (
      let day = 0;
      day < 7;
      day++
    ) {
      const date =
        new Date(startDate);

      date.setDate(
        startDate.getDate() +
          week * 7 +
          day
      );

      const dateKey =
        getDateKey(date);

      const minutes =
        activityMinutes[
          dateKey
        ] || 0;

      const hours =
        minutes / 60;

      weekDays.push({
        date: dateKey,
        hours,
      });
    }

    weeks.push(weekDays);
  }

  /*
   * Find highest daily study time.
   */

  const maxHours = Math.max(
    ...Object.values(
      activityMinutes
    ).map(
      (minutes) =>
        minutes / 60
    ),
    1
  );

  function getLevel(hours) {
    if (hours === 0) {
      return 0;
    }

    if (
      hours <=
      maxHours * 0.25
    ) {
      return 1;
    }

    if (
      hours <=
      maxHours * 0.5
    ) {
      return 2;
    }

    if (
      hours <=
      maxHours * 0.75
    ) {
      return 3;
    }

    return 4;
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7">

      {/* Header */}

      <div className="flex min-w-0 items-start justify-between gap-3">

        <div className="min-w-0">

          <h2 className="text-lg font-semibold sm:text-xl">
            Study Activity
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Your consistency over the last months
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 sm:h-11 sm:w-11">

          <CalendarDays className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />

        </div>

      </div>

      {/* Heatmap */}

      <div className="mt-6 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 sm:mt-8">

        <div className="flex min-w-[560px] gap-2 sm:min-w-[620px] sm:gap-3">

          {/* Weekday labels */}

          <div className="flex w-7 shrink-0 flex-col justify-between py-1 sm:w-8">

            {DAYS.map(
              (day) => (
                <span
                  key={day}
                  className="text-[9px] text-slate-400 sm:text-[10px]"
                >
                  {day}
                </span>
              )
            )}

          </div>

          {/* Heatmap cells */}

          <div className="grid min-w-0 flex-1 grid-flow-col grid-rows-7 gap-1">

            {weeks.map(
              (
                week,
                weekIndex
              ) =>
                week.map(
                  (
                    day,
                    dayIndex
                  ) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      title={`${day.date}: ${day.hours.toFixed(
                        1
                      )} hrs`}
                      className={`aspect-square min-w-[11px] rounded-[3px] ${
                        LEVELS[
                          getLevel(
                            day.hours
                          )
                        ]
                      } transition-transform duration-200 hover:scale-125 sm:min-w-[14px] sm:rounded-[4px]`}
                    />
                  )
                )
            )}

          </div>

        </div>

      </div>

      {/* Legend */}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-1.5 text-[10px] text-slate-400 sm:mt-7 sm:gap-2 sm:text-xs">

        <span>Less</span>

        {LEVELS.map(
          (level, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-[3px] sm:h-3.5 sm:w-3.5 sm:rounded-[4px] ${level}`}
            />
          )
        )}

        <span>More</span>

      </div>

    </div>
  );
}