"use client";

type EventItem = {
  startDate: string;
};

interface MonthlyCalendarProps {
  events: EventItem[];
}

export default function MonthlyCalendar({
  events,
}: MonthlyCalendarProps) {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const monthName = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const lastDay = new Date(year, month + 1, 0);

  const days: number[] = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i);
  }

  const hasEvent = (day: number) => {
    return events.some((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const isToday = (day: number) => {
    return (
      day === today &&
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year
    );
  };

  // ✅ NEW: weekday detector
  const getDayColor = (day: number) => {
    const date = new Date(year, month, day);
    const weekDay = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (weekDay === 0) return "text-red-500"; // Dimanche
    if (weekDay === 6) return "text-sky-500"; // Samedi (bleu clair)

    return "text-gray-600";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border shadow-sm p-3">

      {/* HEADER */}
      <div className="text-center mb-3">
        <h3 className="text-base font-semibold capitalize text-gray-800">
          {monthName}
        </h3>
      </div>

      {/* DAYS HEADER */}
      <div className="grid grid-cols-7 text-[10px] text-gray-500 text-center mb-1">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const active = hasEvent(day);
          const todayFlag = isToday(day);
          const color = getDayColor(day);

          return (
            <div
              key={day}
              className={`
                relative flex items-center justify-center
                h-8 w-8 mx-auto rounded-md text-xs font-medium
                transition

                ${active
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : color}

                ${todayFlag ? "ring-2 ring-amber-700" : ""}
              `}
            >
              {day}

              {/* event dot */}
              {active && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}