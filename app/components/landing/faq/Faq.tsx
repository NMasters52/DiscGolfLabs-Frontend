import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { faqItems, faqMeta } from "./data";
import { fadeUp, fadeIn, staggerContainer } from "../../../lib/motion/variants";

const viewport = { once: true, margin: "-80px" } as const;

export function Faq() {
  const { eyebrow, headingLead, headingAccent, intro } = faqMeta;

  return (
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

      <div className="relative z-10 mx-auto max-w-3xl px-6">
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
            {headingLead} <span className="shimmer-text">{headingAccent}</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
          >
            {intro}
          </motion.p>
        </motion.div>

        {/* FAQ accordion card */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-12 rounded-xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have a question? */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.045)] dark:border-border dark:shadow-none sm:flex-row sm:items-center"
        >
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Still have a question?
            </h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
              Join the waitlist and you can ask me directly once the course
              opens.
            </p>
          </div>
          <Button asChild size="sm" className="group shrink-0">
            <Link to="/">
              <motion.span
                className="inline-flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Join the waitlist
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
