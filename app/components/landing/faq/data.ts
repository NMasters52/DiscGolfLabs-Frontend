export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqMeta = {
  eyebrow: "Questions, answered",
  headingLead: "Before you ask it",
  headingAccent: "— we've got you",
  intro:
    "The honest answers to what players ask before they start the course. No hype, no fine print — just how Disc Golf Labs works, who it's for, and what you'll need to show up.",
} as const;

export const faqItems: FaqItem[] = [
  {
    id: "faq-01",
    question:
      "I've watched tons of putting tutorials and never improved — why is this different?",
    answer:
      "That cycle has a name: tutorial hell. You watch, nod along, and nothing sticks. This course breaks the loop with micro-learning — one short lesson, one drill, one day at a time — then backs it up with statistical feedback from the putting game so you can actually see what changed. You learn it, you do it, you measure it. That repetition is what turns a video into a habit.",
  },
  {
    id: "faq-02",
    question: "Spin, push, or hybrid — which putting style is this for?",
    answer:
      "All of them. The course isn't built around one style; it teaches the three foundations every putt shares — Lever, Spin, and Power. Whether you spin, push, or run a spin-push hybrid, those truths hold. You'll use them to build a stroke that's yours, not a copy of mine.",
  },
  {
    id: "faq-03",
    question: "I make everything in the backyard but fall apart in tournaments.",
    answer:
      "That gap is the most common thing I hear, and it's exactly what Day 4 fixes. We build a pre-shot routine — a repeatable sequence that puts your backyard in your pocket so the basket looks the same whether you're practicing or keeping score. Pressure stops being a surprise and becomes just another rep.",
  },
  {
    id: "faq-04",
    question: "What does the putting game actually track?",
    answer:
      "Your make percentage by distance zone. After every round you can see exactly where you're lights-out and where you're leaking strokes, so you spend your reps where they count instead of parking at 15 feet. Pair it with the \"Rule of 2\" — pick two mental cues per session and drill them on every putt — and your practice finally has intent.",
  },
  {
    id: "faq-05",
    question: "Is this for beginners or advanced players?",
    answer:
      "It's aimed at the intermediate player who's plateaued — the one who's put in reps but stopped getting better. That said, the fundamentals are the fundamentals. If you're brand new you'll skip the bad habits before they start, and if you're seasoned you'll get a clear system to self-diagnose. Everyone leaves with the same three foundations.",
  },
  {
    id: "faq-06",
    question: "What do I need to take the course?",
    answer:
      "Not much: 3–5 putters so you can run real sets, a basket or target to throw at, and your phone to run the putting game. About five days, one lesson and one drill at a time. No special equipment, no gym — just enough to get meaningful reps in.",
  },
  {
    id: "faq-07",
    question: "How much time per day?",
    answer:
      "A short lesson plus one focused drill — the putting game itself only takes a few minutes to run a set. Daily reps beat marathon sessions every time; putting is a muscle, and it grows through frequency, not exhaustion. Show up briefly each day and the gains compound.",
  },
  {
    id: "faq-08",
    question: "I don't have a basket yet. Can I still start?",
    answer:
      "Yes — Day 5's pole drill is built for exactly this. You can train your release and the \"give the basket a handshake\" finish with nothing but a pole, a broomstick, or a stick in the ground. It's a great way to groove the loaded position before you ever own a basket.",
  },
  {
    id: "faq-09",
    question: "Do I lose access after the 5 days?",
    answer:
      "No — once you're in, the lessons stay yours. The five days are how the course is paced, not a countdown to take it away. You can revisit any lesson, rerun the drills, and keep using the putting game to track your reps long after Day 5.",
  },
  {
    id: "faq-10",
    question: "Who is Nicholas, and why trust him?",
    answer:
      "I'm Nicholas Masters, PDGA #61176, and I've been playing and competing since 2012. I built Disc Golf Labs from the same clinics and coaching I've run for years, distilled into a system that actually sticks. The course is everything I wish I'd had when I was stuck — no fluff, just the work that moves your make-rate.",
  },
];
