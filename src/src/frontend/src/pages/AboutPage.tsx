import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Globe,
  GraduationCap,
  Headphones,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  Share2,
  Shield,
  Star,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiInstagram, SiLinkedin } from "react-icons/si";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";

type NavigatePage =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact";

interface AboutPageProps {
  username: string;
  onNavigate: (page: NavigatePage) => void;
  onLogout: () => void;
}

const glassCard = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "16px",
};

const contactRows = [
  {
    icon: Mail,
    label: "vikasjangid336@gmail.com",
    sub: "Tap to email",
    href: "mailto:vikasjangid336@gmail.com" as string | null,
  },
  {
    icon: Phone,
    label: "+91 9358498573",
    sub: "Tap to call",
    href: "tel:+919358498573" as string | null,
  },
  {
    icon: Clock,
    label: "Mon\u2013Sat, 9 AM \u2013 5 PM",
    sub: "Working hours",
    href: null as string | null,
  },
];

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Go to Login page and click 'Forgot Password' to reset via email.",
  },
  {
    q: "How do I view my exam schedule?",
    a: "Visit the Subjects section \u2014 each card shows exam and practical dates.",
  },
  {
    q: "Can I download assignment PDFs?",
    a: "Yes! Click 'View PDF' on any subject card to open the PDF.",
  },
  {
    q: "How do I update my profile?",
    a: "Go to Profile section and tap the edit icon to update your details.",
  },
];

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      style={glassCard}
      className="p-5 mb-4"
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1, #06b6d4)",
          borderRadius: "8px",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color="white" />
      </div>
      <h2 className="text-white font-bold text-base">{title}</h2>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  sub,
  href,
}: {
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  label: string;
  sub: string;
  href: string | null;
}) {
  const content = (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{
        background: "rgba(255,255,255,0.05)",
        cursor: href ? "pointer" : "default",
      }}
    >
      <div
        style={{
          background: "rgba(99,102,241,0.2)",
          borderRadius: "10px",
          padding: 8,
          flexShrink: 0,
        }}
      >
        <Icon size={16} color="#a5b4fc" />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "white" }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
          {sub}
        </p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block hover:scale-[1.02] transition-transform"
        data-ocid={`contact.${href.startsWith("mailto") ? "email" : "phone"}.button`}
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

