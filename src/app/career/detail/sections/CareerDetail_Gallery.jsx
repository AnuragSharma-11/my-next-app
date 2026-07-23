"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

import studioPortrait from "../assets/gallery/studio-portrait.jpg";
import redDress from "../assets/gallery/red-dress.jpg";
import blackTurtleneck from "../assets/gallery/black-turtleneck.jpg";
import goldenHour from "../assets/gallery/golden-hour.jpg";
/* The top card of the deck is byte-identical (md5) to the first Untold
   Stories photograph, so it is imported across rather than duplicated
   into this folder. */
import graffiti from "../assets/stories/teammate-graffiti.jpg";

import Container from "../../../components/Container";

import bloomMid from "../assets/gallery/bloom-mid.svg";
import bloomWide from "../assets/gallery/bloom-wide.svg";
import bloomRight from "../assets/gallery/bloom-right.svg";
import bloomLeft from "../assets/gallery/bloom-left.svg";

/* ==================================================================
   GALLERY  (Figma 1:5108 "Second-Four", an INSTANCE of 1:3337)

   WHAT THE MASTER ENCODES

   The master lives in a library file this workspace cannot open —
   1:3337 is unreachable by id, so its sibling variants could not be
   screenshotted. Everything below is read off the one reachable
   sample plus the geometry it carries, and the sample is unusually
   informative because it is plainly NOT a finished frame:

     evidence                              what it means
     ------------------------------------  ---------------------------
     "Gallery" is authored at 8.783px and  the scene is authored FAR
     the sub-line at 5.405px — a 2.96x     AWAY; something zooms it to
     shortfall on the 26/16px this site    a readable size
     sets everywhere else
     all seven cards share ONE centre      the deck is CLOSED, not
     (712, 928.87) and differ only by      arranged; the rotations are
     rotation                              a fan waiting to open
     only the top card's photo is          the six behind it are
     visible; the rest are grey slivers    stacked, not laid out
     the heading sits BEHIND the deck in   the deck must move off it
     paint order, fully covered            for the title to exist

   So the sample is the CLOSED, far state — frame zero. The animation
   opens the fan and brings the scene in.

   WHY SCROLL-DRIVEN AND NOT PLAY-ONCE

   Frame zero covers the section's own heading with a stack of photos.
   A play-once entrance would be fine, but a play-once that STARTS on
   an unreadable frame strands the section there for every reader who
   arrives with the animation already fired, and a 1794px section that
   never reveals its title is a broken section. Tying it to scroll
   makes the readable state the one the reader ends on, and makes the
   1794px of authored height do real work instead of being padding.
   This is the same call About_Systems made for the same reason.

   WHAT IS INFERRED — READ THIS BEFORE CHANGING IT

   The closed state is the comp's, exactly. The OPEN state is not in
   the file: with the master unreachable there is no second sample to
   diff against, so the spread below (rotation x2.1, a 430px lateral
   sweep and a quadratic droop) is a reconstruction of the gesture the
   closed geometry implies, not authored data. If the master ever
   becomes reachable, FAN_SPREAD / FAN_SWEEP / FAN_DROOP are the three
   numbers to correct and nothing else should need to move.
   ================================================================== */

/* ------------------------------------------------------------------
   STAGE — the comp's 1440x1794 artboard rendered at true size and
   scaled as one unit, the same technique About_Manifesto uses. Every
   number in this file is then a literal Figma pixel that can be
   checked against the node tree, instead of a percentage nobody can
   trace back.
   ------------------------------------------------------------------ */
const FRAME_W = 1440;
const FRAME_H = 1794;

/* Every card in the deck shares this centre — that is what makes it a
   deck rather than a layout. */
const DECK = { x: 712, y: 928.87 };
const CARD = { w: 270, h: 351.747, pad: 6.991, radius: 15.38 };

/* The heading's authored size against the site's real 26/16px is a
   flat 2.9603x, which is the scene's "distance" at frame zero. */
const FAR_SCALE = 1 / 2.9603;

/* Where the title lands once the fan has opened out from under it,
   and how far it has to travel up from its buried authored position
   (centre 848.5 closed, centre ~346 open). */
const TITLE_RISE = 502.6;

/* The three reconstructed numbers. See the block comment above. */
const FAN_SPREAD = 30; // deg swept by the outermost card
const FAN_SWEEP = 430; // px the outermost card travels sideways
const FAN_DROOP = 130; // px the outermost card sags, giving the arc

