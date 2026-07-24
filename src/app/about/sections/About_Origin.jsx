"use client";
import Image from "next/image";
import { motion } from "motion/react";

import originPhoto from "../assets/our-origin/origin-photo.png";
import arcOuter from "../assets/our-origin/arc-outer.svg";
import arcInner from "../assets/our-origin/arc-inner.svg";
import dot from "../assets/our-origin/dot.svg";
import Container from "../../components/Container";
import Eyebrow from "../../components/Eyebrow";

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
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
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

      <Container as={motion.div}
        className="relative z-10 flex flex-col gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* HEADING ROW — eyebrow + intro on the left, display type right.
            items-end baselines them against each other regardless of how
            the copy wraps. */}
        {/* Below lg the display type would be fighting the intro for a
            column neither can hold, so the pair stacks and the heading
            goes back to reading left-aligned like ordinary prose. */}
        <div className="flex w-full flex-col gap-[32px] lg:flex-row lg:items-end lg:gap-[16px]">
          <div className="flex min-w-px flex-1 flex-col gap-[24px]">
            <motion.div variants={riseIn}>
              {/* Near-black rather than teal: this section sits on a
                  light green field, so the dark-section colour would
                  vanish. Wider bar is the comp's too (36 vs 22). */}
              <Eyebrow label="OUR ORIGIN" color="#011a22" barWidth={36} />
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
            className="w-full text-left text-[32px] font-normal leading-[1.2] text-[#012429] sm:text-[40px] lg:w-[483px] lg:shrink-0 lg:text-right lg:text-[52px]"
          >
            It Started With
            <br />A Belief
          </motion.h2>
        </div>

        {/* FEATURE CARD — photo left, copy right */}
        <motion.div
          variants={riseIn}
          className="flex h-auto w-full flex-col items-stretch overflow-hidden rounded-[12px] border border-[#01211d] bg-[#272727] lg:h-[500px] lg:flex-row lg:items-center"
        >
          {/* PHOTO — the source is 1672x941 but only ever shown at
              784x500, so next/image resizes and re-encodes it rather
              than shipping the full 2.2MB original.
              sizes tells it which width to actually generate. */}
          {/* 784 + 416 is the full 1200 column, so the pair only sits
              side by side at 1440. Between lg and there the photo gives
              up whatever the copy panel needs; below lg it becomes a
              banner above the copy at the comp's own aspect. */}
          <div className="relative aspect-[784/500] w-full lg:aspect-auto lg:h-full lg:w-auto lg:flex-1 min-[1440px]:w-[784px] min-[1440px]:flex-none">
            <Image
              src={originPhoto}
              alt="The Aashita team at work"
              fill
              sizes="(min-width: 1024px) 784px, 100vw"
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
          <div className="flex h-auto w-full flex-col px-[20px] py-[28px] sm:px-[30px] sm:py-[32px] lg:h-full lg:w-[416px] lg:shrink-0">
            <div className="flex min-h-px flex-1 flex-col gap-[32px]">
              <p className="text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
                OUR ORIGIN
              </p>

              <div className="flex min-h-px flex-1 flex-col items-start justify-between gap-[24px] lg:items-end lg:gap-0">
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
      </Container>
    </section>
  );
};

export default About_Origin;
