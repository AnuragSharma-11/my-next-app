"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import earthHorizon from "./assets/cta/earth-horizon.png";
import arrow from "./assets/cta/arrow-right.svg";

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

const Cta = () => {
  return (
    <section className="about-cta relative h-[506px] w-full overflow-hidden drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]">
      {/* BACKDROP — three stacked layers, in Figma's own order.
          The gradient is the base colour: the earth photo only sits at
          60% opacity, so the deep teal below it is what actually sets
          the hue rather than the photo's own colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgb(1,23,32) 0%, rgb(2,83,75) 49.971%, rgb(4,125,107) 74.981%, rgb(2,197,165) 100%)",
        }}
      />
      {/* The source is 2233x704 but never shown above 1440 wide, so
          next/image re-encodes it instead of shipping the 2MB original. */}
      <Image
        src={earthHorizon}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        placeholder="blur"
        className="pointer-events-none object-cover opacity-60"
      />
      {/* Top scrim — darkens the upper third so the 52px heading keeps
          contrast against the bright glow along the horizon. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,28,35,0.4) 0%, rgba(0,28,35,0.32) 23.608%, rgba(0,28,35,0) 100%)",
        }}
      />

      {/* CTA STACK — Figma centres this on both axes rather than
          flowing it, so the copy stays optically centred on the
          horizon line no matter how tall the section renders. */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex w-[699px] max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[60px] px-[20px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex w-full flex-col items-center gap-[32px] capitalize text-white">
          <motion.h2
            variants={riseIn}
            className="w-full text-center text-[52px] font-medium leading-[1.2]"
          >
            Ready to build what&rsquo;s next ?
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="w-[626px] max-w-full text-center text-[20px] font-medium leading-[1.7] tracking-[-0.4px]"
          >
            From the first idea to real-world scale, we bring AI, design,
            technology and execution together to build products that create
            meaningful impact.
          </motion.p>
        </div>

        {/* BUTTON — deliberately not Primarybtn: that one is a 344px
            outline pill at 24px with a leading arrow, this is a 260px
            glass pill at 20px with a trailing down-arrow.

            Figma parks a second, gradient-filled copy of the label 49px
            below centre inside an overflow-clip pill. That is a hover
            state stored in place, so the two labels swap by sliding
            together — the clip is what hides the spare one at rest. */}
        <motion.div variants={riseIn}>
          <Link
            href="/contact-us"
            className="group relative block h-[50px] w-[260px] overflow-clip rounded-[1200px] border border-white bg-white/10 backdrop-blur-[1px]"
          >
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[8px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[calc(50%+49px)]">
              <span className="whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
                Start a Conversation
              </span>
              {/* The export is 16x12 with preserveAspectRatio="none", so
                  both dimensions must be pinned or it stretches to its
                  box. Figma rotates it 90deg to point down. */}
              <span className="flex h-[16px] w-[12px] items-center justify-center">
                <img
                  src={arrow.src}
                  alt=""
                  className="h-[12px] w-[16px] rotate-90"
                />
              </span>
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
      </motion.div>
    </section>
  );
};

export default Cta;
