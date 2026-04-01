import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const cards = [
  {
    title: "AI Tutor",
    desc: "Upload PDF and get instant smart explanations.",
    icon: "🤖",
    gradient: "from-cyan-400/30 to-indigo-500/30",
    ocid: "landing.feature.card.1",
  },
  {
    title: "PYQ Predictor",
    desc: "Expected questions from previous year trends.",
    icon: "🎯",
    gradient: "from-purple-400/30 to-pink-500/30",
    ocid: "landing.feature.card.2",
  },
  {
    title: "CGPA Tracker",
    desc: "Track semester goals with beautiful analytics.",
    icon: "📊",
    gradient: "from-emerald-400/30 to-cyan-500/30",
    ocid: "landing.feature.card.3",
  },
  {
    title: "Placement Hub",
    desc: "Internships, resume, and interview prep in one place.",
    icon: "🚀",
    gradient: "from-amber-400/30 to-orange-500/30",
    ocid: "landing.feature.card.4",
  },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-cyan-500/10 to-purple-600/20 blur-3xl pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div
        className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Skip to login link */}
      <div className="relative z-10 flex justify-end px-6 pt-5">
        <button
          type="button"
          data-ocid="landing.login.link"
          onClick={onGetStarted}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200"
        >
          Skip to Login
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <section className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-cyan-300 font-medium tracking-widest uppercase backdrop-blur-sm">
            Government College Gangapur City
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent leading-tight pb-2">
            EduConnect AI Campus
          </h1>
          <p className="mt-5 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A futuristic student super app for BSc, BA and BCom learners —
            powered by AI, built for excellence.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, rotateX: 20, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 4 }}
              data-ocid={card.ocid}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl cursor-default"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {card.title}
              </h3>
              <p className="text-slate-300 text-sm leading-6">{card.desc}</p>
              <div
                className={`mt-5 h-20 rounded-2xl bg-gradient-to-br ${card.gradient}`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          className="mt-20 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              3D Animated{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Dashboard Experience
              </span>
            </h2>
            <p className="text-slate-300 text-lg leading-8">
              Designed for viral growth with floating cards, glassmorphism UI,
              smooth depth effects, premium gradients, and app-store quality
              animations.
            </p>
            <motion.button
              type="button"
              data-ocid="landing.get_started.primary_button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-semibold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow duration-300"
            >
              Launch Student Dashboard →
            </motion.button>
          </div>

          {/* Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, rotateY: -20 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(-8deg) rotateX(4deg)",
            }}
          >
            <div className="rounded-3xl bg-slate-900 p-5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-slate-500 ml-2">
                  EduConnect Dashboard
                </span>
              </div>
              <div className="h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-2xl bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-300">8.4</div>
                    <div className="text-xs text-slate-400">CGPA</div>
                  </div>
                </div>
                <div className="h-24 rounded-2xl bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-300">6</div>
                    <div className="text-xs text-slate-400">Subjects</div>
                  </div>
                </div>
              </div>
              <div className="h-20 rounded-2xl bg-white/10 flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 rounded-full bg-white/20 w-3/4" />
                  <div className="h-2 rounded-full bg-white/10 w-1/2" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </section>
    </div>
  );
}
