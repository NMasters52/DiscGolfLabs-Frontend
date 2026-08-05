import type { LucideIcon } from "lucide-react";
import { FlaskConical, CalendarClock, BarChart3, Target } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

export const aboutMeta = {
  eyebrow: "About Disc Golf Labs",
  headingLead: "Improvement is our purpose,",
  headingAccent: "continuous progress is our mission.",
  intro:
    "Disc Golf Labs is a passion project built by Nicholas Masters — pro competitor, coach, and disc-golf obsessive since 2012. Disc Golf Labs will be starting with a 5 day putting course as it's first installment. With future and broader concepts being planned on for the future.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Founder                                                                   */
/* -------------------------------------------------------------------------- */

export interface Founder {
  name: string;
  initials: string;
  pdga: string;
  since: string;
  role: string;
  location: string;
  bio: string[];
}

export const founder: Founder = {
  name: "Nicholas Masters",
  initials: "NM",
  pdga: "#61176",
  since: "2012",
  role: "Founder · Coach · PDGA #61176",
  location: "Florida, USA",
  bio: [
    "Hi, I'm Nicholas Masters — PDGA #61176. Father, Husband, and Competitor. I've been playing disc golf since 2012, competing at the professional level, running clinics, and helping hundreds of players sharpen their game.",
    "Disc Golf Labs is a passion project that combines three things I love: disc golf, teaching, and technology. The putting course is the distillation of everything I've learned through years of competition and coaching.",
    "My goal is simple. Give you a clear roadmap to becoming a more confident, consistent putter, and the tools to keep improving on your own.",
  ],
};

export const founderQuote = {
  quote:
    "Most players don't need more practice. They need practice with real intent and direction.",
  attribution: founder.name,
};

/* -------------------------------------------------------------------------- */
/*  Stats                                                                     */
/* -------------------------------------------------------------------------- */

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "2012", label: "Playing since" },
  { value: "300+", label: "Players coached" },
  { value: "100s", label: "Clinics taught" },
  { value: "#61176", label: "PDGA number" },
];

/* -------------------------------------------------------------------------- */
/*  Method / the system                                                       */
/* -------------------------------------------------------------------------- */

export interface Method {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export const method: Method[] = [
  {
    id: "reinforcement",
    icon: FlaskConical,
    title: "Reinforcement Learning",
    body: "Learn in small doses, practice immediately, then let statistical feedback reinforce the practice.",
  },
  {
    id: "micro",
    icon: CalendarClock,
    title: "Micro Learning",
    body: "One focused lesson and one drill a day for five days. We break the tutorial-hell cycle on purpose.",
  },
  {
    id: "data",
    icon: BarChart3,
    title: "Data, not guesses",
    body: "The app tracks make % by distance and shows exactly where your game needs the most work.",
  },
  {
    id: "intent",
    icon: Target,
    title: "Practice with intent",
    body: "Putting is a muscle. Reps with purpose beat reps without — every single time.",
  },
];
