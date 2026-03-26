import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Calendar,
  ClipboardList,
  Clock,
  FlaskConical,
} from "lucide-react";
import { motion } from "motion/react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import { useSubjectData } from "../hooks/useQueries";

type SubjectKey = "Physics" | "Chemistry" | "Math";
type NavigatePage =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact";

const subjectConfig: Record<
  SubjectKey,
  {
    icon: React.ElementType;
    color: string;
    iconBg: string;
    hasPractical: boolean;
  }
> = {
  Physics: {
    icon: BookOpen,
    color: "border-blue-200 bg-blue-50",
    iconBg: "bg-blue-100 text-blue-600",
    hasPractical: true,
  },
  Chemistry: {
    icon: FlaskConical,
    color: "border-green-200 bg-green-50",
    iconBg: "bg-green-100 text-green-600",
    hasPractical: true,
  },
  Math: {
    icon: Calculator,
    color: "border-orange-200 bg-orange-50",
    iconBg: "bg-orange-100 text-orange-600",
    hasPractical: false,
  },
};

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
  const subjectMap = new Map(subjects ?? []);
  const data = subjectMap.get(subject);
  const config = subjectConfig[subject];
  const Icon = config.icon;

  const infoCards = [
    {
      icon: Calendar,
      label: "Exam Date",
      value: data?.examDate ?? "TBA",
      show: true,
    },
    {
      icon: Clock,
      label: "Practical Date",
      value: data?.practicalDate ?? "TBA",
      show: config.hasPractical,
    },
    {
      icon: ClipboardList,
      label: "Assignment Details",
      value: data?.assignmentDetails ?? "No assignment currently",
      show: true,
      wide: true,
    },
  ];

  const pageKey = subject.toLowerCase() as NavigatePage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageHeader
        username={username}
        currentPage={pageKey}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <Button
          data-ocid={`${pageKey}.back.button`}
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate("home")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subject header card */}
          <div className={`rounded-xl border-2 p-6 mb-6 ${config.color}`}>
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.iconBg}`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Subject
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {subject}
                </h1>
              </div>
            </div>
          </div>

          {/* Info cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoCards
                .filter((c) => c.show)
                .map((card, i) => {
                  const CardIcon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      data-ocid={`${pageKey}.${card.label.toLowerCase().replace(/ /g, "_")}.card`}
                      className={`bg-card border border-border rounded-xl p-5 shadow-xs ${
                        card.wide ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CardIcon className="h-4 w-4 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {card.label}
                        </h3>
                      </div>
                      <p className="text-foreground font-semibold text-base">
                        {card.value}
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
