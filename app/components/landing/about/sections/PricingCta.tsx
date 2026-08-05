import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "../../../ui/button";

/**
 * Closing call-to-action that routes to the pricing page. Replaces the stale
 * shared waitlist CTA that used to sit here. Voice follows
 * docs/About-Brand-Context.md — concrete, not hypy.
 */
export function PricingCta() {
  return (
    <section className="relative overflow-hidden bg-background pb-28 pt-16 lg:pb-32 lg:pt-20">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-[400px] w-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(109,234,249,0.04)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          Start training
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Practice with real intent.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          A five-day putting course and a tracking app that turn reps into real,
          measurable progress.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {/* Primary — filled teal, routes to pricing */}
          <Button asChild size="lg" className="group w-full sm:w-auto">
            <Link to="/pricing">
              See plans &amp; pricing
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          {/* Secondary — accent-green outline, fills on hover, routes to sign-up */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground sm:w-auto"
          >
            <Link to="/sign-up">Join the Lab</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