/* ------------------------------------------------------------------
   THE DECK

   Listed in Figma's own paint order, back to front — the graffiti
   card is last because it is the one carrying the 120px shadow and
   the only photo visible at rest.

   `slot` is its position once the fan opens, assigned by sorting the
   closed rotations ascending (-26, -14, -7, 0, 0, 7, 14) so that no
   two cards cross each other on the way out. Paint order and fan
   order are deliberately different things.
   ------------------------------------------------------------------ */
const DECK_CARDS = [
  { id: "c1", rot: 14, slot: 6, photo: studioPortrait, alt: "" },
  { id: "c2", rot: -14, slot: 1, photo: studioPortrait, alt: "" },
  { id: "c3", rot: 7, slot: 5, photo: redDress, alt: "" },
  { id: "c4", rot: -26, slot: 0, photo: redDress, alt: "" },
  { id: "c5", rot: 0, slot: 3, photo: blackTurtleneck, alt: "" },
  { id: "c6", rot: 0, slot: 4, photo: goldenHour, alt: "" },
  {
    id: "c7",
    rot: -7,
    slot: 2,
    photo: graffiti,
    alt: "Aashita teammate photographed against a graffiti mural",
    shadow: "2px 4px 120px 0px rgba(0,0,0,0.6)",
  },
];

/* Slot 3 of 0..6 is the middle, so t runs -1..1 and the fan comes out
   symmetric without any per-card hand-tuning. */
const slotT = (slot) => (slot - 3) / 3;

/* ------------------------------------------------------------------
   BACKGROUND BLOOMS

   Four rotated, blurred ellipses at 40% opacity.

   Two traps, both live here:

   1. `box` is Figma's AXIS-ALIGNED BOUNDING BOX of a rotated ellipse,
      not the ellipse. Using it as the element size would draw each
      bloom at the wrong dimensions and the wrong angle. The real
      ellipse is `art`, rotated inside a box that is only used to
      position its centre.

   2. The blur pads the export canvas well past the ellipse — bloom-mid
      is a 672.988x370.144 ellipse inside a 912.988x610.144 viewBox,
      i.e. 120px of padding on every side. `pad` below is that canvas,
      read from each file's OWN viewBox, with the offset that pulls it
      back over the ellipse it belongs to. Drop it and every bloom
      sits inset and undersized. The four paddings differ (120, 80,
      120, 60), so these are not interchangeable.

   `pad` also has to be applied as an explicit width AND height, not
   as four insets: an absolutely positioned REPLACED element with
   width:auto sizes to its intrinsic width and ignores the opposite
   inset, so the inset form silently does nothing here. Pinning both
   axes is required for the second reason too — these exports carry
   preserveAspectRatio="none", so any unpinned axis distorts.
   ------------------------------------------------------------------ */
const BLOOMS = [
  {
    src: bloomMid,
    box: { x: 299.11, y: 931.77, w: 765.322, h: 611.626 },
    art: { w: 672.988, h: 370.144 },
    rot: -23.97,
    pad: { w: 912.988, h: 610.144, x: -120, y: -120 },
  },
  {
    src: bloomWide,
    box: { x: 0, y: 227, w: 1143.928, h: 1233.301 },
    art: { w: 1065.866, h: 633.322 },
    rot: -53.4,
    pad: { w: 1225.87, h: 793.322, x: -80, y: -80 },
  },
  {
    src: bloomRight,
    box: { x: 815.87, y: 541.88, w: 538.635, h: 954.819 },
    art: { w: 951.715, h: 533.073 },
    rot: -90.34,
    pad: { w: 1191.72, h: 773.073, x: -120, y: -120 },
  },
  {
    src: bloomLeft,
    box: { x: 183.68, y: 539.52, w: 928.678, h: 928.32 },
    art: { w: 417.987, h: 895.109 },
    rot: -134.97,
    pad: { w: 537.987, h: 1015.11, x: -60, y: -60 },
  },
];

/* Cover scale for the artboard. This has to be measured: scale() takes
   a unitless number and there is no way to express calc(100vw/1440) as
   one. Scaling the artboard as a unit is also what keeps the deck, the
   blooms and the type in the exact relationship the comp defines
   instead of letting fixed type float against fluid art. */
