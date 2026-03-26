import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BookOpen,
  Calculator,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  Info,
  Phone,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import { useNotifications, useSubjectData } from "../hooks/useQueries";

type SubjectPage = "physics" | "chemistry" | "math";
type NavigatePage = "home" | SubjectPage | "about" | "contact";

interface HomePageProps {
  username: string;
  onNavigate: (page: NavigatePage) => void;
  onLogout: () => void;
}

const subjectConfig = [
  {
    key: "Physics",
    page: "physics" as SubjectPage,
    icon: BookOpen,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600 bg-blue-100",
    hasPractical: true,
  },
  {
    key: "Chemistry",
    page: "chemistry" as SubjectPage,
    icon: FlaskConical,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600 bg-green-100",
    hasPractical: true,
  },
  {
    key: "Math",
    page: "math" as SubjectPage,
    icon: Calculator,
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600 bg-orange-100",
    hasPractical: false,
  },
];

const defaultNotifications = [
  "\ud83d\udcc5 Physics Exam on 25 March 2026",
  "\ud83d\udcdd Physics Assignment: Complete Chapter 5 numericals before 24 March",
  "\ud83e\uddea Physics Practical on 28 March 2026",
  "\ud83d\udce2 Holiday on 1 April \u2014 no classes",
];

const deadlines = [
  { label: "Physics Exam", date: "25 Mar", color: "bg-blue-500" },
  { label: "Chemistry Exam", date: "27 Mar", color: "bg-green-500" },
  { label: "Physics Practical", date: "28 Mar", color: "bg-blue-400" },
  { label: "Math Exam", date: "29 Mar", color: "bg-orange-500" },
  { label: "Chemistry Practical", date: "30 Mar", color: "bg-green-400" },
];

export default function HomePage({
  username,
  onNavigate,
  onLogout,
}: HomePageProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { data: subjects, isLoading: subjectsLoading } = useSubjectData();
  const { data: notifications } = useNotifications();

  const subjectMap = new Map(subjects ?? []);
  const bannerText =
    notifications?.[0] ??
    "\ud83d\udce2 Exam schedule for March 2026 has been updated. Check your subjects.";
  const notifList =
    notifications && notifications.length > 0
      ? notifications
      : defaultNotifications;

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
          className="bg-primary/90 text-primary-foreground"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
            <Bell className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm flex-1">{bannerText}</p>
            <button
              type="button"
              data-ocid="home.dismiss_banner.button"
              onClick={() => setBannerDismissed(true)}
              className="hover:opacity-70 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome, {username}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Student Portal \u2014 Academic Year 2025\u20132026
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Subjects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {subjectConfig.map((s, i) => {
                const data = subjectMap.get(s.key);
                const Icon = s.icon;
                const practicalDate = data?.practicalDate
                  ? Array.isArray(data.practicalDate)
                    ? (data.practicalDate as unknown as [string] | [])[0]
                    : (data.practicalDate as unknown as string | undefined)
                  : undefined;
                const hasAssignment =
                  data?.assignmentDetails &&
                  data.assignmentDetails.trim().length > 0;
                return (
                  <motion.button
                    type="button"
                    key={s.key}
                    data-ocid={`subjects.item.${i + 1}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => onNavigate(s.page)}
                    className={`text-left p-5 rounded-xl border-2 ${s.color} shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-full`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${s.iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-base text-foreground">
                      {s.key}
                    </h3>
                    {subjectsLoading ? (
                      <div className="space-y-1.5 mt-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          \ud83d\udcc5 Exam: {data?.examDate || "TBA"}
                        </p>
                        {s.hasPractical && (
                          <p className="text-xs text-muted-foreground">
                            \ud83e\uddea Practical: {practicalDate || "TBA"}
                          </p>
                        )}
                        <p className="text-xs flex items-center gap-1">
                          <ClipboardList className="h-3 w-3 text-muted-foreground" />
                          <span
                            className={`font-medium ${hasAssignment ? "text-amber-600" : "text-muted-foreground"}`}
                          >
                            {hasAssignment
                              ? "Assignment pending"
                              : "No assignment"}
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                      View Details <ChevronRight className="h-3 w-3" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                data-ocid="home.about.button"
                onClick={() => onNavigate("about")}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-xs hover:shadow-card transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    About College
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mission, vision &amp; history
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>
              <button
                type="button"
                data-ocid="home.contact.button"
                onClick={() => onNavigate("contact")}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-xs hover:shadow-card transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    Contact
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Get in touch with faculty
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>
            </div>
          </div>

          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Academic Notifications
            </h2>
            <div className="space-y-2 mb-6">
              {notifList.map((note, i) => (
                <div
                  key={note}
                  data-ocid={`notifications.item.${i + 1}`}
                  className="p-3 bg-card border border-border rounded-lg text-sm text-foreground shadow-xs"
                >
                  {note}
                </div>
              ))}
            </div>
            <h2 className="text-base font-bold text-foreground mb-3">
              Upcoming Deadlines
            </h2>
            <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
              {deadlines.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex items-center gap-3 p-3 ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full ${d.color}`} />
                  <span className="text-sm text-foreground flex-1">
                    {d.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
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
