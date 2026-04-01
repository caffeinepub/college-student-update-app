export interface Teacher {
  id: number;
  name: string;
  subject: string;
  role: string;
  phone: string;
  email: string;
  experience: number;
  rating: number;
  bio: string;
}

const roles = [
  "Principal",
  "Associate Prof.",
  "Assistant Prof.",
  "Sr. Lecturer",
];

function seedRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function toEmailName(name: string): string {
  // Remove titles like Dr., Sh., Smt., Miss, etc.
  const cleaned = name.replace(/^(Dr\.|Sh\.|Smt\.|Miss|Mr\.)\s*/i, "").trim();
  const parts = cleaned.toLowerCase().split(/\s+/);
  return `${parts[0]}.${parts[parts.length - 1]}`;
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Dr\.|Sh\.|Smt\.|Miss|Mr\.)\s*/i, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const rawTeachers: { name: string; subject: string; roleSeed: number }[] = [
  { name: "Dr. Sumitra Meena", subject: "Principal", roleSeed: 0 },
  { name: "Sh. Chandra Shekhar Meena", subject: "Chemistry", roleSeed: 1 },
  { name: "Sh. Rakesh Kumar Dubey", subject: "Chemistry", roleSeed: 2 },
  { name: "Smt. Urmila Meena", subject: "Chemistry", roleSeed: 3 },
  { name: "Sh. Vijendra Kumar Meena", subject: "Chemistry", roleSeed: 4 },
  { name: "Sh. Pradhan Singh Meena", subject: "Mathematics", roleSeed: 5 },
  { name: "Sh. Mahendra Kumar Meena", subject: "Botany", roleSeed: 6 },
  { name: "Dr. Sunil Kumar Meena", subject: "Zoology", roleSeed: 7 },
  { name: "Smt. Shalu Kanwat", subject: "Zoology", roleSeed: 8 },
  { name: "Sh. Kallan Singh Meena", subject: "Political Science", roleSeed: 9 },
  { name: "Sh. Dharmveer Meena", subject: "Political Science", roleSeed: 10 },
  { name: "Dr. Rohit Kumar Meena", subject: "Political Science", roleSeed: 11 },
  {
    name: "Dr. Satish Kumar Meena",
    subject: "Political Science",
    roleSeed: 12,
  },
  {
    name: "Sh. Mahendra Kumar Sharma",
    subject: "Political Science",
    roleSeed: 13,
  },
  { name: "Sh. Gangaram Meena", subject: "Hindi Literature", roleSeed: 14 },
  { name: "Sh. Dinesh Kumar Meena", subject: "Hindi Literature", roleSeed: 15 },
  { name: "Dr. Arvind Kumar Dixit", subject: "Hindi Literature", roleSeed: 16 },
  { name: "Dr. Ashok Kumar Sharma", subject: "Hindi Literature", roleSeed: 17 },
  { name: "Sh. Dharmraj Meena", subject: "History", roleSeed: 18 },
  { name: "Dr. Pinky Meena", subject: "History", roleSeed: 19 },
  { name: "Sh. Ramkesh Meena", subject: "Sanskrit", roleSeed: 20 },
  { name: "Sh. Suresh Chand Meena", subject: "Sanskrit", roleSeed: 21 },
  { name: "Dr. Gunjan Garg", subject: "Sanskrit", roleSeed: 22 },
  { name: "Dr. Mahendra Kumar Meena", subject: "Sanskrit", roleSeed: 23 },
  { name: "Miss Abha Agarwal", subject: "Economics", roleSeed: 24 },
  { name: "Sh. Kailash Bairwa", subject: "Sociology", roleSeed: 25 },
  { name: "Miss Pinky Meena", subject: "English Literature", roleSeed: 26 },
  { name: "Smt. Premlata Meena", subject: "English Literature", roleSeed: 27 },
  { name: "Sh. Ramnaresh Meena", subject: "Physics", roleSeed: 28 },
  { name: "Sh. Chetan Prakash Meena", subject: "Physics", roleSeed: 29 },
  { name: "Sh. Tejram Meena", subject: "ABST", roleSeed: 30 },
  { name: "Sh. Mahender Singh Meena", subject: "ABST", roleSeed: 31 },
  { name: "Sh. Ramesh Chand Sharma", subject: "ABST", roleSeed: 32 },
  { name: "Sh. Raju Lal Meena", subject: "Physical Education", roleSeed: 33 },
];

