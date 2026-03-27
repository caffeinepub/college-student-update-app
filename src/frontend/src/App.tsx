import { useState } from "react";
import { Role } from "./backend";
import AboutPage from "./pages/AboutPage";
import AdminPanel from "./pages/AdminPanel";
import CalendarPage from "./pages/CalendarPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectPage from "./pages/SubjectPage";
import SubjectsListPage from "./pages/SubjectsListPage";

type Page =
  | "login"
  | "home"
  | "subjects"
  | "physics"
  | "chemistry"
  | "math"
  | "admin"
  | "calendar"
  | "profile"
  | "contact"
  | "about";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [username, setUsername] = useState("");

  function handleLoginSuccess(r: Role, u: string) {
    setUsername(u);
    setPage(r === Role.admin ? "admin" : "home");
  }

  function handleLogout() {
    setUsername("");
    setPage("login");
  }

  function handleNavigate(p: string) {
    setPage(p as Page);
  }

  if (page === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (page === "admin") {
    return <AdminPanel username={username} onLogout={handleLogout} />;
  }

  if (page === "subjects") {
    return (
      <SubjectsListPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "physics" || page === "chemistry" || page === "math") {
    const subjectMap: Record<string, "Physics" | "Chemistry" | "Math"> = {
      physics: "Physics",
      chemistry: "Chemistry",
      math: "Math",
    };
    return (
      <SubjectPage
        subject={subjectMap[page]}
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "calendar") {
    return (
      <CalendarPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "profile") {
    return (
      <ProfilePage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "contact") {
    return (
      <ContactPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "about") {
    return (
      <AboutPage
        username={username}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  // default: home
  return (
    <HomePage
      username={username}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}
