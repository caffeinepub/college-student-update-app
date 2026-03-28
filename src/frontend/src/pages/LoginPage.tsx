import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import {
  AlertCircle,
  AtSign,
  Eye,
  EyeOff,
  Hash,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  User,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Role } from "../backend";
import { useActor } from "../hooks/useActor";
import { useBackendWakeUp } from "../hooks/useBackendWakeUp";

interface LoginPageProps {
  onLoginSuccess: (role: Role, username: string) => void;
}

type LoginTab = "scholar" | "username" | "email";

function getPasswordStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (pwd.length < 4) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

const strengthLabel = ["Weak", "Fair", "Good", "Strong"] as const;
const strengthColor = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-400",
  "bg-emerald-500",
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? strengthColor[strength] : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p
        className="text-xs"
        style={{
          color:
            strength === 0
              ? "oklch(0.65 0.22 30)"
              : strength === 1
                ? "oklch(0.78 0.17 85)"
                : strength === 2
                  ? "oklch(0.65 0.15 220)"
                  : "oklch(0.72 0.17 150)",
        }}
      >
        Password strength: {strengthLabel[strength]}
      </p>
    </div>
  );
}

function GlassInput({
  id,
  type,
  placeholder,
  value,
  onChange,
  required,
  "data-ocid": dataOcid,
  rightElement,
  leftElement,
}: {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  "data-ocid"?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {leftElement && (
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#9ca3af" }}
        >
          {leftElement}
        </div>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        data-ocid={dataOcid}
        className={`w-full py-3.5 rounded-xl text-sm placeholder-slate-400 border-2 transition-all duration-200 outline-none input-glow ${leftElement ? "pl-10" : "pl-4"}${rightElement ? " pr-10" : " pr-4"}`}
        style={{
          color: "#222",
          background: "rgba(255,255,255,0.98)",
          borderColor: "rgba(79,70,229,0.2)",
        }}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
}

// Enhanced animated particle background
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => {
      const r = Math.random() * 3 + 1;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.floor(Math.random() * 80) + 210,
        isLarge: r > 2.5,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 80%, 70%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        if (p.isLarge) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          grd.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${p.alpha})`);
          grd.addColorStop(1, `hsla(${p.hue}, 90%, 80%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 75%, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.35, zIndex: 0 }}
    />
  );
}

