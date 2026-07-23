"use client";
import Image from "next/image";
import { motion } from "motion/react";

import teamTable from "../assets/principles/team-table.png";
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
      <Container as={motion.div}
        className="flex flex-col gap-[80px] py-[90px] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADER — display type left, manifesto label + photo right.
            items-start keeps both columns hanging from the same top
            edge even though the right column is much taller.

            465 + 192 + 543 is exactly 1200, so the comp's row only ever
            fits in a full 1200 content column — i.e. at 1440 and up. At
            1280 the column is 1040 and the row was pushing 160px off the
            page. Below 1440 the two columns therefore share the width
            with a smaller gap, and below lg they stack outright: the
            photo has nothing to sit beside once the copy needs the
            whole measure. */}
        <div className="flex flex-col gap-[48px] lg:flex-row lg:items-start lg:gap-[64px] min-[1440px]:gap-[192px]">
          <div className="flex w-full min-w-0 flex-col gap-[32px] [word-break:break-word] lg:flex-1 min-[1440px]:w-[465px] min-[1440px]:flex-none">
            <motion.h2
              variants={riseIn}
              className="text-[32px] font-normal leading-[1.2] text-white sm:text-[40px] lg:text-[52px]"
            >
              We Think In Systems, <span className="text-[#2dfbd9]">Not Silos</span>
            </motion.h2>

            <motion.p
              variants={riseIn}
              className="text-[18px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3] lg:text-[22px]"
            >
              We see the bigger picture, connect knowledge, own outcomes, and
              build for the future.
            </motion.p>
          </div>

          <div className="flex w-full min-w-0 flex-col items-end gap-[32px] lg:flex-1 lg:gap-[62px] min-[1440px]:w-[543px] min-[1440px]:flex-none">
            <motion.div variants={riseIn}>
              <Eyebrow label="THE AASHITA MANIFESTO" />
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
        {/* The 506px measure plus a nowrap title needs ~780px of row, so
            it only clears the column from lg up. Below that the pair
            stacks and the title is allowed to wrap. */}
        <div className="flex w-full flex-col gap-[40px] uppercase lg:gap-[64px]">
          {PRINCIPLES.map((principle) => (
            <motion.div
              key={principle.title}
              variants={riseIn}
              className="flex w-full flex-col gap-[8px] border-b border-solid border-[#272727] py-[12px] [word-break:break-word] lg:flex-row lg:items-start lg:justify-between lg:gap-[16px]"
            >
              <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.44px] text-white lg:whitespace-nowrap lg:text-[22px]">
                {principle.title}
              </p>
              <p className="w-full text-[16px] font-normal leading-[1.64] tracking-[-0.44px] text-white lg:w-[440px] lg:shrink-0 lg:text-[22px] min-[1440px]:w-[506px]">
                {principle.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default About_Principles;
