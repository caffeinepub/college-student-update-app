import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  FlaskConical,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import { useFirebaseSubjects } from "../hooks/useFirebaseSubjects";
import { useCompletedAssignments, useSubjectData } from "../hooks/useQueries";

type NavigatePage =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact"
  | "calendar"
  | "profile"
  | "subjects";

type Filter = "All" | "Pending" | "Completed";

const SUBJECTS = ["Physics", "Chemistry", "Math"] as const;
type SubjectKey = (typeof SUBJECTS)[number];

const subjectConfig: Record<
  SubjectKey,
  {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    iconBg: string;
    glowColor: string;
    borderHover: string;
    navigateTo: NavigatePage;
    hasPractical: boolean;
  }
> = {
  Physics: {
    icon: BookOpen,
    gradient: "from-blue-600/30 via-blue-500/10 to-transparent",
    iconBg: "bg-blue-500/20 text-blue-400",
    glowColor:
      "hover:shadow-[0_0_28px_rgba(96,165,250,0.35)] hover:border-blue-400/50",
    borderHover: "group-hover:border-blue-400/50",
    navigateTo: "physics",
    hasPractical: true,
  },
  Chemistry: {
    icon: FlaskConical,
    gradient: "from-emerald-600/30 via-emerald-500/10 to-transparent",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    glowColor:
      "hover:shadow-[0_0_28px_rgba(52,211,153,0.35)] hover:border-emerald-400/50",
    borderHover: "group-hover:border-emerald-400/50",
    navigateTo: "chemistry",
    hasPractical: true,
  },
  Math: {
    icon: Calculator,
    gradient: "from-orange-600/30 via-orange-500/10 to-transparent",
    iconBg: "bg-orange-500/20 text-orange-400",
    glowColor:
      "hover:shadow-[0_0_28px_rgba(251,146,60,0.35)] hover:border-orange-400/50",
    borderHover: "group-hover:border-orange-400/50",
    navigateTo: "math",
    hasPractical: false,
  },
};

