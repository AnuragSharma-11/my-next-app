

"use client";

import { motion, useReducedMotion } from "motion/react";

import Container from "../components/Container";
import CharReveal from "../components/CharReveal";
import Eyebrow from "../components/Eyebrow";
import PillButton from "../components/PillButton";

import arcRings from "./assets/framework/arc-rings.svg";
import arcSweep from "./assets/framework/arc-sweep.svg";

/* ==================================================================
   ONE FRAMEWORK, INFINITE POSSIBILITIES  (Figma 1:3654)

   Two component sets live inside this node, and they encode two
   DIFFERENT kinds of animation. Getting that distinction right is the
   whole job here:

     Arc-Container   (1:6036, 5 variants) -> a CONTINUOUS rotation
     Tabs-Container  (1:6143, 8 variants) -> a DISCRETE reveal

   ARC-CONTAINER — diffing the five variant renders shows that the
   rings, both colour blooms, the two point-lights, the centre rule and
   the badge are pixel-identical in all five. The ONLY thing that moves
   is a soft white wedge pivoting about the badge:

     Default   bearing  ~15deg   (north-east)
     Variant2  bearing ~105deg   (south-east)
     Variant3  bearing ~195deg   (south-west)
     Variant4  bearing ~285deg   (north-west)
     Variant5  bearing  ~15deg   — identical to Default

   Ninety degrees per sample, monotonically clockwise, and variant 5
   lands back on variant 1. That is a loop closing, not a fifth state:
   the designer sampled a radar sweep at four quarter-turns and added
   the fifth frame to show it wraps. So this is coded as ONE infinite
   linear 360deg rotation. Cross-fading the five samples would have
   produced exactly the four-step stutter the samples were drawn to
   describe, not to be.

   TABS-CONTAINER — the eight variants are genuinely stepped, and the
   evidence is that nothing ever interpolates:

     Variant1  0 tiles      Variant5  3 tiles (top row complete)
     Variant2  1 tile       Variant7  5 tiles
     Variant3  2 tiles      Variant8  6 tiles (settled)
     Variant4  3 tiles

   One tile appears per step, previous tiles never move or leave, and
   the series terminates in a stable full grid. A tile is either drawn
   or it is not — there is no half-tile frame to scrub through, so the
   only continuum available is the DELAY RAMP between them. That makes
   this a staggered entrance rather than a scroll scrub: unlike the
   About manifesto odometer (where each step REPLACES the last and so
   must stay scrubbable), nothing here is ever taken away, and the end
   state is the readable one. Pinning 600vh of runway to reveal six
   tiles that then just sit there would be motion for its own sake.
   ================================================================== */

/* ------------------------------------------------------------------
   ARC GEOMETRY

   The arc art exports as a single SVG whose viewBox is 1395.33 x
   1073.58 — but the node itself is only 1395.334 x 910.137. That extra
   163.44px of height is BLUR PADDING: four of the circles carry heavy
   feGaussianBlur filters and Figma grows the export canvas to hold the
   spill. Figma writes the same fact as inset[-7.98% 0 -9.98% 0]:

     top pad     910.137 * 0.0798 = 72.63
     bottom pad  910.137 * 0.0998 = 90.83
     910.137 + 72.63 + 90.83     = 1073.6   -> the viewBox height

   Horizontal padding is zero, which is why the width matches exactly.
   So the SVG must be positioned by its PADDED box: 72.63px ABOVE where
   the node claims to start. Place it by the node box instead and the
   blooms sit ~73px low against the rings.

   Both SVGs are emitted with preserveAspectRatio="none", so width AND
   height are pinned from the viewBox. object-contain would do nothing
   and the art would stretch to whatever box it was handed.
   ------------------------------------------------------------------ */
const ARC_BOX_W = 1395.33; // padded export canvas, not the node
const ARC_BOX_H = 1073.58;

const ARC_NODE_H = 910.137;
const ARC_TOP_PAD = ARC_NODE_H * 0.0798; // 72.63
const ARC_NODE_TOP = 60; // Arc-Group's y within Arc-Container
const ARC_BOX_TOP = ARC_NODE_TOP - ARC_TOP_PAD; // -12.63

const ARC_CONTAINER_W = 1395.334;
const ARC_CONTAINER_H = 1025;

/* Rotation origin for the sweep.

   The wedge is a path whose apex — the second coordinate in its `d`,
   (697.845, 498.319) — is the point it pivots on. That is NOT the same
   as the ring centre (696.154, 499.414) or the badge centre (696.336,
   499.311); the three agree only to within ~1.6px. Rotating about the
   APEX is what keeps the wedge's tip pinned inside the badge instead
   of letting it trace a small circle of its own.

   Expressed as a fraction of the padded box so the origin survives any
   scaling of the art. */
const SWEEP_ORIGIN_X = (697.845 / ARC_BOX_W) * 100; // 50.013%
const SWEEP_ORIGIN_Y = (498.319 / ARC_BOX_H) * 100; // 46.418%

