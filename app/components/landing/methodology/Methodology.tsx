import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "../../ui/button";
import { pillars, methodologyMeta } from "./data";
import { fadeUp, fadeIn, staggerContainer } from "../../../lib/motion/variants";
import { PillarCard } from "./PillarCard";

const viewport = { once: true, margin: "-80px" } as const;

export function Methodology() {
  const { eyebrow, headingLead, headingAccent, intro } = methodologyMeta;

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.035]"
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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {headingLead} <span className="shimmer-text">{headingAccent}</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
          >
            {intro}
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 rounded-xl border border-border/80 bg-card px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none"
        >
          <div className="flex flex-col items-start gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Protocol // DiscGolfLabs - Training Specs</span>
            <span>
              Phases: 4
              <span aria-hidden className="terminal-cursor" />
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-primary/15">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={viewport}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className="relative mt-10">
          <div
            aria-hidden
            className="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-linear-to-b from-primary/60 via-primary/30 to-transparent lg:left-1/2"
          />
          <motion.div
            aria-hidden
            variants={fadeIn}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewport}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-linear-to-b from-primary via-primary/40 to-transparent lg:left-1/2"
          />

          <ol className="space-y-8">
            {pillars.map((pillar, index) => {
              const isLeftSide = index % 2 === 0;
              return (
                <motion.li
                  key={pillar.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  className="relative pl-14 lg:grid lg:grid-cols-2 lg:gap-12 lg:pl-0"
                >
                  <div className="absolute left-5 top-1 -translate-x-1/2 lg:left-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-[0_0_24px_rgba(109,234,249,0.25)]">
                      <pillar.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  <PillarCard pillar={pillar} left={isLeftSide} />
                </motion.li>
              );
            })}

            <motion.li
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="relative pl-14 lg:col-span-2 lg:flex lg:flex-col lg:items-center lg:gap-4 lg:pl-0"
            >
              <div className="absolute left-5 top-1 -translate-x-1/2 lg:static lg:translate-x-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/50 bg-background shadow-[0_0_24px_rgba(47,212,99,0.25)]">
                  <Check className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="relative w-full overflow-hidden rounded-xl border-2 border-accent/35 bg-card p-6 lg:max-w-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Outcome
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  A self-correcting game.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  You will have the ability to diagnose your own misses and play
                  more consistent rounds. Giving you the keys to your game.
                </p>
                <Button asChild size="sm" className="mt-4 group">
                  <Link to="/pricing">
                    <motion.span
                      className="inline-flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Start training
                      <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                    </motion.span>
                  </Link>
                </Button>
              </div>
            </motion.li>
          </ol>
        </div>
      </div>
    </section>
  );
}