function ParticleBackground() {
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 10,
      opacity: Math.random() * 0.35 + 0.1,
      hue: Math.random() > 0.5 ? "blue" : "purple",
    })),
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/60 to-purple-950/40" />
      {/* Radial glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-10px",
            opacity: p.opacity,
            background:
              p.hue === "blue"
                ? "rgba(96,165,250,0.8)"
                : "rgba(167,139,250,0.8)",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow:
              p.hue === "blue"
                ? "0 0 6px rgba(96,165,250,0.6)"
                : "0 0 6px rgba(167,139,250,0.6)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Firebase Live Subjects Section ───────────────────────────────────────────

function FirebaseSubjectsSection() {
  const { subjects, loading, error } = useFirebaseSubjects();

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.07, duration: 0.35 },
  });

  return (
    <section className="mb-10">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3 mb-5"
      >
        <h2 className="text-xl font-bold text-foreground">📚 Live Subjects</h2>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="firebase.error_state"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm mb-4"
        >
          ⚠️ Firebase connection error — check your config.
          <span className="block text-red-400/70 text-xs mt-0.5">{error}</span>
        </motion.div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-44 rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && subjects.length === 0 && (
        <motion.div
          {...stagger(0)}
          data-ocid="firebase.empty_state"
          className="text-center py-10 text-muted-foreground text-sm border border-dashed border-slate-200 rounded-2xl"
        >
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
          No subjects found in Firebase. Add data to the{" "}
          <code className="text-xs bg-slate-800/60 px-1 py-0.5 rounded">
            subjects
          </code>{" "}
          collection.
        </motion.div>
      )}

      {/* Subject cards */}
      {!loading && subjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              {...stagger(i)}
              data-ocid={`firebase.item.${i + 1}`}
              className="relative overflow-hidden rounded-2xl border border-slate-100 backdrop-blur-md bg-slate-50 p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:border-indigo-400/40"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-indigo-500/8 to-transparent pointer-events-none" />

              {/* Subject name */}
              <div className="relative">
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {subject.subject_name}
                </h3>
              </div>

              {/* Exam date */}
              <div className="relative flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span className="text-muted-foreground">Exam:</span>
                <span className="font-medium text-foreground">
                  {subject.exam_date || "TBA"}
                </span>
              </div>

              {/* PDF button or no-PDF notice */}
              <div className="relative mt-auto">
                {subject.assignment_pdf ? (
                  <Button
                    data-ocid={`firebase.view_pdf.button.${i + 1}`}
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_0_14px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-200 text-xs font-semibold"
                    onClick={() =>
                      window.open(subject.assignment_pdf, "_blank")
                    }
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View PDF
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground/60 text-center py-1">
                    No PDF attached
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface SubjectsListPageProps {
  username: string;
  onNavigate: (page: NavigatePage) => void;
  onLogout: () => void;
}

export default function SubjectsListPage({
  username,
  onNavigate,
  onLogout,
}: SubjectsListPageProps) {
  const { data: subjects, isLoading } = useSubjectData();
  const { data: completedAssignments = [] } = useCompletedAssignments();
  const [filter, setFilter] = useState<Filter>("All");

  const subjectMap = useMemo(() => new Map(subjects ?? []), [subjects]);

  const filteredSubjects = SUBJECTS.filter((s) => {
    const isCompleted = completedAssignments.includes(s);
    if (filter === "Completed") return isCompleted;
    if (filter === "Pending") return !isCompleted;
    return true;
  });

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.4 },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <PageHeader
        username={username}
        currentPage="subjects"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            My{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Subjects
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your academic progress and assignments
          </p>
        </motion.div>

        {/* ── Firebase Live Subjects ── */}
        <FirebaseSubjectsSection />

        {/* Divider */}
        <div className="border-t border-slate-200 mb-8" />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="flex items-center gap-2 mb-8 justify-center"
        >
          {(["All", "Pending", "Completed"] as Filter[]).map((tab) => (
            <button
              type="button"
              key={tab}
              data-ocid={`subjects.${tab.toLowerCase()}.tab`}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                filter === tab
                  ? "bg-gradient-to-r from-blue-500/25 to-purple-500/20 border-blue-400/50 text-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.25)]"
                  : "border-slate-100 text-muted-foreground hover:border-slate-200 hover:text-foreground bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Subjects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-72 rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <motion.div
            {...stagger(0)}
            data-ocid="subjects.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No subjects in this category</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((subjectKey, i) => {
              const config = subjectConfig[subjectKey];
              const data = subjectMap.get(subjectKey);
              const Icon = config.icon;
              const isCompleted = completedAssignments.includes(subjectKey);

              return (
                <motion.div
                  key={subjectKey}
                  {...stagger(i)}
                  data-ocid={`subjects.item.${i + 1}`}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-100 backdrop-blur-md bg-slate-50 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${config.glowColor}`}
                  onClick={() => onNavigate(config.navigateTo)}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100`}
                  />

                  {/* Header */}
                  <div className="relative flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {subjectKey}
                      </h2>
                      {data?.teacherName && (
                        <p className="text-xs text-muted-foreground">
                          {data.teacherName}
                        </p>
                      )}
                    </div>
                    <div className="ml-auto">
                      {isCompleted ? (
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs">
                          <Clock className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">📅 Exam</span>
                      <span className="font-medium text-foreground text-xs">
                        {data?.examDate || "TBA"}
                      </span>
                    </div>
                    {config.hasPractical && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          🧪 Practical
                        </span>
                        <span className="font-medium text-foreground text-xs">
                          {data?.practicalDate || "TBA"}
                        </span>
                      </div>
                    )}
                    {data?.assignmentDetails && (
                      <div className="flex items-start justify-between text-sm gap-2">
                        <span className="text-muted-foreground flex-shrink-0">
                          📝 Assignment
                        </span>
                        <span className="text-foreground/70 text-xs text-right line-clamp-1">
                          {data.assignmentDetails}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View details button */}
                  <div className="relative mt-auto pt-2">
                    <Button
                      data-ocid={`subjects.view_details.button.${i + 1}`}
                      size="sm"
                      className="w-full bg-slate-100 hover:bg-slate-100 border border-slate-100 text-foreground text-xs font-semibold transition-all duration-200 group-hover:border-slate-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(config.navigateTo);
                      }}
                    >
                      View Details →
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