export default function AboutPage({
  username,
  onNavigate,
  onLogout,
}: AboutPageProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "EduConnect",
        text: "Smart Campus, Smart Students",
        url: "https://educonnect.app",
      });
    } else {
      window.alert("Share this link: https://educonnect.app");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        minHeight: "100vh",
      }}
    >
      <PageHeader
        username={username}
        currentPage="about"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Back button */}
        <motion.button
          type="button"
          data-ocid="about.back.button"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 mb-5 text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </motion.button>

        {/* 1. App Identity */}
        <Section delay={0}>
          <div className="flex flex-col items-center text-center py-2">
            <motion.div
              animate={{ rotateY: [0, 10, -10, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                borderRadius: "20px",
                width: 72,
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                boxShadow: "0 0 24px rgba(99,102,241,0.5)",
              }}
            >
              <GraduationCap size={36} color="white" />
            </motion.div>
            <h1 className="text-white font-bold" style={{ fontSize: 28 }}>
              EduConnect
            </h1>
            <p
              className="italic mt-1"
              style={{ color: "#06b6d4", fontSize: 15 }}
            >
              "Smart Campus, Smart Students"
            </p>
            <span
              className="mt-3 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "rgba(99,102,241,0.25)",
                color: "#a5b4fc",
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              v1.0.0
            </span>
          </div>
        </Section>

        {/* 2. About App */}
        <Section delay={0.08}>
          <SectionTitle icon={Info} title="About EduConnect" />
          <div className="space-y-3">
            {[
              "Smart college app for modern students",
              "Helps manage academic details in one place",
              "Connects students, teachers, and resources",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3">
                <div
                  style={{
                    background: "rgba(6,182,212,0.2)",
                    borderRadius: "50%",
                    padding: 4,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <Check size={12} color="#06b6d4" />
                </div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Mission */}
        <Section delay={0.16}>
          <SectionTitle icon={Target} title="Our Mission" />
          <div className="space-y-3">
            {[
              {
                icon: "\ud83d\ude80",
                text: "Make student life easy and digital",
              },
              {
                icon: "\ud83d\udcac",
                text: "Improve communication in college",
              },
              { icon: "\ud83d\udcda", text: "Provide smart learning tools" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Contact & Support */}
        <Section delay={0.24}>
          <SectionTitle icon={Headphones} title="Contact & Support" />
          <div className="space-y-3">
            {contactRows.map((row) => (
              <ContactRow key={row.label} {...row} />
            ))}
          </div>
        </Section>

        {/* 5. Help Options */}
        <Section delay={0.32}>
          <SectionTitle icon={HelpCircle} title="Help & Feedback" />
          <div className="space-y-3">
            {[
              {
                emoji: "\ud83d\udee0",
                label: "Report a Problem",
                color: "#f97316",
                bg: "rgba(249,115,22,0.15)",
                border: "rgba(249,115,22,0.3)",
                msg: "Thank you! We'll review your report.",
                ocid: "help.report.button",
              },
              {
                emoji: "\ud83d\udca1",
                label: "Send Feedback",
                color: "#a5b4fc",
                bg: "rgba(99,102,241,0.15)",
                border: "rgba(99,102,241,0.3)",
                msg: "Thanks for your feedback! We appreciate it.",
                ocid: "help.feedback.button",
              },
              {
                emoji: "\u2753",
                label: "Ask for Help",
                color: "#06b6d4",
                bg: "rgba(6,182,212,0.15)",
                border: "rgba(6,182,212,0.3)",
                msg: "We'll connect you with support shortly!",
                ocid: "help.ask.button",
              },
            ].map((item) => (
              <motion.button
                type="button"
                key={item.label}
                data-ocid={item.ocid}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.alert(item.msg)}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </Section>

        {/* 6. Social Links */}
        <Section delay={0.4}>
          <SectionTitle icon={Globe} title="Follow Us" />
          <div className="flex flex-wrap gap-3">
            <motion.a
              data-ocid="social.website.link"
              href="https://gcgangapurcity.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              <Globe size={14} />
              Website
            </motion.a>
            <motion.a
              data-ocid="social.instagram.link"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(217,70,239,0.15)",
                border: "1px solid rgba(217,70,239,0.3)",
                color: "#e879f9",
              }}
            >
              <SiInstagram size={14} />
              Instagram
            </motion.a>
            <motion.a
              data-ocid="social.linkedin.link"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(6,182,212,0.15)",
                border: "1px solid rgba(6,182,212,0.3)",
                color: "#06b6d4",
              }}
            >
              <SiLinkedin size={14} />
              LinkedIn
            </motion.a>
          </div>
        </Section>

        {/* 7. Location */}
        <Section delay={0.48}>
          <SectionTitle icon={MapPin} title="Our Location" />
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Government College Gangapur City, Sawai Madhopur, Rajasthan 322201
          </p>
          <motion.a
            data-ocid="location.maps.button"
            href="https://www.google.com/maps/search/Government+College+Gangapur+City"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
            }}
          >
            <MapPin size={14} />
            Open in Google Maps
          </motion.a>
        </Section>

        {/* 8. Developer Info */}
        <Section delay={0.56}>
          <SectionTitle icon={Code2} title="Developer" />
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center text-white font-bold text-lg rounded-full"
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                boxShadow: "0 0 16px rgba(99,102,241,0.4)",
              }}
            >
              VJ
            </div>
            <div>
              <p className="text-white font-bold">Vikas Jangid</p>
              <p
                className="text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Full Stack Developer
              </p>
              <a
                data-ocid="developer.email.button"
                href="mailto:vikasjangid336@gmail.com"
                className="text-xs"
                style={{ color: "#06b6d4" }}
              >
                vikasjangid336@gmail.com
              </a>
            </div>
          </div>
        </Section>

        {/* 9. FAQ Accordion */}
        <Section delay={0.64}>
          <SectionTitle icon={HelpCircle} title="Frequently Asked Questions" />
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <button
                  type="button"
                  data-ocid="faq.item.1"
                  onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "white" }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === faq.q ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, marginLeft: 8 }}
                  >
                    <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === faq.q && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="px-4 pb-4 text-sm"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Section>

        {/* 10. Legal */}
        <Section delay={0.72}>
          <SectionTitle icon={Shield} title="Legal" />
          <div className="space-y-2">
            {[
              {
                label: "Privacy Policy",
                msg: "Privacy Policy: Your data is stored securely and never shared with third parties.",
                ocid: "legal.privacy.button",
              },
              {
                label: "Terms & Conditions",
                msg: "Terms & Conditions: By using EduConnect, you agree to our academic usage policies.",
                ocid: "legal.terms.button",
              },
            ].map((item) => (
              <button
                type="button"
                key={item.label}
                data-ocid={item.ocid}
                onClick={() => window.alert(item.msg)}
                className="w-full flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {item.label}
                </span>
                <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
              </button>
            ))}
          </div>
        </Section>

        {/* 11. Rate & Share */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 mb-4"
        >
          <motion.button
            type="button"
            data-ocid="rate.app.button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              window.alert(
                "Thank you for rating! 5 stars helps us grow \ud83c\udf1f",
              )
            }
            className="flex flex-col items-center justify-center p-5 rounded-2xl text-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Star size={24} color="#fbbf24" fill="#fbbf24" className="mb-2" />
            <p className="text-white text-sm font-semibold">Rate EduConnect</p>
            <p className="text-xs mt-1" style={{ color: "#fbbf24" }}>
              \u2b50\u2b50\u2b50\u2b50\u2b50
            </p>
          </motion.button>
          <motion.button
            type="button"
            data-ocid="share.app.button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-5 rounded-2xl text-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Share2 size={24} color="#06b6d4" className="mb-2" />
            <p className="text-white text-sm font-semibold">
              Share with Friends
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Spread the word
            </p>
          </motion.button>
        </motion.div>

        {/* 12. Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center py-6 pb-2"
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Made with \u2764\ufe0f by{" "}
            <span style={{ color: "#a5b4fc" }}>Vikas Jangid</span>
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            EduConnect v1.0.0 \u00b7 2026
          </p>
          <button
            type="button"
            data-ocid="about.back.link"
            onClick={() => onNavigate("home")}
            className="mt-3 text-xs"
            style={{ color: "#06b6d4" }}
          >
            \u2190 Back to Dashboard
          </button>
        </motion.div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
