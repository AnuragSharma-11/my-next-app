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

import Container from "../components/Container";
import Eyebrow from "../components/Eyebrow";

import backdropGlow from "./assets/overview/backdrop-glow.svg";
import bgImage from "./assets/overview/bgimg.svg";
import arrow from "./assets/overview/arrow-right.svg";
/* The cliff photo already shipped in this repo as a 3080x2232 public
   asset. Figma exports the same photograph at 1672x1211 — verified by
   fingerprinting both down to 8x8, which matched to within one level per
   channel. Importing the existing file instead of committing a second
   2.6MB copy keeps one source of truth, and the larger original is the
   better master anyway: this image ends the animation at full bleed, so
   next/image needs headroom above 1440 to serve wide displays. */
/* The studio photo the user placed in this section's own asset
   folder — replaces the earlier cliff-city plate. */
import cliffCity from "./assets/overview/bg-122334455.png";

/* ------------------------------------------------------------------
   MOTION

   The Figma component set (1:5924) ships FOUR variants that are four
   SAMPLES OF ONE CONTINUOUS ANIMATION, not four states. Diffing their
   geometry makes the intent unambiguous — the photo grows out of its
   card and swallows the frame, the intro copy dims underneath it, and a
   second headline is then revealed on top of the full-bleed image:

     sample    photo box (l, t, w, h)     copy   eyebrow      overlay
     Default   550, 418, 770 x 558        1.0    OVERVIEW     —
     Variant2  235, 190, 1085 x 786       0.6    OVERVIEW     —
     Variant3   -2, -22, 1448 x 956       0.4    WHO WE ARE   entering
     Variant4   -2, -22, 1448 x 956       0.4    WHO WE ARE   settled

   Two things fall out of that table. First, every one of left/top/
   width/height moves monotonically across the first three samples — a
   scale-up whose anchor drifts toward the top-left. Second, Variant3
   and Variant4 share identical photo geometry, so the last leg is not
   photo motion at all: it is the reveal of the "Aashita Enterprises"
   headline, its subheading and the rule above them, each sliding up
   through an overflow-clip mask that Figma drew around them.

   So the run has two acts, and the four samples land at 0 / 0.34 /
   0.67 / 1 of one scrub.

   THIS HAS TO BE SCROLL-DRIVEN. The end state covers the intro copy
   with a full-bleed photograph and puts different words on top of it.
   A play-once entrance would strand the section on that frame forever,
   and the "Founded in 2012..." paragraph would never be readable.

   TWO DELIBERATE DEPARTURES FROM THE COMP:

   1. The photo box is expressed as a FRACTION of the stage, not as the
      raw pixels Figma authored. The comp is one fixed 1440x934
      artboard; a browser is not. Pinning it at 1440 would frame the
      scene in dead black on a wide display and the photo would never
      actually reach full bleed. Fractions make the same composition
      resolve at any viewport. The end box is snapped to exactly
      (0,0,1,1) rather than the comp's 8px/22px overscan, so full bleed
      is true full bleed with no rounding drift.

   2. The photo animates via TRANSFORM only — never left/top/width/
      height. Those four are layout properties: changing them forces the
      browser to recompute layout every frame, which is precisely what
      makes a scroll-scrub feel gritty. Transforms composite on the GPU.
      This is the single biggest lever on how good this feels.
   ------------------------------------------------------------------ */

// The Figma frame these fractions were derived from.
const FRAME_W = 1440;
const FRAME_H = 934;

// Photo box per sample, as fractions of the stage.
const BOX = [
  { x: 550 / FRAME_W, y: 418 / FRAME_H, w: 770 / FRAME_W, h: 558 / FRAME_H },
  { x: 235 / FRAME_W, y: 190 / FRAME_H, w: 1085 / FRAME_W, h: 786 / FRAME_H },
  { x: 0, y: 0, w: 1, h: 1 },
  { x: 0, y: 0, w: 1, h: 1 },
];

