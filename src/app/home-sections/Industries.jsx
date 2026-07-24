"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import studentPhoto from "./assets/industries/student-photo.png";
// import sectionTexture from "./assets/industries/section-texture.png";
import pinStem from "./assets/industries/pin-stem.svg";
import pinGlow from "./assets/industries/pin-glow.png";
import Container from "../components/Container";
import Eyebrow from "../components/Eyebrow";
import SectionBg from "../components/SectionBg";

/* ==================================================================
   OUR INDUSTRIES  (Figma 1:3440 "Section-3-container", 1440x2539)

   IS THE PATH AUTHORED AS AN ANIMATION? NO — AND HERE IS THE PROOF.

   get_design_context on 1:3440 returns the subtree fully expanded,
   and there is NOT ONE `instance` node anywhere beneath it. Every
   descendant is a frame, group, vector or text node. No instance
   means no component set, which means no variants, which means there
   is no authored keyframe continuum to interpolate. Compare
   About_Systems, where 3:701 ships three variants that ARE samples of
   one motion — nothing of the kind exists here.

   BUT THE DESIGNER STILL SIGNALLED INTENT, in two ways that would be
   easy to miss and expensive to ignore:

   1. NAMING. The five card frames are called
      "Animated-Card-Container-1ST"; the eyebrow sits in
      "Tag-Animated-Container"; the heading in
      "Heading-Animated-container".

   2. RIG. Those three containers are `overflow-clip` boxes whose
      contents are positioned to overflow them — the heading text is
      offset inside a 564x124 clip window it exactly fills. That is a
      clip-wipe reveal rig, built and then left un-keyframed. So the
      wipe is transcribed, not invented.

   WHY THE PATH IS SCROLL-DRAWN. The serpentine is a single vector
   (1:3442) 2065px tall carrying five pin markers along it. A 2539px
   section whose whole spine is one continuous line with markers on it
   only reads one way: the line is traced as you descend, and each
   card arrives as the line reaches it. A whileInView stagger would
   leave the line fully drawn on arrival and reduce the pins to
   decoration. The draw is the section.
   ================================================================== */

/* ------------------------------------------------------------------
   THE PATH

   Transcribed VERBATIM from Figma's own SVG export of 1:3442 — this
   is the exported `d`, not art traced off a screenshot. It has to be
   inlined rather than referenced as <img> because a file loaded
   through <img> is opaque: you cannot reach into it to drive
   pathLength. The export is one continuous path, not fragments, so
   there is exactly one thing to draw.

   The export's own viewBox is 1114.05 x 2067.86 while the node box
   Figma reports is 1112.06 x 2065.86 — 1px larger on every side,
   which is the 2px stroke bleeding past its own geometry. So the SVG
   is placed 1px up and left of the node box, otherwise the whole path
   sits a pixel off and the pins drift with it.

   The export wraps the path in an alpha mask over a giant ellipse
   filled #DDDDDD->#DFDFDF. That resolves to a flat near-white; the
   ellipse contributes no visible variation, so it collapses to a
   plain #DEDEDE stroke.
   ------------------------------------------------------------------ */
const PATH_D =
  "M1 1C133 1 627.5 50.3555 627.5 204.355C627.5 412.855 22.4688 389.194 31.5 525C41 667.855 386.5 697.855 642.5 756.355C1058.5 851.418 1038.5 1020.86 739.5 1146.86C530.045 1235.12 -165.5 1469.36 455 1672.5C766.189 1774.38 1212 1967.36 1093.5 2066.86";

const PATH_VB_W = 1114.05;
const PATH_VB_H = 2067.86;

// The Figma artboard everything below is a fraction of
// ("Our Industries-Figma", node 31:740, 1440x2490).
const FRAME_W = 1440;
const FRAME_H = 2490;

/* Rendered 1:1 with the new frame — 31:740 already composes the
   taller card----1 cards tightly, so no compression pass is needed. */