function useCoverScale(w, h) {
  const [scale, setScale] = useState(1);

  const useIsomorphic =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

  useIsomorphic(() => {
    const measure = () =>
      setScale(Math.max(window.innerWidth / w, window.innerHeight / h));

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [w, h]);

  return scale;
}

/* ------------------------------------------------------------------
   THE COMPACT BRANCH — why this fan does not reflow.

   Every other section on this page is a row that can become a column.
   This one is a single 1440x1794 artboard scaled as ONE unit, which is
   what keeps the deck, blooms and type in the exact relationship the
   comp defines. That property is also what makes it unshrinkable: the
   cover scale is max(vw/1440, vh/1794), so on a 375x812 phone the
   height term wins at 0.45 and the whole scene — including the 26px
   title — renders at 45%. A 12px heading behind a 121px photo deck is
   not a small version of this section, it is an unreadable one.

   Scaling the type back up independently is the one thing the artboard
   technique forbids, so below lg the fan is abandoned rather than
   approximated: the same photographs, laid out as a plain grid, under
   the same heading at full size. The 250vh runway goes with it — a
   collapsed animation on an uncollapsed runway is two and a half
   screens of dead scroll, which is worse than the fan ever was. This
   is the same bargain the reduced-motion branch already strikes.

   Client-side matchMedia rather than CSS because the runway height and
   the scroll bindings are JS, not classes; a `lg:` variant cannot
   unhook useScroll.
   ------------------------------------------------------------------ */
function useIsCompact() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompact(mq.matches);

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return compact;
}

