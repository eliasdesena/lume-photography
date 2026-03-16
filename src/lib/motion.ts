import type { Variants } from "framer-motion";

/**
 * Core easing curve — used everywhere for a consistent organic feel.
 * This is a custom bezier that starts fast and decelerates gently.
 */
const ease = [0.22, 1, 0.36, 1] as const;

/** Standard fade-up for section content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

/** Fade-up with custom delay per child index. */
export const fadeUpStagger: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
      delay: i * 0.1,
    },
  }),
};

/** Hero image — subtle scale + fade, feels cinematic. */
export const heroImageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease },
  },
};

/** Hero text cascade — each child delays based on custom index. */
export const heroTextReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
      delay: 0.4 + i * 0.12,
    },
  }),
};

/** Scale entrance for contained cards/sections. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease },
  },
};

/** Stagger container — orchestrates child animations. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/** Accordion expand/collapse. */
export const accordionContent: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease },
  },
};

/** SVG checkmark draw for success page. */
export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
  },
};

/** Horizontal reveal — for decorative lines / accents. */
export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease },
  },
};

/** Shared viewport trigger config. */
export const viewportConfig = {
  once: true,
  margin: "-80px" as const,
};