const STAGE_H = FRAME_H;

// SVG box in frame coords: node origin (148, 423.61) less the 1px stroke bleed.
// Same path as the old comp, moved 49px up in the new frame.
const PATH_BOX = {
  x: 147 / FRAME_W,
  y: 422.61 / FRAME_H,
  w: PATH_VB_W / FRAME_W,
  h: PATH_VB_H / FRAME_H,
};

/* ------------------------------------------------------------------
   CARDS

   PLACEHOLDER COPY — FLAGGED. All five cards in the comp carry
   byte-identical copy: kicker "EDUCATION", the same heading, the same
   paragraph, the same photograph. That is placeholder, not design.
   It is reproduced verbatim because inventing five industries would
   be putting words in the client's mouth. When the real five arrive
   they drop into THIS ARRAY and nowhere else.

   GEOMETRY. Figma wraps each card in a 758x366 `overflow-clip`
   container and centres the card inside it at (50%-21px, 50%-11.17px)
   — the container is a clip window for the reveal, not the card. The
   card slot origin (comp card was 544.3 x 207.02) lands its top-left at
   (85.85, 68.32) inside the container. `x`/`y` below are already that
   resolved position in frame coords, so the clip-window indirection
   does not have to be re-derived at render time.

     container origin        ->  card top-left
     (682,  460)  right      ->  (767.85,  528.32)
     (  0,  781)  left       ->  ( 85.85,  849.32)
     (235, 1191)  left       ->  (320.85, 1259.32)
     (682, 1621)  right      ->  (767.85, 1689.32)
     (  0, 1965)  left       ->  ( 85.85, 2033.32)

   `at` is the card's position along the DRAW, expressed as a fraction
   of the path's own vertical span (y 471.64 -> 2539). It is a
   deliberate approximation: the draw front advances by arc length,
   not by y, and this serpentine's horizontal excursions mean the two
   diverge. Each value is therefore pulled slightly early, so a card
   is never still fading in after the line has already swept past it —
   a late card reads as broken, an early one reads as anticipation.
   ------------------------------------------------------------------ */
/* card----1 (Figma 22:701): 578 x 314. */
const CARD_W = 578;
const CARD_H = 314;

const INDUSTRIES = [
  {
    id: "technology",
    kicker: "TECHNOLOGY",
    heading: "Building what is next",
    body: "Digital products, platforms and intelligent solutions that help organizations move faster and grow smarter.",
    stat: "15+ products built",
    x: 751,
    y: 425.8,
    side: "right",
    at: 0.14,
  },
  {
    id: "ngo-healthcare",
    kicker: "NGO – HEALTHCARE",
    heading: "Improving lives through impact",
    body: "Human-centred healthcare initiatives that expand access, strengthen communities and create lasting change.",
    stat: "100K+ people impacted",
    x: 69,
    y: 746.8,
    side: "left",
    at: 0.204,
  },
  {
    id: "education",
    kicker: "EDUCATION",
    heading: "Empowering future-ready learners",
    body: "AI-powered learning platforms and educational ecosystems that personalize curricula, scale institutional capacity, and unlock human potential across emerging markets.",
    stat: "3 platforms launched",
    x: 304,
    y: 1155.8,
    side: "left",
    at: 0.484,
  },
  {
    id: "automobile",
    kicker: "AUTOMOBILE",
    heading: "Driving the future forward",
    body: "Connected mobility and automotive solutions that make journeys safer, smarter and more sustainable.",
    x: 751,
    y: 1586.8,
    side: "right",
    at: 0.651,
  },
  {
    id: "manufacturing",
    kicker: "MANUFACTURING",
    heading: "Transforming how things are made",
    body: "Technology-led manufacturing solutions that improve efficiency, quality and resilience across operations.",
    x: 69,
    y: 1930.8,
    side: "left",
    at: 0.833,
  },
];

