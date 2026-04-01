import {
  Eye,
  EyeOff,
  Hash,
  Lock,
  Mail,
  RefreshCw,
  User,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Role } from "../backend";
import { useActor } from "../hooks/useActor";

interface LoginPageProps {
  onLoginSuccess: (role: Role, username: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { actor, isFetching, isError, refetch } = useActor();
  const [tab, setTab] = useState<"signin" | "register">("signin");

  // Sign In state
  const [siUsername, setSiUsername] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPw, setSiShowPw] = useState(false);
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regScholar, setRegScholar] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regShowPw, setRegShowPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  function cleanError(raw: string): string {
    if (!raw) return "Something went wrong. Please try again.";
    if (
      raw.includes("Request ID:") ||
      raw.includes("Reject code:") ||
      raw.toLowerCase().includes("failed to fetch") ||
      raw.toLowerCase().includes("networkerror") ||
      raw.toLowerCase().includes("typeerror")
    ) {
      return "Unable to connect to server. Please check your internet connection and try again.";
    }
    return raw;
  }

  function isNetworkError(raw: string): boolean {
    return (
      raw.includes("Request ID:") ||
      raw.includes("Reject code:") ||
      raw.toLowerCase().includes("failed to fetch") ||
      raw.toLowerCase().includes("networkerror") ||
      raw.toLowerCase().includes("typeerror")
    );
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!siUsername.trim() || !siPassword.trim()) {
      setSiError("Please enter your username and password.");
      return;
    }
    if (!actor) {
      setSiError(
        "Server is still connecting. Please wait a moment and try again.",
      );
      return;
    }
    setSiLoading(true);
    setSiError("");

    const attemptLogin = async () => {
      const role = await actor.login(siUsername.trim(), siPassword);
      if (role === Role.invalid) {
        setSiError("Invalid username or password.");
      } else {
        onLoginSuccess(role, siUsername.trim());
      }
    };

    try {
      await attemptLogin();
    } catch (err: any) {
      const raw = err?.message || String(err);
      if (isNetworkError(raw)) {
        setSiError("Connecting to server, please wait...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          await attemptLogin();
        } catch (retryErr: any) {
          setSiError(cleanError(retryErr?.message || String(retryErr)));
        }
      } else {
        setSiError(cleanError(raw));
      }
    } finally {
      setSiLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regName.trim()) {
      setRegError("Full name is required.");
      return;
    }
    if (!regScholar.trim() || !/^\d{3,10}$/.test(regScholar.trim())) {
      setRegError("Scholar Number must be 3\u201310 digits.");
      return;
    }
    if (!regUsername.trim()) {
      setRegError("Username is required.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError("Invalid email format.");
      return;
    }
    if (!actor) {
      setRegError(
        "Server is still connecting. Please wait a moment and try again.",
      );
      return;
    }

    setRegLoading(true);

    const attemptRegister = async () => {
      const result = await actor.register(
        regUsername.trim(),
        regPassword,
        regName.trim(),
        regScholar.trim(),
      );
      if (result.__kind__ === "err") {
        setRegError(cleanError(result.err));
        return;
      }
      setRegSuccess("Account created! You can now sign in.");
      const savedUsername = regUsername.trim();
      setRegName("");
      setRegScholar("");
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");
      setTimeout(() => {
        setTab("signin");
        setSiUsername(savedUsername);
        setRegSuccess("");
      }, 1500);
    };

    try {
      await attemptRegister();
    } catch (err: any) {
      const raw = err?.message || String(err);
      if (isNetworkError(raw)) {
        setRegError("Connecting to server, please wait...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          await attemptRegister();
        } catch (retryErr: any) {
          setRegError(cleanError(retryErr?.message || String(retryErr)));
        }
      } else {
        setRegError(cleanError(raw));
      }
    } finally {
      setRegLoading(false);
    }
  }

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm";

  return (
    <div
      className="min-h-screen flex items-start justify-center p-4 pt-10 pb-10"
      style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)",
      }}
      data-ocid="login.page"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">
            ACADEMIA
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Government College Student Portal
          </p>
        </div>

        {/* Server status banner */}
        {isFetching && !actor && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-amber-700">
            <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            Connecting to server, please wait...
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-700">
            <span>Unable to reach server.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-1 ml-3 font-semibold text-red-600 hover:text-red-800 underline underline-offset-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex rounded-lg bg-gray-100 p-1 mb-6"
          data-ocid="login.tab"
        >
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setSiError("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              tab === "signin"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
            data-ocid="login.signin.tab"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setRegError("");
              setRegSuccess("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              tab === "register"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
            data-ocid="login.register.tab"
          >
            Register
          </button>
        </div>

        {/* Sign In Form */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="si-username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="si-username"
                  type="text"
                  value={siUsername}
                  onChange={(e) => setSiUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={inputClass}
                  data-ocid="login.input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="si-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="si-password"
                  type={siShowPw ? "text" : "password"}
                  value={siPassword}
                  onChange={(e) => setSiPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setSiShowPw(!siShowPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {siShowPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {siError && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  siError.includes("Connecting")
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}
                data-ocid="login.error_state"
              >
                {siError.includes("Connecting") && (
                  <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                )}
                {siError}
              </div>
            )}

            <button
              type="submit"
              disabled={siLoading || isFetching}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              data-ocid="login.submit_button"
            >
              {siLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : isFetching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                  data-ocid="register.input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-scholar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Scholar Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-scholar"
                  type="text"
                  value={regScholar}
                  onChange={(e) => setRegScholar(e.target.value)}
                  placeholder="3\u201310 digit number (e.g. 617)"
                  className={inputClass}
                  data-ocid="register.input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-username"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a username"
                  className={inputClass}
                  data-ocid="register.input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClass}
                  data-ocid="register.input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-password"
                  type={regShowPw ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  data-ocid="register.input"
                />
                <button
                  type="button"
                  onClick={() => setRegShowPw(!regShowPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {regShowPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-confirm"
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={inputClass}
                  data-ocid="register.input"
                />
              </div>
            </div>

            {regError && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  regError.includes("Connecting")
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}
                data-ocid="register.error_state"
              >
                {regError.includes("Connecting") && (
                  <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                )}
                {regError}
              </div>
            )}
            {regSuccess && (
              <p
                className="text-green-600 text-sm font-medium"
                data-ocid="register.success_state"
              >
                {regSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={regLoading || isFetching}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              data-ocid="register.submit_button"
            >
              {regLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : isFetching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-600"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
