import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ShieldLogo from "./ShieldLogo";

type Page = "home" | "physics" | "chemistry" | "math" | "about" | "contact";

interface PageHeaderProps {
  username: string;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export default function PageHeader({
  username,
  currentPage,
  onNavigate,
  onLogout,
}: PageHeaderProps) {
  const navLinks: { label: string; page: Page }[] = [
    { label: "Dashboard", page: "home" },
    { label: "Subjects", page: "physics" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => onNavigate("home")}
          aria-label="Go to home"
        >
          <ShieldLogo size={32} />
          <div className="text-left">
            <div className="font-bold text-base leading-none">ACADEMIA</div>
            <div className="text-xs opacity-70 leading-none mt-0.5">
              STUDENT PORTAL
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav
          className="hidden md:flex items-center gap-1 ml-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              onClick={() => onNavigate(link.page)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPage === link.page
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10 opacity-80"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs opacity-60">Signed in as</div>
            <div className="text-sm font-semibold">{username}</div>
          </div>
          <Button
            type="button"
            data-ocid="nav.logout.button"
            onClick={onLogout}
            size="sm"
            className="bg-white/15 hover:bg-white/25 text-primary-foreground border border-white/30 rounded-full"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5 overflow-x-auto">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              data-ocid={`mobile.nav.${link.label.toLowerCase()}.link`}
              onClick={() => onNavigate(link.page)}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded transition-colors ${
                currentPage === link.page
                  ? "bg-white/20 font-semibold"
                  : "opacity-70"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
