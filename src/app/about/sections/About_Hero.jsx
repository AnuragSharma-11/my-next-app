"use client";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";

import ringOuter from "../assets/hero/ring-1.svg";
import ringMid from "../assets/hero/ring-2.svg";
import ringInner from "../assets/hero/ring-3.svg";
import ringCore from "../assets/hero/ring-4.svg";
import arc from "../assets/hero/arc-1.svg";

/* ------------------------------------------------------------------
   ORBIT GEOMETRY

   Every ring SVG exports as "the circle + its dots", so Figma padded
   the export box to fit the dots. That means the circle is NOT in the
   middle of its own file.

   Worse, each circle carries transform="matrix(1 0 0 -1 e f)" — a Y
   flip Figma emits for mirrored shapes. So the real centre is NOT the
   cx/cy attributes: it is (cx + e, f - cy). Read cy straight and the
   rings land up to 12px apart and stop looking concentric.

   cx/cy below are the resolved centres, post-transform. Used twice:
     1. to place each ring so all four share one centre (concentric)
     2. as transformOrigin, so rotation spins true instead of wobbling
   ------------------------------------------------------------------ */

/* Background sweep. The SVG is 7058x2943 but 200px of that on each
   side is transparent padding for the baked-in blur, leaving 6658px of
   visible art. ARC_SCALE sizes that art to ~2394px on screen — the
   width the sweep occupied in the comp. Both original arcs shared a
   centre at y=455.5, so the combined asset inherits it.
   Tune ARC_SCALE alone to make the glow bigger or smaller. */
const ARC_SCALE = 2394 / 6658;
const ARC_W = 7058 * ARC_SCALE;
const ARC_H = 2943 * ARC_SCALE;
const ARC_CENTER_Y = 455.5;

const ORBIT_BOX = 750; // Ellipse-Container in Figma
const CENTER_X = 378.5; // shared centre of all four rings, within that box
const CENTER_Y = 371;

const RINGS = [
  { src: ringOuter, w: 754.1, h: 742.0, cx: 378.5, cy: 371.0, duration: 90 },
  { src: ringMid, w: 613.3, h: 617.4, cx: 304.8, cy: 312.5, duration: 70 },
  { src: ringInner, w: 477.3, h: 477.3, cx: 238.6, cy: 238.6, duration: 55 },
  { src: ringCore, w: 362.2, h: 360.7, cx: 174.2, cy: 186.5, duration: 40 },
];

// Ring 1 drives the labels, so they share its duration.
const LABEL_DURATION = RINGS[0].duration;

// Centre wordmark: public/logo/Aashita_logo.svg, natively 103x33 —
// almost exactly the 104px width Figma gives it at the orbit centre.
// Aspect is taken from its viewBox so the height is never guessed.
const LOGO_W = 103;
const LOGO_ASPECT = 103 / 33;

/* Labels in polar coords around the orbit centre. Stored as angle+radius
   rather than left/top so they can be rotated as a group — you cannot
   orbit something that is pinned to a corner. */
const LABELS = [
  { text: "Think Long Term", angle: 167.4, radius: 454 },
  { text: "Build With Ownership", angle: 152.5, radius: 436 },
  { text: "Human Progress", angle: 57.2, radius: 382 },
  { text: "Purposeful Intelligence", angle: 25.5, radius: 440 },
  { text: "Scale What Matters", angle: 6.2, radius: 395 },
];

