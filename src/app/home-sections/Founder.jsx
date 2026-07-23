"use client";
import Image from "next/image";
import { motion } from "motion/react";

import founderPortrait from "./assets/founder/founder-portrait.png";
import founderBackdrop from "./assets/founder/founder-backdrop.png";
import Container from "../components/Container";
import Eyebrow from "../components/Eyebrow";

/* ------------------------------------------------------------------
   MOTION

   The Figma frame (1:3389) contains no instance nodes — every layer is
   a plain frame, text or rectangle — so there is no master component
   set whose variants sample an authored animation. Nothing to
   reproduce, which means scroll-reveal is the honest choice here.

   A pull quote should arrive quietly: one stagger, one direction, no
   scale or rotation. The portrait gets a longer, gentler travel than
   the type so the photograph settles last rather than racing the
   words it is meant to attribute.

   whileInView + viewport.once plays it as the section arrives and then
   leaves it alone — replaying on every scroll pass reads as nervous.
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

/* The ghost is the SAME bitmap as the portrait at 10% opacity, not a
   second export — so it can be animated independently. It drifts in
   from further right and lands slower, which sells it as a reflection
   trailing the man rather than a second person. */
const portraitIn = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const ghostIn = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 0.1,
    x: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const Founder = () => {
  return (
    <section className="founder relative w-full overflow-hidden drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]">
      {/* BACKDROP — the comp stacks a teal ramp under these layers, but
          the SECTION surface is owned by the .founder class in
          globals.css (--surface-quiet): painting the full ramp inline
          here restarted the page's gradient arc mid-page. What remains
          is the photographic texture knocked back to 30% so it reads
          as grain rather than subject, then a dark scrim that fades
          out downward to keep the eyebrow legible up top. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={founderBackdrop}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(23,29,32,0.6)] to-[rgba(23,29,32,0)]" />
      </div>

      <Container
        as={motion.div}
        className="relative z-10 py-[var(--section-pad)]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:justify-between lg:gap-0">
          {/* PULL QUOTE — the 156px gap between eyebrow and quote is
              Figma's, and it is doing real work: it drops the quote to
              the vertical middle of the frame so it sits level with the
              founder's gaze rather than above it. */}
          {/* The 156px gap only buys the alignment it is there for when
              the portrait is beside the quote. Stacked, it is just dead
              space, so it collapses with the row. */}
          <div className="flex w-full min-w-px flex-1 flex-col gap-[40px] self-stretch lg:gap-[156px]">
            <motion.div variants={riseIn}>
              <Eyebrow label="THE FOUNDER" color="#ffffff" barColor="#00b99b" barWidth={36} />
            </motion.div>

            {/* 36px quote->attribution, 12px name->role: the wider
                first gap separates the statement from its source, the
                tighter second binds name and role as one unit. */}
            <figure className="flex flex-col gap-[36px] text-white">
              <motion.blockquote
                variants={riseIn}
                /* Between the title and section tiers (24 -> 36 at
                   1440): the full section scale read oversized here,
                   per review — a pull quote should sit above card
                   titles but below the page's H2s. */
                className="w-[411px] max-w-full text-[length:clamp(1.5rem,2.5vw,2.25rem)] font-normal leading-[1.3]"
              >
                {"“We don't Just Build Products. We build solutions that create real impact in people’s lives.”"}
              </motion.blockquote>

              <motion.figcaption variants={riseIn} className="flex flex-col gap-[12px]">
                <cite className="w-[411px] max-w-full text-[length:var(--text-title)] font-medium not-italic leading-[1.2]">
                  Pankaj Gupta
                </cite>
                <span className="w-[411px] max-w-full text-[length:var(--text-body)] font-normal leading-[1.2] text-white/70">
                  Founder, Aashita
                </span>
              </motion.figcaption>
            </figure>
          </div>

          {/* PORTRAIT PAIR — the portrait is TALLER than its own row
              (573 in a 412 box) and deliberately overflows; the section
              clips it, which is what makes him stand on the bottom edge
              instead of floating in a padded box.

              The negative right margin pulls the ghost back underneath
              him so the two silhouettes overlap at the shoulder, as in
              the comp. */}
          {/* The portrait pair is 571px of fixed art and is deliberately
              NOT scaled down: shrinking a photograph of a person to fit
              a phone is worse than cropping it. Below lg it is centred
              in a full-width box and the section's overflow-hidden takes
              the sides, which is the same clip that already lets him
              stand on the bottom edge. */}
          <div className="flex h-[462px] w-full shrink-0 flex-col justify-center pt-[50px] lg:w-[600px]">
            {/* items-END, not centre: the portrait is 573 tall and the
                ghost 532 — centring floated the ghost 20px above the
                portrait's feet. Bottom-aligned, both silhouettes stand
                on the same line, per review. */}
            <div className="relative flex min-h-px flex-1 items-end justify-center lg:justify-start">
              <motion.div
                variants={portraitIn}
                className="relative mr-[-65px] h-[573px] w-[330px] shrink-0"
              >
                <Image
                  src={founderPortrait}
                  alt="Pankaj Gupta, founder of Aashita, looking upward"
                  fill
                  sizes="330px"
                  className="object-cover"
                  placeholder="blur"
                />
              </motion.div>

              <motion.div
                variants={ghostIn}
                aria-hidden
                className="relative h-[532px] w-[306px] shrink-0"
              >
                <Image
                  src={founderPortrait}
                  alt=""
                  fill
                  sizes="306px"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Founder;
