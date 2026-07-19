"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import torus from "../assets/philosophy/philosophy-torus.png";
import glow from "../assets/philosophy/philosophy-glow.svg";
import nodeRing from "../assets/philosophy/timeline-node-ring.svg";
import nodeDot from "../assets/philosophy/timeline-node-dot.svg";
import rule from "../assets/philosophy/timeline-rule.svg";

/* ==================================================================
   OUR PHILOSOPHY  (Figma 1:3927 "Project container", 1440x1450)

   ON THE EMPTY LOWER HALF — this was investigated before writing a
   line of code, because a 1450px frame holding two timeline rows
   looks exactly like a comp whose remaining stages are hidden or
   clipped. It isn't one. get_metadata on 1:3927 returns the subtree
   fully recursed (it walks eight levels deep on the sibling frames),
   and it lists exactly seventeen descendants: the header stack, two
   rules, two labels, two descriptions, two node groups, and two
   pieces of decorative art. There is no clip window, no hidden row,
   and — decisively — NOT ONE `instance` node anywhere beneath it. No
   instance means no component set, which means no variants, which
   means there is no authored animation to reproduce.

   The "Scroll Animation container" instances that exist elsewhere in
   this file (1:4637, 1:4638) are 1200x580 and are not in this
   subtree, so they belong to some other section.

   What actually fills the lower half is the decorative art, which
   the two-row screenshot makes easy to miss: an 787.65px torus
   (1:3930) hung off the left edge at y=903 and a 431px blurred glow
   (1:3929) at y=1048. Together they span y=903..1690 — they overrun
   the frame's own 1450px bottom. The gradient ramps to its brightest
   teal at exactly 100%, so the lower half is the payoff of the
   background, not a gap where content went missing.

   SO THE MOTION HERE IS DESIGNED, NOT TRANSCRIBED. With no variants
   to interpolate, a scroll-scrub would be invention — and inventing
   a 300vh runway for a section the comp draws as one static screen
   would be worse than restraint. Each row instead reveals once as it
   is reached: the node pops, its rule draws outward from the node,
   and the copy lifts in behind it. That is the smallest gesture that
   still reads as a timeline being traced rather than a list fading
   in, and it costs no extra scroll.
   ================================================================== */

/* ------------------------------------------------------------------
   TIMELINE STAGES

   Only two stages exist in the comp (nodes 1:3940/44 and 1:3942/45).
   They are data rather than markup so the row geometry below is
   authored once — the comp's own 117px pitch already implies more
   stages were intended to follow.
   ------------------------------------------------------------------ */
const STAGES = [
  { label: "Problem", description: "Finding meaningful problems worth solving" },
  {
    label: "Research",
    description: "Market research, user research and competitive analysis.",
  },
];

/* ------------------------------------------------------------------
   DECORATIVE ART

   Positioned as fractions of the 1440x1450 frame rather than in raw
   pixels. Both pieces are anchored well below the copy and deliberately
   bleed off the left edge; pinning them at 1440px would park them mid-
   canvas on a wide display and break that bleed.

   The torus is a rotated square in Figma: a 787.654 box at (-356, 903)
   centring a 571.797 plate turned 58.08deg. Only the centre and the
   plate size survive that — hence the centre-anchored placement.
   ------------------------------------------------------------------ */
const FRAME_W = 1440;
const FRAME_H = 1450;

const TORUS = {
  cx: (-356 + 787.654 / 2) / FRAME_W, // 2.63%
  cy: (903 + 787.654 / 2) / FRAME_H, // 89.44%
  size: 571.797 / FRAME_W, // 39.71%
  rotate: 58.08,
};

const GLOW = {
  // Figma insets the art by -37.12% so the gaussian blur is not clipped;
  // the exported 751px viewBox already contains that bleed, so the box
  // is widened to match instead of letting the blur crop.
  cx: (-63.419 + 431 / 2) / FRAME_W,
  cy: (1048.582 + 431 / 2) / FRAME_H,
  size: (431 * 1.7424) / FRAME_W,
};

const pct = (v) => `${(v * 100).toFixed(4)}%`;

/* Rows share one reveal shape. Eased hard out so each row settles
   rather than arriving at constant speed — the rule in particular
   reads as being drawn only if it decelerates into place. */
const EASE = [0.22, 1, 0.36, 1];

