"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook02Icon,
  InstagramIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";

import Navbar from "../../components/Navbar";

import beamWide from "../assets/product-hero/beam-wide.svg";
import beamNarrow from "../assets/product-hero/beam-narrow.svg";
import beamSwirl from "../assets/product-hero/beam-swirl.png";
import cursorGlyph from "../assets/product-hero/cursor-glyph.svg";
import arrow from "../assets/product-hero/arrow-right.svg";

/* ------------------------------------------------------------------
   THE STAGE

   The beam, the swirl, the five pills and the cursor are one rigid
   composition: every pill is placed relative to where the beam narrows.
   Reflowing them independently would peel the labels off the light they
   sit in, so they all live inside a single fixed 1440x946 stage that is
   scaled as a unit.

   CSS cannot do that scale on its own — transform: scale() needs a
   unitless number and calc(100vh / 946) yields a length — so the factor
   is measured once per resize. Cheap: it only writes a single number
   into a transform, and the browser composites the whole subtree.

   Only the right-hand artwork lives in here. The copy on the left stays
   in normal flow with percentage margins, because scaling the stage
   would scale the headline too and 62px type has no business growing to
   90px on a tall monitor.
   ------------------------------------------------------------------ */
const FRAME_W = 1440;
const FRAME_H = 946;

/* ------------------------------------------------------------------
   BEAM GEOMETRY

   Both beam SVGs carry a baked-in feGaussianBlur, and Figma pads the
   export canvas to hold the blur spill: the wide beam is a 634x983 shape
   inside a 754x1103 viewBox, i.e. exactly 60px of transparent margin on
   every side. Placing the file at the shape's coordinates would push the
   beam 60px down and right of where it belongs.

   The values below are the PADDED box — the shape's Figma position minus
   that 60px margin — so the art lands where the comp put it.

   Both files also export with preserveAspectRatio="none", which makes
   object-contain a no-op: the art simply stretches to whatever box it is
   handed. Width AND height are therefore both pinned to the viewBox's
   own numbers, never left to `auto`.
   ------------------------------------------------------------------ */
const BEAM_PAD = 60;
const BEAMS = [
  { src: beamWide, x: 744.25 - BEAM_PAD, y: -26 - BEAM_PAD, w: 754, h: 1103 },
  { src: beamNarrow, x: 860 - BEAM_PAD, y: -26 - BEAM_PAD, w: 528, h: 1103 },
];

/* Swirl behind the pills: a 1254x1254 PNG the comp draws at 429px and
   turns -16.93deg. next/image serves it down rather than shipping the
   full raster for a third of its size. Positioned by CENTRE because the
   rotation is about the centre — anchoring by corner would swing it. */
const SWIRL = { size: 429.188, cx: 1052.78, cy: 747.62, rotate: -16.93 };

/* Cursor glyph, 41.46x41.45 per its viewBox, rotated -25.37deg. Same
   centre-anchoring reason as the swirl. */
const CURSOR = { w: 41.4628, h: 41.447, cx: 996.97, cy: 726.97, rotate: -25.37 };

/* ------------------------------------------------------------------
   PRODUCT PILLS

   Five near-identical chips that differ only in label, centre and tilt,
   so they are data. cx/cy are the CENTRE of each pill's Figma box — the
   pills are rotated, and a rotation is only stable about a centre.

   `float` is the drift below: amplitude in px, degrees of sway, and a
   period. Each pill gets its own numbers so the cluster never pulses in
   lockstep, which is what would make it read as one sliding sheet
   instead of five things suspended in a beam.
   ------------------------------------------------------------------ */
const PILLS = [
  { label: "ebyai", cx: 1076.5, cy: 565, rotate: 0, drift: 9, sway: 1.6, period: 6.4 },
  { label: "crmsuite", cx: 1029.37, cy: 627.61, rotate: 2.99, drift: 12, sway: 2.2, period: 7.8 },
  { label: "listurad", cx: 937.85, cy: 689.74, rotate: -4.79, drift: 10, sway: 1.8, period: 5.9 },
  { label: "cancercare", cx: 1099.73, cy: 713.25, rotate: 4.61, drift: 14, sway: 2.4, period: 8.6 },
  { label: "fintech", cx: 891.28, cy: 762.27, rotate: -8.89, drift: 11, sway: 2.0, period: 7.1 },
];