const phonePrefixes = ["9358", "9876", "9414", "8890", "7014", "9928", "8003"];

const bios: Record<string, string> = {
  Principal:
    "Leading Government College Gangapur City with vision and dedication.",
  Chemistry:
    "Passionate educator making chemistry accessible and exciting for every student.",
  Mathematics:
    "Inspiring mathematical thinking through innovative problem-solving approaches.",
  Botany: "Dedicated to exploring the wonders of plant biology with students.",
  Zoology:
    "Bringing the animal kingdom to life through engaging classroom experiences.",
  "Political Science":
    "Nurturing civic awareness and analytical thinking in young minds.",
  "Hindi Literature":
    "Celebrating the richness of Hindi literary tradition with every lecture.",
  History:
    "Connecting students with the past to understand the present better.",
  Sanskrit:
    "Preserving and teaching the ancient wisdom embedded in Sanskrit texts.",
  Economics:
    "Making economic principles relevant to everyday life and career choices.",
  Sociology:
    "Exploring society, culture and human behavior through academic inquiry.",
  "English Literature":
    "Fostering love for English literature and language in every student.",
  Physics:
    "Unraveling the mysteries of the physical world through practical experiments.",
  ABST: "Teaching business studies and accounting with a focus on real-world applications.",
  "Physical Education":
    "Promoting fitness, sports, and healthy habits across the campus.",
};

export const teachers: Teacher[] = rawTeachers.map((t, idx) => {
  const rng = seedRng(idx * 137 + 42);
  const r1 = rng();
  const r2 = rng();
  const r3 = rng();
  const r4 = rng();

  const roleIndex =
    t.subject === "Principal"
      ? 0
      : t.name.startsWith("Dr.")
        ? 1
        : Math.floor(r1 * 3) + 1; // 1, 2, or 3

  const experience = 3 + Math.floor(r2 * 13); // 3–15
  const rating = Math.round((4.0 + r3 * 1.0) * 10) / 10; // 4.0–5.0
  const phoneIdx = Math.floor(r4 * phonePrefixes.length);
  const phoneSuffix = String(Math.floor(rng() * 900000) + 100000);
  const phone = `+91 ${phonePrefixes[phoneIdx]}${phoneSuffix}`;

  return {
    id: idx + 1,
    name: t.name,
    subject: t.subject,
    role: roles[roleIndex],
    phone,
    email: `${toEmailName(t.name)}@gcgc.edu.in`,
    experience,
    rating,
    bio: bios[t.subject] ?? "Dedicated educator committed to student success.",
  };
});

export function getInitialsForTeacher(name: string): string {
  return getInitials(name);
}

export const ALL_SUBJECTS = [
  "All",
  "Chemistry",
  "Mathematics",
  "Political Science",
  "Hindi Literature",
  "History",
  "Sanskrit",
  "Physics",
  "ABST",
  "Zoology",
  "Botany",
  "Economics",
  "Sociology",
  "English Literature",
  "Physical Education",
];

export const SUBJECT_GRADIENTS: Record<string, string> = {
  Principal: "from-yellow-400 to-amber-500",
  Chemistry: "from-emerald-400 to-teal-500",
  Mathematics: "from-blue-400 to-indigo-500",
  Botany: "from-green-400 to-lime-500",
  Zoology: "from-orange-400 to-red-500",
  "Political Science": "from-violet-400 to-purple-500",
  "Hindi Literature": "from-pink-400 to-rose-500",
  History: "from-amber-400 to-orange-500",
  Sanskrit: "from-cyan-400 to-sky-500",
  Economics: "from-lime-400 to-green-500",
  Sociology: "from-fuchsia-400 to-pink-500",
  "English Literature": "from-sky-400 to-blue-500",
  Physics: "from-indigo-400 to-blue-600",
  ABST: "from-teal-400 to-cyan-600",
  "Physical Education": "from-red-400 to-orange-500",
};

export const SUBJECT_BADGE_COLORS: Record<string, string> = {
  Principal:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Chemistry:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Mathematics:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Botany:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Zoology:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Political Science":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "Hindi Literature":
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  History:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Sanskrit: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Economics: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  Sociology:
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "English Literature":
    "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  Physics:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  ABST: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "Physical Education":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};
