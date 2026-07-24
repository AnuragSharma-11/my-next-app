"use client";
import { motion, useReducedMotion } from "motion/react";

/* ==================================================================
   PAGE TRANSITION  (App Router template)

   template.js re-mounts on every navigation, so whatever it renders
   re-animates each time a route changes — this is the App Router's
   hook for page transitions.

   TWO parts:
     1. AURA REVEAL — a soft teal radial that flashes over the new
        page and fades out, so a route change feels like the brand
        light washing in rather than a hard cut.
     2. CONTENT FADE — the page fades up into place.

   WHY OPACITY-ONLY on the content (no transform/filter): the Overview
   and Manifesto sections use position:sticky, and the navbar is fixed.
   A transform OR filter on an ancestor creates a containing block that
   breaks BOTH — and motion can leave a `transform: none`/matrix on the
   wrapper after the tween, which would break sticky permanently.
   Opacity creates only a stacking context, never a containing block,
   so it is the one safe property to animate on a page-level wrapper.
   ================================================================== */

export default function Template({ children }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      {/* AURA REVEAL — fixed overlay, fades out over the new page. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(12,255,215,0.18) 0%, rgba(3,206,180,0.08) 30%, transparent 60%)",
        }}
      />

      {/* CONTENT — opacity-only fade (safe for sticky/fixed). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
