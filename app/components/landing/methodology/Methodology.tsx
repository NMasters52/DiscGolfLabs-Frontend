import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { cn } from "../../../lib/utils";
import { pillars, methodologyMeta } from "./data";

const rise = (delay: number) => ({ animationDelay: `${delay}ms` });

/**
 * V3 — Protocol.
 * The methodology as a sequential training protocol: an overall progress bar,
 * a vertical spine with numbered nodes that alternate sides on desktop, glass
 * step cards with phase tags + deliverables, and an "outcome" terminus.
 */
export function Methodology() {
  const { eyebrow, headingLead, headingAccent, intro } = methodologyMeta;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(100), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-28">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[900px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109,234,249,0.09), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* header */}
        <div className="text-center">
          <p
            className="m-rise font-mono text-[11px] uppercase tracking-[0.35em] text-primary"
            style={rise(0)}
          >
            {eyebrow}
          </p>
          <h2
            className="m-rise mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={rise(80)}
          >
            {headingLead} <span className="text-primary">{headingAccent}</span>
          </h2>
          <p
            className="m-rise mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
            style={rise(160)}
          >
            {intro}
          </p>
        </div>

        {/* protocol progress */}
        <div
          className="m-fade mt-12 rounded-xl border border-border bg-card/40 px-5 py-4 backdrop-blur-sm"
          style={rise(220)}
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Protocol // DGL-Training</span>
            <span>4 Phases</span>
          </div>
          <Progress value={progress} className="mt-3 h-1.5" />
        </div>

        {/* timeline */}
        <div className="relative mt-10">
          {/* spine */}
          <div
            aria-hidden
            className="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-linear-to-b from-primary/40 via-primary/20 to-transparent lg:left-1/2"
          />
          <div
            aria-hidden
            className="m-grow-y absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-linear-to-b from-primary via-primary/40 to-transparent lg:left-1/2"
            style={{ transformOrigin: "top" }}
          />

          <ol className="space-y-8">
            {pillars.map((p, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={p.id}
                  className="m-rise relative pl-14 lg:grid lg:grid-cols-2 lg:gap-12 lg:pl-0"
                  style={rise(320 + i * 120)}
                >
                  {/* node */}
                  <div className="absolute left-5 top-1 -translate-x-1/2 lg:left-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-[0_0_24px_rgba(109,234,249,0.25)]">
                      <p.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* card */}
                  <div
                    className={cn(
                      "rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-primary/30",
                      left
                        ? "lg:col-start-1 lg:mr-12 lg:text-right"
                        : "lg:col-start-2 lg:ml-12"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
                        left && "lg:justify-end"
                      )}
                    >
                      <span className="text-primary">Phase {p.index}</span>
                      <span className="text-muted-foreground/50">/</span>
                      <span>{p.code}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[15px] font-medium italic text-primary/90">
                      {p.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <div
                      className={cn(
                        "mt-4 flex flex-wrap gap-1.5",
                        left && "lg:justify-end"
                      )}
                    >
                      {p.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="font-mono text-[9px] tracking-wider text-muted-foreground"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/70">
                      <Check className="mr-1.5 inline size-3 align-middle text-accent" />
                      <span className="text-muted-foreground">Deliverable —</span>{" "}
                      {p.practice}
                    </p>
                  </div>
                </li>
              );
            })}

            {/* outcome terminus */}
            <li
              className="m-rise relative pl-14 lg:grid lg:grid-cols-2 lg:gap-12 lg:pl-0"
              style={rise(320 + pillars.length * 120)}
            >
              <div className="absolute left-5 top-1 -translate-x-1/2 lg:left-1/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/50 bg-background shadow-[0_0_24px_rgba(47,212,99,0.25)]">
                  <Check className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 lg:col-start-2 lg:ml-12">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Outcome
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                  A self-correcting game.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You diagnose your own misses, adapt on the fly, and keep
                  improving — no coach required.
                </p>
                <Button asChild size="sm" className="mt-4 group">
                  <Link to="/pricing">
                    Start training
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
