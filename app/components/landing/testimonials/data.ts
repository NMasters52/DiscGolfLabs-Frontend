// SAMPLE placeholders — replace with real testimonials before launch.
// Every entry below is a stand-in quote. The product is pre-launch; these exist
// so the page has shape and voice. Swap them out as soon as real students
// start dropping putts and sending in words.

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  meta: string;
  rating: number;
  tag?: string;
  /** Marks this as a placeholder so it's easy to grep out before launch. */
  sample: true;
  /** Optionally flag the strongest quote to render as the featured card. */
  featured?: boolean;
}

export const testimonialsMeta = {
  eyebrow: "Straight from the practice green",
  headingLead: "Putts that actually",
  headingAccent: "made it to the course",
  intro:
    "Real words from real players — well, almost. These are sample quotes standing in for the real thing while the course is still pre-launch. We'll swap every one of them out the moment our first cohort starts stringing putts together.",
} as const;

export const testimonials: Testimonial[] = [
  {
    id: "t00",
    quote:
      "I was always the guy who putted great in the backyard and then melted the second a cardmate pulled out a phone. The loaded position work finally gave me a stroke that travels. First tournament out, I shot the cleanest putting round of my life — and it was all on camera. I stopped begging the basket and started giving it a handshake.",
    name: "Marcus Reyes",
    meta: "PDGA #12345 · Austin, TX",
    rating: 5,
    tag: "Tournament tested",
    sample: true,
    featured: true,
  },
  {
    id: "t01",
    quote:
      "I used to three-putt my way through league night. After the five days, I strung together six in a row from 25 feet and my cardmates thought I'd switched putters. Same putter — just fewer variables.",
    name: "Dani Brooks",
    meta: "Recreational · MA3",
    rating: 5,
    tag: "League night",
    sample: true,
  },
  {
    id: "t02",
    quote:
      "The Rule of 2 killed my overthinking. Two cues, one rep at a time. I stopped tinkering between rounds and my make-rate from 20 feet finally stopped bouncing around week to week.",
    name: "Tyler Okonkwo",
    meta: "Intermediate · MA2",
    rating: 5,
    tag: "Rule of 2",
    sample: true,
  },
  {
    id: "t03",
    quote:
      "Genuinely addicted to the putting game now. I log a quick session most mornings before work — chasing my make-% by distance is weirdly fun, and league card is way less stressful because of it.",
    name: "Priya Nair",
    meta: "Recreational · MA4",
    rating: 5,
    tag: "Putting game",
    sample: true,
  },
  {
    id: "t04",
    quote:
      "Aim small, miss small finally clicked for me. I'm leaving putts close instead of blowin' by the basket, and my scramble putts feel like actual putts instead of prayers.",
    name: "Sam Whitaker",
    meta: "PDGA #09876 · Denver, CO",
    rating: 5,
    tag: "Scramble",
    sample: true,
  },
  {
    id: "t05",
    quote:
      "I was deep in tutorial hell — watched every putting video on the internet and somehow got worse. One short lesson plus one drill a day actually stuck. The structure is the whole magic.",
    name: "Jordan Lee",
    meta: "Recreational · MA3",
    rating: 5,
    tag: "Ex-tutorial-hell",
    sample: true,
  },
  {
    id: "t06",
    quote:
      "Five days, fifteen minutes a day, and my 25-footer started falling in again. I keep waiting for it to stop working and the trend line just keeps climbing.",
    name: "Elena Fischer",
    meta: "Intermediate · MA2",
    rating: 5,
    tag: "Trending up",
    sample: true,
  },
];
