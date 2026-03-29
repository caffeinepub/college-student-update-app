import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  BookOpen,
  Calculator,
  Camera,
  Check,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  FlaskConical,
  GraduationCap,
  Hash,
  Home,
  Image,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  Save,
  School,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  scholarNumber: string;
  courseYear: string;
  collegeName: string;
}

const STORAGE_KEY = "academia_profile";

function loadProfile(username: string): ProfileData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ProfileData;
  } catch {}
  return {
    name: username,
    email: `${username.toLowerCase()}@academia.edu`,
    phone: "+91 98765 43210",
    address: "Gangapur City, Rajasthan, India",
    scholarNumber: `GCG-${username.toUpperCase().slice(0, 4)}-617`,
    courseYear: "B.Sc. PCM — 2nd Year",
    collegeName: "Government College Gangapur City",
  };
}

export default function ProfilePage({
  username,
  onNavigate,
  onLogout,
}: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData>(() =>
    loadProfile(username),
  );
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(profile);
  const [saving, setSaving] = useState(false);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwSaving, setPwSaving] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-photo-menu]")) setShowPhotoMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePhotoFile(file: File | null | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setShowPhotoMenu(false);
    toast.success("Profile photo updated!");
  }

  async function handleSaveProfile() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setProfile(editData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editData));
    } catch {}
    setSaving(false);
    setEditMode(false);
    toast.success("Profile updated successfully!");
  }

  async function handleChangePassword() {
    if (!passwordData.current) {
      toast.error("Enter your current password.");
      return;
    }
    if (passwordData.next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.next !== passwordData.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setPwSaving(false);
    setPasswordData({ current: "", next: "", confirm: "" });
    setShowPasswordForm(false);
    toast.success("Password changed successfully!");
  }

  const initials =
    profile.name
      .split(/[\s_-]/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || profile.name.slice(0, 2).toUpperCase();

  const infoFields: {
    icon: React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    label: string;
    key: keyof ProfileData;
  }[] = [
    { icon: User, label: "Full Name", key: "name" },
    { icon: Mail, label: "Email", key: "email" },
    { icon: Phone, label: "Phone Number", key: "phone" },
    { icon: MapPin, label: "Address", key: "address" },
    { icon: Hash, label: "Scholar Number", key: "scholarNumber" },
    { icon: GraduationCap, label: "Course / Year", key: "courseYear" },
    { icon: School, label: "College Name", key: "collegeName" },
  ];

  const subjects = [
    {
      name: "Physics",
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      exam: "25 Mar 2026",
      page: "physics" as Page,
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      exam: "27 Mar 2026",
      page: "chemistry" as Page,
    },
    {
      name: "Mathematics",
      icon: Calculator,
      color: "text-orange-600",
      bg: "bg-orange-50",
      exam: "29 Mar 2026",
      page: "math" as Page,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      {/* Float keyframe injected via style tag */}
      <style>{`
        @keyframes avatar-float {
          0%, 100% { transform: translateY(0px); filter: drop-shadow(0 8px 24px rgba(79,70,229,0.3)); }
          50% { transform: translateY(-10px); filter: drop-shadow(0 20px 40px rgba(79,70,229,0.5)); }
        }
        .avatar-float { animation: avatar-float 3s ease-in-out infinite; }
        @keyframes ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(79,70,229,0); }
        }
        .ring-pulse { animation: ring-pulse 3s ease-in-out infinite; }
      `}</style>

      <PageHeader
        username={username}
        currentPage="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow:
              "0 8px 40px rgba(79,70,229,0.12), 0 2px 8px rgba(79,70,229,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(79,70,229,0.10) 0%, transparent 65%)",
            }}
          />

          {/* Avatar */}
          <div className="relative inline-block mb-6" data-photo-menu>
            <button
              type="button"
              className="avatar-float relative w-28 h-28 rounded-full mx-auto cursor-pointer ring-pulse"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              }}
              onClick={() => setShowPhotoMenu((p) => !p)}
              aria-label="Edit profile photo"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-3xl font-bold text-white rounded-full select-none">
                  {initials}
                </span>
              )}
              {/* Edit overlay */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.38)" }}
              >
                <Camera className="h-7 w-7 text-white" />
              </div>
            </button>

            {/* Active dot */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />

            {/* Photo menu */}
            <AnimatePresence>
              {showPhotoMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(79,70,229,0.15)",
                    boxShadow: "0 8px 32px rgba(79,70,229,0.18)",
                    minWidth: 180,
                  }}
                >
                  <button
                    type="button"
                    data-ocid="profile.camera.button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-indigo-50 transition-colors"
                    style={{ color: "#4f46e5" }}
                    onClick={() => {
                      cameraInputRef.current?.click();
                      setShowPhotoMenu(false);
                    }}
                  >
                    <Camera className="h-4 w-4" /> Camera
                  </button>
                  <div
                    style={{ height: 1, background: "rgba(79,70,229,0.08)" }}
                  />
                  <button
                    type="button"
                    data-ocid="profile.upload_button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-indigo-50 transition-colors"
                    style={{ color: "#7c3aed" }}
                    onClick={() => {
                      galleryInputRef.current?.click();
                      setShowPhotoMenu(false);
                    }}
                  >
                    <Image className="h-4 w-4" /> Gallery
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold"
            style={{ color: "#1e1b4b" }}
          >
            {profile.name}
          </motion.h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {profile.courseYear}
          </p>
          <p
            className="text-xs mt-0.5 font-medium"
            style={{ color: "#7c3aed" }}
          >
            {profile.collegeName}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge
              style={{
                background: "rgba(79,70,229,0.1)",
                color: "#4f46e5",
                border: "1px solid rgba(79,70,229,0.2)",
              }}
            >
              Student
            </Badge>
            <Badge
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#059669",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              Active
            </Badge>
            <Badge
              style={{
                background: "rgba(124,58,237,0.1)",
                color: "#7c3aed",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              {profile.scholarNumber}
            </Badge>
          </div>

          <button
            type="button"
            data-ocid="profile.edit_button"
            onClick={() => {
              setEditData(profile);
              setEditMode(true);
            }}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
            }}
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
        </motion.div>

        {/* ── STUDENT INFO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 24px rgba(79,70,229,0.09)",
          }}
        >
          <h3
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: "#1e1b4b" }}
          >
            <User className="h-4 w-4 text-indigo-500" />
            Student Information
          </h3>
          <div className="space-y-3">
            {infoFields.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: "rgba(79,70,229,0.04)" }}
              >
                <f.icon
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#4f46e5" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5" style={{ color: "#9ca3af" }}>
                    {f.label}
                  </p>
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "#1e1b4b" }}
                  >
                    {profile[f.key]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── EDIT PROFILE PANEL ── */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              data-ocid="profile.modal"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(79,70,229,0.15)",
                boxShadow: "0 8px 40px rgba(79,70,229,0.14)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-base font-bold flex items-center gap-2"
                  style={{ color: "#1e1b4b" }}
                >
                  <Edit3 className="h-4 w-4 text-indigo-500" />
                  Edit Profile
                </h3>
                <button
                  type="button"
                  data-ocid="profile.close_button"
                  onClick={() => setEditMode(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" style={{ color: "#6b7280" }} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    {
                      key: "name",
                      label: "Full Name",
                      placeholder: "Your full name",
                      icon: User,
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      placeholder: "+91 XXXXX XXXXX",
                      icon: Phone,
                    },
                    {
                      key: "courseYear",
                      label: "Course / Year",
                      placeholder: "B.Sc. PCM — 2nd Year",
                      icon: GraduationCap,
                    },
                    {
                      key: "collegeName",
                      label: "College Name",
                      placeholder: "College name",
                      icon: School,
                    },
                    {
                      key: "scholarNumber",
                      label: "Scholar Number",
                      placeholder: "GCG-XXXX-000",
                      icon: Hash,
                    },
                    {
                      key: "address",
                      label: "Address",
                      placeholder: "City, State",
                      icon: MapPin,
                    },
                  ] as {
                    key: keyof ProfileData;
                    label: string;
                    placeholder: string;
                    icon: React.ComponentType<{
                      className?: string;
                      style?: React.CSSProperties;
                    }>;
                  }[]
                ).map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <Label
                      htmlFor={`edit-${f.key}`}
                      className="text-xs font-semibold"
                      style={{ color: "#6b7280" }}
                    >
                      {f.label}
                    </Label>
                    <div className="relative">
                      <f.icon
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                        style={{ color: "#a5b4fc" }}
                      />
                      <Input
                        id={`edit-${f.key}`}
                        data-ocid={`profile.${f.key}.input`}
                        value={editData[f.key]}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            [f.key]: e.target.value,
                          }))
                        }
                        placeholder={f.placeholder}
                        className="pl-9 text-sm rounded-xl"
                        style={{
                          color: "#1e1b4b",
                          background: "white",
                          border: "1.5px solid rgba(79,70,229,0.18)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <Button
                  type="button"
                  data-ocid="profile.save_button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 rounded-xl font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                  }}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save Changes
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  data-ocid="profile.cancel_button"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="rounded-xl font-semibold"
                  style={{
                    borderColor: "rgba(79,70,229,0.2)",
                    color: "#4f46e5",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ACCOUNT OPTIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 24px rgba(79,70,229,0.09)",
          }}
        >
          <div className="p-5 pb-3">
            <h3
              className="text-base font-bold flex items-center gap-2"
              style={{ color: "#1e1b4b" }}
            >
              <Home className="h-4 w-4 text-indigo-500" />
              Account Options
            </h3>
          </div>

          {/* Change Password */}
          <div>
            <button
              type="button"
              data-ocid="profile.change_password.button"
              onClick={() => setShowPasswordForm((p) => !p)}
              className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50/60 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,70,229,0.1)" }}
              >
                <Lock className="h-4 w-4" style={{ color: "#4f46e5" }} />
              </div>
              <div className="flex-1 text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1e1b4b" }}
                >
                  Change Password
                </p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  Update your login password
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4"
                style={{
                  color: "#d1d5db",
                  transform: showPasswordForm ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            <AnimatePresence>
              {showPasswordForm && (
                <motion.div
                  data-ocid="profile.password.panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-5 pb-5 space-y-3"
                    style={{ background: "rgba(79,70,229,0.03)" }}
                  >
                    {(
                      [
                        {
                          key: "current",
                          label: "Current Password",
                          show: showPw.current,
                          toggle: () =>
                            setShowPw((p) => ({ ...p, current: !p.current })),
                        },
                        {
                          key: "next",
                          label: "New Password",
                          show: showPw.next,
                          toggle: () =>
                            setShowPw((p) => ({ ...p, next: !p.next })),
                        },
                        {
                          key: "confirm",
                          label: "Confirm New Password",
                          show: showPw.confirm,
                          toggle: () =>
                            setShowPw((p) => ({ ...p, confirm: !p.confirm })),
                        },
                      ] as {
                        key: keyof typeof passwordData;
                        label: string;
                        show: boolean;
                        toggle: () => void;
                      }[]
                    ).map((f) => (
                      <div key={f.key} className="space-y-1">
                        <Label
                          className="text-xs font-semibold"
                          style={{ color: "#6b7280" }}
                        >
                          {f.label}
                        </Label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                            style={{ color: "#a5b4fc" }}
                          />
                          <Input
                            data-ocid={`profile.${f.key}_password.input`}
                            type={f.show ? "text" : "password"}
                            value={passwordData[f.key]}
                            onChange={(e) =>
                              setPasswordData((p) => ({
                                ...p,
                                [f.key]: e.target.value,
                              }))
                            }
                            placeholder="••••••••"
                            className="pl-9 pr-10 text-sm rounded-xl"
                            style={{
                              color: "#1e1b4b",
                              background: "white",
                              border: "1.5px solid rgba(79,70,229,0.18)",
                            }}
                          />
                          <button
                            type="button"
                            onClick={f.toggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {f.show ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        data-ocid="profile.update_password.button"
                        onClick={handleChangePassword}
                        disabled={pwSaving}
                        size="sm"
                        className="rounded-xl font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        }}
                      >
                        {pwSaving ? (
                          <span className="flex items-center gap-2">
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5" />
                            Update Password
                          </span>
                        )}
                      </Button>
                      <Button
                        type="button"
                        data-ocid="profile.cancel_password.button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasswordForm(false)}
                        className="rounded-xl font-semibold"
                        style={{ color: "#6b7280" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ height: 1, background: "rgba(79,70,229,0.06)" }} />

          {/* Dark Mode */}
          <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50/60 transition-colors">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(124,58,237,0.1)" }}
            >
              <Moon className="h-4 w-4" style={{ color: "#7c3aed" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>
                Dark Mode
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                Switch to dark theme
              </p>
            </div>
            <Switch
              data-ocid="profile.dark_mode.switch"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div style={{ height: 1, background: "rgba(79,70,229,0.06)" }} />

          {/* Notifications */}
          <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50/60 transition-colors">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <Bell className="h-4 w-4" style={{ color: "#059669" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#1e1b4b" }}>
                Notifications
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                Exam and assignment alerts
              </p>
            </div>
            <Switch
              data-ocid="profile.notifications.switch"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div style={{ height: 1, background: "rgba(79,70,229,0.06)" }} />

          {/* Logout */}
          <button
            type="button"
            data-ocid="profile.logout.button"
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-red-50 transition-colors"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.1)" }}
            >
              <LogOut className="h-4 w-4" style={{ color: "#dc2626" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>
                Log Out
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                Sign out of your account
              </p>
            </div>
            <ChevronRight className="h-4 w-4" style={{ color: "#fca5a5" }} />
          </button>
        </motion.div>

        {/* ── ENROLLED SUBJECTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 24px rgba(79,70,229,0.09)",
          }}
        >
          <h3
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: "#1e1b4b" }}
          >
            <BookOpen className="h-4 w-4 text-indigo-500" />
            Enrolled Subjects
          </h3>
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <motion.button
                type="button"
                key={s.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.07 }}
                data-ocid={`profile.item.${i + 1}`}
                onClick={() => onNavigate(s.page)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50 transition-all text-left group"
                style={{ background: "rgba(79,70,229,0.03)" }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}
                >
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e1b4b" }}
                  >
                    {s.name}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    Exam: {s.exam}
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#4f46e5" }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
