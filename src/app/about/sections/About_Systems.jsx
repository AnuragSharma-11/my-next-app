"use client";
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

import teamPhoto from "../assets/systems/systems-team-photo.png";

/* ------------------------------------------------------------------
   MOTION

   The Figma component set (3:701) ships three variants that are three
   SAMPLES OF ONE CONTINUOUS ANIMATION, not three discrete states.
   Diffing their geometry makes the intent unambiguous — the photo
   grows from a right-hand card to a full-bleed cover while the copy
   dims underneath it:

     sample        photo box (l, t, w, h)      copy opacity
     Default       777, 185, 543 x 305.44      1.0
     Variant2      655,  90, 665 x 374         0.6
     Variant3        0,  18, 1440 x 810        0.2

   Every one of left/top/width/height moves monotonically, and the box
   holds 16:9 throughout — a uniform scale-up whose anchor drifts.

   TWO DELIBERATE DEPARTURES FROM THE COMP:

   1. Everything below is expressed as a FRACTION of the stage, not as
      the raw 1440x828 pixels Figma authored. The comp is one fixed
      artboard; a browser is not. Pinning the stage at 1440 would leave
      a 2560px display framing the scene in dead black, and the photo
      would never actually reach full bleed. Fractions make the same
      composition resolve at any viewport.

   2. The photo animates via TRANSFORM (translate + scale), never via
      left/top/width/height. Those four are layout properties: changing
      them forces the browser to recompute layout every frame, which is
      what makes a scroll-scrub feel gritty. Transforms are handled on
      the compositor, so the same motion runs on the GPU and stays
      smooth. This is the single biggest lever on how good this feels.

   The end state buries the copy under a full-bleed image, so this has
   to be scroll-driven rather than a play-once entrance — otherwise the
   section is stranded on an unreadable frame forever.
   ------------------------------------------------------------------ */

// The Figma frame these fractions were derived from.
const FRAME_W = 1440;
const FRAME_H = 828;

// Photo box per sample, as fractions of the stage.
const BOX = [
  { x: 777 / FRAME_W, y: 185 / FRAME_H, w: 543 / FRAME_W, h: 305.44 / FRAME_H },
  { x: 655 / FRAME_W, y: 90 / FRAME_H, w: 665 / FRAME_W, h: 374 / FRAME_H },
  { x: 0, y: 0, w: 1, h: 1 }, // full bleed — the comp's 1440x810 in a 1440x828 frame
];

// Figma samples land at 0 / 0.5 / 1 of the scrub.
const KEYS = [0, 0.5, 1];

const pct = (v) => `${(v * 100).toFixed(4)}%`;

const About_Systems = () => {
  const scrubRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // "end end" ends the scrub exactly as the sticky stage unpins, so the
  // photo lands full-bleed rather than mid-grow.
  const { scrollYProgress } = useScroll({
    target: scrubRef,
    offset: ["start start", "end end"],
  });

  /* Raw scroll progress steps in discrete jumps — one value per scroll
     event, and a trackpad flick delivers those unevenly. Feeding it
     through a spring gives the photo a small amount of inertia so it
     glides between samples instead of snapping. Low stiffness + high
     damping = smoothing without visible bounce or lag. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0001,
  });

  // transform-origin is the stage's top-left, so translate positions the
  // box and scale sizes it — together they reproduce the Figma rect.
  const x = useTransform(progress, KEYS, BOX.map((b) => pct(b.x)));
  const y = useTransform(progress, KEYS, BOX.map((b) => pct(b.y)));
  const scaleX = useTransform(progress, KEYS, BOX.map((b) => b.w));
  const scaleY = useTransform(progress, KEYS, BOX.map((b) => b.h));

  const copyOpacity = useTransform(progress, KEYS, [1, 0.6, 0.2]);

  // The frame reads as a card early on and must be gone by full bleed,
  // so it fades out rather than sitting as a hairline across the screen.
  const frameOpacity = useTransform(progress, [0, 0.75, 1], [1, 0.5, 0]);

  // Reduced motion collapses the scroll runway too — leaving 300vh of
  // dead scroll for an animation that never plays is worse than the
  // animation itself.
  const photoStyle = reduceMotion
    ? {
        x: pct(BOX[0].x),
        y: pct(BOX[0].y),
        scaleX: BOX[0].w,
        scaleY: BOX[0].h,
      }
    : { x, y, scaleX, scaleY };

  return (
    <section
      ref={scrubRef}
      className="about-systems relative w-full bg-[#0f0f0f]"
      style={{ height: reduceMotion ? "100vh" : "300vh" }}
    >
      {/* PINNED STAGE — a true 100vw x 100vh box. The scene is composed
          inside this, so "full bleed" means the actual viewport. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* COPY BLOCK — holds position, only dims as the photo takes over.
            Figma's 120px left margin is 8.333% of the 1440 frame, so it
            scales with the viewport instead of hugging the left edge on
            wide displays. Type uses clamp() for the same reason: 3.6vw
            resolves to exactly 52px at 1440 and grows from there, with a
            ceiling so it cannot run away on ultrawide. */}
        <motion.div
          className="absolute left-[8.333%] top-[10.87%] z-10 flex w-[32.3%] flex-col gap-[clamp(1rem,2.2vw,2rem)]"
          style={{ opacity: reduceMotion ? 1 : copyOpacity }}
        >
          <h2 className="text-[clamp(2rem,3.6vw,4rem)] font-normal leading-[1.2] text-white">
            We Think In Systems, <span className="text-[#2dfbd9]">Not Silos</span>
          </h2>
          <p className="text-[clamp(1rem,1.53vw,1.65rem)] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]">
            We see the bigger picture, connect knowledge, own outcomes, and build
            for the future.
          </p>
        </motion.div>

        {/* EYEBROW — pinned in all three samples. Its right edge sits at
            1320 of 1440, i.e. the same 8.333% inset as the copy on the
            left, so anchoring it by `right` keeps the two margins equal
            at any width instead of drifting apart. */}
        <div className="absolute right-[8.333%] top-[10.87%] z-10 flex items-center gap-[16px]">
          <span className="h-[4px] w-[22px] shrink-0 bg-[#2dfbd9]" />
          <p className="whitespace-nowrap text-[clamp(1rem,1.53vw,1.65rem)] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
            THE AASHITA MANIFESTO
          </p>
        </div>

        {/* PHOTO — sized to the full stage and scaled DOWN into the card
            position, rather than sized small and grown. That way the end
            state is exactly 100% of the viewport with no rounding drift,
            and the browser only ever compositing a transform.

            willChange promotes it to its own layer up front, so the first
            scroll frame doesn't pay for the promotion. */}
        <motion.div
          className="absolute inset-0 z-20 origin-top-left overflow-hidden"
          style={{ ...photoStyle, willChange: "transform" }}
        >
          <Image
            src={teamPhoto}
            alt="Aashita designers, engineers and strategists mapping a system together around one table"
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            priority={false}
          />

          {/* CARD FRAME — inset ring drawn with box-shadow rather than a
              border, because a border would change the element's box and
              drag layout back into a transform-only animation. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: reduceMotion ? 1 : frameOpacity,
              boxShadow: "inset 0 0 0 4px #272727",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About_Systems;