// Ring centre in Arc-Container coordinates — the `</>` glyph is hung
// off this rather than off Figma's own top:456, so the badge, the
// rings and the glyph all resolve from one number.
const RING_CENTER_X = 696.154;
const RING_CENTER_Y = ARC_BOX_TOP + 499.414; // 486.78

// One full sweep. Slow enough to read as a scanning instrument rather
// than a spinner.
const SWEEP_DURATION = 18;

/* Figma stacks the tabs 462px INTO the arc (mb-[-462px] on the arc).

   THE DIAGRAM DOES NOT REFLOW — it is one 1395x1025 composition whose
   rings, blooms and sweep origin are all absolute coordinates inside
   it. So below xl it is SCALED rather than rearranged, and the wrapper
   height and the tab overlap are scaled by the same factors or the
   grid stops sitting where the comp stacks it:

     xl   1.000  ->  1025 tall, 462 overlap   (the comp)
     lg   0.741  ->   760 tall, 342 overlap
     sm   0.546  ->   560 tall, 252 overlap
     base 0.410  ->   420 tall, 189 overlap

   Written literally into the classes below because Tailwind scans for
   literal strings — a template built from these numbers compiles to
   nothing at all. */

/* ------------------------------------------------------------------
   THE SIX STAGES — copy verbatim from the Tabs-Container variants,
   in the order the variants introduce them.
   ------------------------------------------------------------------ */
const STAGES = [
  { title: "VISION", body: "We imagine what’s possible", w: 200 },
  { title: "RESEARCH", body: "We validate with real insights", w: 200 },
  { title: "DESIGN", body: "We design for people & impact", w: 192 },
  { title: "ENGINEERING", body: "We build with precision", w: 200 },
  { title: "LAUNCH", body: "We launch with purpose", w: 200 },
  { title: "SCALE", body: "We scale for a better tomorrow", w: 228 },
];

