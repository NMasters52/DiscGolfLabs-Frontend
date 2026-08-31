import {
  Infinity as InfinityIcon,
  Globe,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Static marketing tiers (first draft). Wire the course tier to Stripe
// (app/routes/checkout/) later.

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceSuffix?: string;
  cadence: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  featured?: boolean;
  badge?: string;
}

export const pricingMeta = {
  eyebrow: "Access",
  headingLead: "Pick your",
  headingAccent: "access level.",
  intro:
    "One course, one decision. Start with the 5-day putting course, or go lifetime and ride every lesson and update I build from here on out.",
} as const;

export const tiers: PricingTier[] = [
  {
    id: "course",
    name: "Putting Course",
    price: "$49",
    cadence: "one-time",
    description:
      "The full 5-day course that builds your putting game one rep at a time. Yours to keep.",
    features: [
      "The full 5-day course — one lesson + a drill each day",
      "The putting game with make-% tracking by distance",
      "The Rule of 2 framework for every round",
      "Day-4 pre-shot routine builder",
      "Lifetime access to these lessons",
    ],
    ctaLabel: "Get the course",
    ctaTo: "/",
  },
  {
    id: "lifetime",
    name: "Lifetime Membership",
    price: "$199",
    cadence: "one-time",
    description:
      "Everything in the course, plus every lesson and feature I build from here on out.",
    features: [
      "Everything in the Putting Course",
      "All future courses & lessons — included",
      "New drills and games, first",
      "Members-only features",
    ],
    ctaLabel: "Go lifetime",
    ctaTo: "/",
    featured: true,
    badge: "Best value",
  },
];

export interface Reassurance {
  icon: LucideIcon;
  label: string;
}

export const reassurances: Reassurance[] = [
  { icon: InfinityIcon, label: "Lifetime access" },
  { icon: Globe, label: "Practice anywhere" },
  { icon: Clock, label: "Self-paced" },
  { icon: Sparkles, label: "Fights tutorial hell" },
];
