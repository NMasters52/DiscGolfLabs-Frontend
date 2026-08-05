import { founderQuote } from "../data";

/**
 * Founder pull quote framed by hairline rules — carried over from the Gallery
 * design. The animated line-draws are now plain static rules.
 */
export function FounderQuote() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div aria-hidden className="h-px w-full bg-border" />
      <div className="py-12 text-center">
        <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl">
          <span className="text-primary/40">“</span>
          {founderQuote.quote}
          <span className="text-primary/40">”</span>
        </blockquote>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          — {founderQuote.attribution}
        </p>
      </div>
      <div aria-hidden className="h-px w-full bg-border" />
    </section>
  );
}