/* ------------------------------------------------------------------
   PINS

   `x`/`y` are the stem's RAW node origin. The exported stem SVG is
   18 x 66.5975 while its node box is only 10 x 58.6 — Figma pads an
   export canvas to fit the gaussian blur, so the art is NOT centred
   in its own file. Painting it at the node box would crop the glow
   and shift the pin up-left. The 4px pad is subtracted back below.

   The glow ellipse sits a constant ~48.7px below the stem origin in
   all five pins, so that offset is a constant rather than five data
   points.
   ------------------------------------------------------------------ */
const STEM_PAD = 4;
const STEM_W = 18;
const STEM_H = 66.5975;
const GLOW_DY = 48.7;
const GLOW_W = 20;
const GLOW_H = 15.97;

const PINS = [
  { x: 143, y: 419, at: 0.02 },
  { x: 243, y: 1036, at: 0.332 },
  { x: 988, y: 1245, at: 0.501 },
  { x: 625, y: 1673, at: 0.67 },
  { x: 816, y: 2175, at: 0.874 },
];

const pct = (v) => `${(v * 100).toFixed(4)}%`;

const EASE = [0.22, 1, 0.36, 1];

/* Shared reveal shape, matching About_Origin's stage/riseIn pair. */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/* Clip-wipe for the two `overflow-clip` header boxes Figma authored.
   The text starts fully below its own clip window and slides up into
   it, so the wipe is a transform inside an existing clip rather than
   an animated height. */
const wipeUp = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

/* ==================================================================
   CARD

   Its own component so it can call useTransform on the shared scroll
   progress. Five cards each needing three derived values is fifteen
   hooks — illegal in a loop in the parent, trivial here.
   ================================================================== */
const IndustryCard = ({ item, progress, reduceMotion }) => {
  /* The card COMES OUT as the front arrives: a tight window ending
     exactly on `at`, so the reveal is visibly caused by the line
     reaching the waypoint — with a small scale pop so it emerges
     rather than merely fades. */
  const span = [Math.max(0, item.at - 0.05), Math.min(1, item.at + 0.02)];
  const opacity = useTransform(progress, span, [0, 1]);
  const y = useTransform(progress, span, [28, 0]);
  const scale = useTransform(progress, span, [0.94, 1]);

  const style = reduceMotion ? undefined : { opacity, y, scale };

  return (
    <motion.article style={style} className="group/card relative">
      {/* CARD BODY — spec'd by the client:
            card:        16px padding all sides, 24px corner radius.
            row gap:     24px between the text column and the photo.
            alignment:   content justified TOP-to-BOTTOM — the kicker/
                         heading/description group sits at the top, the
                         "Learn more" link at the bottom (items-stretch
                         + justify-between), and the photo fills the
                         card's full height.
          Border kept on the bottom+right edges only (the comp's rim
          light), over a 2% white wash + 4px backdrop blur. Below sm
          the row stacks instead of cropping. */}
      <div className="flex flex-col gap-[24px] rounded-[24px] border-b border-r border-solid border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-[16px] backdrop-blur-[4px] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-[4px] hover:border-[#0cffd7]/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)] sm:min-h-[300px] sm:flex-row sm:items-stretch">
        {/* TEXT COLUMN — top group pinned up, "Learn more" pinned down. */}
        <div className="flex w-full min-w-0 flex-col justify-between gap-[24px] sm:flex-1">
          {/* TOP GROUP: kicker, heading, description. */}
          <div className="flex flex-col gap-[14px]">
            {/* KICKER — dash + label. Label: BOLD / 12px. */}
            <div className="flex items-center gap-[10px]">
              <span aria-hidden className="block h-[2px] w-[20px] bg-[#0cffd7]" />
              <p className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.08em] text-[#0cffd7]">
                {item.kicker}
              </p>
            </div>
            {/* HEADING — SEMIBOLD / 22px / 120% line-height. */}
            <h3 className="text-[22px] font-semibold leading-[1.2] text-white">
              {item.heading}
            </h3>
            {/* DESCRIPTION — MEDIUM / 14px / 150% line-height. */}
            <p className="text-[14px] font-medium leading-[1.5] text-white/70">
              {item.body}
            </p>
          </div>

          {/* LEARN MORE — SEMIBOLD / 14px, at the bottom of the column. */}
          <span className="flex items-center gap-[6px] text-[14px] font-semibold text-[#0cffd7]">
            <span>Learn more</span>
            <span aria-hidden className="transition-transform duration-300 group-hover/card:translate-x-[3px]">→</span>
          </span>
        </div>

        {/* PHOTO — 20px radius, fills the card's full height (self-
            stretch), fixed width on desktop. On mobile it takes a set
            height since the row is stacked. */}
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-[20px] sm:h-auto sm:w-[216px] sm:self-stretch">
          <Image
            src={studentPhoto}
            alt="A student working at a laptop in a classroom"
            fill
            sizes="216px"
            className="object-cover"
            placeholder="blur"
          />
        </div>
      </div>
    </motion.article>
  );
};