/* ------------------------------------------------------------------
   ENTRANCE TIMELINE  (Figma variants 1 -> 4)

   The parent hands each child its turn via staggerChildren, so the
   order lives in one place instead of being hardcoded as delays on
   five separate elements.
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

const orbitIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const About_Hero = () => {
  return (
    <section className="about-hero relative h-screen w-full overflow-hidden">
      {/* SOFT LIGHT WASH — the second gradient from Figma, layered over
          the base one to lift the horizon band */}
      <div className="absolute inset-0 about-hero__wash" />

      {/* BACKGROUND SWEEP — both light arcs in one asset, with the blur
          baked in as an SVG filter rather than a CSS one, so the GPU
          never has to re-blur it on scroll.

          The file carries 200px of transparent filter padding on every
          side. ARC_W/ARC_H below are the padded box; the visible art
          inside is 6658x2543 of it. Scaled so that art spans ~2394px,
          matching the width the sweep had in the original comp. */}
      <div
        className="pointer-events-none bottom-20 absolute left-1/2 -translate-x-1/2 -scale-y-80 rotate-180
        w-[170vw]"
      >
        <img src={arc.src} alt="" className="h-full w-full" />
      </div>

      <motion.div
        className="relative z-10 h-full"
        variants={stage}
        initial="hidden"
        animate="visible"
      >
        {/* NAV — variant 2
        <motion.div variants={riseIn}>
          <Navbar />
        </motion.div> */}

        {/* HEADING + BODY — variant 3 */}
        <div className="pt-[118px] text-center mt-60">
          <motion.h1
            variants={riseIn}
            className="text-[72px] font-normal leading-[1.2] text-white"
          >
            We&rsquo;re Aashita
          </motion.h1>

          <motion.p
            variants={riseIn}
            className="mx-auto mt-[38px] max-w-[558px] text-[16px] font-medium leading-[1.5] tracking-[-0.32px] text-white"
          >
            We build and scale AI-powered products that solve meaningful
            problems across industries. Bringing intelligence, technology, and
            purpose together to turn ambitious ideas into real-world impact.
          </motion.p>
        </div>

        {/* ORBIT — variant 4, then rotates forever */}
        <motion.div
          variants={orbitIn}
          className="absolute left-1/2 top-[800px] -translate-x-1/2"
          style={{ width: ORBIT_BOX, height: ORBIT_BOX }}
        >
          {/* RINGS — each spins at its own pace so the field never looks
              like one rigid disc. Dots are baked into the SVGs, so they
              orbit for free. */}
          {RINGS.map((ring) => (
            <motion.img
              key={ring.src.src}
              src={ring.src.src}
              alt=""
              className="pointer-events-none absolute"
              style={{
                width: ring.w,
                height: ring.h,
                left: CENTER_X - ring.cx,
                top: CENTER_Y - ring.cy,
                transformOrigin: `${ring.cx}px ${ring.cy}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: ring.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* CENTRE MARK — stays put while everything turns around it.

              Figma builds this from four separate layers (swoosh + two
              Salsa text runs + the dot). Rebuilding that would mean
              loading Salsa, which the app does not use, so we reuse the
              wordmark already shipped in public/logo.

              Path note: public/ is served from the URL root, so the
              folder name itself never appears in the src. */}
          <img
            src="/logo/Aashita_logo.svg"
            alt="Aashita"
            className="absolute"
            style={{
              width: LOGO_W,
              height: LOGO_W / LOGO_ASPECT,
              left: CENTER_X,
              top: CENTER_Y - LOGO_W / LOGO_ASPECT / 2,
              transform: "translateX(-50%)",
            }}
          />

          {/* LABELS — orbit in lockstep with ring 1.
              Three nested transforms, and each one undoes the last:
                1. wrapper spins  +360
                2. spoke places the label at its angle + radius
                3. counter-spin  -360   cancels (1)
                4. counter-angle        cancels (2)
              Net rotation on the text is zero, so it orbits while
              staying perfectly upright and readable. */}
          <motion.div
            className="absolute"
            style={{ left: CENTER_X, top: CENTER_Y }}
            animate={{ rotate: 360 }}
            transition={{
              duration: LABEL_DURATION,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {LABELS.map((label) => (
              <div
                key={label.text}
                className="absolute"
                style={{
                  transform: `rotate(${-label.angle}deg) translateX(${label.radius}px)`,
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: LABEL_DURATION,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <span
                    className="block whitespace-nowrap text-[20px] font-medium leading-[1.2] text-white"
                    style={{
                      transform: `rotate(${label.angle}deg) translate(-50%, -50%)`,
                    }}
                  >
                    {label.text}
                  </span>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About_Hero;
