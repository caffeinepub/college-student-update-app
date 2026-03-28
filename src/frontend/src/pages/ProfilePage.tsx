import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calculator,
  CalendarDays,
  Edit3,
  FlaskConical,
  GraduationCap,
  IdCard,
  Mail,
  Shield,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
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

interface ProfilePageProps {
  username: string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-3 bg-white border border-slate-100 shadow-xs">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs" style={{ color: "#6b7280" }}>
          {label}
        </p>
        <p className="text-sm font-bold" style={{ color: "#1e1b4b" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage({
  username,
  onNavigate,
  onLogout,
}: ProfilePageProps) {
  const initials =
    username
      .split(/[\s_-]/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || username.slice(0, 2).toUpperCase();

  const profileDetails = [
    { icon: User, label: "Username", value: username },
    { icon: GraduationCap, label: "Course", value: "B.Sc. PCM" },
    {
      icon: CalendarDays,
      label: "Academic Year",
      value: "2nd Year (2025–2026)",
    },
    {
      icon: IdCard,
      label: "College ID",
      value: `ACA-${username.toUpperCase().slice(0, 4)}-2024`,
    },
    {
      icon: Mail,
      label: "Institute Email",
      value: `${username.toLowerCase()}@academia.edu`,
    },
    { icon: Shield, label: "Account Status", value: "Active" },
  ];

  const subjects = [
    {
      name: "Physics",
      icon: BookOpen,
      color: "text-indigo-600",
      exam: "25 Mar 2026",
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      color: "text-emerald-600",
      exam: "27 Mar 2026",
    },
    {
      name: "Mathematics",
      icon: Calculator,
      color: "text-orange-600",
      exam: "29 Mar 2026",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <PageHeader
        username={username}
        currentPage="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Hero profile card */}
          <div className="glass-card-strong rounded-3xl shadow-glass p-8 text-center relative overflow-hidden">
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 50% -20%, rgba(79,70,229,0.12) 0%, transparent 60%)",
              }}
            />

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative inline-block mb-5"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white animate-pulse-glow"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                }}
              >
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground font-display">
              {username}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              B.Sc. PCM · 2nd Year
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge
                className="text-xs font-semibold"
                style={{
                  background: "rgba(79,70,229,0.1)",
                  color: "#4f46e5",
                  border: "1px solid rgba(79,70,229,0.2)",
                }}
              >
                Student
              </Badge>
              <Badge
                className="text-xs font-semibold"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#059669",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                Active
              </Badge>
            </div>

            <button
              type="button"
              data-ocid="profile.edit_button"
              onClick={() => toast.info("Profile editing coming soon!")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary-glow"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>

          {/* Details grid */}
          <div className="glass-card rounded-2xl shadow-glass p-6">
            <h3 className="text-base font-bold text-foreground mb-4">
              Student Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profileDetails.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(79,70,229,0.04)" }}
                >
                  <detail.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      {detail.label}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        detail.label === "Account Status"
                          ? "text-emerald-600"
                          : "text-foreground"
                      }`}
                    >
                      {detail.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Academic stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={BookOpen}
              label="Subjects"
              value="3 Active"
              color="bg-indigo-50 text-indigo-600"
            />
            <StatCard
              icon={CalendarDays}
              label="Next Exam"
              value="25 Mar"
              color="bg-orange-50 text-orange-600"
            />
            <StatCard
              icon={Star}
              label="Status"
              value="On Track"
              color="bg-emerald-50 text-emerald-600"
            />
          </div>

          {/* Enrolled subjects */}
          <div className="glass-card rounded-2xl shadow-glass p-6">
            <h3 className="text-base font-bold text-foreground mb-4">
              Enrolled Subjects
            </h3>
            <div className="space-y-3">
              {subjects.map((s, i) => (
                <motion.button
                  type="button"
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  data-ocid={`profile.item.${i + 1}`}
                  onClick={() => onNavigate(s.name.toLowerCase() as Page)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50 transition-all text-left group"
                  style={{ background: "rgba(79,70,229,0.03)" }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 ${s.color}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#1e1b4b" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      Exam: {s.exam}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
