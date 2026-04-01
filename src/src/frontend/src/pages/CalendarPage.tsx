import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";

type Page =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact"
  | "calendar"
  | "profile";

interface CalendarPageProps {
  username: string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

type EventType = {
  day: number;
  label: string;
  color: string;
  bg: string;
  border: string;
};

const MARCH_EVENTS: EventType[] = [
  {
    day: 24,
    label: "Physics Assignment Due",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    day: 25,
    label: "Physics Exam",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    day: 27,
    label: "Chemistry Exam",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    day: 28,
    label: "Physics Practical",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    day: 29,
    label: "Math Exam",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    day: 30,
    label: "Chemistry Practical",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
];

const APRIL_EVENTS: EventType[] = [
  {
    day: 1,
    label: "Holiday — No Classes",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-300",
  },
];

const DOT_COLORS: Record<number, string> = {
  24: "bg-red-500",
  25: "bg-indigo-500",
  27: "bg-emerald-500",
  28: "bg-sky-500",
  29: "bg-orange-500",
  30: "bg-teal-500",
};

const APRIL_DOT_COLORS: Record<number, string> = {
  1: "bg-slate-500",
};

const MONTHS = [
  {
    name: "March 2026",
    year: 2026,
    month: 2,
    startDay: 0,
    days: 31,
    events: MARCH_EVENTS,
    dotColors: DOT_COLORS,
  },
  {
    name: "April 2026",
    year: 2026,
    month: 3,
    startDay: 3,
    days: 30,
    events: APRIL_EVENTS,
    dotColors: APRIL_DOT_COLORS,
  },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage({
  username,
  onNavigate,
  onLogout,
}: CalendarPageProps) {
  const [monthIdx, setMonthIdx] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const monthData = MONTHS[monthIdx];
  const eventsByDay = new Map<number, EventType[]>();
  for (const ev of monthData.events) {
    const arr = eventsByDay.get(ev.day) ?? [];
    arr.push(ev);
    eventsByDay.set(ev.day, arr);
  }

  const totalCells = monthData.startDay + monthData.days;
  const rows = Math.ceil(totalCells / 7);

  const legend = [
    { color: "bg-red-500", label: "Assignment Due" },
    { color: "bg-indigo-500", label: "Physics Exam" },
    { color: "bg-emerald-500", label: "Chemistry Exam" },
    { color: "bg-sky-500", label: "Physics Practical" },
    { color: "bg-orange-500", label: "Math Exam" },
    { color: "bg-teal-500", label: "Chemistry Practical" },
    { color: "bg-slate-500", label: "Holiday" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <PageHeader
        username={username}
        currentPage="calendar"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display gradient-heading">
              Academic Calendar
            </h1>
            <p className="text-blue-300/80 text-sm mt-1 font-medium">
              Exam schedule, practicals, and assignment deadlines
            </p>
          </div>

          {/* Calendar card */}
          <div className="rounded-2xl p-6 bg-white shadow-card border border-slate-100">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                data-ocid="calendar.pagination_prev"
                onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
                disabled={monthIdx === 0}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 hover:bg-slate-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" style={{ color: "#1e1b4b" }} />
              </button>
              <h2
                className="text-xl font-extrabold"
                style={{ color: "#1e1b4b" }}
              >
                {monthData.name}
              </h2>
              <button
                type="button"
                data-ocid="calendar.pagination_next"
                onClick={() =>
                  setMonthIdx((i) => Math.min(MONTHS.length - 1, i + 1))
                }
                disabled={monthIdx === MONTHS.length - 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 hover:bg-slate-100"
                aria-label="Next month"
              >
                <ChevronRight
                  className="h-5 w-5"
                  style={{ color: "#1e1b4b" }}
                />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-bold text-blue-300 uppercase tracking-wider py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: rows * 7 }, (_, i) => i).map((cellIdx) => {
                const day = cellIdx - monthData.startDay + 1;
                const isValidDay = day >= 1 && day <= monthData.days;
                const events = isValidDay ? (eventsByDay.get(day) ?? []) : [];
                const isHovered = hoveredDay === day && isValidDay;
                const today = new Date();
                const isToday =
                  isValidDay &&
                  today.getDate() === day &&
                  today.getMonth() === monthData.month &&
                  today.getFullYear() === monthData.year;

                return (
                  <div
                    key={`cell-${cellIdx}`}
                    onMouseEnter={() =>
                      isValidDay && events.length > 0
                        ? setHoveredDay(day)
                        : undefined
                    }
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`relative min-h-[52px] sm:min-h-[64px] rounded-xl p-1.5 transition-all duration-150 ${
                      !isValidDay
                        ? "opacity-0 pointer-events-none"
                        : events.length > 0
                          ? "cursor-pointer hover:bg-indigo-50 bg-slate-50"
                          : ""
                    } ${isToday ? "ring-2 ring-primary/80 bg-primary/15" : ""}`}
                  >
                    {isValidDay && (
                      <>
                        <span
                          className={`text-sm font-bold ${
                            isToday ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {day}
                        </span>
                        {/* Event dots */}
                        {events.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1">
                            {events.map((ev) => (
                              <div
                                key={`dot-${ev.label}`}
                                className={`w-2 h-2 rounded-full ${monthData.dotColors[day] ?? "bg-primary"}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Tooltip on hover */}
                        {isHovered && events.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 pointer-events-none"
                          >
                            <div className="rounded-xl p-2.5 bg-white shadow-lg border border-slate-100">
                              {events.map((ev, evIdx) => (
                                <div
                                  key={ev.label}
                                  className={`text-xs font-semibold ${ev.color} ${
                                    evIdx > 0
                                      ? "mt-1 pt-1 border-t border-white/10"
                                      : ""
                                  }`}
                                >
                                  {ev.label}
                                </div>
                              ))}
                            </div>
                            <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 border-l border-t border-slate-100" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events list */}
          <div className="mt-6 rounded-2xl p-5 bg-white shadow-card border border-slate-100">
            <h3 className="text-lg font-extrabold mb-4 gradient-heading">
              📅 {monthData.name} Events
            </h3>
            <div className="space-y-2">
              {monthData.events.map((ev, i) => (
                <motion.div
                  key={ev.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`calendar.item.${i + 1}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${ev.bg} ${ev.border}`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${monthData.dotColors[ev.day] ?? "bg-primary"}`}
                  />
                  <span className={`text-sm font-bold ${ev.color}`}>
                    {monthData.name.split(" ")[0]} {ev.day}
                  </span>
                  <span
                    className="text-sm font-semibold flex-1"
                    style={{ color: "#1e1b4b" }}
                  >
                    {ev.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 rounded-2xl p-5 bg-white shadow-card border border-slate-100">
            <h3
              className="text-sm font-bold mb-3 uppercase tracking-wider"
              style={{ color: "#374151" }}
            >
              Legend
            </h3>
            <div className="flex flex-wrap gap-3">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#374151" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
