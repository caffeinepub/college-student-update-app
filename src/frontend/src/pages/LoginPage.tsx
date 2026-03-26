import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Role } from "../backend";
import { useActor } from "../hooks/useActor";

interface LoginPageProps {
  onLoginSuccess: (role: Role, username: string) => void;
  isAdminMode?: boolean;
}

export default function LoginPage({
  onLoginSuccess,
  isAdminMode = false,
}: LoginPageProps) {
  const { actor } = useActor();
  const [tab, setTab] = useState<"signin" | "register">("signin");

  // Sign in state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminMode, setAdminMode] = useState(isAdminMode);

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError("Not connected to backend. Please wait and try again.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const role = await actor.login(username.trim(), password);
      if (role === Role.invalid) {
        setError("Invalid username or password. Please try again.");
      } else if (adminMode && role !== Role.admin) {
        setError("Access denied. Admin credentials required.");
      } else {
        onLoginSuccess(role, username.trim());
      }
    } catch {
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setRegError("Not connected to backend. Please wait and try again.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    setRegError("");
    setRegLoading(true);
    try {
      const result = await actor.register(
        regUsername.trim(),
        regPassword,
        regFullName.trim(),
      );
      if (result.__kind__ === "err") {
        setRegError(result.err);
      } else {
        const role = await actor.login(regUsername.trim(), regPassword);
        onLoginSuccess(role, regUsername.trim());
      }
    } catch {
      setRegError("Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* System banner */}
      <div className="bg-foreground text-background text-xs py-1.5 px-4 text-center">
        <span className="opacity-80">
          System maintenance scheduled for Sunday 2:00–4:00 AM.
        </span>{" "}
        <span className="underline cursor-pointer opacity-90">
          View Details
        </span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col">
        <div className="bg-primary py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Left: branding */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary-foreground flex-1 text-center md:text-left"
            >
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <Shield className="h-10 w-10" />
                <div>
                  <div className="text-2xl font-bold tracking-widest">
                    ACADEMIA
                  </div>
                  <div className="text-xs opacity-70 tracking-widest">
                    STUDENT PORTAL
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                COLLEGE STUDENT
                <br />
                UPDATE APP
              </h1>
              <p className="mt-3 text-sm opacity-70 max-w-xs">
                Access your exam schedules, assignment details, and academic
                notifications in one place.
              </p>
            </motion.div>

            {/* Center: Login card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-sm"
            >
              <div
                data-ocid="login.card"
                className="bg-card rounded-xl shadow-2xl p-6"
              >
                {/* Tab toggle */}
                <div className="flex rounded-lg bg-muted p-1 mb-5">
                  <button
                    type="button"
                    data-ocid="login.signin.tab"
                    onClick={() => {
                      setTab("signin");
                      setError("");
                    }}
                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${
                      tab === "signin"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    data-ocid="login.register.tab"
                    onClick={() => {
                      setTab("register");
                      setRegError("");
                    }}
                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${
                      tab === "register"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {tab === "signin" ? (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">
                      {adminMode ? "Admin Login" : "Student Login"}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-5">
                      {adminMode
                        ? "Sign in with your administrator credentials"
                        : "Sign in to access your academic portal"}
                    </p>

                    {error && (
                      <div
                        data-ocid="login.error_state"
                        className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="username"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          data-ocid="login.input"
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="password"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          data-ocid="login.password.input"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          data-ocid="login.remember.checkbox"
                          checked={rememberMe}
                          onCheckedChange={(v) => setRememberMe(!!v)}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm cursor-pointer"
                        >
                          Remember me
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        data-ocid="login.submit_button"
                        className="w-full bg-primary text-primary-foreground hover:opacity-90"
                        disabled={isLoading || !actor}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                            Signing In...
                          </>
                        ) : adminMode ? (
                          "Sign In as Admin"
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                      <button
                        type="button"
                        data-ocid="login.admin_mode.toggle"
                        onClick={() => {
                          setAdminMode(!adminMode);
                          setError("");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                      >
                        {adminMode
                          ? "← Back to Student Login"
                          : "Admin / Teacher Login →"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">
                      Create Account
                    </h2>
                    <p className="text-xs text-muted-foreground mb-5">
                      Register as a new student
                    </p>

                    {regError && (
                      <div
                        data-ocid="register.error_state"
                        className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {regError}
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="reg-fullname"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="reg-fullname"
                          data-ocid="register.fullname.input"
                          type="text"
                          placeholder="Enter your full name"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="reg-username"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Username
                        </Label>
                        <Input
                          id="reg-username"
                          data-ocid="register.input"
                          type="text"
                          placeholder="Choose a username"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="reg-password"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Password
                        </Label>
                        <Input
                          id="reg-password"
                          data-ocid="register.password.input"
                          type="password"
                          placeholder="Choose a password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="reg-confirm"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Confirm Password
                        </Label>
                        <Input
                          id="reg-confirm"
                          data-ocid="register.confirm.input"
                          type="password"
                          placeholder="Repeat your password"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          required
                          className="border-border"
                        />
                      </div>

                      <Button
                        type="submit"
                        data-ocid="register.submit_button"
                        className="w-full bg-primary text-primary-foreground hover:opacity-90"
                        disabled={regLoading || !actor}
                      >
                        {regLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right: description */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-primary-foreground hidden lg:block flex-1 text-right"
            >
              <h3 className="text-lg font-semibold mb-2">Your Academic Hub</h3>
              <p className="text-sm opacity-70 max-w-xs ml-auto">
                Stay informed with real-time updates on exams, practicals, and
                assignments across all your subjects — Physics, Chemistry, and
                Math.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-primary/95 border-t border-white/10 py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 text-xs text-primary-foreground opacity-50">
            <span>About Us</span>
            <span>Contact</span>
            <span>Privacy</span>
            <span>Support</span>
          </div>
          <p className="text-center text-xs text-primary-foreground opacity-30 mt-1">
            &copy; {new Date().getFullYear()} Academia University
          </p>
        </footer>
      </div>
    </div>
  );
}