/* ==================================================================
   PIN
   ================================================================== */
const Pin = ({ pin, progress, reduceMotion }) => {
  /* Pins IGNITE on the beat the draw front passes them: a fast pop
     with a 1.3x overshoot, plus a halo that flares to full and then
     settles to a resting glow — the waypoint visibly "switches on"
     as the journey reaches it. */
  const span = [Math.max(0, pin.at - 0.02), pin.at];
  const opacity = useTransform(progress, span, [0, 1]);
  const scale = useTransform(
    progress,
    [Math.max(0, pin.at - 0.02), pin.at, Math.min(1, pin.at + 0.06)],
    [0.3, 1.3, 1]
  );
  const flare = useTransform(
    progress,
    [Math.max(0, pin.at - 0.01), Math.min(1, pin.at + 0.02), Math.min(1, pin.at + 0.1)],
    [0, 1, 0.45]
  );

  const style = reduceMotion ? undefined : { opacity, scale };

  return (
    <motion.div
      aria-hidden
      style={{
        ...style,
        left: pct((pin.x - STEM_PAD) / FRAME_W),
        top: pct((pin.y - STEM_PAD) / FRAME_H),
        width: pct(STEM_W / FRAME_W),
      }}
      className="pointer-events-none absolute origin-bottom"
    >
      {/* FLARE HALO — the ignition burst. Sized well past the stem
          and centred on the marker head so the flash reads as light,
          not a UI element appearing. */}
      {!reduceMotion && (
        <motion.span
          className="absolute left-1/2 top-0 block size-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            opacity: flare,
            background:
              "radial-gradient(circle, rgba(12,255,215,0.55) 0%, rgba(12,255,215,0.15) 45%, transparent 70%)",
          }}
        />
      )}

      {/* The glow plate is a PNG despite Figma naming the layer
          "Ellipse" — verified with `file`, not inferred from the URL.
          Both axes are set explicitly on the stem because the export
          carries preserveAspectRatio="none", which makes any
          object-fit class a no-op and would stretch it to its box. */}
      <img
        src={pinStem.src}
        alt=""
        className="block w-full"
        style={{ aspectRatio: `${STEM_W} / ${STEM_H}` }}
      />
      <img
        src={pinGlow.src}
        alt=""
        className="absolute block"
        style={{
          left: pct(-1 / STEM_W),
          top: pct(GLOW_DY / STEM_H),
          width: pct(GLOW_W / STEM_W),
          aspectRatio: `${GLOW_W} / ${GLOW_H}`,
        }}
      />
    </motion.div>
  );
};

