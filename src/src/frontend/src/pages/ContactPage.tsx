import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";

type NavigatePage =
  | "home"
  | "physics"
  | "chemistry"
  | "math"
  | "about"
  | "contact";

interface ContactPageProps {
  username: string;
  onNavigate: (page: NavigatePage) => void;
  onLogout: () => void;
}

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "vikasjangid336@gmail.com",
    sub: "We respond within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "9358498573",
    sub: "Mon\u2013Fri, 9 AM \u2013 5 PM",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 University Ave, Academic City",
    sub: "Main Campus, Building A",
  },
];

export default function ContactPage({
  username,
  onNavigate,
  onLogout,
}: ContactPageProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 264)" }}
    >
      <PageHeader
        username={username}
        currentPage="contact"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        <Button
          data-ocid="contact.back.button"
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => onNavigate("home")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
            Get in Touch
          </p>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-sm opacity-75">
            Have a question or need assistance? Reach out to the academic
            office.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="font-semibold text-foreground">{c.value}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-xs"
          >
            {sent ? (
              <div
                data-ocid="contact.success_state"
                className="flex flex-col items-center justify-center h-full py-8 text-center"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <h3 className="font-bold text-lg text-foreground">
                  Message Sent!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  className="mt-4 bg-primary text-primary-foreground"
                  size="sm"
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div data-ocid="contact.form" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        data-ocid="contact.name.input"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Email
                      </Label>
                      <Input
                        data-ocid="contact.email.input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Subject
                    </Label>
                    <Input
                      data-ocid="contact.subject.input"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, subject: e.target.value }))
                      }
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Message
                    </Label>
                    <Textarea
                      data-ocid="contact.message.textarea"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Write your message here..."
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <Button
                  data-ocid="contact.submit_button"
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary text-primary-foreground"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <PageFooter onNavigate={onNavigate} />
    </div>
  );
}
