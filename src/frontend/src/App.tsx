import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Role } from "./backend";
import AboutPage from "./pages/AboutPage";
import AdminPanel from "./pages/AdminPanel";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SubjectPage from "./pages/SubjectPage";

const queryClient = new QueryClient();

type AuthState = "unauthenticated" | "student" | "admin";
type Page = "home" | "physics" | "chemistry" | "math" | "about" | "contact";

function AppContent() {
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handleLoginSuccess = (role: Role, user: string) => {
    setUsername(user);
    setCurrentPage("home");
    if (role === Role.admin) {
      setAuthState("admin");
    } else {
      setAuthState("student");
    }
  };

  const handleLogout = () => {
    setAuthState("unauthenticated");
    setUsername("");
    setCurrentPage("home");
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (authState === "unauthenticated") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (authState === "admin") {
    return <AdminPanel username={username} onLogout={handleLogout} />;
  }

  // Student views
  if (currentPage === "home") {
    return (
      <HomePage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "physics") {
    return (
      <SubjectPage
        subject="Physics"
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "chemistry") {
    return (
      <SubjectPage
        subject="Chemistry"
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "math") {
    return (
      <SubjectPage
        subject="Math"
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "about") {
    return (
      <AboutPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "contact") {
    return (
      <ContactPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <HomePage
      username={username}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}
