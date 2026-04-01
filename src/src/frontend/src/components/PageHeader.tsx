import { Button } from "@/components/ui/button";
import { Calendar, LogOut, User } from "lucide-react";
import ShieldLogo from "./ShieldLogo";

interface PageHeaderProps {
  username: string;
  currentPage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

export default function PageHeader({
  username,
  currentPage,
  onNavigate,
  onLogout,
}: PageHeaderProps) {
  const navLinks: {
    label: string;
    page: string;
    icon?: React.ComponentType<{ className?: string }>;
    activePages?: string[];
  }[] = [
    { label: "Dashboard", page: "home" },
    {
      label: "Subjects",
      page: "subjects",
      activePages: ["subjects", "physics", "chemistry", "math"],
    },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
    { label: "Calendar", page: "calendar", icon: Calendar },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl border-b"
      style={{
        background: "rgba(255,255,255,0.88)",
        borderBottomColor: "rgba(79,70,229,0.1)",
        boxShadow: "0 2px 20px rgba(79,70,229,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => onNavigate("home")}
          aria-label="Go to home"
        >
          <div style={{ color: "#4f46e5" }}>
            <ShieldLogo size={32} />
          </div>
          <div className="text-left">
            <div
              className="font-bold text-sm leading-none tracking-wider font-display"
              style={{ color: "#4f46e5" }}
            >
              ACADEMIA
            </div>
            <div
              className="text-xs leading-none mt-0.5 tracking-widest font-medium"
              style={{ color: "#7c3aed" }}
            >
              STUDENT PORTAL
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav
          className="hidden md:flex items-center gap-1 ml-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.activePages
              ? link.activePages.includes(currentPage)
              : currentPage === link.page;
            return (
              <button
                type="button"
                key={link.page}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={() => onNavigate(link.page)}
                className="px-3 py-1.5 text-sm rounded-xl transition-all flex items-center gap-1.5 font-medium"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))",
                        color: "#4f46e5",
                        fontWeight: 700,
                        boxShadow: "inset 0 0 0 1px rgba(79,70,229,0.2)",
                      }
                    : { color: "#6b7280" }
                }
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Profile + Logout */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="nav.profile.link"
            onClick={() => onNavigate("profile")}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-sm font-medium"
            style={
              currentPage === "profile"
                ? {
                    background: "rgba(79,70,229,0.08)",
                    color: "#4f46e5",
                    fontWeight: 700,
                  }
                : { color: "#6b7280" }
            }
          >
            <User className="h-4 w-4" />
            <span>{username}</span>
          </button>
          <Button
            type="button"
            data-ocid="nav.logout.button"
            onClick={onLogout}
            size="sm"
            variant="outline"
            className="rounded-xl text-sm font-semibold"
            style={{
              borderColor: "rgba(79,70,229,0.2)",
              color: "#4f46e5",
              background: "rgba(79,70,229,0.04)",
            }}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className="md:hidden border-t"
        style={{ borderColor: "rgba(79,70,229,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5 overflow-x-auto">
          {[...navLinks, { label: "Profile", page: "profile" }].map((link) => {
            const isActive = (link as { activePages?: string[] }).activePages
              ? (link as { activePages?: string[] }).activePages!.includes(
                  currentPage,
                )
              : currentPage === link.page;
            return (
              <button
                type="button"
                key={link.page}
                data-ocid={`mobile.nav.${link.label.toLowerCase()}.link`}
                onClick={() => onNavigate(link.page)}
                className="px-3 py-1 text-xs whitespace-nowrap rounded-lg transition-all font-semibold"
                style={
                  isActive
                    ? { background: "rgba(79,70,229,0.1)", color: "#4f46e5" }
                    : { color: "#6b7280" }
                }
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
