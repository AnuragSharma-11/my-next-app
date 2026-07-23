"use client";
import Image from "next/image";
import { motion } from "motion/react";

import earthHorizon from "./assets/cta/earth-horizon.png";
import PillButton from "./PillButton";

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

/* ------------------------------------------------------------------
   ONE CTA, DIFFERENT WORDS

   About (1:4830) and Blog (1:4640) are the SAME frame — same 506px
   height, same three backdrop layers, same 260x50 glass pill, right
   down to the gradient label parked 49px below centre. Only the
   heading, body and button label differ, and Blog points at a
   newsletter rather than a contact form.

   So the copy is props with About's wording as the default: existing
   call sites keep working untouched, and Blog passes its three strings.
   Forking the component would have duplicated the whole backdrop stack
   to change three lines of text.
   ------------------------------------------------------------------ */
const Cta = ({
  heading = "Ready to build what’s next ?",
  body = "From the first idea to real-world scale, we bring AI, design, technology and execution together to build products that create meaningful impact.",
  buttonLabel = "Start a Conversation",
  href = "/contact-us",
}) => {
  return (
    <section className="about-cta relative min-h-[506px] w-full overflow-hidden drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]">
      {/* BACKDROP — three stacked layers, in Figma's own order.
          The gradient is the base colour: the earth photo only sits at
          60% opacity, so the deep teal below it is what actually sets
          the hue rather than the photo's own colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "var(--gradient-primary)",
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
        /* 715px is the comp's own heading width (node 1:4644). At 699
           minus 20px of padding the heading had 659px to work with and
           broke "Next ?" onto a second line on every page. */
        className="relative mx-auto flex w-[715px] max-w-[calc(100%-40px)] flex-col items-center gap-[32px] py-[80px] lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-[60px] lg:py-0"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex w-full flex-col items-center gap-[32px] capitalize text-white">
          <motion.h2
            variants={riseIn}
            className="w-full text-center text-[var(--text-section)] font-medium leading-[1.2]"
          >
            {heading}
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="w-[626px] max-w-full text-center text-[var(--text-subheading)] font-medium leading-[1.7] tracking-[-0.4px]"
          >
            {body}
          </motion.p>
        </div>

        {/* BUTTON — the shared PillButton, which is this exact control:
            an outlined pill with a second, gradient-filled copy of the
            label parked 49px below centre inside an overflow-clip box,
            both sliding together on hover.

            This section is where that construction was first decoded,
            and it then turned up on the home hero, the product hero and
            the locations band — so it moved into a component. `arrowDown`
            reproduces the 90deg rotation Figma applies here only.

            Still deliberately not Primarybtn: that is a 344px outline
            pill at 24px with a LEADING arrow and no hover state. */}
        <motion.div variants={riseIn}>
          <PillButton
            label={buttonLabel}
            href={href}
            width={260}
            arrowDown
            className="bg-white/10 backdrop-blur-[1px]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Cta;
