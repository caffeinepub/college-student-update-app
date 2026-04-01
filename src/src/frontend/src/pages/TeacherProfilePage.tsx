import {
  ArrowLeft,
  Award,
  Bell,
  BookOpen,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import {
  SUBJECT_BADGE_COLORS,
  SUBJECT_GRADIENTS,
  getInitialsForTeacher,
  teachers,
} from "../data/teacherData";
import { TeacherAvatar } from "./TeachersPage";

interface TeacherProfilePageProps {
  teacherId: number;
  onBack: () => void;
}

const notifications = [
  {
    icon: "📝",
    type: "Assignment",
    title: "New Assignment Posted",
    desc: (subject: string) =>
      `New assignment posted in ${subject}. Check your portal for details.`,
    time: "2 hours ago",
    color: "border-l-blue-400 bg-blue-50/60 dark:bg-blue-900/20",
  },
  {
    icon: "⚠️",
    type: "Exam Alert",
    title: "Upcoming Exam Alert",
    desc: (subject: string) =>
      `${subject} exam scheduled for 15 May 2026. Start preparing now!`,
    time: "1 day ago",
    color: "border-l-amber-400 bg-amber-50/60 dark:bg-amber-900/20",
  },
  {
    icon: "📢",
    type: "Announcement",
    title: "College Holiday Announcement",
    desc: (_subject: string) =>
      "College holiday declared on 1 April 2026. No classes will be held.",
    time: "3 days ago",
    color: "border-l-purple-400 bg-purple-50/60 dark:bg-purple-900/20",
  },
];

export default function TeacherProfilePage({
  teacherId,
  onBack,
}: TeacherProfilePageProps) {
  const teacher = teachers.find((t) => t.id === teacherId);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-500">Teacher not found.</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 text-indigo-600 font-semibold hover:underline"
          >
            ← Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  const gradient =
    SUBJECT_GRADIENTS[teacher.subject] ?? "from-indigo-400 to-purple-500";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Gradient header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)",
          borderRadius: "0 0 2rem 2rem",
        }}
      >
        {/* Decorative */}
        <div className="absolute -top-10 right-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-4 left-0 w-64 h-32 rounded-full bg-purple-300/10 blur-2xl" />

        {/* Back button */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-5">
          <button
            type="button"
            data-ocid="teacher_profile.back.button"
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Faculty
          </button>
        </div>

        {/* Avatar + name section */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pb-10 pt-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mb-4"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/25 to-white/5 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full">
                <TeacherAvatar
                  name={teacher.name}
                  subject={teacher.subject}
                  size="lg"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {teacher.name}
            </h1>
            <p className="mt-1 text-white/70 text-sm">{teacher.subject}</p>
            <span className="inline-block mt-3 px-4 py-1 rounded-full text-xs font-bold text-white bg-white/15 border border-white/25 backdrop-blur-sm">
              {teacher.role}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Info cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Phone */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Phone
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug break-all">
              {teacher.phone}
            </p>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center">
              <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Email
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug break-all">
              {teacher.email}
            </p>
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center">
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Experience
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {teacher.experience} Years
            </p>
          </div>

          {/* Rating */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rating
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {teacher.rating.toFixed(1)} / 5.0
            </p>
          </div>
        </motion.div>

        {/* Subject */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Subject / Department
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  SUBJECT_BADGE_COLORS[teacher.subject] ??
                  "bg-indigo-100 text-indigo-800"
                }`}
              >
                {teacher.subject}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {teacher.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm shadow-slate-100 dark:shadow-slate-900 border border-slate-100 dark:border-slate-700"
        >
          <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-2 tracking-wide uppercase">
            About
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {teacher.bio}
          </p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
              Notifications
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.type}
                data-ocid={`teacher_profile.notifications.item.${i + 1}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className={`rounded-2xl border-l-4 p-4 ${notif.color} dark:border-opacity-80`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5">
                    {notif.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {notif.title}
                      </p>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.desc(teacher.subject)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  );
}
