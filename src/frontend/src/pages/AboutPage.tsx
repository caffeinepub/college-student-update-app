import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BookOpen, Globe, Users } from "lucide-react";
import { motion } from "motion/react";
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

const stats = [
  { icon: Users, label: "Students Enrolled", value: "12,400+" },
  { icon: BookOpen, label: "Academic Programmes", value: "85+" },
  { icon: Award, label: "Years of Excellence", value: "62" },
  { icon: Globe, label: "International Partnerships", value: "48" },
];

const highlights = [
  {
    title: "Our Mission",
    text: "To provide world-class education that empowers students with knowledge, skills, and values to lead and serve in a rapidly changing world.",
  },
  {
    title: "Our Vision",
    text: "To be a globally recognised institution of academic excellence, innovation, and inclusive learning by 2030.",
  },
  {
    title: "Our Values",
    text: "Integrity, Excellence, Collaboration, Innovation, and Respect for Diversity form the foundation of everything we do at Academia University.",
  },
];

export default function AboutPage({
  username,
  onNavigate,
  onLogout,
}: AboutPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <PageHeader
        username={username}
        currentPage="about"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <Button
          data-ocid="about.back.button"
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate("home")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
            About Us
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Academia University
          </h1>
          <p className="mt-3 text-sm opacity-75 max-w-2xl">
            Established in 1963, Academia University has grown into one of the
            region's most respected institutions of higher education, fostering
            critical thinking, research, and community engagement.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-xl p-4 text-center shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              data-ocid={`about.highlight.${i + 1}`}
              className="bg-card border border-border rounded-xl p-5 shadow-xs"
            >
              <h3 className="font-bold text-sm text-foreground mb-2">
                {h.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {h.text}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
