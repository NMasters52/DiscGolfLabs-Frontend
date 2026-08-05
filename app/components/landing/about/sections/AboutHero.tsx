import { aboutMeta } from "../data";

/**
 * Page hero — centered eyebrow, headline with the shimmer accent word, and
 * intro paragraph. Markup is carried over from the Zen design; the entrance
 * animation wrappers were removed for a static, mobile-safe base.
 */
export function AboutHero() {
  const { eyebrow, headingLead, headingAccent, intro } = aboutMeta;

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Warm ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(16,184,78,0.06), transparent 70%), radial-gradient(50% 40% at 80% 30%, rgba(109,234,249,0.05), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-20 text-center sm:pt-36">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {headingLead}{" "}
            <span className="shimmer-text">{headingAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}