// 3D floating geometric shapes
function FloatingShapes() {
  const shapes = [
    {
      id: "s1",
      size: 80,
      top: "8%",
      left: "5%",
      color: "rgba(79,70,229,0.3)",
      animClass: "shape-float-1",
      type: "circle",
    },
    {
      id: "s2",
      size: 60,
      top: "15%",
      right: "8%",
      color: "rgba(124,58,237,0.25)",
      animClass: "shape-float-2",
      type: "square",
    },
    {
      id: "s3",
      size: 100,
      top: "55%",
      left: "2%",
      color: "rgba(59,130,246,0.25)",
      animClass: "shape-float-3",
      type: "square",
    },
    {
      id: "s4",
      size: 50,
      top: "70%",
      right: "5%",
      color: "rgba(79,70,229,0.28)",
      animClass: "shape-float-4",
      type: "circle",
    },
    {
      id: "s5",
      size: 70,
      top: "40%",
      right: "2%",
      color: "rgba(99,102,241,0.25)",
      animClass: "shape-float-5",
      type: "triangle",
    },
    {
      id: "s6",
      size: 90,
      top: "80%",
      left: "10%",
      color: "rgba(139,92,246,0.22)",
      animClass: "shape-float-6",
      type: "triangle",
    },
    {
      id: "s7",
      size: 45,
      top: "25%",
      left: "15%",
      color: "rgba(14,165,233,0.25)",
      animClass: "shape-float-7",
      type: "square",
    },
    {
      id: "s8",
      size: 65,
      top: "90%",
      right: "15%",
      color: "rgba(124,58,237,0.22)",
      animClass: "shape-float-8",
      type: "circle",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shape-float-1 {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          33% { transform: translateY(-18px) rotateX(30deg) rotateY(20deg) rotateZ(10deg); }
          66% { transform: translateY(10px) rotateX(-15deg) rotateY(40deg) rotateZ(-8deg); }
        }
        @keyframes shape-float-2 {
          0%, 100% { transform: translateY(0px) rotateX(10deg) rotateY(0deg) rotateZ(0deg); }
          40% { transform: translateY(-22px) rotateX(-20deg) rotateY(30deg) rotateZ(15deg); }
          70% { transform: translateY(12px) rotateX(25deg) rotateY(-20deg) rotateZ(-10deg); }
        }
        @keyframes shape-float-3 {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(10deg) rotateZ(5deg); }
          50% { transform: translateY(-15px) rotateX(20deg) rotateY(-30deg) rotateZ(-12deg); }
        }
        @keyframes shape-float-4 {
          0%, 100% { transform: translateY(0px) rotateX(-5deg) rotateY(0deg) rotateZ(0deg); }
          30% { transform: translateY(-20px) rotateX(15deg) rotateY(25deg) rotateZ(8deg); }
          60% { transform: translateY(8px) rotateX(-25deg) rotateY(-15deg) rotateZ(-5deg); }
        }
        @keyframes shape-float-5 {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          45% { transform: translateY(-25px) rotateX(35deg) rotateY(20deg) rotateZ(18deg); }
        }
        @keyframes shape-float-6 {
          0%, 100% { transform: translateY(0px) rotateX(5deg) rotateY(5deg) rotateZ(0deg); }
          35% { transform: translateY(-12px) rotateX(-30deg) rotateY(25deg) rotateZ(-12deg); }
          70% { transform: translateY(15px) rotateX(20deg) rotateY(-20deg) rotateZ(8deg); }
        }
        @keyframes shape-float-7 {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(15deg) rotateZ(5deg); }
          50% { transform: translateY(-19px) rotateX(25deg) rotateY(-25deg) rotateZ(-15deg); }
        }
        @keyframes shape-float-8 {
          0%, 100% { transform: translateY(0px) rotateX(-10deg) rotateY(0deg) rotateZ(0deg); }
          40% { transform: translateY(-16px) rotateX(20deg) rotateY(30deg) rotateZ(10deg); }
          80% { transform: translateY(10px) rotateX(-15deg) rotateY(-20deg) rotateZ(-8deg); }
        }
        .shape-float-1 { animation: shape-float-1 14s ease-in-out infinite; }
        .shape-float-2 { animation: shape-float-2 17s ease-in-out infinite; }
        .shape-float-3 { animation: shape-float-3 19s ease-in-out infinite; }
        .shape-float-4 { animation: shape-float-4 12s ease-in-out infinite; }
        .shape-float-5 { animation: shape-float-5 16s ease-in-out infinite; }
        .shape-float-6 { animation: shape-float-6 20s ease-in-out infinite; }
        .shape-float-7 { animation: shape-float-7 13s ease-in-out infinite; }
        .shape-float-8 { animation: shape-float-8 18s ease-in-out infinite; }
      `}</style>
      {shapes.map((s) => {
        const posStyle: React.CSSProperties = {
          position: "fixed",
          pointerEvents: "none",
          zIndex: 1,
          width: s.size,
          height: s.type === "triangle" ? 0 : s.size,
          top: s.top,
          ...("left" in s
            ? { left: s.left }
            : { right: (s as { right: string }).right }),
        };

        if (s.type === "circle") {
          return (
            <div
              key={s.id}
              className={s.animClass}
              style={{
                ...posStyle,
                borderRadius: "50%",
                border: `1.5px solid ${s.color}`,
                background: "transparent",
                boxShadow: `0 0 12px ${s.color}`,
              }}
            />
          );
        }
        if (s.type === "square") {
          return (
            <div
              key={s.id}
              className={s.animClass}
              style={{
                ...posStyle,
                borderRadius: "12px",
                border: `1.5px solid ${s.color}`,
                background: "transparent",
                boxShadow: `0 0 12px ${s.color}`,
              }}
            />
          );
        }
        return (
          <div
            key={s.id}
            className={s.animClass}
            style={{
              ...posStyle,
              height: s.size,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              border: "none",
              background: s.color,
              filter: `drop-shadow(0 0 8px ${s.color})`,
            }}
          />
        );
      })}
    </>
  );
}

function isNetworkError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    msg.includes("Request ID:") ||
    msg.includes("Reject code:") ||
    lower.includes("fetch") ||
    lower.includes("network") ||
    lower.includes("timeout") ||
    lower.includes("connection")
  );
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { actor, isFetching } = useActor();
  const { isWakingUp, ensureAwake } = useBackendWakeUp();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [loginTab, setLoginTab] = useState<LoginTab>("scholar");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Sign-in state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  // Banner shown on sign-in tab after successful registration + failed auto-login
  const [regSuccessMsg, setRegSuccessMsg] = useState("");

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regScholar, setRegScholar] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regRetryCount, setRegRetryCount] = useState(0);
  const [showRegRetryBtn, setShowRegRetryBtn] = useState(false);

  // Mouse parallax for card
  const cardRotateX = useMotionValue(0);
  const cardRotateY = useMotionValue(0);
  const springX = useSpring(cardRotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(cardRotateY, { stiffness: 120, damping: 20 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    cardRotateY.set((dx / (rect.width / 2)) * 8);
    cardRotateX.set(-(dy / (rect.height / 2)) * 8);
  };

  const handleMouseLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const loginTabConfig: {
    key: LoginTab;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "scholar",
      label: "Scholar No.",
      placeholder: "e.g. 617 or SCH2024001",
    },
    { key: "username", label: "Username", placeholder: "Enter your username" },
    { key: "email", label: "Email", placeholder: "Enter your email" },
  ];

  const attemptSignIn = async (): Promise<void> => {
    if (!actor) return;
    let role: Role;
    if (loginTab === "scholar") {
      role = await actor.loginByScholarNumber(identifier.trim(), password);
    } else {
      role = await actor.login(identifier.trim(), password);
    }
    if (role === Role.invalid) {
      setError("Invalid credentials. Please check and try again.");
    } else if (adminMode && role !== Role.admin) {
      setError("Access denied. Admin credentials required.");
    } else {
      setLoginSuccess(true);
      setTimeout(() => {
        onLoginSuccess(role, identifier.trim());
      }, 1200);
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!actor) {
      setError("Not connected to backend. Please wait and try again.");
      return;
    }
    // Reset retry state on fresh attempt
    setRetryCount(0);
    setShowRetryBtn(false);
    setError("");
    setIsLoading(true);
    // Wake up the backend canister before the real request
    await ensureAwake(3, 2000);
    let handledByRetry = false;
    try {
      await attemptSignIn();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (isNetworkError(errMsg)) {
        // Auto-retry: keep spinner running, retry after 2s
        handledByRetry = true;
        setError("Server waking up, please wait...");
        setRetryCount(1);
        await new Promise((r) => setTimeout(r, 2000));
        try {
          setError("Retrying connection...");
          await attemptSignIn();
        } catch (retryErr) {
          const retryMsg =
            retryErr instanceof Error ? retryErr.message : String(retryErr);
          if (isNetworkError(retryMsg)) {
            setError(
              "Unable to reach server. The server may still be waking up — please try again in a few seconds.",
            );
          } else {
            setError(`Login failed: ${retryMsg}`);
          }
          setShowRetryBtn(true);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setError(`Login failed: ${errMsg}`);
    } finally {
      if (!handledByRetry) setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setRegError("Not connected to server. Please wait and try again.");
      return;
    }
    if (!regFullName.trim()) {
      setRegError("Full Name is required.");
      return;
    }
    if (!regScholar.trim()) {
      setRegError("Scholar Number is required.");
      return;
    }
    if (!/^[A-Za-z0-9]{3,15}$/.test(regScholar.trim())) {
      setRegError(
        "Invalid Scholar Number. Must be 3 to 15 alphanumeric characters.",
      );
      return;
    }
    if (!regUsername.trim()) {
      setRegError("Username is required.");
      return;
    }
    if (regUsername.trim().length < 3) {
      setRegError("Username must be at least 3 characters.");
      return;
    }
    if (regEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(regEmail.trim())) {
        setRegError("Invalid email format. Please enter a valid email.");
        return;
      }
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }

    setRegError("");
    setRegSuccess(false);
    setRegRetryCount(0);
    setShowRegRetryBtn(false);
    setRegLoading(true);
    // Wake up the backend canister before registering
    await ensureAwake(2, 2000);

    const doRegister = async (attempt: number): Promise<void> => {
      try {
        const result = await actor.register(
          regUsername.trim(),
          regPassword,
          regFullName.trim(),
          regScholar.trim(),
        );
        if ("err" in result) {
          const errMsg = result.err;
          if (errMsg.toLowerCase().includes("scholar")) {
            setRegError(
              "Scholar Number already exists. Please use a different Scholar Number.",
            );
          } else if (errMsg.toLowerCase().includes("username")) {
            setRegError(
              "Username already taken. Please choose a different username.",
            );
          } else {
            setRegError(errMsg);
          }
          setRegLoading(false);
          return;
        }
        // Registration succeeded — show banner and attempt auto-login
        setRegSuccess(true);
        setRegLoading(false);
        const savedUsername = regUsername.trim();
        const savedPassword = regPassword;
        setTimeout(async () => {
          try {
            const role = await actor.login(savedUsername, savedPassword);
            if (role === Role.invalid) {
              setIdentifier(savedUsername);
              setLoginTab("username");
              setMode("signin");
              setRegSuccess(false);
              setRegSuccessMsg(
                "Account created! Sign in with your credentials below.",
              );
            } else {
              onLoginSuccess(role, savedUsername);
            }
          } catch {
            setIdentifier(savedUsername);
            setLoginTab("username");
            setMode("signin");
            setRegSuccess(false);
            setRegSuccessMsg(
              "Account created! Sign in with your credentials below.",
            );
          }
        }, 1500);
      } catch (err) {
        let errStr = "";
        if (err instanceof Error) {
          errStr = err.message;
          const cause = (err as unknown as { cause?: { message?: string } })
            .cause;
          if (cause?.message) errStr = cause.message;
        } else if (typeof err === "object" && err !== null) {
          const anyErr = err as Record<string, unknown>;
          errStr = String(anyErr.message || anyErr.cause || err);
        } else {
          errStr = String(err);
        }

        if (isNetworkError(errStr) && attempt === 0) {
          // Auto-retry once
          setRegRetryCount(1);
          setRegError("Server may be waking up — retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await doRegister(1);
          return;
        }

        // Exceeded retries or non-network error
        if (isNetworkError(errStr)) {
          setRegError(
            "Unable to reach server. Please check your internet connection and try again.",
          );
          setShowRegRetryBtn(true);
        } else {
          // Clean up the error message
          if (
            errStr.includes("Request ID:") ||
            errStr.includes("Reject code:")
          ) {
            setRegError(
              "Server connection error. Please check your internet and try again.",
            );
            setShowRegRetryBtn(true);
          } else if (errStr.length > 200) {
            const colonIdx = errStr.indexOf(":");
            if (colonIdx > 0) {
              errStr = errStr.slice(colonIdx + 1, colonIdx + 160).trim();
            } else {
              errStr =
                "Registration failed. Please check your connection and try again.";
            }
            setRegError(errStr);
          } else if (errStr.length > 0) {
            setRegError(errStr);
          } else {
            setRegError("Registration failed. Please try again.");
          }
        }
        setRegLoading(false);
      }
    };

    await doRegister(0);
    setRegLoading(false);
  };

  return (
    <div
      className="min-h-screen relative overflow-y-auto"
      style={{ background: "#050810" }}
    >
      {/* Animated gradient orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(124,58,237,0.14) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 50% 90%, rgba(59,130,246,0.1) 0%, transparent 70%)",
          animation: "pulse-orbs 8s ease-in-out infinite alternate",
          zIndex: 0,
        }}
      />

      <ParticleBackground />
      <FloatingShapes />

      <style>{`
        @keyframes pulse-orbs {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>

      <motion.div
        key="login-form"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen flex items-center justify-center px-4 py-12 relative"
        style={{ zIndex: 10 }}
      >
        <div className="w-full max-w-md">
          {/* Logo header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div
              className="inline-flex items-center justify-center w-18 h-18 rounded-2xl glass-card mb-4 animate-pulse-glow"
              style={{
                width: 72,
                height: 72,
                background: "rgba(59,130,246,0.12)",
                border: "2px solid rgba(99,102,241,0.4)",
                boxShadow: "0 0 32px rgba(99,102,241,0.35)",
              }}
            >
              <Shield className="h-10 w-10" style={{ color: "#818cf8" }} />
            </div>
            <h1 className="text-3xl font-bold tracking-widest shimmer-text font-display">
              ACADEMIA
            </h1>
            <p
              className="text-xs tracking-[0.25em] mt-1.5"
              style={{ color: "#6b7280" }}
            >
              COLLEGE STUDENT PORTAL
            </p>
          </motion.div>

          {/* Main card */}
          <div
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              ref={cardRef}
              data-ocid="login.card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }}
              className={`glass-card-strong rounded-3xl p-7 animate-neon-border ${
                error || regError ? "animate-shake" : ""
              }`}
            >
              {/* Mode toggle: Sign In / Register */}
              <div
                className="flex rounded-2xl p-1 mb-7"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <button
                  type="button"
                  data-ocid="login.signin.tab"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className="flex-1 text-sm font-bold py-3 rounded-xl transition-all duration-250"
                  style={
                    mode === "signin"
                      ? {
                          background:
                            "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          color: "#fff",
                          boxShadow:
                            "0 0 18px rgba(99,102,241,0.55), 0 2px 8px rgba(0,0,0,0.3)",
                          fontWeight: 800,
                          letterSpacing: "0.02em",
                        }
                      : {
                          color: "#c4b5fd",
                          fontWeight: 700,
                        }
                  }
                >
                  Sign In
                </button>
                <button
                  type="button"
                  data-ocid="login.register.tab"
                  onClick={() => {
                    setMode("register");
                    setRegError("");
                  }}
                  className="flex-1 text-sm font-bold py-3 rounded-xl transition-all duration-250"
                  style={
                    mode === "register"
                      ? {
                          background:
                            "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          color: "#fff",
                          boxShadow:
                            "0 0 18px rgba(99,102,241,0.55), 0 2px 8px rgba(0,0,0,0.3)",
                          fontWeight: 800,
                          letterSpacing: "0.02em",
                        }
                      : {
                          color: "#c4b5fd",
                          fontWeight: 700,
                        }
                  }
                >
                  Register
                </button>
              </div>

              {/* Wake-up status banner */}
              {isWakingUp && (
                <div
                  className="mb-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#6366f1",
                  }}
                >
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                  <span>
                    Connecting to server — this may take a moment on first
                    load...
                  </span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {mode === "signin" ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{
                        background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {adminMode ? "Admin Login" : "Student Login"}
                    </h2>
                    <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
                      {adminMode
                        ? "Administrator credentials required"
                        : "Access your academic portal"}
                    </p>

                    {!adminMode && (
                      <div
                        className="flex gap-1 mb-5 rounded-xl p-1"
                        style={{ background: "rgba(79,70,229,0.04)" }}
                      >
                        {loginTabConfig.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            data-ocid={`login.${t.key}.tab`}
                            onClick={() => {
                              setLoginTab(t.key);
                              setIdentifier("");
                              setError("");
                            }}
                            className="flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200"
                            style={
                              loginTab === t.key
                                ? {
                                    background: "rgba(79,70,229,0.1)",
                                    color: "#4f46e5",
                                    border: "1px solid rgba(79,70,229,0.25)",
                                  }
                                : { color: "#9ca3af" }
                            }
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="login.error_state"
                        className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-300 rounded-xl p-3 mb-4 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span>{error}</span>
                          {showRetryBtn && (
                            <button
                              type="button"
                              data-ocid="login.retry.button"
                              onClick={() => handleSignIn()}
                              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 transition-colors"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Try Again
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Post-registration success guidance banner */}
                    {regSuccessMsg && !error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="login.reg_success.success_state"
                        className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-4 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        {regSuccessMsg}
                      </motion.div>
                    )}

                    {loginSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="login.success_state"
                        className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-4 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        Login successful! Redirecting...
                      </motion.div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          {adminMode
                            ? "Username"
                            : loginTabConfig.find((t) => t.key === loginTab)
                                ?.label}
                        </Label>
                        <GlassInput
                          id="identifier"
                          type={loginTab === "email" ? "email" : "text"}
                          placeholder={
                            adminMode
                              ? "Admin username"
                              : (loginTabConfig.find((t) => t.key === loginTab)
                                  ?.placeholder ?? "")
                          }
                          value={identifier}
                          onChange={(e) => {
                            setIdentifier(e.target.value);
                            if (regSuccessMsg) setRegSuccessMsg("");
                          }}
                          required
                          data-ocid="login.input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Password
                        </Label>
                        <GlassInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          data-ocid="login.password.input"
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="transition-colors"
                              style={{ color: "#9ca3af" }}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="remember"
                            data-ocid="login.remember.checkbox"
                            checked={rememberMe}
                            onCheckedChange={(v) => setRememberMe(!!v)}
                            className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm cursor-pointer"
                            style={{ color: "#374151" }}
                          >
                            Remember me
                          </Label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForgotOpen((v) => !v)}
                          className="text-xs transition-colors"
                          style={{ color: "#818cf8" }}
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {forgotOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs rounded-xl p-3 border"
                          style={{
                            color: "#6b7280",
                            background: "rgba(79,70,229,0.05)",
                            borderColor: "rgba(79,70,229,0.15)",
                          }}
                        >
                          🔐 Contact your college administrator to reset your
                          password. Email:{" "}
                          <span style={{ color: "#818cf8" }}>
                            admin@academia.edu
                          </span>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        data-ocid="login.submit_button"
                        disabled={
                          isLoading ||
                          loginSuccess ||
                          isWakingUp ||
                          (!actor && !isFetching)
                        }
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-primary-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {retryCount > 0 ? "Retrying..." : "Signing In..."}
                          </>
                        ) : loginSuccess ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />{" "}
                            Redirecting...
                          </>
                        ) : isWakingUp ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Waking up server...
                          </>
                        ) : !actor && isFetching ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : adminMode ? (
                          "Sign In as Admin"
                        ) : (
                          "Sign In →"
                        )}
                      </button>
                    </form>

                    <div
                      className="mt-5 pt-4 border-t text-center"
                      style={{ borderColor: "rgba(79,70,229,0.1)" }}
                    >
                      <button
                        type="button"
                        data-ocid="login.admin_mode.toggle"
                        onClick={() => {
                          setAdminMode((v) => !v);
                          setError("");
                          setIdentifier("");
                          setLoginTab("username");
                        }}
                        className="text-xs transition-colors"
                        style={{ color: "#9ca3af" }}
                      >
                        {adminMode
                          ? "← Back to Student Login"
                          : "Admin / Teacher Login →"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{
                        background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Create Account
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
                      Register as a new student
                    </p>

                    {regError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="register.error_state"
                        className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-300 rounded-xl p-3 mb-4 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span>{regError}</span>
                          {regRetryCount > 0 && !showRegRetryBtn && (
                            <span className="ml-2 text-gray-400 text-xs">
                              Retry {regRetryCount}/2
                            </span>
                          )}
                          {showRegRetryBtn && (
                            <button
                              type="button"
                              data-ocid="register.retry.button"
                              onClick={
                                handleRegister as unknown as React.MouseEventHandler
                              }
                              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 transition-colors"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Try Again
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {regSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="register.success_state"
                        className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-4 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        Registration successful! Redirecting to your
                        dashboard...
                      </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Full Name
                        </Label>
                        <GlassInput
                          id="reg-fullname"
                          type="text"
                          placeholder="Your full name"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          required
                          data-ocid="register.fullname.input"
                          leftElement={<User className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Scholar Number
                        </Label>
                        <GlassInput
                          id="reg-scholar"
                          type="text"
                          placeholder="e.g. 617 or SCH2024001"
                          value={regScholar}
                          onChange={(e) => setRegScholar(e.target.value)}
                          required
                          data-ocid="register.scholar.input"
                          leftElement={<Hash className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Username
                        </Label>
                        <GlassInput
                          id="reg-username"
                          type="text"
                          placeholder="Choose a username"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          required
                          data-ocid="register.input"
                          leftElement={<AtSign className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Email{" "}
                          <span
                            className="normal-case font-normal"
                            style={{ color: "#9ca3af" }}
                          >
                            (optional)
                          </span>
                        </Label>
                        <GlassInput
                          id="reg-email"
                          type="email"
                          placeholder="your@email.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          data-ocid="register.email.input"
                          leftElement={<Mail className="h-4 w-4" />}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Password
                        </Label>
                        <GlassInput
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          data-ocid="register.password.input"
                          leftElement={<Lock className="h-4 w-4" />}
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowRegPassword((v) => !v)}
                              className="transition-colors"
                              style={{ color: "#9ca3af" }}
                              aria-label={
                                showRegPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showRegPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          }
                        />
                        <PasswordStrength password={regPassword} />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#374151" }}
                        >
                          Confirm Password
                        </Label>
                        <GlassInput
                          id="reg-confirm"
                          type="password"
                          placeholder="Repeat your password"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          required
                          data-ocid="register.confirm.input"
                          leftElement={<Lock className="h-4 w-4" />}
                        />
                        {regConfirm && regPassword !== regConfirm && (
                          <p className="text-xs text-red-500 mt-1">
                            Passwords do not match
                          </p>
                        )}
                        {regConfirm &&
                          regPassword === regConfirm &&
                          regConfirm.length > 0 && (
                            <p className="text-xs text-emerald-600 mt-1">
                              ✓ Passwords match
                            </p>
                          )}
                      </div>

                      <button
                        type="submit"
                        data-ocid="register.submit_button"
                        disabled={
                          regLoading || isWakingUp || (!actor && !isFetching)
                        }
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-primary-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                      >
                        {regLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />{" "}
                            {regRetryCount > 0
                              ? "Retrying..."
                              : "Creating Account..."}
                          </>
                        ) : isWakingUp ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Waking up server...
                          </>
                        ) : !actor && isFetching ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Create Account →"
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs mt-6 pb-6"
            style={{ color: "#9ca3af" }}
          >
            © {new Date().getFullYear()} Academia University. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-colors"
              style={{ color: "#4f46e5" }}
            >
              caffeine.ai
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
