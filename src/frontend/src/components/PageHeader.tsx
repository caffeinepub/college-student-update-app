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
    <header className="bg-card/80 backdrop-blur-xl border-b border-border/40 shadow-glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => onNavigate("home")}
          aria-label="Go to home"
        >
          <div className="text-primary">
            <ShieldLogo size={32} />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm leading-none text-foreground tracking-wider">
              ACADEMIA
            </div>
            <div className="text-xs text-muted-foreground leading-none mt-0.5 tracking-widest">
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
                className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile + Logout */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="nav.profile.link"
            onClick={() => onNavigate("profile")}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
              currentPage === "profile"
                ? "bg-primary/20 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="font-medium">{username}</span>
          </button>
          <Button
            type="button"
            data-ocid="nav.logout.button"
            onClick={onLogout}
            size="sm"
            variant="outline"
            className="border-border/40 text-muted-foreground hover:text-foreground hover:bg-white/8 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = link.activePages
              ? link.activePages.includes(currentPage)
              : currentPage === link.page;
            return (
              <button
                type="button"
                key={link.page}
                data-ocid={`mobile.nav.${link.label.toLowerCase()}.link`}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <button
            type="button"
            data-ocid="mobile.nav.profile.link"
            onClick={() => onNavigate("profile")}
            className={`px-3 py-1 text-xs whitespace-nowrap rounded-lg transition-all ${
              currentPage === "profile"
                ? "bg-primary/20 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
        </div>
      </div>
    </header>
  );
}