const CareerDetail_Gallery = () => {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const compact = useIsCompact();
  const scale = useCoverScale(FRAME_W, FRAME_H);

  /* "start start" -> "end end": progress is 0 the instant the stage
     pins and 1 as it unpins, so the fan owns exactly this section's
     scroll and nothing bleeds in from the stories above. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Raw scrollYProgress arrives in uneven steps — one value per scroll
     event, and a trackpad flick delivers a burst of them. Feeding it
     through a low-stiffness, high-damping spring gives the fan a
     little inertia so it glides open instead of snapping between
     whatever samples the reader's scroll happened to land on. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0001,
  });

  /* The title is the payoff, so it arrives on the back half of the
     scrub — by then the fan has cleared the space it lands in. */
  const titleScale = useTransform(progress, [0, 1], [FAR_SCALE, 1]);
  const titleY = useTransform(progress, [0, 1], [TITLE_RISE, 0]);
  const titleOpacity = useTransform(progress, [0.35, 0.75], [0, 1]);

  /* Reduced motion collapses the animation AND the runway together.
     Keeping 250vh of dead scroll for a fan that never opens is worse
     than the fan was, so the section becomes one screen showing the
     open, readable end state. */
  const openState = {
    scale: 1,
    y: 0,
    opacity: 1,
  };

  /* Hooks above run unconditionally — the branch is on render only, so
     the scroll bindings stay legal even though nothing consumes them
     here. See the useIsCompact block for why this exists. */
  if (compact) {
    return (
      <section className="career-detail-gallery relative w-full overflow-hidden py-[90px]">
        <Container className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[10px] text-center text-white [word-break:break-word]">
            <h2 className="w-full text-[26px] font-semibold leading-[1.3] tracking-[-0.52px]">
              Gallery
            </h2>
            <p className="w-full text-[16px] font-normal leading-[1.5] tracking-[-0.32px]">
              Step behind the curtain and withness all behind-the-scenes of life
              at Aashita
            </p>
          </div>

          {/* The deck's seven cards in fan order, so the sequence a
              reader sees here is the one the fan would have laid out. */}
          <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3">
            {[...DECK_CARDS]
              .sort((a, b) => a.slot - b.slot)
              .map((card) => (
                <div
                  key={card.id}
                  className="relative aspect-[270/352] w-full overflow-hidden bg-[#111]"
                  style={{ borderRadius: CARD.radius }}
                >
                  <Image
                    src={card.photo}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="career-detail-gallery relative w-full"
      style={{ height: reduceMotion ? "100vh" : "250vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ARTBOARD — one 1440x1794 unit, cover-scaled and centred. */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {/* BACKGROUND BLOOMS — static. They are the room the deck
              sits in, and animating four large blurred plates would
              cost far more than it reads. */}
          {BLOOMS.map((bloom, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute flex items-center justify-center"
              style={{
                left: bloom.box.x,
                top: bloom.box.y,
                width: bloom.box.w,
                height: bloom.box.h,
              }}
            >
              <div
                className="relative shrink-0 opacity-40"
                style={{
                  width: bloom.art.w,
                  height: bloom.art.h,
                  transform: `rotate(${bloom.rot}deg)`,
                }}
              >
                <img
                  src={bloom.src.src}
                  alt=""
                  className="absolute block max-w-none"
                  style={{
                    left: bloom.pad.x,
                    top: bloom.pad.y,
                    width: bloom.pad.w,
                    height: bloom.pad.h,
                  }}
                />
              </div>
            </div>
          ))}

          {/* THE DECK — every card is the same 270x351.747 plate on the
              same centre, so the ONLY thing that differs between them,
              closed or open, is a transform. That is deliberate: the
              whole fan runs on rotate/translate and never touches
              left/top/width/height, so it composites on the GPU and
              stays smooth under a scrub. */}
          {DECK_CARDS.map((card) => (
            <FanCard
              key={card.id}
              card={card}
              progress={progress}
              reduceMotion={reduceMotion}
            />
          ))}

          {/* TITLE — authored buried behind the deck at 1/2.96 size.
              It is rendered at its true size here and scaled DOWN into
              the closed state, so the open state is exactly 26/16px
              with no rounding drift, and z-20 puts it above the deck
              once the fan has moved out from under it. */}
          <motion.div
            className="absolute z-20 flex flex-col items-center text-center text-white [word-break:break-word]"
            style={{
              /* Figma centres the title at calc(50% + 0.48px) of the
                 1440 frame — 8.48px right of the deck's own centre. */
              left: 720.48,
              top: 300,
              width: 370,
              gap: 10,
              x: "-50%",
              ...(reduceMotion ? openState : {
                scale: titleScale,
                y: titleY,
                opacity: titleOpacity,
              }),
              willChange: "transform",
            }}
          >
            <h2 className="w-full text-[26px] font-semibold leading-[1.3] tracking-[-0.52px]">
              Gallery
            </h2>
            {/* "withness" is the comp's own spelling, reproduced as
                authored. Correcting it to "witness" is an editorial
                call, not a build one. */}
            <p className="w-full text-[16px] font-normal leading-[1.5] tracking-[-0.32px]">
              Step behind the curtain and withness all behind-the-scenes of life
              at Aashita
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------
   ONE CARD OF THE FAN

   Split out because each card needs its own useTransform chain, and
   hooks cannot be called inside a .map() body in the parent.

   The card is positioned by its CENTRE (left/top minus half its size)
   so that rotate() pivots where Figma pivots it — around the shared
   deck centre — rather than around a corner.
   ------------------------------------------------------------------ */
const FanCard = ({ card, progress, reduceMotion }) => {
  const t = slotT(card.slot);

  // Closed values are the comp's. Open values are the reconstruction.
  const openRot = t * FAN_SPREAD;
  const openX = t * FAN_SWEEP;
  const openY = t * t * FAN_DROOP;

  const rotate = useTransform(progress, [0, 1], [card.rot, openRot]);
  const x = useTransform(progress, [0, 1], [0, openX]);
  const y = useTransform(progress, [0, 1], [0, openY]);

  const motionStyle = reduceMotion
    ? { rotate: openRot, x: openX, y: openY }
    : { rotate, x, y };

  return (
    <motion.div
      className="absolute flex flex-col items-start overflow-hidden bg-white/10"
      style={{
        left: DECK.x - CARD.w / 2,
        top: DECK.y - CARD.h / 2,
        width: CARD.w,
        height: CARD.h,
        padding: CARD.pad,
        borderRadius: CARD.radius,
        boxShadow: card.shadow,
        ...motionStyle,
        willChange: "transform",
      }}
    >
      <div
        className="relative min-h-px w-full flex-1 overflow-hidden bg-[#111]"
        style={{ borderRadius: CARD.radius }}
      >
        <Image
          src={card.photo}
          alt={card.alt}
          fill
          /* Painted at 256px inside the artboard, but the artboard is
              cover-scaled up on wide displays — 400 covers 1440..2400
              without over-fetching. */
          sizes="400px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
};

export default CareerDetail_Gallery;
