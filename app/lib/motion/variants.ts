import type { Variants } from "motion/react";

/**
 * Shared motion variants — reusable app-wide.
 * Entrance/reveal effects kept subtle and consistent; reduced-motion is
 * handled centrally via <MotionConfig reducedMotion="user"> at the root.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};
