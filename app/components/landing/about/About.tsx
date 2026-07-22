import {
  AboutHero,
  FounderCard,
  FounderQuote,
  AboutStats,
  MethodSection,
  PricingCta,
} from "./sections";

/**
 * About page. A single composition assembled from the strongest sections of
 * the former Gallery / Zen designs: Zen hero + founder soft card + Zen stats,
 * Gallery quote + method, and a closing CTA to pricing. Animations are
 * intentionally removed for a mobile-safe base (to be re-added later).
 */
export function About() {
  return (
    <>
      <AboutHero />
      <FounderCard />
      <FounderQuote />
      <AboutStats />
      <MethodSection />
      <PricingCta />
    </>
  );
}
