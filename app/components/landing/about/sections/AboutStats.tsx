import { stats } from "../data";

/**
 * Credibility stats as a 2-up (mobile) / 4-up (sm+) grid of soft cards —
 * carried over from the Zen design. Static; entrance stagger removed.
 */
export function AboutStats() {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card/60 p-5 text-center"
          >
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
