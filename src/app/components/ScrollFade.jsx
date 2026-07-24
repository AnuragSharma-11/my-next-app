"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

/* ==================================================================
   SCROLL FADE — the "previous section" effect: a section stays crisp
   while it owns the screen, then blurs and fades as it scrolls up and
   out the top, so attention hands off cleanly to whatever is arriving
   below.

   The window is ["start start", "end start"]: progress 0 when the
   section's top meets the viewport top, progress 1 when its bottom
   does (fully above the fold). It holds full clarity through the first
   ~55% of that exit, then dissolves — so a section only blurs once it
   is genuinely on its way out, never while you are still reading it.

   DO NOT wrap sticky/scrub sections in this: `filter` creates a
   containing block that breaks position:sticky. It is meant for
   ordinary flow sections (Impact, Framework, Insights, the CTA).
   ================================================================== */

export default function ScrollFade({ children, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.4,
  });

  const opacity = useTransform(smooth, [0, 0.55, 1], [1, 1, 0.12]);
  const filter = useTransform(smooth, [0, 0.55, 1], ["blur(0px)", "blur(0px)", "blur(7px)"]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { opacity, filter, willChange: "opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
