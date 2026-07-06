import { Target, BarChart3, Brain, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    id: "Lab 001",
    icon: Target,
    title: "Foundations",
    description:
      'We stop the "quick-fix" cycle. By breaking your form down to the fundamentals. We take the core principles of each form, create drills for them, and reinforce them with tracking your progress.',
  },
  {
    id: "Lab 002",
    icon: BarChart3,
    title: "Data Feedback",
    description:
      "Stop wondering if you're getting better. Use interactive games and real-time data to see your progress in black and white, turning every practice session into a measurable win.",
  },
  {
    id: "Lab 003",
    icon: Brain,
    title: "Tournament Translation",
    description:
      "Form is useless if it breaks under pressure. Our drills can be used to simulate the mental load of a competitive round or tournament. Training your brain to stay calm and your mechanics to stay fluid when the shot matters.",
  },
  {
    id: "Lab 004",
    icon: Zap,
    title: "The \u201CWhy\u201D",
    description:
      "Stop relying on the temporary boost that fades a few days after a lesson or clinic. We teach self-diagnosable systems so you can recognize, fix, and adapt your own form. The goal is to make your knowledge a tool you can use for life—not something that depends on having a coach beside you.",
  },
];

export const Features = () => {
  return (
    <section className="relative bg-slate-300 pt-14 pb-24 dark:bg-background lg:pt-16 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
            The System
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Build a game that doesn't break.
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
            Stop watching YouTube tutorials and start using a structured process
            to practice. The most progress is gained from experience.
          </p>
        </div>

        {/* Feature grid -- glassmorphism cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group relative border-slate-200 bg-card shadow-md shadow-foreground/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl dark:border-border"
            >
              <CardHeader className="pb-2">
                {/* Numerical silhouette label */}
                <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                  {feature.id}
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/8 border border-primary/15">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-[15px] font-bold text-foreground tracking-wide">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
