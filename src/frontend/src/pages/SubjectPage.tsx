import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  FlaskConical,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import {
  useCompletedAssignments,
  useMarkAssignmentComplete,
  useSubjectData,
} from "../hooks/useQueries";

type SubjectKey = "Physics" | "Chemistry" | "Math";
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

const SUBJECTS: SubjectKey[] = ["Physics", "Chemistry", "Math"];

const subjectConfig: Record<
  SubjectKey,
  {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    iconBg: string;
    glowHover: string;
    accentText: string;
    hasPractical: boolean;
    mockDeadline: string;
  }
> = {
  Physics: {
    icon: BookOpen,
    gradient: "from-blue-600/35 via-blue-500/15 to-transparent",
    iconBg: "bg-blue-500/20 text-blue-400",
    glowHover:
      "hover:shadow-[0_0_32px_rgba(96,165,250,0.4)] hover:border-blue-400/60",
    accentText: "text-blue-400",
    hasPractical: true,
    mockDeadline: "15 April 2026",
  },
  Chemistry: {
    icon: FlaskConical,
    gradient: "from-emerald-600/35 via-emerald-500/15 to-transparent",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    glowHover:
      "hover:shadow-[0_0_32px_rgba(52,211,153,0.4)] hover:border-emerald-400/60",
    accentText: "text-emerald-400",
    hasPractical: true,
    mockDeadline: "18 April 2026",
  },
  Math: {
    icon: Calculator,
    gradient: "from-orange-600/35 via-orange-500/15 to-transparent",
    iconBg: "bg-orange-500/20 text-orange-400",
    glowHover:
      "hover:shadow-[0_0_32px_rgba(251,146,60,0.4)] hover:border-orange-400/60",
    accentText: "text-orange-400",
    hasPractical: false,
    mockDeadline: "20 April 2026",
  },
};

function ParticleBackground() {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/60 to-purple-950/40" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
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

interface SubjectCardProps {
  subjectKey: SubjectKey;
  index: number;
  isInitiallyExpanded: boolean;
  subjectData:
    | {
        examDate?: string;
        practicalDate?: string;
        assignmentDetails?: string;
        teacherName?: string;
        teacherEmail?: string;
      }
    | undefined;
  isCompleted: boolean;
  onMarkComplete: (subject: SubjectKey) => void;
  isPendingMark: boolean;
}

function SubjectCard({
  subjectKey,
  index,
  isInitiallyExpanded,
  subjectData,
  isCompleted,
  onMarkComplete,
  isPendingMark,
}: SubjectCardProps) {
  const [expanded, setExpanded] = useState(isInitiallyExpanded);
  const [markAnimating, setMarkAnimating] = useState(false);
  const config = subjectConfig[subjectKey];
  const Icon = config.icon;

  const handleMark = () => {
    setMarkAnimating(true);
    onMarkComplete(subjectKey);
    setTimeout(() => setMarkAnimating(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.4 }}
      data-ocid={`subjects.item.${index + 1}`}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 ${config.glowHover}`}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Card header — always visible */}
      <button
        type="button"
        className="relative w-full text-left p-5 flex items-center gap-4"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`subjects.item.${index + 1}.toggle`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{subjectKey}</h2>
          {subjectData?.teacherName && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <User className="h-3 w-3" /> {subjectData.teacherName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-500/30">
              <CheckCircle2 className="h-3 w-3" /> Done
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold border border-yellow-500/30">
              <Clock className="h-3 w-3" /> Pending
            </span>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative px-5 pb-5 space-y-4">
              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl border border-white/10 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    📅 Exam Date
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {subjectData?.examDate || "TBA"}
                  </p>
                </div>
                {config.hasPractical && (
                  <div className="bg-white/5 rounded-xl border border-white/10 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      🧪 Practical Date
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {subjectData?.practicalDate || "TBA"}
                    </p>
                  </div>
                )}
              </div>

              {/* Professor email */}
              {subjectData?.teacherEmail && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{subjectData.teacherEmail}</span>
                </div>
              )}

              {/* Assignment card */}
              <div
                data-ocid={`subjects.item.${index + 1}.assignment.card`}
                className="bg-white/5 rounded-xl border border-white/10 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" /> Assignment
                </p>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm font-medium text-foreground flex-1">
                    {subjectData?.assignmentDetails ||
                      "No assignment currently."}
                  </p>
                  {isCompleted ? (
                    <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </span>
                  ) : (
                    <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold border border-yellow-500/30">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3 w-3" />
                  <span>
                    Deadline:{" "}
                    <span className="text-foreground/80 font-medium">
                      {config.mockDeadline}
                    </span>
                  </span>
                </div>

                {!isCompleted && (
                  <motion.div
                    animate={markAnimating ? { scale: [1, 0.95, 1.05, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Button
                      type="button"
                      size="sm"
                      data-ocid={`subjects.item.${index + 1}.complete_assignment.button`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMark();
                      }}
                      disabled={isPendingMark}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 hover:border-green-400/50 transition-all duration-200 hover:shadow-[0_0_16px_rgba(52,211,153,0.3)] active:scale-95 text-xs h-8"
                    >
                      {isPendingMark ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SubjectPageProps {
  subject: SubjectKey;
  username: string;
  onNavigate: (page: NavigatePage) => void;
  onLogout: () => void;
}

export default function SubjectPage({
  subject,
  username,
  onNavigate,
  onLogout,
}: SubjectPageProps) {
  const { data: subjects, isLoading } = useSubjectData();
  const { data: completedAssignments = [] } = useCompletedAssignments();
  const markComplete = useMarkAssignmentComplete();
  const [filter, setFilter] = useState<Filter>("All");

  const subjectMap = new Map(subjects ?? []);

  const filteredSubjects = SUBJECTS.filter((s) => {
    const completed = completedAssignments.includes(s);
    if (filter === "Completed") return completed;
    if (filter === "Pending") return !completed;
    return true;
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
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex items-center gap-3"
        >
          <Button
            data-ocid="subjects.back_dashboard.button"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200"
            onClick={() => onNavigate("home")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </motion.div>

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
            View details, exam dates, and assignment status for all subjects
          </p>
        </motion.div>

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
                  : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground bg-white/5"
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
              <Skeleton key={n} className="h-24 rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="subjects.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No subjects in this category</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.map((subjectKey, i) => (
              <SubjectCard
                key={subjectKey}
                subjectKey={subjectKey}
                index={i}
                isInitiallyExpanded={subjectKey === subject}
                subjectData={
                  subjectMap.get(subjectKey) as
                    | {
                        examDate?: string;
                        practicalDate?: string;
                        assignmentDetails?: string;
                        teacherName?: string;
                        teacherEmail?: string;
                      }
                    | undefined
                }
                isCompleted={completedAssignments.includes(subjectKey)}
                onMarkComplete={(s) => markComplete.mutate(s)}
                isPendingMark={markComplete.isPending}
              />
            ))}
          </div>
        )}
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
