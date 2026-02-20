import { Target, BarChart3, Brain, Zap } from "lucide-react";

const features = [
  {
    id: "LAB 001",
    icon: Target,
    title: "Throw biomechanics",
    description:
      "Measure release angle, nose angle, spin rate, and velocity. Turn every rep into a controlled experiment.",
  },
  {
    id: "LAB 002",
    icon: BarChart3,
    title: "Flight analytics",
    description:
      "Model disc trajectories, overlay historical data, and isolate the variables that separate good rounds from great ones.",
  },
  {
    id: "LAB 003",
    icon: Brain,
    title: "Cognitive training",
    description:
      "Sharpen course management, pre-shot routines, and pressure response. Where the mind-body connection drives lower scores.",
  },
  {
    id: "LAB 004",
    icon: Zap,
    title: "Adaptive programs",
    description:
      "Foundation-first coaching plans that evolve with your metrics. Every drill is calibrated to your current performance ceiling.",
  },
];

export const Features = () => {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
            Research Modules
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Precision tools for the modern player
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
            Every module is built around the same principle: measure, analyze,
            adapt, repeat.
          </p>
        </div>

        {/* Feature grid -- glassmorphism cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:bg-card/80 hover:shadow-[0_0_40px_rgba(109,234,249,0.06)]"
            >
              {/* Numerical silhouette label */}
              <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                {feature.id}
              </span>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/8 border border-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-2 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
