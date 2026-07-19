"use client";
import Image from "next/image";
import { motion } from "motion/react";

import originPhoto from "../assets/our-origin/origin-photo.png";
import arcOuter from "../assets/our-origin/arc-outer.svg";
import arcInner from "../assets/our-origin/arc-inner.svg";
import dot from "../assets/our-origin/dot.svg";

/* ------------------------------------------------------------------
   MOTION

   This section has no Figma variants, so there is no authored
   animation to reproduce. That makes scroll-reveal the honest choice:
   it respects the reading order the layout already implies instead of
   inventing motion the designer never asked for.

   whileInView + viewport.once means it plays as the section arrives
   and then stays put — no replay on every scroll pass, which reads as
   nervous on a long page like this one.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const About_Origin = () => {
  return (
    <section className="about-origin relative w-full overflow-hidden py-[90px]">
      {/* BACKGROUND SWEEPS — Figma floats these at top:-274, i.e. they
          bleed up past this section's own top edge into the hero above.
          overflow-hidden on the section clips that overhang, which is
          what keeps the seam invisible. */}
      <div className="pointer-events-none absolute left-1/2 top-[-274px] h-[511px] w-[1654px] -translate-x-1/2 -scale-y-100 rotate-180">
        <img src={arcOuter.src} alt="" className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[-179px] h-[321px] w-[1158px] -translate-x-1/2 -scale-y-100 rotate-180">
        <img src={arcInner.src} alt="" className="h-full w-full" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-[1200px] max-w-full flex-col gap-[80px] px-[120px] xl:px-0"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* HEADING ROW — eyebrow + intro on the left, display type right.
            items-end baselines them against each other regardless of how
            the copy wraps. */}
        <div className="flex w-full items-end gap-[16px]">
          <div className="flex min-w-px flex-1 flex-col gap-[24px]">
            <motion.div variants={riseIn} className="flex items-center gap-[20px]">
              <span className="h-[4px] w-[36px] bg-[#011a22]" />
              <p className="text-[22px] font-semibold leading-[1.54] tracking-[-0.44px] text-[#011a22]">
                OUR ORIGIN
              </p>
            </motion.div>

            <motion.p
              variants={riseIn}
              className="w-[422px] max-w-full text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-white"
            >
              Aashita began with a simple belief: technology should solve
              meaningful problems, strengthen organizations, and improve lives.
            </motion.p>
          </div>

          <motion.h2
            variants={riseIn}
            className="w-[483px] shrink-0 text-right text-[52px] font-normal leading-[1.2] text-[#012429]"
          >
            It Started With
            <br />A Belief
          </motion.h2>
        </div>

        {/* FEATURE CARD — photo left, copy right */}
        <motion.div
          variants={riseIn}
          className="flex h-[500px] w-full items-center overflow-hidden rounded-[12px] border border-[#01211d] bg-[#272727]"
        >
          {/* PHOTO — the source is 1672x941 but only ever shown at
              784x500, so next/image resizes and re-encodes it rather
              than shipping the full 2.2MB original.
              sizes tells it which width to actually generate. */}
          <div className="relative h-full w-[784px] shrink-0">
            <Image
              src={originPhoto}
              alt="The Aashita team at work"
              fill
              sizes="784px"
              className="object-cover"
              placeholder="blur"
            />
            {/* Figma puts a near-horizontal scrim here (-89.87deg) to
                darken the edge where photo meets copy panel. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(-89.87deg, rgba(0,0,0,0) 0%, rgba(0,12,16,0.2) 99.927%)",
              }}
            />
          </div>

          {/* COPY PANEL */}
          <div className="flex h-full w-[416px] shrink-0 flex-col px-[30px] py-[32px]">
            <div className="flex min-h-px flex-1 flex-col gap-[32px]">
              <p className="text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
                OUR ORIGIN
              </p>

              <div className="flex min-h-px flex-1 flex-col items-end justify-between">
                <div className="flex w-full flex-col gap-[22px]">
                  <h3 className="text-[28px] font-medium leading-[1.5] tracking-[-0.56px] text-[#e8e8e8]">
                    Technology Should
                    <br />
                    Create Meaningful Change.
                  </h3>
                  <p className="w-[342px] max-w-full text-[16px] font-normal leading-[1.5] tracking-[-0.32px] text-[#e3e3e3]">
                    Aashita began with an observation: meaningful problems
                    persist when intelligence, purpose, and execution fail to
                    come together.
                  </p>
                </div>

                {/* LINK ROW — the label is a gradient, which text cannot
                    take directly. bg-clip-text paints the gradient onto
                    the glyphs and text-transparent lets it show through. */}
                <div className="flex items-center gap-[8px]">
                  <img src={dot.src} alt="" className="h-[8px] w-[8px]" />
                  <span className="bg-gradient-to-r from-[#727272] to-[#006756] bg-clip-text text-[20px] font-medium leading-[1.5] text-transparent">
                    Discover Our Journey
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About_Origin;