/* ------------------------------------------------------------------
   MOTION

   NOTHING HERE IS AUTHORED IN FIGMA. The node was checked for it: the
   only `instance` nodes in 1:3800 are the three social icons, and their
   component set ships a single "Default" variant. The five pills are
   plain frames, not instances, so there is no variant series to read a
   timeline out of. The drift below is designed, not transcribed.

   It is deliberately small. The pills are captions on a beam of light —
   the moment they travel far enough to trade places, the composition
   the designer built stops being the composition on screen.

   Everything animates through transform (y + rotate) rather than top or
   margin, so each pill stays on the compositor and the loop costs no
   layout work at all.
   ------------------------------------------------------------------ */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const Product_Hero = () => {
  const reduceMotion = useReducedMotion();

  // 1 until the browser reports a height, so SSR and the first paint
  // agree and the stage never flashes at the wrong size.
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => setScale(window.innerHeight / FRAME_H);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      className="product-hero relative h-screen w-full overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #011720 0%, #02534B 49.971%, #047D6B 74.981%, #02C5A5 100%)",
      }}
    >
      <Navbar />

      {/* LIGHT BEAM STAGE — scaled from the top-right so the beam always
          reaches the top of the viewport and the pills ride with it.
          pointer-events-none because it is scenery: it overlaps the copy
          column on narrow viewports and must never eat those clicks. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 origin-top-right"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          transform: `scale(${scale})`,
        }}
      >
        {/* BEAMS — two overlapping cones, the narrow one riding inside the
            wide one to give the core its hotter centre. */}
        {BEAMS.map((beam) => (
          <img
            key={beam.src.src}
            src={beam.src.src}
            alt=""
            className="absolute"
            style={{ left: beam.x, top: beam.y, width: beam.w, height: beam.h }}
          />
        ))}

        {/* SWIRL — the soft concentric arcs the pills sit on top of.
            It turns very slowly so the cluster reads as suspended in
            something moving rather than pinned to a still backdrop. */}
        <motion.div
          className="absolute"
          style={{
            width: SWIRL.size,
            height: SWIRL.size,
            left: SWIRL.cx - SWIRL.size / 2,
            top: SWIRL.cy - SWIRL.size / 2,
          }}
          initial={{ rotate: SWIRL.rotate }}
          animate={reduceMotion ? undefined : { rotate: SWIRL.rotate + 360 }}
          transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src={beamSwirl}
            alt=""
            width={SWIRL.size}
            height={SWIRL.size}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* PRODUCT PILLS — the outer div holds the static placement so
            the inner motion element is free to own transform outright;
            stacking placement and animation on one node would mean the
            keyframes overwrite the position. */}
        {PILLS.map((pill, i) => (
          <div
            key={pill.label}
            className="absolute"
            style={{
              left: pill.cx,
              top: pill.cy,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              className="flex items-center justify-center whitespace-nowrap rounded-[12520px] px-[12px] py-[8px] text-[18px] font-bold leading-[20px] text-white drop-shadow-[2px_4px_10px_rgba(0,44,37,0.6)]"
              style={{
                backgroundImage: "linear-gradient(90deg, #007661 0%, #001821 100%)",
              }}
              initial={{ opacity: 0, y: pill.drift + 18, rotate: pill.rotate }}
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0, rotate: pill.rotate }
                  : {
                      opacity: 1,
                      y: [-pill.drift, pill.drift, -pill.drift],
                      rotate: [
                        pill.rotate - pill.sway,
                        pill.rotate + pill.sway,
                        pill.rotate - pill.sway,
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0.5 }
                  : {
                      opacity: { duration: 0.8, delay: 0.3 + i * 0.12 },
                      y: {
                        duration: pill.period,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      },
                      rotate: {
                        duration: pill.period,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      },
                    }
              }
            >
              {pill.label}
            </motion.div>
          </div>
        ))}

        {/* CURSOR GLYPH — drifts on the same easing as the pills but at
            its own pace, so it looks like part of the same field. */}
        <motion.img
          src={cursorGlyph.src}
          alt=""
          className="absolute"
          style={{
            width: CURSOR.w,
            height: CURSOR.h,
            left: CURSOR.cx - CURSOR.w / 2,
            top: CURSOR.cy - CURSOR.h / 2,
          }}
          initial={{ rotate: CURSOR.rotate }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [-7, 7, -7],
                  rotate: [CURSOR.rotate - 2, CURSOR.rotate + 2, CURSOR.rotate - 2],
                }
          }
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 h-full"
        variants={stage}
        initial="hidden"
        animate="visible"
      >
        {/* HEADING + BODY — Figma's 120px left inset is 8.333% of the 1440
            frame, so it tracks the viewport instead of hugging the edge on
            wide displays. The stack's own 161px top is 17.02% of 946. */}
        <div className="absolute left-[8.333%] top-[17.02%] flex w-[658px] max-w-[45.7%] flex-col gap-[60px]">
          <div className="flex flex-col gap-[24px]">
            <motion.h1
              variants={riseIn}
              className="text-[62px] font-normal leading-[1.2] text-white"
            >
              We build
              <br />
              What matters
              <br />
              <span className="text-[#03ceb4]">For a better tomorrow</span>
            </motion.h1>

            <motion.p
              variants={riseIn}
              className="max-w-[624px] text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3]"
            >
              Our products are built on a shared foundation of AI, designed to
              solve complex problems, power industries, and create meaningful
              impact at scale.
            </motion.p>
          </div>

          {/* SCROLL BUTTON — the arrow is the same 16x12 export as the
              horizontal one in the comp, turned 90deg. Rotating it here
              beats shipping a second identical file. */}
          <motion.a
            variants={riseIn}
            href="#products"
            className="group flex h-[50px] w-[240px] items-center justify-center gap-[8px] rounded-[1200px] border border-solid border-white transition-colors duration-300 hover:bg-white/10"
          >
            <span className="text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
              Scroll down
            </span>
            <motion.span
              className="flex h-[16px] w-[12px] items-center justify-center"
              animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={arrow.src}
                alt=""
                className="rotate-90"
                style={{ width: 16, height: 12 }}
              />
            </motion.span>
          </motion.a>
        </div>

        {/* SOCIAL ICONS — reused wholesale from the home hero so the two
            pages cannot drift apart. Figma's chip is 36px with a 20px
            glyph, which is p-[8px] around a size-20 icon. */}
        <motion.div
          variants={riseIn}
          className="absolute bottom-[50px] left-[8.333%] flex items-center gap-[10px]"
        >
          {[
            { icon: Facebook02Icon, href: "https://www.facebook.com/aashita.ai/", label: "Facebook" },
            { icon: NewTwitterIcon, href: "https://x.com/aashita_ai", label: "X" },
            { icon: InstagramIcon, href: "https://www.instagram.com/aashita.ai/", label: "Instagram" },
          ].map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              aria-label={social.label}
              className="flex items-center justify-center rounded-[1200px] bg-white/10 p-[8px] text-white transition-colors duration-300 hover:bg-white/20"
            >
              <HugeiconsIcon
                icon={social.icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Product_Hero;