const Product_Philosophy = () => {
  const reduceMotion = useReducedMotion();

  /* Reduced motion resolves every row to its final state and skips the
     stagger entirely. There is no scroll runway to collapse here — the
     section is its natural height either way — so this is purely about
     removing the transforms. */
  const reveal = (delay, duration = 0.7) =>
    reduceMotion
      ? {}
      : {
          initial: "hidden",
          whileInView: "shown",
          viewport: { once: true, amount: 0.6 },
          transition: { duration, ease: EASE, delay },
        };

  return (
    <section
      className="product-philosophy relative w-full overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #011720 0%, #02534B 49.971%, #047D6B 74.981%, #02C5A5 100%)",
      }}
    >
      {/* ================= DECORATIVE ART =================
          Behind everything and inert to assistive tech. */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* GLOW — an SVG whose only content is a blurred circle. Figma
            exports it with preserveAspectRatio="none", so BOTH axes are
            set explicitly; leaving either to `auto` would blow it up to
            the 751px viewBox. */}
        <img
          src={glow.src}
          alt=""
          className="absolute"
          style={{
            left: pct(GLOW.cx),
            top: pct(GLOW.cy),
            width: pct(GLOW.size),
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* TORUS — a 1254px plate rendered at roughly 572px, so it goes
            through next/image to avoid shipping four times the pixels
            the layout ever uses. */}
        <div
          className="absolute"
          style={{
            left: pct(TORUS.cx),
            top: pct(TORUS.cy),
            width: pct(TORUS.size),
            aspectRatio: "1 / 1",
            transform: `translate(-50%, -50%) rotate(${TORUS.rotate}deg)`,
          }}
        >
          <Image
            src={torus}
            alt=""
            fill
            sizes="40vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      {/* Figma's 120px margin on a 1440 frame is 8.333%, so the column is
          expressed as a fraction and capped at the comp's own 1200px. */}
      <div className="relative z-10 mx-auto w-[83.333%] max-w-[1200px]">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-[16px] pt-[90px] lg:flex-row lg:items-start">
          <motion.div
            className="flex flex-1 flex-col gap-[24px]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              shown: { opacity: 1, y: 0 },
            }}
            {...reveal(0)}
          >
            <h2 className="max-w-[623px] text-[clamp(2rem,3.6vw,3.25rem)] font-normal leading-[1.2] text-white">
              Every Product Begins
              <br />
              With A Real Problem
            </h2>
            <p className="max-w-[525px] text-[clamp(1rem,1.53vw,1.375rem)] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]">
              We solve real human challenges with intelligent, scalable products
              that create measurable impact.
            </p>
          </motion.div>

          {/* EYEBROW — right-aligned against the same column edge the
              rules terminate on, so the two share one margin. */}
          <motion.div
            className="flex shrink-0 items-center gap-[16px] lg:pt-[4px]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              shown: { opacity: 1, y: 0 },
            }}
            {...reveal(0.1)}
          >
            <span className="h-[4px] w-[22px] shrink-0 rounded-full bg-[#e3e3e3]" />
            <p className="whitespace-nowrap text-[clamp(1rem,1.53vw,1.375rem)] font-semibold leading-[1.5] tracking-[-0.44px] text-[#a3e4ff]">
              OUR PHILOSOPHY
            </p>
          </motion.div>
        </div>

        {/* ================= TIMELINE ROWS =================
            Figma stacks rows on a 117px pitch: node top 384 then 501,
            with the rule centred on the node (397 / 514) and the copy
            42px below the node's top. Those three offsets are what the
            row block below reproduces. */}
        <div className="mt-[80px] flex flex-col gap-[39px] pb-[60px]">
          {STAGES.map((stage, i) => {
            // Rows trail each other by a beat so the timeline reads as
            // being traced downward rather than appearing at once.
            const base = 0.15 * i;

            return (
              <div key={stage.label} className="flex flex-col">
                {/* RAIL — node and its rule share one 26px band. */}
                <div className="relative h-[26px]">
                  {/* RULE — grown with scaleX from the node outward.
                      Scaling is deliberate over animating width: width
                      is a layout property and would reflow the row on
                      every frame, while a transform is composited. The
                      origin is the left edge because in the comp the
                      line begins at the node's centre (x=133 = node
                      centre) and runs to the column edge. */}
                  <motion.div
                    className="absolute left-[13px] right-0 top-1/2 h-[2px] origin-left -translate-y-1/2"
                    variants={{
                      hidden: { scaleX: 0 },
                      shown: { scaleX: 1 },
                    }}
                    {...reveal(base + 0.15, 0.9)}
                  >
                    <img
                      src={rule.src}
                      alt=""
                      aria-hidden="true"
                      className="block h-[2px] w-full"
                    />
                  </motion.div>

                  {/* NODE — ring plus an inner dot, both exported art.
                      The dot is concentric with the ring in the comp
                      (both centre on x=133), so it is centred here
                      rather than offset by Figma's raw 5px inset. */}
                  <motion.div
                    className="absolute left-0 top-0 size-[26px]"
                    variants={{
                      hidden: { scale: 0.4, opacity: 0 },
                      shown: { scale: 1, opacity: 1 },
                    }}
                    {...reveal(base)}
                  >
                    <img
                      src={nodeRing.src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 size-[26px]"
                    />
                    <img
                      src={nodeDot.src}
                      alt=""
                      aria-hidden="true"
                      className="absolute left-[5px] top-[5px] size-[16px]"
                    />
                  </motion.div>
                </div>

                {/* COPY — label hard left, description hard right, both
                    on the column edges the rule spans between. They
                    stack below the lg breakpoint because the comp's
                    693px uppercase description has nowhere to go on a
                    narrow column without colliding with the label. */}
                <motion.div
                  className="mt-[16px] flex flex-col gap-[8px] lg:flex-row lg:items-baseline lg:justify-between lg:gap-[40px]"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    shown: { opacity: 1, y: 0 },
                  }}
                  {...reveal(base + 0.25)}
                >
                  <p className="shrink-0 text-[clamp(1rem,1.53vw,1.375rem)] font-bold uppercase leading-[1.64] tracking-[-0.44px] text-white">
                    {stage.label}
                  </p>
                  <p className="text-[clamp(1rem,1.53vw,1.375rem)] font-normal uppercase leading-[1.64] tracking-[-0.44px] text-white lg:text-right">
                    {stage.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DECORATIVE RUNOUT — the comp devotes its lower 830px to the
          gradient and the torus with no content at all. Held as an
          aspect-ratio spacer rather than a fixed 830px so the art keeps
          its proportion to the section at any width. */}
      <div
        className="relative w-full"
        style={{ aspectRatio: `${FRAME_W} / 700` }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Product_Philosophy;
