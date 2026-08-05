import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { CtaSection } from "../cta-section";
import { fadeUp, fadeIn, staggerContainer } from "../../../lib/motion/variants";
import { testimonials, testimonialsMeta } from "./data";
import { TestimonialCard } from "./TestimonialCard";

const viewport = { once: true, margin: "-80px" } as const;

export function Testimonials() {
  const { eyebrow, headingLead, headingAccent, intro } = testimonialsMeta;
  const featured =
    testimonials.find((t) => t.featured) ?? testimonials[0];
  const rest = testimonials.filter((t) => t.id !== featured.id);

  return (
    <>
      <section className="relative overflow-hidden bg-background pt-24 pb-24 lg:pt-28">
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

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-center"
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
              className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
            >
              {intro}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6 flex justify-center">
              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 bg-primary/10 text-foreground/70"
              >
                <Sparkles className="size-3 text-primary" />
                Sample testimonials
              </Badge>
            </motion.div>
          </motion.div>

          {/* Featured quote */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mx-auto mt-14 max-w-4xl"
          >
            <TestimonialCard testimonial={featured} featured />
          </motion.div>

          {/* Quote grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeUp} className="h-full">
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </motion.div>
            ))}
          </motion.div>

          {/* Mid-page CTA band */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-border/80 bg-card p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none sm:p-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              Your turn
            </p>
            <h3 className="mt-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Be one of the first to{" "}
              <span className="shimmer-text">put it on camera.</span>
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Join the waitlist and we&apos;ll send the 5-day course your way the
              second doors open.
            </p>
            <Button asChild size="lg" className="mt-6 group">
              <Link to="/">
                Join the waitlist
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
