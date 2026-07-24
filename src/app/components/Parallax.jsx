"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

/* ==================================================================
   PARALLAX — moves its contents at a different speed than the scroll,
   so an image drifts against the page as you pass it.

   HOW IT STAYS SEAMLESS: the inner layer is over-sized (inset -12%),
   so translating it up/down never exposes an empty edge — the image
   always covers the frame. `speed` is how far it drifts as a fraction
   of that overflow; 0.12 is a gentle, premium amount.

   The outer frame keeps its own rounding/overflow via `className`;
   the motion happens on the inner layer. Reduced motion pins it.
   ================================================================== */

export default function Parallax({ children, distance = 60, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth the raw progress so the drift never steps on a fast flick.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  /* Numeric pixels (not a "%" string): motion applies a number to `y`
     directly as translateY(px); percentage strings silently resolved
     to 0 here. As the frame passes through the viewport the inner
     layer travels `distance` down to `distance` up — the drift. The
     inner layer is over-sized (inset -12%) so this never bares an edge;
     `distance` must stay under that overflow (~12% of the frame). */
  const y = useTransform(smooth, [0, 1], [distance, -distance]);

  /* The outer must be POSITIONED (its inner drift layer is absolute) and
     must CLIP. If the caller's className already sets a position (e.g.
     `absolute inset-0` to fill a card) respect it — hardcoding
     `relative` on top of that collapsed the box to zero height and hid
     the image. Only add `relative` when no position was supplied. */
  const hasPosition = /\b(absolute|fixed|relative|sticky)\b/.test(className);

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${hasPosition ? "" : "relative"} ${className}`}
    >
      <motion.div
        className="absolute inset-[-12%]"
        style={reduce ? undefined : { y, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