// Figma authors the three columns at 233 / 232 / 233.
const TILE_WIDTHS = [233, 232, 233];

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Framework = () => {
  const reduceMotion = useReducedMotion();

  return (
    /* No bg utility on the section: the .framework class in globals.css
       owns the surface (--surface-quiet); a hard-coded bg-black was
       fighting the page's gradient arc. */
    <section className="framework relative w-full overflow-hidden py-[var(--section-pad)]">
      {/* HEADING ROW — stays inside the shared 1200 column so this
          section's left edge lands on 120 like every other one. */}
      <Container>
        <motion.div
          className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-end lg:gap-[60px]"
          variants={stage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
        >
          <div className="flex w-full min-w-px flex-1 flex-col gap-[24px]">
            {/* The comp stores this heading with a U+2028 line
                separator, so the two-line break is authored intent
                rather than a width accident — it is made explicit
                here so it survives any change of column width. */}
            <CharReveal
              as="h2"
              className="w-[623px] max-w-full text-[length:var(--text-section)] font-normal leading-[1.2] text-white"
            >
              One Framework, Infinite Possibilities
            </CharReveal>

            <motion.p
              variants={riseIn}
              /* Body copy -> --text-body; the old lg:22px sat in the
                 title tier and competed with the heading hierarchy. */
              className="w-[400px] max-w-full text-[length:var(--text-body)] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
            >
              Every Aashita vertical is built on a shared innovation framework
              that turn ideas into impactful, scalable business.
            </motion.p>
          </div>

          <div className="flex w-full shrink-0 flex-col items-start gap-[32px] lg:w-auto lg:items-end lg:gap-[80px]">
            {/* This eyebrow is the site's only COOL-BLUE one: the comp
                gives the label #a3e4ff over a #086083 bar, against the
                usual #2dfbd9 teal. Both are passed explicitly. */}
            <motion.div variants={riseIn}>
              <Eyebrow label="HOW WE BUILD" color="#a3e4ff" barColor="#086083" barWidth={36} />
            </motion.div>

            {/* BUTTON — PillButton, not Primarybtn. Primarybtn is a 344px
                (w-86) outline pill at 24px with a leading Hugeicons
                glyph and no hover state, which is a different control.
                Figma's button here is 318x50 at 20px with the exported
                16x12 arrow and the gradient hover label parked 49px
                below centre — exactly what PillButton encapsulates, so
                the only local value is the 318px width.

                Figma carries no link destination. /about is where the
                approach and manifesto actually live, so it points there
                rather than at an invented /approach route. */}
            <motion.div variants={riseIn}>
              <PillButton
                label="See Our approach in action"
                href="/about"
                width={318}
              />
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* FRAMEWORK DIAGRAM

          This ESCAPES the 1200 column on purpose. The arc is authored at
          1395.334 wide inside a 1440 frame — Figma parks it at x=-97.67
          relative to the content column precisely so the blooms bleed
          past the gutter on both sides. Constraining it to 1200 would
          crop the orange and cyan blooms, which are the section's whole
          visual payload. Only the diagram escapes; the heading above and
          the stage grid below both stay in Container, so the section
          still reports left:120 width:1200 for its actual content. */}
      <div className="pointer-events-none relative mx-auto mt-[60px] h-[420px] w-full overflow-hidden sm:h-[560px] lg:h-[760px] xl:h-[1025px]">
      <div
        className="absolute left-1/2 top-0 origin-top -translate-x-1/2 scale-[0.41] sm:scale-[0.546] lg:scale-[0.741] xl:scale-100"
        style={{ width: ARC_CONTAINER_W, height: ARC_CONTAINER_H }}
      >
        {/* STATIC PLATE — blooms, four concentric rings, both point
            lights, the centre rule and the white badge. Everything the
            five variants agree on, in one file. */}
        <img
          src={arcRings.src}
          alt=""
          aria-hidden
          className="absolute left-0"
          style={{ top: ARC_BOX_TOP, width: ARC_BOX_W, height: ARC_BOX_H }}
        />

        {/* THE SWEEP — the one thing the variants actually move.

            It is a second SVG sharing the plate's exact viewBox and
            exact box, so the two register with no arithmetic at all:
            the wedge sits where Figma drew it by construction, and only
            the rotation is ours. Splitting it out of the export is what
            made a real continuum possible instead of four snapshots.

            Clipped to the outer ring in the asset, so the wedge reads
            as a dial sweep and never spills past the rings. */}
        <motion.img
          src={arcSweep.src}
          alt=""
          aria-hidden
          className="absolute left-0"
          style={{
            top: ARC_BOX_TOP,
            width: ARC_BOX_W,
            height: ARC_BOX_H,
            transformOrigin: `${SWEEP_ORIGIN_X}% ${SWEEP_ORIGIN_Y}%`,
            willChange: "transform",
          }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: SWEEP_DURATION, repeat: Infinity, ease: "linear" }
          }
        />

        {/* CODE GLYPH — hung off the resolved ring centre rather than
            Figma's literal top:456, so the badge, the rings and the
            glyph all derive from the same coordinate. */}
        <p
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-b from-[#0bb3f9] to-[#013951] bg-clip-text text-[52px] font-semibold leading-[1.1] tracking-[-3.12px] text-transparent"
          style={{ left: RING_CENTER_X, top: RING_CENTER_Y }}
        >
          &lt;/&gt;
        </p>
      </div>
      </div>

      {/* STAGE GRID — back inside the column at Figma's own 1200, lifted
          462px into the arc exactly as the comp stacks it. The lift
          tracks the diagram's scale; below lg the grid also stops being
          an absolutely-centred fixed stack, because three 233px tiles
          need 706px of column and the column is 335 on a phone. */}
      <Container>
        <div
          className="relative -mt-[189px] w-full overflow-clip py-[40px] sm:-mt-[252px] lg:-mt-[342px] lg:h-[464px] lg:py-0 xl:-mt-[462px]"
          style={{
            backgroundImage:
              "linear-gradient(179.37deg, rgba(7,7,7,0) 25.508%, rgba(0,0,0,0.6) 56.821%, rgb(0,0,0) 98.623%)",
          }}
        >
          {/* Figma centres this stack 39px below the box's own centre. */}
          <motion.div
            className="relative flex flex-col items-center lg:absolute lg:left-1/2 lg:top-[calc(50%+39px)] lg:-translate-x-1/2 lg:-translate-y-1/2"
            variants={stage}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            {[0, 1].map((row) => (
              <div
                key={row}
                className="flex w-full flex-wrap items-stretch justify-center gap-[4px] border-t border-white/10 lg:h-[var(--row-h)] lg:w-auto lg:items-center lg:flex-nowrap"
                style={{ "--row-h": `${row === 0 ? 160 : 148}px` }}
              >
                {STAGES.slice(row * 3, row * 3 + 3).map((s, i) => (
                  <motion.div
                    key={s.title}
                    variants={riseIn}
                    className="group/tile flex w-full flex-col items-center justify-center gap-[22px] border-x border-white/10 px-[2px] py-[24px] transition-colors duration-300 hover:bg-white/[0.04] sm:w-[calc(50%_-_4px)] lg:h-full lg:w-[var(--tile-w)] lg:py-0"
                    style={{ "--tile-w": `${TILE_WIDTHS[i]}px` }}
                  >
                    {/* The comp leaves these as plain 30px white squares
                        — placeholders the designer never replaced with
                        real icons. Reproduced as drawn rather than
                        invented, since inventing six icons would be a
                        larger departure than the empty square is. */}
                    <span className="size-[30px] shrink-0 bg-white" />

                    <span className="flex flex-col items-center gap-[12px] text-center">
                      {/* Tile titles -> --text-title (20->24). */}
                      <span className="text-[length:var(--text-title)] font-semibold leading-[1.2] tracking-[-0.4px] text-[#f4f4f4]">
                        {s.title}
                      </span>
                      <span
                        className="w-full text-[14px] font-normal leading-[1.5] tracking-[-0.28px] text-[#9f9f9f] lg:w-[var(--body-w)]"
                        style={{ "--body-w": `${s.w}px` }}
                      >
                        {s.body}
                      </span>
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Framework;
