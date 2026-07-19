"use client";
import Image from "next/image";
import { motion } from "motion/react";

import teamTable from "../assets/principles/team-table.png";

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

/* The four rows differ only in their copy, so they live as data.
   A fifth principle is a content edit here, not a markup change. */
const PRINCIPLES = [
  {
    title: "Understand Deeply",
    body: "We study people, systems, and real-world problems before deciding what to build.",
  },
  {
    title: "Connect Knowledge",
    body: "We study people, systems, and real-world problems before deciding what to build.",
  },
  {
    title: "Build With Ownership",
    body: "We study people, systems, and real-world problems before deciding what to build.",
  },
  {
    title: "Think Beyond Today",
    body: "We study people, systems, and real-world problems before deciding what to build.",
  },
];

const About_Principles = () => {
  return (
    <section className="about-principles w-full bg-[#0f0f0f]">
      <motion.div
        className="mx-auto flex w-[1440px] max-w-full flex-col gap-[80px] px-[120px] py-[90px] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADER — display type left, manifesto label + photo right.
            items-start keeps both columns hanging from the same top
            edge even though the right column is much taller. */}
        <div className="flex items-start gap-[192px]">
          <div className="flex w-[465px] max-w-full shrink-0 flex-col gap-[32px] [word-break:break-word]">
            <motion.h2
              variants={riseIn}
              className="text-[52px] font-normal leading-[1.2] text-white"
            >
              We Think In Systems, <span className="text-[#2dfbd9]">Not Silos</span>
            </motion.h2>

            <motion.p
              variants={riseIn}
              className="text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
            >
              We see the bigger picture, connect knowledge, own outcomes, and
              build for the future.
            </motion.p>
          </div>

          <div className="flex w-[543px] max-w-full shrink-0 flex-col items-end gap-[62px]">
            <motion.div variants={riseIn} className="flex items-center gap-[16px]">
              <span className="h-[4px] w-[22px] shrink-0 bg-[#2dfbd9]" />
              <p className="whitespace-nowrap text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
                THE AASHITA MANIFESTO
              </p>
            </motion.div>

            {/* PHOTO — source is 1280x720 but only ever painted at 543
                wide, so next/image resizes it instead of shipping the
                full 1.3MB original. The 4px border sits outside the
                rounded clip, which is why it lives on the wrapper. */}
            <motion.div
              variants={riseIn}
              className="relative aspect-[1280/720] w-full overflow-hidden rounded-[12px] border-4 border-solid border-[#272727]"
            >
              <Image
                src={teamTable}
                alt="A team of designers, engineers and strategists working around a table of sketches and system maps"
                fill
                sizes="543px"
                className="object-cover"
                placeholder="blur"
              />
            </motion.div>
          </div>
        </div>

        {/* PRINCIPLE ROWS — each row is a justify-between pair so the
            title stays flush left and the description column holds a
            fixed 506px measure regardless of title length. The rule is
            a border-b on the row itself rather than a separate element,
            so it can never drift out of sync with the row's padding. */}
        <div className="flex w-full flex-col gap-[64px] uppercase">
          {PRINCIPLES.map((principle) => (
            <motion.div
              key={principle.title}
              variants={riseIn}
              className="flex w-full items-start justify-between gap-[16px] border-b border-solid border-[#272727] py-[12px] [word-break:break-word]"
            >
              <p className="whitespace-nowrap text-[22px] font-bold leading-[1.5] tracking-[-0.44px] text-white">
                {principle.title}
              </p>
              <p className="w-[506px] max-w-full shrink-0 text-[22px] font-normal leading-[1.64] tracking-[-0.44px] text-white">
                {principle.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About_Principles;