// Where the four Figma samples land along the scrub.
const KEYS = [0, 0.34, 0.67, 1];

const pct = (v) => `${(v * 100).toFixed(4)}%`;

const Overview = () => {
  const scrubRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // "end end" ends the scrub exactly as the sticky stage unpins, so the
  // reveal lands settled rather than mid-slide.
  const { scrollYProgress } = useScroll({
    target: scrubRef,
    offset: ["start start", "end end"],
  });

  /* Raw scroll progress arrives in discrete jumps — one value per scroll
     event, and a trackpad flick delivers those very unevenly. Feeding it
     through a spring gives the scene a little inertia so it glides
     between samples instead of snapping. Low stiffness + high damping is
     smoothing without visible bounce or lag. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0001,
  });

  // transform-origin is the stage's top-left, so translate positions the
  // box and scale sizes it — together they reproduce the Figma rect.
  const photoX = useTransform(progress, KEYS, BOX.map((b) => pct(b.x)));
  const photoY = useTransform(progress, KEYS, BOX.map((b) => pct(b.y)));
  const photoScaleX = useTransform(progress, KEYS, BOX.map((b) => b.w));
  const photoScaleY = useTransform(progress, KEYS, BOX.map((b) => b.h));

  // The black dim tracks COVERAGE: it starts at 0 when the photo covers
  // ~70% of the screen (progress ~0.25) and reaches its full — but still
  // slight (0.32) — value exactly as the photo hits full bleed (progress
  // ~0.67), holding there. So the image visibly, gradually dims as it
  // grows to fill the screen, then stays gently dark under the reveal.
  const scrimOpacity = useTransform(progress, [0.25, 0.67], [0, 1]);

  /* Fades the intro layer FULLY out as the photo grows to full bleed,
     rather than settling at 0.4 — at 0.4 the copy stayed visible under
     the expanding image and read as text bleeding behind it. Gone by
     the time the photo covers it (sample 3), so the handoff is clean. */
  const copyOpacity = useTransform(progress, KEYS, [1, 0.45, 0, 0]);

  /* The eyebrow does not just recolour — the words change, OVERVIEW to
     WHO WE ARE. Two Eyebrow instances stacked and crossfaded is the only
     honest way to scrub that; you cannot tween a string. */
  const eyebrowAOpacity = useTransform(progress, KEYS, [1, 1, 0, 0]);
  const eyebrowBOpacity = useTransform(progress, KEYS, [0, 0, 1, 1]);

  // The 134px rule under the copy swaps solid teal for a blue gradient
  // on the same schedule as the eyebrow.
  const barAOpacity = eyebrowAOpacity;
  const barBOpacity = eyebrowBOpacity;

  /* The heading goes 42px -> 52px across the last two samples. Animating
     font-size would relayout every frame, so this is a scale from the
     42px base instead: 52/42 = 1.2381, anchored left so the first
     character stays put. It is only partly visible by the time it
     finishes, but leaving it out would put a visible size jump between
     the samples. */
  const headingScale = useTransform(progress, KEYS, [1, 1, 52 / 42, 52 / 42]);

  // The outlined pill fills with a gradient and drops its border.
  const btnFillOpacity = useTransform(progress, KEYS, [0, 1, 1, 1]);
  const btnBorder = useTransform(progress, KEYS, [
    "rgba(255,255,255,1)",
    "rgba(255,255,255,0)",
    "rgba(255,255,255,0)",
    "rgba(255,255,255,0)",
  ]);

  // The glow behind everything rides up 47px between the first two
  // samples. Transform, not top, for the same reason as the photo.
  const glowY = useTransform(progress, KEYS, [0, -47, -47, -47]);

  /* THE REVEAL — Variant3 holds the overlay text pushed below its own
     clip window, Variant4 has it settled at the top. That is a masked
     slide-up, so it is a translate of 100% inside an overflow-clip box.
     The rule above it draws out from 12px to the full 1200px column,
     which is a scaleX from 0.01 rather than a width animation. */
  const ruleScaleX = useTransform(progress, KEYS, [0.01, 0.01, 0.01, 1]);
  const ruleOpacity = useTransform(progress, KEYS, [0, 0, 0, 1]);
  const revealY = useTransform(progress, KEYS, ["100%", "100%", "100%", "0%"]);

  /* Reduced motion collapses the animation AND the runway together.
     Leaving 400vh of dead scroll for a scrub that never plays is worse
     than the scrub itself. Frozen at sample 0, which is the state where
     all the copy is readable. */
  const photoStyle = reduceMotion
    ? {
        x: pct(BOX[0].x),
        y: pct(BOX[0].y),
        scaleX: BOX[0].w,
        scaleY: BOX[0].h,
      }
    : { x: photoX, y: photoY, scaleX: photoScaleX, scaleY: photoScaleY };

  const still = (v, frozen) => (reduceMotion ? frozen : v);

  return (
    <section
      ref={scrubRef}
      className="overview relative w-full"
      style={{ height: reduceMotion ? "100vh" : "400vh" }}
    >
      {/* PINNED STAGE — a true 100vw x 100vh box, so "full bleed" at the
          end of the scrub means the actual viewport rather than 1440.
          The stage paints NO background of its own: the .overview class
          in globals.css owns the section's surface (--surface-quiet),
          and an inline ramp here restarted the page's gradient arc. */}
      <motion.div className="sticky top-0 h-screen w-full overflow-clip">
        {/* PALETTE BASE — the HERO's own gradient, so the pinned Overview
            view shares the hero's colour family (dark base climbing to
            teal) instead of the flat navy it had. Everything else layers
            over this. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "var(--gradient-primary)" }}
        />

        {/* AMBIENT BACKDROP — the teal light-ribbon (bgimg). It is teal
            on BLACK, so mix-blend-screen drops the black entirely and
            only the glowing wave adds light over the navy surface —
            immersive, not a competing dark plate. Sits on the right,
            where the intro's negative space is, and is knocked back so
            it reads as atmosphere behind the copy rather than subject.
            z-0: below the glow, the copy and the growing photo, so the
            photo still covers it cleanly at full bleed. */}
        <img
          src={bgImage.src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full w-[70%] object-cover opacity-[0.55] mix-blend-screen [mask-image:linear-gradient(90deg,transparent_0%,black_45%)]"
        />

        {/* BACKDROP GLOW — four heavily blurred ellipses.

            The blur pads the export canvas well beyond the layer box:
            Figma's own inset is -70% / -68.55% / -87.34% / -68.64% on a
            1151x916 box, which works out to the 2730 x 2357.19 viewBox
            the file actually carries. So the art is NOT centred in its
            own file and cannot be placed by centring it.

            Both width and height are pinned from that viewBox because
            the export sets preserveAspectRatio="none" — object-contain is
            a no-op on these files and the art would stretch to its box. */}
        {/* Knocked back to 18%: at full strength this plate painted the
            whole section bright teal-green, hiding the #012532 field
            the section shares with the hero's dark base (per review —
            "use the hero's blue here too"). At 18% it reads as ambient
            light on the blue, not a different colour. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[452px] h-[916px] w-[1151px] -translate-x-1/2 opacity-[0.18]"
          style={{ y: still(glowY, 0) }}
        >
          <img
            src={backdropGlow.src}
            alt=""
            className="max-w-none"
            style={{
              width: 2730,
              height: 2357.19,
              marginLeft: -0.6864 * 1151,
              marginTop: -0.7 * 916,
            }}
          />
        </motion.div>

        {/* INTRO COPY — holds position and only dims as the photo takes
            over, exactly as the samples do. Figma's content stack starts
            at y=60 of 934 and runs 789px tall; as percentages of the
            stage that is a 6.42% top inset and 84.5% of the height, which
            keeps the same proportions at any viewport height. */}
        <motion.div
          className="absolute inset-0 z-10 pt-[6.42%]"
          style={{ opacity: still(copyOpacity, 1) }}
        >
          {/* The 84.5% height is what pins the eyebrow to the top of the
              stage and the rule to its bottom. That only reads as a
              composition when the two columns sit side by side; once
              they stack the same height just strands the copy, so the
              proportion — and the row — start at lg. */}
          <Container className="flex flex-col gap-[32px] lg:h-[84.5%] lg:flex-row lg:items-stretch lg:gap-0">
            {/* LEFT COLUMN — one clean left-aligned stack now: the
                eyebrow, the display heading and the Eco-System button
                form the TOP group (all sharing the gutter edge), and
                the intro copy is pinned to the BOTTOM. This replaces
                the old split where the heading floated in a separate
                right column, disconnected from the left edge. Widened
                to 600px so the 564px heading fits. */}
            <div className="flex w-full shrink-0 flex-col justify-between gap-[40px] lg:w-[600px] lg:gap-0">
              {/* TOP GROUP — eyebrow, heading, button, left-aligned. */}
              <div className="flex flex-col items-start gap-[32px]">
                {/* The two eyebrows occupy the same grid cell so the
                    crossfade happens in place instead of reflowing. */}
                <div className="grid">
                  <motion.div
                    className="col-start-1 row-start-1"
                    style={{ opacity: still(eyebrowAOpacity, 1) }}
                  >
                    <Eyebrow label="OVERVIEW" color="#0cffd7" barWidth={36} />
                  </motion.div>
                  <motion.div
                    className="col-start-1 row-start-1"
                    style={{ opacity: still(eyebrowBOpacity, 0) }}
                  >
                    <Eyebrow
                      label="WHO WE ARE"
                      color="#a3e4ff"
                      barColor="#086083"
                      barWidth={36}
                    />
                  </motion.div>
                </div>

                <motion.h2
                  /* Sized as --text-section * 42/52: the comp animates
                     this heading 42px -> 52px across the scrub (the
                     headingScale transform multiplies by 52/42), so the
                     BASE is the section token pre-scaled down and the
                     scrub lands it exactly ON var(--text-section). */
                  className="w-[564px] max-w-full origin-left text-[length:calc(var(--text-section)*0.80769)] font-normal leading-[1.2] text-white"
                  style={{ scale: still(headingScale, 1) }}
                >
                  We build businesses Designed for decades, Not Projects.
                </motion.h2>

                {/* ECO-SYSTEM BUTTON — the outline fills in across the
                    scrub (that fill is why it is not the shared
                    PillButton, which has no gradient-filled state). */}
                <motion.a
                  href="/eco-system"
                  className="relative flex h-[50px] w-[240px] items-center justify-center gap-[8px] rounded-[60px] border border-solid px-[16px] py-[8px] shadow-[2px_4px_20px_0px_rgba(0,0,0,0.25)]"
                  style={{ borderColor: still(btnBorder, "rgba(255,255,255,1)") }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-[60px] bg-gradient-to-r from-[#085f83] to-[#021922]"
                    style={{ opacity: still(btnFillOpacity, 0) }}
                  />
                  <span className="relative whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
                    Eco-System
                  </span>
                  <span className="relative flex h-[12px] w-[16px] shrink-0">
                    <img src={arrow.src} alt="" className="h-[12px] w-[16px]" />
                  </span>
                </motion.a>
              </div>

              {/* BOTTOM — intro copy + closing rule. */}
              <div className="flex flex-col justify-between gap-[24px] lg:gap-0">
                <div className="flex flex-col justify-between gap-[16px] text-[length:clamp(1.25rem,1.5vw,1.375rem)] font-medium leading-[1.55] tracking-[-0.44px] text-white lg:h-[396px] lg:gap-0">
                  <p className="w-[400px] max-w-full">
                    Founded in 2012 by Mr. Pankaj Gupta in Jaipur, India, we
                    have grown from our local roots into a global presence,
                    expanding rapidly across India, China, Indonesia, and
                    Vietnam.
                  </p>
                  <p className="w-[400px] max-w-full">
                    {/* Run-in heading inside the paragraph — a title,
                        not body, so it takes the --text-title token. */}
                    <span className="text-[length:var(--text-title)] font-bold">
                      Our mission :
                    </span>
                    <br />
                    is simple to build innovative businesses that create new
                    opportunities and shape a better and equitable future for
                    everyone. We design our solutions to last for decades, not
                    just for today.
                  </p>
                </div>

                {/* CLOSING RULE — solid teal early, blue gradient later */}
                <div className="relative h-[4px] w-[134px]">
                  <motion.span
                    className="absolute inset-0 bg-[#00594b]"
                    style={{ opacity: still(barAOpacity, 1) }}
                  />
                  <motion.span
                    className="absolute inset-0"
                    style={{
                      opacity: still(barBOpacity, 0),
                      backgroundImage:
                        "linear-gradient(89.9deg, rgb(0,161,224) 0%, rgb(0,88,122) 99.997%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — left empty on purpose: the photo (a
                separate absolute layer below) grows over this half, so
                the flow content stays entirely in the left column. */}
            <div className="hidden lg:block lg:flex-1" />
          </Container>
        </motion.div>

        {/* PHOTO — sized to the whole stage and scaled DOWN into the card
            position rather than sized small and grown up. That way the end
            state is exactly 100% of the viewport with no rounding drift,
            and the browser only ever composites a transform.

            willChange promotes it to its own layer up front so the first
            scroll frame does not pay for the promotion. */}
        <motion.div
          className="absolute inset-0 z-20 origin-top-left overflow-hidden"
          style={{ ...photoStyle, willChange: "transform" }}
        >
          {/* Ends at full bleed, so sizes is 100vw — but it opens at 770
              of 1440, so the small-viewport hint keeps the initial paint
              from over-fetching. */}
          <Image
            src={cliffCity}
            alt="A lone figure on a clifftop looking out over a futuristic city at sunrise"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
            placeholder="blur"
          />
          {/* DIM — a slight BLACK layer that fades in as the photo grows
              (scrimOpacity: 0 at ~70% coverage -> full at full bleed), so
              the image visibly dims as it takes over and the reveal text
              stays readable. Black, low opacity — a gentle darkening, not
              a heavy overlay. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.38)]"
            style={{ opacity: still(scrimOpacity, 0) }}
          />
        </motion.div>

        {/* REVEAL — the second headline, which only exists once the photo
            has gone full bleed. Figma wraps each line in its own
            overflow-clip frame with the text parked below the window, so
            these are masked slide-ups rather than fades. */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center">
          <Container className="flex flex-col gap-[12px]">
            <motion.span
              aria-hidden
              className="h-[2px] w-full origin-center bg-white"
              style={{
                scaleX: still(ruleScaleX, 0.01),
                opacity: still(ruleOpacity, 0),
              }}
            />
            <div className="flex flex-col items-start gap-[16px] lg:flex-row lg:justify-between lg:gap-[40px]">
              <div className="overflow-clip">
                <motion.h3
                  /* --text-title, not a second section-size heading:
                     the scrubbed H2 above is this section's one
                     --text-section element, so the reveal headline
                     steps down (was 32px at lg, now 24px max). */
                  className="text-[length:var(--text-title)] font-medium leading-[1.2] text-white"
                  style={{ y: still(revealY, "100%") }}
                >
                  Aashita Enterprises
                </motion.h3>
              </div>
              {/* 443px wide and flush to the column's right edge — the
                  comp lands its right edge on 1320, the same gutter
                  Container already enforces. */}
              <div className="overflow-clip">
                <motion.p
                  className="w-[443px] max-w-full text-[length:var(--text-body)] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
                  style={{ y: still(revealY, "100%") }}
                >
                  A seamless ecosystem of products working together to create
                  and impact.
                </motion.p>
              </div>
            </div>
          </Container>
        </div>
      </motion.div>
    </section>
  );
};

export default Overview;
