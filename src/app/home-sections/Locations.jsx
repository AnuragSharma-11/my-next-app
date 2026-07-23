"use client";
import Link from "next/link";
import { motion } from "motion/react";

import arrow from "./assets/locations/arrow-right.svg";
import Container from "../components/Container";
import CharReveal from "../components/CharReveal";
import Eyebrow from "../components/Eyebrow";

/* ------------------------------------------------------------------
   MOTION

   The only `instance` in this frame is the button (1:3416), and its
   authored state is reproduced literally below. Nothing else here is a
   component instance, so the cards carry no designer-authored motion.

   That makes scroll-reveal the honest choice for them: it respects the
   reading order the layout already implies instead of inventing motion
   the designer never asked for.

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

/* ------------------------------------------------------------------
   OFFICE DATA

   PLACEHOLDER COPY, REPRODUCED VERBATIM. All four cards in the comp
   read "Headquarters" / "Jaipur, India" even though the heading names
   China, India and Indonesia. That is the designer's lorem, not a
   spec, and it is not this component's job to invent three cities.

   Keeping it as data means the real offices land as a one-place edit
   to this array — no markup change, and a fifth office is a new row
   rather than a fifth copy-pasted block.
   ------------------------------------------------------------------ */
const OFFICES = [
  { id: "office-1", role: "Headquarters", city: "Jaipur, India" },
  { id: "office-2", role: "Headquarters", city: "Jaipur, India" },
  { id: "office-3", role: "Headquarters", city: "Jaipur, India" },
  { id: "office-4", role: "Headquarters", city: "Jaipur, India" },
];

const Locations = () => {
  return (
    <section
      className="locations relative w-full drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"

    >
      <Container
        as={motion.div}
        className="py-[var(--section-pad)]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* HEADING ROW — two 600px halves of the 1200 column. The left
            half is justify-between over a fixed 462px so the button
            sits on the grid's bottom edge (Figma parks it at y=412 of
            462, i.e. flush with the second card row) rather than
            floating directly under the heading.

            The halves are w-1/2, not w-[600px]. They resolve to exactly
            600 at 1440 — but 600+600 already exceeds the content column
            at 1280, where the gutter has grown to 120 and left only
            1040. A fraction holds the comp's split at every width the
            row still fits in, and the row itself stacks below lg. */}
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:gap-0">
          <div className="flex w-full shrink-0 flex-col justify-between gap-[32px] lg:h-[462px] lg:w-1/2 lg:gap-0">
            <div className="flex flex-col gap-[32px]">
              <motion.div variants={riseIn}>
                {/* White label on a teal bar: this section's field is
                    dark enough at the top that the shared default teal
                    label would fight the bar beside it. */}
                <Eyebrow
                  label="WHERE TO FIND US"
                  color="#ffffff"
                  barColor="#ffffff"
                  barWidth={36}
                />
              </motion.div>

              <CharReveal
                as="h2"
                className="w-[411px] max-w-full text-[length:clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-[1.3] text-white"
              >
                Aashita has offices in the China, India, Indonesia
              </CharReveal>
            </div>

            {/* BUTTON — deliberately not Primarybtn: that one is a
                344px outline pill at 24px with a 2px border and a
                LEADING arrow, this is a 240x50 pill at 20px with a 1px
                border and a trailing arrow. Nothing but the pill shape
                is shared.

                Figma parks a second, gradient-filled copy of the label
                49px below centre inside an overflow-clip pill. That is
                a hover state stored in place, so the two labels swap by
                sliding together — the clip is what hides the spare one
                at rest. Translating both by the same 49px is what makes
                it one continuous motion rather than two fades. */}
            <motion.div variants={riseIn}>
              <Link
                href="/about"
                className="group relative block h-[50px] w-[240px] overflow-clip rounded-[1200px] border border-solid border-white"
              >
                <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[8px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[calc(50%+49px)]">
                  <span className="whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
                    See Locations
                  </span>
                  {/* The export is 16x12 with preserveAspectRatio="none",
                      so both dimensions must be pinned or it stretches
                      to whatever box it lands in. */}
                  <img
                    src={arrow.src}
                    alt=""
                    className="h-[12px] w-[16px] shrink-0"
                  />
                </span>

                <span className="absolute left-[calc(50%+1px)] top-[calc(50%+49px)] flex h-[50px] w-[240px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[8px] rounded-[1200px] bg-gradient-to-r from-[#029c88] to-[#1b6d57] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[calc(50%+49px)]">
                  <span className="whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
                    How we do it
                  </span>
                  <img
                    src={arrow.src}
                    alt=""
                    className="h-[12px] w-[16px] shrink-0"
                  />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* OFFICE CARDS — 2x2 over the right 600px: two 294px columns
              at a 12px gutter, which is exactly Figma's 294+12+294.

              grid rather than flex-wrap here because the row count is
              fixed at two and the cards have no intrinsic width to fall
              back on — Figma's own export uses `flex-1 min-w-px`, which
              on a wrapping parent collapses all four onto one line. */}
          <div className="grid w-full shrink-0 grid-cols-1 gap-[12px] sm:grid-cols-2 lg:w-1/2 lg:pt-[50px]">
            {OFFICES.map((office) => (
              <motion.div
                key={office.id}
                variants={riseIn}
                className="flex h-[140px] flex-col justify-between overflow-clip rounded-[6px] bg-[#242424] p-[16px] sm:h-[200px]"
              >
                <p className="whitespace-nowrap text-[length:var(--text-body)] font-medium leading-none tracking-[-0.32px] text-[#ddd]">
                  {office.role}
                </p>

                {/* The gap between the two lines is justify-between
                    doing its job across a fixed 200px — there is no
                    image fill or placeholder child on this frame in
                    Figma, so it is negative space, not an empty slot. */}
                <div className="flex items-center gap-[12px]">
                  {/* A 10px solid disc. Exporting a filled circle as an
                      asset would ship a network request for something
                      border-radius already does exactly. */}
                  <span className="size-[10px] shrink-0 rounded-full bg-[#277266]" />
                  {/* The city line is the card's title -> --text-title. */}
                  <p className="whitespace-nowrap text-[length:var(--text-title)] font-medium leading-none tracking-[-0.4px] text-[#f5f5f5]">
                    {office.city}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Locations;