const Industries = () => {
  const stageRef = useRef(null);
  const reduceMotion = useReducedMotion();

  /* The section is 2539px tall in the comp and is left that tall here,
     so the draw needs NO artificial runway — it rides the section's own
     pass through the viewport. That is also why reduced motion has no
     runway to collapse: there is no scroll height that exists solely to
     feed the animation. It only has to resolve everything to its end
     state, which it does by skipping the derived styles entirely. */
  /* ONE progress value, driven by GSAP ScrollTrigger with scrub.

     WHY THE SPRING HAD TO GO: a soft spring's catch-up time is
     unbounded — flick past the section and the line was still drawing
     after the next section had arrived, which is exactly the
     desynchronisation reported. ScrollTrigger's `scrub: 0.6` is
     time-bounded smoothing: the tween chases the scroll position and
     is guaranteed to land within ~0.6s, so the draw can never fall
     behind the page.

     THE WINDOW: starts as the stage enters (top at 80% viewport) and
     completes at "bottom 95%" — the journey reaches its terminus
     while the final card is still comfortably on screen, BEFORE the
     user can move on. ScrollTrigger is already fed by Lenis
     (SmoothScroll wires lenis.on("scroll", ScrollTrigger.update)), so
     the scrub rides the eased scroll, not raw wheel ticks.

     Downstream, everything still consumes a motion MotionValue — the
     ScrollTrigger just SETS it — so the cards, pins, comet and
     brackets keep their useTransform wiring untouched. */
  const progress = useMotionValue(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      /* Start the draw when the FIRST NODE reaches the CENTRE of the
         screen — not when the stage's top edge enters. Pin 1 sits at
         y=419 of the 2490-frame, so its offset from the stage top is
         that fraction of the rendered stage height; `top+=<offset>
         center` fires exactly when that point is vertically centred.
         Function form so it re-measures on resize. */
      start: () =>
        `top+=${(stageRef.current.offsetHeight * 419) / FRAME_H} center`,
      end: "bottom 60%",
      scrub: 0.6,
      onUpdate: (self) => progress.set(self.progress),
    });
    return () => st.kill();
  }, [progress]);

  const drawn = reduceMotion ? 1 : progress;

  /* ------------------------------------------------------------------
     COMET HEAD — the journey's traveller. A glowing dot rides the
     exact front of the draw: each smoothed progress frame is mapped
     through getPointAtLength on a hidden copy of the path, and the
     point (in viewBox units) is converted to stage percentages so the
     head is an HTML element — an SVG circle would be squashed into an
     ellipse by the stage's preserveAspectRatio="none" scaling.

     It fades in just after the journey starts and out just before it
     ends, so the line never appears to be dragging a stalled dot at
     either terminus.
     ------------------------------------------------------------------ */
  const measureRef = useRef(null);
  const pathLenRef = useRef(0);
  const headX = useMotionValue(-10);
  const headY = useMotionValue(-10);
  const headOpacity = useTransform(progress, [0, 0.02, 0.96, 1], [0, 1, 1, 0]);
  const headLeft = useTransform(headX, (v) => `${v}%`);
  const headTop = useTransform(headY, (v) => `${v}%`);

  useMotionValueEvent(progress, "change", (t) => {
    const path = measureRef.current;
    if (!path) return;
    if (!pathLenRef.current) pathLenRef.current = path.getTotalLength();
    const pt = path.getPointAtLength(
      Math.max(0, Math.min(1, t)) * pathLenRef.current
    );
    headX.set((PATH_BOX.x + (pt.x / PATH_VB_W) * PATH_BOX.w) * 100);
    headY.set((PATH_BOX.y + (pt.y / PATH_VB_H) * PATH_BOX.h) * 100);
  });

  return (
    <section
      /* id anchors the footer's Industries links (/#industries) —
         no industry pages exist yet, so they land here. */
      id="industries"
      className="industries relative w-full overflow-hidden"
    >
      {/* The teal light-ribbon backdrop — Industries only. */}
      <SectionBg opacity={0.7} />

      {/* ================= HEADING =================
          In Container, because the comp's Heading-Container is exactly
          430+206+564 = 1200 wide and centred — it IS the content
          column, so it must share the site-wide gutter rather than
          re-declare one. */}
      {/* pt is the section's top edge -> shared --section-pad. The
          BOTTOM edge at xl is owned by the aspect-locked serpentine
          stage (the comp's 2539 frame carries its own bottom room), so
          no pb is forced onto the scroll stage. */}
      {/* The frame sets the header 60px from the section top. */}
      <Container className="relative z-20 pt-[60px]">
        {/* HEADER — the frame's own split layout (31:744): eyebrow on
            the left, heading + lead RIGHT-aligned in a 564 stack on
            the far side. The clip-wipe rigs are the comp's authored
            Animated-Containers. Copy is the frame's: "Frontiers" with
            the s, and the new lead paragraph (31:753). */}
        <motion.div
          className="flex flex-col gap-[40px] lg:flex-row lg:items-start lg:justify-between"
          variants={stage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          {/* Figma's clip window with the eyebrow wiping up into it. */}
          <div className="overflow-hidden">
            <motion.div variants={reduceMotion ? undefined : wipeUp}>
              {/* White label over the comp's #02e5c0 bar at 36px. */}
              <Eyebrow
                label="OUR INDUSTRIES"
                color="#ffffff"
                barColor="#02e5c0"
                barWidth={36}
              />
            </motion.div>
          </div>

          <div className="flex w-full max-w-[564px] flex-col items-end gap-[40px]">
            <div className="w-full overflow-hidden">
              <motion.h2
                variants={reduceMotion ? undefined : wipeUp}
                /* 52px regular, 1.1 leading, -2.08 tracking — the
                   frame's exact display setting, reached through the
                   shared section token (52 ceiling). */
                className="text-right text-[length:var(--text-section)] font-normal leading-[1.1] tracking-[-0.04em] text-white"
              >
                Building Across Five Frontiers
              </motion.h2>
            </div>
            <motion.p
              variants={riseIn}
              /* 22px medium in the frame -> the subheading token
                 (24 ceiling, same tier), right-aligned on the comp's
                 438 measure. */
              className="w-full max-w-[438px] text-right text-[length:var(--text-subheading)] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
            >
              From education to enterprise, we build category-defining
              businesses across five frontier industries — each designed
              for decades of impact.
            </motion.p>
          </div>
        </motion.div>
      </Container>

      {/* ================= SERPENTINE STAGE =================
          THIS DELIBERATELY ESCAPES Container. The path's own node box
          spans x 148..1260 and the cards run from x=0 to x=1440 — card
          2 and card 5 sit flush against the artboard's left edge, well
          outside the 120px gutter. Constraining this to the 1200
          column would either clip the line or squash the serpentine's
          amplitude, and the amplitude is the composition. The heading
          above stays in Container so it still lines up with every
          other section on the site.

          The stage is locked to the comp's own 1440:2539 aspect and
          capped at 1440 wide. The lock is what makes the path and the
          cards agree: both are positioned as fractions of ONE box, so
          they scale together and the pins stay on the line at any
          width. Un-lock the aspect and the path shears away from its
          markers — which is exactly what a preserveAspectRatio="none"
          export does if you let its box drift. */}
      {/* The stage is pulled UP under the header (negative margin): the
          comp overlays the header on the SAME frame as the cards, but
          this build renders the header as a separate block above the
          stage, which double-counted the top space and left a full
          empty screen before the first card. The stage's own top band
          is empty (the line only starts drawing there), so tucking it
          behind the header removes the gap without hiding anything —
          the header sits top-right, the line begins top-left. */}
      <div
        ref={stageRef}
        className="relative z-10 mx-auto hidden w-full max-w-[var(--frame)] xl:-mt-[360px] xl:block"
        style={{ aspectRatio: `${FRAME_W} / ${STAGE_H}` }}
      >
        {/* SERPENTINE PATH */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: pct(PATH_BOX.x),
            top: pct(PATH_BOX.y),
            width: pct(PATH_BOX.w),
            height: pct(PATH_BOX.h),
          }}
          aria-hidden="true"
        >
          <svg
            viewBox={`0 0 ${PATH_VB_W} ${PATH_VB_H}`}
            fill="none"
            preserveAspectRatio="none"
            className="block h-full w-full"
          >
            {/* WHY A MASK RATHER THAN ANIMATING THE DASH DIRECTLY.

                The line is dotted — stroke-dasharray="4 4" — and the
                usual way to draw an SVG path is also stroke-dasharray
                plus a moving stroke-dashoffset. Those two uses collide
                on one attribute: driving the offset on this path would
                make the dots crawl along it instead of the line
                growing.

                So the dots and the draw are split across two elements.
                A solid, fat, undashed copy of the same path is stroked
                white inside a mask and ITS pathLength is animated; the
                dotted path is painted through that mask. The dots stay
                perfectly still and the line lengthens. Same path data
                twice, one source of truth. */}
            <defs>
              <mask id="industries-draw" maskUnits="userSpaceOnUse">
                <motion.path
                  d={PATH_D}
                  stroke="#ffffff"
                  strokeWidth={24}
                  strokeLinecap="round"
                  fill="none"
                  style={{ pathLength: drawn }}
                />
              </mask>
            </defs>

            <g mask="url(#industries-draw)">
              <path
                d={PATH_D}
                stroke="#DEDEDE"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>

            {/* Invisible copy used only to measure points along the
                path for the comet head. */}
            <path ref={measureRef} d={PATH_D} fill="none" stroke="none" />
          </svg>
        </div>

        {/* COMET HEAD — see the block above the return. */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-10 size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0cffd7]"
            style={{
              left: headLeft,
              top: headTop,
              opacity: headOpacity,
              boxShadow:
                "0 0 12px 4px rgba(12,255,215,0.65), 0 0 36px 10px rgba(12,255,215,0.25)",
            }}
          />
        )}

        {/* PATH MARKERS */}
        {PINS.map((pin, i) => (
          <Pin
            key={`pin-${i}`}
            pin={pin}
            progress={progress}
            reduceMotion={reduceMotion}
          />
        ))}

        {/* CARDS — absolutely placed at the resolved coordinates in
            INDUSTRIES. Position is a fraction of the stage so it tracks
            the path; the card box itself stays at its comp pixel size so
            the type never scales. */}
        {INDUSTRIES.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: pct(item.x / FRAME_W),
              top: pct(item.y / FRAME_H),
              width: CARD_W,
            }}
          >
            <IndustryCard
              item={item}
              progress={progress}
              reduceMotion={reduceMotion}
            />
          </div>
        ))}
      </div>

      {/* ================= NARROW LAYOUT =================
          Below xl the serpentine is dropped rather than scaled. The
          cards keep their comp pixel size so the type never scales, and
          at 1024 the outermost card already runs past the viewport —
          the stage only stops overflowing once the frame it is a
          fraction of is at least 1280 wide. Below that the path would
          read as noise behind cards it can no longer reach anyway. The
          alternating rhythm is a wide-viewport idea, so on narrow it
          becomes an ordinary stack and the cards reveal on their own. */}
      <Container className="relative z-10 flex flex-col items-center gap-[48px] pb-[var(--section-pad)] pt-[80px] xl:hidden">
        {INDUSTRIES.map((item, i) => (
          <motion.div
            key={item.id}
            className="w-full max-w-[578px]"
            initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.1 }}
          >
            <IndustryCard item={item} progress={progress} reduceMotion />
          </motion.div>
        ))}
      </Container>
    </section>
  );
};

export default Industries;
