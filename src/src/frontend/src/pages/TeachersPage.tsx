import { Search, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import {
  ALL_SUBJECTS,
  SUBJECT_BADGE_COLORS,
  SUBJECT_GRADIENTS,
  getInitialsForTeacher,
  teachers,
} from "../data/teacherData";

interface TeachersPageProps {
  username: string;
  onNavigate: (page: string) => void;
  onSelectTeacher: (id: number) => void;
  onLogout: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => i).map((i) => (
        <span
          key={`star-${i}`}
          className={`text-sm ${
            i < full
              ? "text-yellow-400"
              : i === full && half
                ? "text-yellow-300"
                : "text-slate-200 dark:text-slate-600"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function TeacherAvatar({
  name,
  subject,
  size = "md",
}: {
  name: string;
  subject: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = getInitialsForTeacher(name);
  const gradient =
    SUBJECT_GRADIENTS[subject] ?? "from-indigo-400 to-purple-500";
  const sizeClass = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  }[size];
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export { TeacherAvatar };

export default function TeachersPage({
  username,
  onNavigate,
  onSelectTeacher,
  onLogout,
}: TeachersPageProps) {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter((t) => {
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);
      const matchSubject =
        activeSubject === "All" || t.subject === activeSubject;
      return matchSearch && matchSubject;
    });
  }, [search, activeSubject]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PageHeader
        username={username}
        currentPage="teachers"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-purple-300/10 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-white/70 text-sm font-medium tracking-wide uppercase">
                Government College Gangapur City
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our Faculty
            </h1>
            <p className="mt-1 text-white/70 text-sm">
              {teachers.length} dedicated educators shaping futures
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-6 relative max-w-md"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              data-ocid="teachers.search_input"
              placeholder="Search teachers by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm font-medium text-white placeholder-white/50 bg-white/15 border border-white/20 backdrop-blur-sm focus:outline-none focus:bg-white/25 focus:border-white/40 transition-all"
            />
            {search && (
              <button
                type="button"
                data-ocid="teachers.search_clear.button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="sticky top-[57px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
            {ALL_SUBJECTS.map((subj) => (
              <button
                key={subj}
                type="button"
                data-ocid="teachers.filter.tab"
                onClick={() => setActiveSubject(subj)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeSubject === subj
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Count */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
          Showing {filtered.length} of {teachers.length} teachers
          {activeSubject !== "All" && ` in ${activeSubject}`}
        </p>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="teachers.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                No teachers found
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Try a different search term or filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveSubject("All");
                }}
                className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.map((teacher, i) => (
                <motion.div
                  key={teacher.id}
                  data-ocid={`teachers.item.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-md shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer group"
                  onClick={() => onSelectTeacher(teacher.id)}
                >
                  {/* Card top accent bar */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${SUBJECT_GRADIENTS[teacher.subject] ?? "from-indigo-400 to-purple-500"}`}
                  />

                  <div className="p-4 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="mt-2 mb-3">
                      <TeacherAvatar
                        name={teacher.name}
                        subject={teacher.subject}
                        size="md"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight mb-1 line-clamp-2">
                      {teacher.name}
                    </h3>

                    {/* Subject badge */}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                        SUBJECT_BADGE_COLORS[teacher.subject] ??
                        "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {teacher.subject}
                    </span>

                    {/* Rating */}
                    <StarRating rating={teacher.rating} />

                    {/* View Profile button */}
                    <button
                      type="button"
                      data-ocid={`teachers.item.${i + 1}.button`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTeacher(teacher.id);
                      }}
                      className="mt-3 w-full py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <PageFooter
        onNavigate={onNavigate as (page: "about" | "contact") => void}
      />
    </div>
  );
}
