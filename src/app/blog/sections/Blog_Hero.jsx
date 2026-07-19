"use client";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";

/* ------------------------------------------------------------------
   The decorative field that sits behind this hero is NOT owned here.

   blog-bg.svg is 1440x3629 — two and a half times this hero's height —
   because the art deliberately bleeds past the hero and on down through
   Featured Insights and into the grid. Mounting it inside this section
   scoped it to the hero and, worse, put it at a negative z-index behind
   a section that paints its own opaque background: a relative element
   with no z-index or transform creates no stacking context, so the
   backdrop was drawn and then painted straight over.

   It now lives in blog/page.js, wrapping every section. This one must
   therefore stay TRANSPARENT — giving it a background of its own is
   exactly what hid the artwork before.
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   MOTION

   The hero subtree in Figma contains no instance nodes and no variant
   sets — nav, heading and body are all plain frames and text. With no
   authored animation to reproduce, a restrained entrance is the honest
   choice: the parent hands each line its turn via staggerChildren so
   the timing lives in one place rather than as hardcoded delays.

   Children animate opacity and y only. Both are compositor properties,
   so the browser never has to re-layout the 3629px backdrop sitting
   behind them.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const Blog_Hero = () => {
  return (
    <section className="blog-hero relative w-full pb-[120px] pt-[170px]">
      {/* NAV — reused from the shared component. It positions itself
          absolutely at z-50, so it sits outside the stagger rather than
          fighting the copy stack for flow position. */}
      <Navbar />

      {/* HEADING STACK — Figma pins it at x=120, y=170 on a 1440 frame.
          px-[120px] reproduces the gutter without hardcoding a width,
          so it still holds together below 1440. */}
      <motion.div
        className="relative z-10 flex w-full flex-col items-start justify-center gap-[32px] px-[120px]"
        variants={stage}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={riseIn}
          className="w-[587px] max-w-full text-[82px] font-normal leading-[1.2] text-[#1ef4d1]"
        >
          Insights
        </motion.h1>

        <div className="flex flex-col items-start gap-[22px]">
          <motion.p
            variants={riseIn}
            className="w-[587px] max-w-full text-[42px] font-normal leading-[1.2] text-white"
          >
            Powering a World That Works
          </motion.p>

          <motion.p
            variants={riseIn}
            className="w-[516px] max-w-full text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3]"
          >
            Expert analysis, original research, and real-world stories that
            accelerate intelligent transformation.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default Blog_Hero;
