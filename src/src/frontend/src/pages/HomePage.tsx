import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Info,
  Phone,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import {
  useCompletedAssignments,
  useMarkAssignmentComplete,
  useNotifications,
  useSubjectData,
} from "../hooks/useQueries";

type Page =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact"
  | "calendar"
  | "profile"
  | "teachers";

interface HomePageProps {
  username: string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const subjectConfig = [
  {
    key: "Physics",
    page: "physics" as Page,
    icon: BookOpen,
    gradient: "from-indigo-100 via-blue-50/50 to-white/0",
    accent: "border-indigo-200 hover:border-indigo-400",
    iconBg: "bg-indigo-100 text-indigo-600",
    dotColor: "bg-indigo-500",
    glowColor: "hover:shadow-indigo-200",
    hasPractical: true,
  },
  {
    key: "Chemistry",
    page: "chemistry" as Page,
    icon: FlaskConical,
    gradient: "from-emerald-100 via-green-50/50 to-white/0",
    accent: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-100 text-emerald-700",
    dotColor: "bg-emerald-500",
    glowColor: "hover:shadow-emerald-200",
    hasPractical: true,
  },
  {
    key: "Math",
    page: "math" as Page,
    icon: Calculator,
    gradient: "from-orange-100 via-amber-50/50 to-white/0",
    accent: "border-orange-200 hover:border-orange-400",
    iconBg: "bg-orange-100 text-orange-700",
    dotColor: "bg-orange-500",
    glowColor: "hover:shadow-orange-200",
    hasPractical: false,
  },
];

const defaultNotifications = [
  "📅 Physics Exam on 25 March 2026",
  "📝 Physics Assignment: Complete Chapter 5 numericals before 24 March",
  "🧪 Physics Practical on 28 March 2026",
  "📢 Holiday on 1 April — no classes",
];

const deadlines = [
  {
    label: "Physics Assignment Due",
    date: "24 Mar",
    color: "bg-red-400",
    border: "border-l-red-400",
  },
  {
    label: "Physics Exam",
    date: "25 Mar",
    color: "bg-blue-400",
    border: "border-l-blue-400",
  },
  {
    label: "Chemistry Exam",
    date: "27 Mar",
    color: "bg-emerald-400",
    border: "border-l-emerald-400",
  },
  {
    label: "Physics Practical",
    date: "28 Mar",
    color: "bg-sky-400",
    border: "border-l-sky-400",
  },
  {
    label: "Math Exam",
    date: "29 Mar",
    color: "bg-orange-400",
    border: "border-l-orange-400",
  },
  {
    label: "Chemistry Practical",
    date: "30 Mar",
    color: "bg-teal-400",
    border: "border-l-teal-400",
  },
];

const searchablePages: { label: string; page: Page; desc: string }[] = [
  {
    label: "Physics",
    page: "physics",
    desc: "Exam, practical, assignment details",
  },
  {
    label: "Chemistry",
    page: "chemistry",
    desc: "Exam, practical, assignment details",
  },
  { label: "Math", page: "math", desc: "Exam and assignment details" },
  {
    label: "Calendar",
    page: "calendar",
    desc: "View all exam and assignment dates",
  },
  { label: "About", page: "about", desc: "College information and history" },
  { label: "Contact", page: "contact", desc: "Faculty contact and queries" },
  { label: "Profile", page: "profile", desc: "Your student profile" },
  { label: "Teachers", page: "teachers", desc: "Browse all faculty members" },
];

function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const today = new Date(2026, 2, 26); // March 26 2026
  const parts = dateStr.match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (!parts) return null;
  const months: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };
  const d = new Date(Number(parts[3]), months[parts[2]] ?? 0, Number(parts[1]));
  const diff = Math.ceil(
    (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

function CountdownBadge({ examDate }: { examDate: string }) {
  const days = getDaysUntil(examDate);
  if (days === null) return null;
  if (days < 0)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
        Exam passed
      </span>
    );
  const color =
    days <= 3
      ? "bg-red-50 text-red-600 border-red-200"
      : days <= 7
        ? "bg-amber-50 text-amber-600 border-amber-200"
        : "bg-emerald-50 text-emerald-600 border-emerald-200";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-bold ${color}`}
    >
      {days === 0 ? "Exam Today!" : `Exam in ${days}d`}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-24 bg-slate-100" />
          <Skeleton className="h-3 w-32 bg-slate-100" />
        </div>
      </div>
      <Skeleton className="h-2 w-full bg-slate-100 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 bg-slate-100 rounded-full" />
        <Skeleton className="h-5 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-7 w-24 bg-slate-100 rounded-lg" />
        <Skeleton className="h-7 w-28 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function HomePage({
  username,
  onNavigate,
  onLogout,
}: HomePageProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "completed">("all");
  const [sortBy, setSortBy] = useState<"name" | "examDate">("name");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);

  const { data: subjects, isLoading: subjectsLoading } = useSubjectData();
  const { data: notifications } = useNotifications();
  const { data: completedAssignments = [] } = useCompletedAssignments();
  const markComplete = useMarkAssignmentComplete();

  const touchStartX = useRef<Record<string, number>>({});

  const subjectMap = new Map(subjects ?? []);
  const bannerText =
    notifications?.[0] ??
    "📢 Exam schedule for March 2026 has been updated. Check your subjects.";
  const notifList =
    notifications && notifications.length > 0
      ? notifications
      : defaultNotifications;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { pages: [], notifs: [] };
    const q = searchQuery.toLowerCase();
    return {
      pages: searchablePages.filter(
        (p) =>
          p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q),
      ),
      notifs: notifList.filter((n) => n.toLowerCase().includes(q)),
    };
  }, [searchQuery, notifList]);

  const hasResults =
    searchQuery.trim() &&
    (searchResults.pages.length > 0 || searchResults.notifs.length > 0);

  const filteredSubjects = useMemo(() => {
    let list = subjectConfig.filter((s) => {
      const q = searchQuery.toLowerCase();
      if (q && !s.key.toLowerCase().includes(q)) return false;
      if (filterTab === "completed")
        return completedAssignments.includes(s.key);
      return true;
    });
    if (sortBy === "examDate") {
      list = [...list].sort((a, b) => {
        const da = getDaysUntil(subjectMap.get(a.key)?.examDate ?? "") ?? 9999;
        const db = getDaysUntil(subjectMap.get(b.key)?.examDate ?? "") ?? 9999;
        return da - db;
      });
    } else {
      list = [...list].sort((a, b) => a.key.localeCompare(b.key));
    }
    return list;
  }, [searchQuery, filterTab, sortBy, completedAssignments, subjectMap]);

  const urgentAlerts = useMemo(() => {
    return subjectConfig
      .filter((s) => {
        const data = subjectMap.get(s.key);
        if (!data) return false;
        const days = getDaysUntil(data.examDate);
        return days !== null && days >= 0 && days <= 3;
      })
      .filter((s) => !dismissedAlerts.includes(s.key));
  }, [subjectMap, dismissedAlerts]);

  const handleTouchStart = (key: string, e: React.TouchEvent) => {
    touchStartX.current[key] = e.touches[0].clientX;
  };

  const handleTouchEnd = (key: string, page: Page, e: React.TouchEvent) => {
    const start = touchStartX.current[key];
    if (start === undefined) return;
    const delta = e.changedTouches[0].clientX - start;
    if (delta > 80) {
      if (!completedAssignments.includes(key)) {
        markComplete.mutate(key);
      }
    } else if (delta < -80) {
      onNavigate(page);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <PageHeader
        username={username}
        currentPage="home"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {!bannerDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          data-ocid="home.notifications.panel"
          className="border-b"
          style={{
            background:
              "linear-gradient(90deg, rgba(79,70,229,0.08), rgba(124,58,237,0.05))",
            borderBottomColor: "rgba(79,70,229,0.15)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
            <Bell
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "#4f46e5" }}
            />
            <p
              className="text-sm flex-1 font-semibold"
              style={{ color: "#3730a3" }}
            >
              {bannerText}
            </p>
            <button
              type="button"
              data-ocid="home.dismiss_banner.button"
              onClick={() => setBannerDismissed(true)}
              className="hover:opacity-70 transition-opacity"
              style={{ color: "#6b7280" }}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Welcome + Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-bold font-display"
              style={{ color: "#1e1b4b" }}
            >
              Welcome, {username}!
            </h1>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: "#6366f1" }}
            >
              Student Portal — Academic Year 2025–2026
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              data-ocid="home.search_input"
              placeholder="Search subjects, notifications…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white border-2 border-slate-200 placeholder-slate-400 focus:border-indigo-400 focus:outline-none transition-all"
              style={{ color: "#1e1b4b" }}
            />
          </div>
        </div>

        {/* Search results */}
        {searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl p-4 bg-white shadow-card border border-slate-100"
          >
            {!hasResults && (
              <p className="text-sm text-slate-500">
                No results for "{searchQuery}"
              </p>
            )}
            {searchResults.pages.length > 0 && (
              <div className="mb-3">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#4f46e5" }}
                >
                  Pages
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchResults.pages.map((r) => (
                    <button
                      key={r.page}
                      type="button"
                      onClick={() => {
                        onNavigate(r.page);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-left"
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#1e1b4b" }}
                      >
                        {r.label}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:block">
                        — {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {searchResults.notifs.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#4f46e5" }}
                >
                  Notifications
                </p>
                <div className="space-y-1.5">
                  {searchResults.notifs.map((n) => (
                    <p
                      key={n}
                      className="text-sm px-1"
                      style={{ color: "#374151" }}
                    >
                      {n}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* Section title — My Subjects */}
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              <BookOpen className="h-5 w-5 text-blue-400 flex-shrink-0" />
              My Subjects
            </h2>

            {/* Urgent alerts */}
            <AnimatePresence>
              {urgentAlerts.map((s) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700"
                >
                  <Bell className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm flex-1 font-semibold">
                    ⚠️ <strong>{s.key}</strong> exam coming soon!
                  </span>
                  <button
                    type="button"
                    onClick={() => setDismissedAlerts((p) => [...p, s.key])}
                    className="hover:opacity-60 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Filter + Sort toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                {(["all", "completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    data-ocid="subjects.filter.tab"
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                      filterTab === tab
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  type="button"
                  data-ocid="subjects.sort.button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all shadow-xs"
                >
                  Sort: {sortBy === "name" ? "By Name" : "By Exam Date"}
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden min-w-[150px]"
                    >
                      {(["name", "examDate"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortBy(opt);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors font-medium ${
                            sortBy === opt
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {opt === "name" ? "By Name" : "By Exam Date"}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-xs text-slate-400 hidden sm:block font-medium">
                ← View Details&nbsp;&nbsp;|&nbsp;&nbsp;Mark Complete →
              </span>
            </div>

            {/* Subject cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {subjectsLoading
                ? [1, 2, 3].map((n) => <SkeletonCard key={n} />)
                : filteredSubjects.map((s, i) => {
                    const data = subjectMap.get(s.key);
                    const Icon = s.icon;
                    const isCompleted = completedAssignments.includes(s.key);

                    return (
                      <motion.div
                        key={s.key}
                        data-ocid={`subjects.item.${i + 1}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onTouchStart={(e) => handleTouchStart(s.key, e)}
                        onTouchEnd={(e) => handleTouchEnd(s.key, s.page, e)}
                        className={`relative overflow-hidden rounded-2xl border-2 bg-white ${s.accent} shadow-card hover:shadow-card-hover ${s.glowColor} hover:-translate-y-1 transition-all duration-300 group card-lift`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${s.gradient} pointer-events-none`}
                        />

                        <div className="relative p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${s.dotColor}`}
                                />
                                <h3
                                  className="font-extrabold text-lg leading-tight"
                                  style={{ color: "#1e1b4b" }}
                                >
                                  {s.key}
                                </h3>
                              </div>
                              {data?.teacherName && (
                                <p
                                  className="text-xs truncate mt-0.5 font-medium"
                                  style={{ color: "#6b7280" }}
                                >
                                  {data.teacherName}
                                </p>
                              )}
                            </div>
                            <CountdownBadge examDate={data?.examDate ?? ""} />
                          </div>

                          <div className="space-y-2 mb-4">
                            <p
                              className="text-sm flex items-center gap-1.5"
                              style={{ color: "#6b7280" }}
                            >
                              📅{" "}
                              <span
                                className="font-semibold"
                                style={{ color: "#1e1b4b" }}
                              >
                                Exam: {data?.examDate || "TBA"}
                              </span>
                            </p>
                            {s.hasPractical && (
                              <p
                                className="text-sm flex items-center gap-1.5"
                                style={{ color: "#6b7280" }}
                              >
                                🧪{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: "#1e1b4b" }}
                                >
                                  Practical: {data?.practicalDate || "TBA"}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              data-ocid={`subjects.item.${i + 1}.button`}
                              onClick={() => onNavigate(s.page)}
                              className="h-7 text-xs px-2.5 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-all hover:scale-105 font-semibold"
                              style={{ color: "#4f46e5" }}
                            >
                              View Details{" "}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                            {!isCompleted && (
                              <Button
                                type="button"
                                size="sm"
                                data-ocid={`subjects.item.${i + 1}.secondary_button`}
                                onClick={() => markComplete.mutate(s.key)}
                                disabled={markComplete.isPending}
                                className="h-6 text-xs px-2 bg-transparent hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-400 rounded-lg transition-all hover:scale-105 font-semibold"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Mark
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

              {!subjectsLoading && filteredSubjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  data-ocid="subjects.empty_state"
                  className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs"
                >
                  <p className="text-slate-500 font-medium">
                    No subjects match the current filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterTab("all")}
                    className="mt-2 text-sm hover:underline"
                    style={{ color: "#4f46e5" }}
                  >
                    Show all subjects
                  </button>
                </motion.div>
              )}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <button
                type="button"
                data-ocid="home.teachers.button"
                onClick={() => onNavigate("teachers")}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-card transition-all text-left col-span-2 sm:col-span-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.06))",
                  borderColor: "rgba(79,70,229,0.18)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                >
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#1e1b4b" }}
                  >
                    Teachers
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#9ca3af" }}
                  >
                    34 faculty members
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-indigo-400" />
              </button>
              <button
                type="button"
                data-ocid="home.about.button"
                onClick={() => onNavigate("about")}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-card transition-all text-left"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(79,70,229,0.08)" }}
                >
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#1e1b4b" }}
                  >
                    About College
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#9ca3af" }}
                  >
                    Mission &amp; history
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
              </button>
              <button
                type="button"
                data-ocid="home.contact.button"
                onClick={() => onNavigate("contact")}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-card transition-all text-left"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(79,70,229,0.08)" }}
                >
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#1e1b4b" }}
                  >
                    Contact
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#9ca3af" }}
                  >
                    Get in touch
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
              </button>
              <button
                type="button"
                data-ocid="home.calendar.button"
                onClick={() => onNavigate("calendar")}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-card transition-all text-left"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(79,70,229,0.08)" }}
                >
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#1e1b4b" }}
                  >
                    Calendar
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#9ca3af" }}
                  >
                    Exam schedule
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-slate-300" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            {/* Academic Notifications */}
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              <Bell className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              Academic Notifications
            </h2>
            <div className="space-y-2 mb-6">
              {notifList.map((note, i) => (
                <div
                  key={note}
                  data-ocid={`notifications.item.${i + 1}`}
                  className="p-3 rounded-xl text-sm font-medium border border-slate-100 bg-white shadow-xs"
                  style={{ color: "#374151" }}
                >
                  {note}
                </div>
              ))}
            </div>

            {/* Upcoming Deadlines */}
            <h2 className="text-xl font-extrabold mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
              Upcoming Deadlines
            </h2>
            <div className="rounded-xl border border-slate-100 overflow-hidden bg-white shadow-xs">
              {deadlines.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex items-center gap-3 px-4 py-3.5 border-l-4 ${d.border} ${
                    i !== 0 ? "border-t border-white/10" : ""
                  } hover:bg-slate-50 transition-colors`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${d.color} flex-shrink-0`}
                  />
                  <span
                    className="text-sm font-semibold flex-1 leading-tight"
                    style={{ color: "#1e1b4b" }}
                  >
                    {d.label}
                  </span>
                  <span
                    className="text-sm font-bold whitespace-nowrap"
                    style={{ color: "#4f46e5" }}
                  >
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
