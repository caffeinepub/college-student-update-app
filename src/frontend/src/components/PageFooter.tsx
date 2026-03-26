import ShieldLogo from "./ShieldLogo";

type FooterPage = "about" | "contact";

interface PageFooterProps {
  onNavigate?: (page: FooterPage) => void;
}

export default function PageFooter({ onNavigate }: PageFooterProps) {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldLogo size={28} />
          <span className="font-bold tracking-widest text-sm">
            ACADEMIA UNIVERSITY
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs opacity-70">
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate("about")}
                className="hover:opacity-100 transition-opacity"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="hover:opacity-100 transition-opacity"
              >
                Contact
              </button>
            </>
          )}
          <span>Privacy</span>
          <span>Support</span>
        </div>
        <div className="text-xs opacity-50 text-center">
          &copy; {year} Academia University. Built with ♥ using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-100"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
