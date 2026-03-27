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
    color: "text-red-300",
    bg: "bg-red-500/20",
    border: "border-red-500/40",
  },
  {
    day: 25,
    label: "Physics Exam",
    color: "text-blue-300",
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
  },
  {
    day: 27,
    label: "Chemistry Exam",
    color: "text-emerald-300",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
  },
  {
    day: 28,
    label: "Physics Practical",
    color: "text-sky-300",
    bg: "bg-sky-500/20",
    border: "border-sky-500/40",
  },
  {
    day: 29,
    label: "Math Exam",
    color: "text-orange-300",
    bg: "bg-orange-500/20",
    border: "border-orange-500/40",
  },
  {
    day: 30,
    label: "Chemistry Practical",
    color: "text-teal-300",
    bg: "bg-teal-500/20",
    border: "border-teal-500/40",
  },
];

const APRIL_EVENTS: EventType[] = [
  {
    day: 1,
    label: "Holiday — No Classes",
    color: "text-slate-300",
    bg: "bg-slate-500/20",
    border: "border-slate-500/40",
  },
];

const DOT_COLORS: Record<number, string> = {
  24: "bg-red-400",
  25: "bg-blue-400",
  27: "bg-emerald-400",
  28: "bg-sky-400",
  29: "bg-orange-400",
  30: "bg-teal-400",
};

const APRIL_DOT_COLORS: Record<number, string> = {
  1: "bg-slate-400",
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
    { color: "bg-red-400", label: "Assignment Due" },
    { color: "bg-blue-400", label: "Physics Exam" },
    { color: "bg-emerald-400", label: "Chemistry Exam" },
    { color: "bg-sky-400", label: "Physics Practical" },
    { color: "bg-orange-400", label: "Math Exam" },
    { color: "bg-teal-400", label: "Chemistry Practical" },
    { color: "bg-slate-400", label: "Holiday" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Academic Calendar
            </h1>
            <p className="text-blue-300/80 text-sm mt-1 font-medium">
              Exam schedule, practicals, and assignment deadlines
            </p>
          </div>

          {/* Calendar card */}
          <div className="glass-card rounded-2xl shadow-glass p-6">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                data-ocid="calendar.pagination_prev"
                onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
                disabled={monthIdx === 0}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <h2 className="text-xl font-extrabold text-white">
                {monthData.name}
              </h2>
              <button
                type="button"
                data-ocid="calendar.pagination_next"
                onClick={() =>
                  setMonthIdx((i) => Math.min(MONTHS.length - 1, i + 1))
                }
                disabled={monthIdx === MONTHS.length - 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5 text-white" />
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
                          ? "cursor-pointer hover:bg-white/10 bg-white/5"
                          : ""
                    } ${isToday ? "ring-2 ring-primary/80 bg-primary/15" : ""}`}
                  >
                    {isValidDay && (
                      <>
                        <span
                          className={`text-sm font-bold ${
                            isToday ? "text-primary" : "text-white"
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
                            <div className="glass-card-strong rounded-xl p-2.5 shadow-glass">
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
                            <div className="w-2 h-2 bg-white/10 rotate-45 mx-auto -mt-1" />
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
          <div className="mt-6 glass-card rounded-2xl p-5 shadow-glass">
            <h3 className="text-lg font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                  <span className="text-sm text-white font-semibold flex-1">
                    {ev.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 glass-card rounded-2xl p-5 shadow-glass">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Legend
            </h3>
            <div className="flex flex-wrap gap-3">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-white/80 font-semibold">
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
