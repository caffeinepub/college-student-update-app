import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  Calculator,
  CheckCircle,
  FlaskConical,
  Loader2,
  LogOut,
  Plus,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ShieldLogo from "../components/ShieldLogo";
import {
  useNotifications,
  useSubjectData,
  useUpdateChemistry,
  useUpdateMath,
  useUpdateNotifications,
  useUpdatePhysics,
} from "../hooks/useQueries";

interface AdminPanelProps {
  username: string;
  onLogout: () => void;
}

function SubjectForm({
  subjectName,
  icon: Icon,
  examDate: initExam,
  practicalDate: initPractical,
  assignmentDetails: initAssignment,
  teacherName: initTeacherName,
  teacherEmail: initTeacherEmail,
  progress: initProgress,
  attendancePresent: initAttendancePresent,
  attendanceTotal: initAttendanceTotal,
  marks: initMarks,
  hasPractical,
  onSave,
  isSaving,
}: {
  subjectName: string;
  icon: React.ComponentType<{ className?: string }>;
  examDate: string;
  practicalDate?: string;
  assignmentDetails: string;
  teacherName: string;
  teacherEmail: string;
  progress: number;
  attendancePresent: number;
  attendanceTotal: number;
  marks: string;
  hasPractical: boolean;
  onSave: (
    examDate: string,
    practicalDate: string,
    assignmentDetails: string,
    teacherName: string,
    teacherEmail: string,
    progress: bigint,
    attendancePresent: bigint,
    attendanceTotal: bigint,
    marks: string,
  ) => void;
  isSaving: boolean;
}) {
  const [examDate, setExamDate] = useState(initExam);
  const [practicalDate, setPracticalDate] = useState(initPractical ?? "");
  const [assignmentDetails, setAssignmentDetails] = useState(initAssignment);
  const [teacherName, setTeacherName] = useState(initTeacherName);
  const [teacherEmail, setTeacherEmail] = useState(initTeacherEmail);
  const [progress, setProgress] = useState(String(initProgress));
  const [attendancePresent, setAttendancePresent] = useState(
    String(initAttendancePresent),
  );
  const [attendanceTotal, setAttendanceTotal] = useState(
    String(initAttendanceTotal),
  );
  const [marks, setMarks] = useState(initMarks);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave(
      examDate,
      practicalDate,
      assignmentDetails,
      teacherName,
      teacherEmail,
      BigInt(Number(progress) || 0),
      BigInt(Number(attendancePresent) || 0),
      BigInt(Number(attendanceTotal) || 0),
      marks,
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sn = subjectName.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-bold text-foreground">{subjectName}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Exam Date
          </Label>
          <Input
            data-ocid={`admin.${sn}.exam_date.input`}
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            placeholder="e.g. 25 March 2026"
          />
        </div>
        {hasPractical && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Practical Date
            </Label>
            <Input
              data-ocid={`admin.${sn}.practical_date.input`}
              value={practicalDate}
              onChange={(e) => setPracticalDate(e.target.value)}
              placeholder="e.g. 28 March 2026"
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Assignment Details
        </Label>
        <Textarea
          data-ocid={`admin.${sn}.assignment.textarea`}
          value={assignmentDetails}
          onChange={(e) => setAssignmentDetails(e.target.value)}
          placeholder="Describe the assignment details..."
          rows={3}
        />
      </div>

      {/* Teacher Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Teacher Name
          </Label>
          <Input
            data-ocid={`admin.${sn}.teacher_name.input`}
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="e.g. Dr. Sharma"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Teacher Email
          </Label>
          <Input
            data-ocid={`admin.${sn}.teacher_email.input`}
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            placeholder="teacher@college.edu"
          />
        </div>
      </div>

      {/* Academic data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Progress (0-100)
          </Label>
          <Input
            data-ocid={`admin.${sn}.progress.input`}
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="75"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attendance Present
          </Label>
          <Input
            data-ocid={`admin.${sn}.attendance_present.input`}
            type="number"
            min="0"
            value={attendancePresent}
            onChange={(e) => setAttendancePresent(e.target.value)}
            placeholder="30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attendance Total
          </Label>
          <Input
            data-ocid={`admin.${sn}.attendance_total.input`}
            type="number"
            min="0"
            value={attendanceTotal}
            onChange={(e) => setAttendanceTotal(e.target.value)}
            placeholder="40"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Marks
          </Label>
          <Input
            data-ocid={`admin.${sn}.marks.input`}
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="78/100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          data-ocid={`admin.${sn}.save_button`}
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
        {saved && (
          <span
            data-ocid={`admin.${sn}.success_state`}
            className="flex items-center gap-1 text-sm text-green-400"
          >
            <CheckCircle className="h-4 w-4" /> Saved!
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminPanel({ username, onLogout }: AdminPanelProps) {
  const { data: subjects } = useSubjectData();
  const { data: notifications } = useNotifications();
  const updatePhysics = useUpdatePhysics();
  const updateChemistry = useUpdateChemistry();
  const updateMath = useUpdateMath();
  const updateNotifications = useUpdateNotifications();

  const subjectMap = new Map(subjects ?? []);
  const physics = subjectMap.get("Physics") ?? {
    examDate: "",
    practicalDate: "",
    assignmentDetails: "",
    teacherName: "",
    teacherEmail: "",
    progress: BigInt(0),
    attendancePresent: BigInt(0),
    attendanceTotal: BigInt(0),
    marks: "",
  };
  const chemistry = subjectMap.get("Chemistry") ?? {
    examDate: "",
    practicalDate: "",
    assignmentDetails: "",
    teacherName: "",
    teacherEmail: "",
    progress: BigInt(0),
    attendancePresent: BigInt(0),
    attendanceTotal: BigInt(0),
    marks: "",
  };
  const math = subjectMap.get("Math") ?? {
    examDate: "",
    assignmentDetails: "",
    teacherName: "",
    teacherEmail: "",
    progress: BigInt(0),
    attendancePresent: BigInt(0),
    attendanceTotal: BigInt(0),
    marks: "",
  };

  const [notifList, setNotifList] = useState<{ id: number; text: string }[]>(
    () => {
      const items = notifications ?? [
        "📅 Physics Exam on 25 March",
        "📝 Chemistry Assignment due tomorrow",
        "🧪 Math practical on 28 March",
      ];
      return items.map((text, i) => ({ id: i + 1, text }));
    },
  );
  const [nextId, setNextId] = useState(4);
  const [notifSaved, setNotifSaved] = useState(false);
  const [newNotif, setNewNotif] = useState("");

  const handleAddNotif = () => {
    if (!newNotif.trim()) return;
    setNotifList((prev) => [...prev, { id: nextId, text: newNotif.trim() }]);
    setNextId((n) => n + 1);
    setNewNotif("");
  };

  const handleSaveNotifs = async () => {
    await updateNotifications.mutateAsync(notifList.map((n) => n.text));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <ShieldLogo size={30} />
          <div className="flex-1">
            <div className="font-bold text-sm">ACADEMIA — ADMIN PANEL</div>
            <div className="text-xs opacity-60">Signed in as {username}</div>
          </div>
          <Button
            type="button"
            data-ocid="admin.logout.button"
            onClick={onLogout}
            size="sm"
            className="bg-white/15 hover:bg-white/25 text-primary-foreground border border-white/30 rounded-full"
          >
            <LogOut className="h-4 w-4 mr-1" /> Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Admin Management Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update subject data and notifications visible to all students.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-card p-6">
          <Tabs defaultValue="physics">
            <TabsList
              data-ocid="admin.tabs"
              className="mb-6 flex flex-wrap h-auto gap-1"
            >
              <TabsTrigger
                data-ocid="admin.physics.tab"
                value="physics"
                className="flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4" /> Physics
              </TabsTrigger>
              <TabsTrigger
                data-ocid="admin.chemistry.tab"
                value="chemistry"
                className="flex items-center gap-1.5"
              >
                <FlaskConical className="h-4 w-4" /> Chemistry
              </TabsTrigger>
              <TabsTrigger
                data-ocid="admin.math.tab"
                value="math"
                className="flex items-center gap-1.5"
              >
                <Calculator className="h-4 w-4" /> Math
              </TabsTrigger>
              <TabsTrigger
                data-ocid="admin.notifications.tab"
                value="notifications"
                className="flex items-center gap-1.5"
              >
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="physics">
              <SubjectForm
                subjectName="Physics"
                icon={BookOpen}
                examDate={physics.examDate}
                practicalDate={physics.practicalDate}
                assignmentDetails={physics.assignmentDetails}
                teacherName={physics.teacherName ?? ""}
                teacherEmail={physics.teacherEmail ?? ""}
                progress={Number(physics.progress ?? 0)}
                attendancePresent={Number(physics.attendancePresent ?? 0)}
                attendanceTotal={Number(physics.attendanceTotal ?? 0)}
                marks={physics.marks ?? ""}
                hasPractical
                onSave={(e, p, a, tn, te, pr, ap, at, m) =>
                  updatePhysics.mutateAsync({
                    examDate: e,
                    practicalDate: p,
                    assignmentDetails: a,
                    teacherName: tn,
                    teacherEmail: te,
                    progress: pr,
                    attendancePresent: ap,
                    attendanceTotal: at,
                    marks: m,
                  })
                }
                isSaving={updatePhysics.isPending}
              />
            </TabsContent>

            <TabsContent value="chemistry">
              <SubjectForm
                subjectName="Chemistry"
                icon={FlaskConical}
                examDate={chemistry.examDate}
                practicalDate={chemistry.practicalDate}
                assignmentDetails={chemistry.assignmentDetails}
                teacherName={chemistry.teacherName ?? ""}
                teacherEmail={chemistry.teacherEmail ?? ""}
                progress={Number(chemistry.progress ?? 0)}
                attendancePresent={Number(chemistry.attendancePresent ?? 0)}
                attendanceTotal={Number(chemistry.attendanceTotal ?? 0)}
                marks={chemistry.marks ?? ""}
                hasPractical
                onSave={(e, p, a, tn, te, pr, ap, at, m) =>
                  updateChemistry.mutateAsync({
                    examDate: e,
                    practicalDate: p,
                    assignmentDetails: a,
                    teacherName: tn,
                    teacherEmail: te,
                    progress: pr,
                    attendancePresent: ap,
                    attendanceTotal: at,
                    marks: m,
                  })
                }
                isSaving={updateChemistry.isPending}
              />
            </TabsContent>

            <TabsContent value="math">
              <SubjectForm
                subjectName="Math"
                icon={Calculator}
                examDate={math.examDate}
                assignmentDetails={math.assignmentDetails}
                teacherName={math.teacherName ?? ""}
                teacherEmail={math.teacherEmail ?? ""}
                progress={Number(math.progress ?? 0)}
                attendancePresent={Number(math.attendancePresent ?? 0)}
                attendanceTotal={Number(math.attendanceTotal ?? 0)}
                marks={math.marks ?? ""}
                hasPractical={false}
                onSave={(e, _p, a, tn, te, pr, ap, at, m) =>
                  updateMath.mutateAsync({
                    examDate: e,
                    assignmentDetails: a,
                    teacherName: tn,
                    teacherEmail: te,
                    progress: pr,
                    attendancePresent: ap,
                    attendanceTotal: at,
                    marks: m,
                  })
                }
                isSaving={updateMath.isPending}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Manage Notifications
                </h3>

                <div className="space-y-2">
                  {notifList.map((item, i) => (
                    <div
                      key={item.id}
                      data-ocid={`admin.notifications.item.${i + 1}`}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={item.text}
                        onChange={(e) =>
                          setNotifList((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, text: e.target.value }
                                : n,
                            ),
                          )
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        data-ocid={`admin.notifications.delete_button.${i + 1}`}
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setNotifList((prev) =>
                            prev.filter((n) => n.id !== item.id),
                          )
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    data-ocid="admin.notifications.input"
                    value={newNotif}
                    onChange={(e) => setNewNotif(e.target.value)}
                    placeholder="Add a new notification..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddNotif()}
                  />
                  <Button
                    type="button"
                    data-ocid="admin.notifications.add_button"
                    onClick={handleAddNotif}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    data-ocid="admin.notifications.save_button"
                    onClick={handleSaveNotifs}
                    disabled={updateNotifications.isPending}
                    className="bg-primary text-primary-foreground"
                  >
                    {updateNotifications.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Save All Notifications
                      </>
                    )}
                  </Button>
                  {notifSaved && (
                    <span
                      data-ocid="admin.notifications.success_state"
                      className="flex items-center gap-1 text-sm text-green-400"
                    >
                      <CheckCircle className="h-4 w-4" /> Saved!
                    </span>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-4">
        <p className="text-center text-xs opacity-40">
          &copy; {new Date().getFullYear()} Academia University Admin Portal
        </p>
      </footer>
    </div>
  );
}
