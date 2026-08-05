import { motion } from "motion/react";

import { CtaSection } from "../cta-section";
import { fadeUp, fadeIn, staggerContainer } from "../../../lib/motion/variants";
import { pricingMeta, tiers, reassurances } from "./data";
import { PricingCard } from "./PricingCard";

const viewport = { once: true, margin: "-80px" } as const;

export function Pricing() {
  const { eyebrow, headingLead, headingAccent, intro } = pricingMeta;

  return (
    <>
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-28">
        {/* Decorative grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[900px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(109,234,249,0.09), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary"
            >
              {eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {headingLead}{" "}
              <span className="shimmer-text">{headingAccent}</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
            >
              {intro}
            </motion.p>
          </motion.div>

          {/* Tier grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-center"
          >
            {tiers.map((tier) => (
              <motion.div key={tier.id} variants={fadeUp} className="h-full">
                <PricingCard tier={tier} />
              </motion.div>
            ))}
          </motion.div>

          {/* Reassurance row */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {reassurances.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
