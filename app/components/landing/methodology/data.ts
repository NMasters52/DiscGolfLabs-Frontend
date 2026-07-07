import { Target, BarChart3, Brain, Zap, type LucideIcon } from "lucide-react";

export interface Pillar {
  id: string;
  index: string;
  code: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  practice: string;
  metricLabel: string;
  metricValue: string;
  tags: string[];
  highlights?: string[];
}

export const methodologyMeta = {
  eyebrow: "The Method",
  headingLead: "Method over",
  headingAccent: "magic.",
  intro:
    "Disc Golf Labs isn't a swing tip. It's a stress tested system that gives you the tools to diagnos your form, measures every rep, and prepares you for when the pressure is real.",
  documentId: "DGL-METHOD-V1",
} as const;

export const pillars: Pillar[] = [
  {
    id: "p01",
    index: "01",
    code: "FND-01",
    icon: Target,
    title: "Foundations",
    tagline: "Mechanics before miracles.",
    description:
      "We end the quick-fix cycle. Your putting stroke gets broken down to its fundamentals — grip, stance, weight transfer, release — and rebuilt deliberately. Each principle earns its own drill and its own progress tracker before you move on.",
    practice:
      "Isolate one mechanic per session. Measure it. Advance only when it's automatic.",
    metricLabel: "Form factors",
    metricValue: "06",
    tags: ["Stance", "Grip", "Release"],
    highlights: ["fundamentals", "deliberately", "progress tracker"],
  },
  {
    id: "p02",
    index: "02",
    code: "DAT-02",
    icon: BarChart3,
    title: "Data Feedback",
    tagline: "Progress you can see.",
    description:
      "Stop wondering if you're getting better. Interactive games and real-time data turn every session into a measurable outcome — make rate, distance zones, and streaks rendered in black and white.",
    practice: "Log every session. Trust the trend, not the single make.",
    metricLabel: "Data / session",
    metricValue: "40+",
    tags: ["Make %", "Distance", "Streak"],
    highlights: ["measurable outcome", "make rate", "streaks"],
  },
  {
    id: "p03",
    index: "03",
    code: "PRS-03",
    icon: Brain,
    title: "Tournament Translation",
    tagline: "Pressure is a skill.",
    description:
      "Form is useless if it collapses under pressure. Our drills simulate the mental load of a competitive round, training your mind to stay calm and your mechanics to stay fluid when the shot actually matters.",
    practice:
      "Train under simulated stakes. Raise your floor, not just your ceiling.",
    metricLabel: "Pressure drills",
    metricValue: "12",
    tags: ["Focus", "Tempo", "Nerves"],
    highlights: ["pressure", "competitive round", "stay fluid"],
  },
  {
    id: "p04",
    index: "04",
    code: "WHY-04",
    icon: Zap,
    title: "The “Why”",
    tagline: "Become your own coach.",
    description:
      "Stop depending on the temporary boost that fades days after a clinic. We teach self-diagnosable systems so you can recognize, fix, and adapt your own form — knowledge that becomes a tool for life, not a crutch that needs a coach beside you.",
    practice: "Diagnose the miss before you re-throw. Own the fix.",
    metricLabel: "Self-diagnosis",
    metricValue: "100%",
    tags: ["Diagnose", "Adapt", "Ownership"],
    highlights: ["self-diagnosable", "tool for life", "recognize, fix, and adapt"],
  },
];
