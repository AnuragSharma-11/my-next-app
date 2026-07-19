"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

import hall from "../assets/manifesto/hall-background.png";
import glow from "../assets/manifesto/glow-bottom-right.png";
import platform from "../assets/manifesto/platform-floor.png";
import archLandscape from "../assets/manifesto/arch-landscape.png";
import zeroFrame from "../assets/manifesto/zero-frame.png";
import ceilingEllipse from "../assets/manifesto/ceiling-ellipse.svg";

import digit1Fill from "../assets/manifesto/digit-1-fill.png";
import digit2Fill from "../assets/manifesto/digit-2-fill.png";
import digit3Fill from "../assets/manifesto/digit-3-fill.png";
import digit4Fill from "../assets/manifesto/digit-4-fill.png";
import digit5Fill from "../assets/manifesto/digit-5-fill.png";

import digit1Stroke from "../assets/manifesto/digit-1-stroke.png";
import digit2Stroke from "../assets/manifesto/digit-2-stroke.png";
import digit3Stroke from "../assets/manifesto/digit-3-stroke.png";
import digit4Stroke from "../assets/manifesto/digit-4-stroke.png";
import digit5Stroke from "../assets/manifesto/digit-5-stroke.png";

import leaderLeftTop from "../assets/manifesto/leader-left-top.svg";
import leaderRightTop from "../assets/manifesto/leader-right-top.svg";
import leaderLeftBottom from "../assets/manifesto/leader-left-bottom.svg";
import leaderRightBottom from "../assets/manifesto/leader-right-bottom.svg";

/* ==================================================================
   THE AASHITA MANIFESTO  (Figma 1:4801, component set 2:7743)

   In Figma the five variants advance ON CLICK. Here they advance ON
   SCROLL — that is the only intentional departure. Everything else
   (geometry, type, copy, transition shape) is the comp's own values.

   HOW THE COMP ACTUALLY ANIMATES

   It is an odometer, and nothing cross-fades. Figma builds six fixed
   overflow-clip windows, each holding a tall stack of five items, and
   every variant slides all six stacks by exactly one item:

     Count-Container            the second digit    1:2679
     Scroll-Content-Container   the belief copy     1:2706
     Principal-Container x4     the corner labels   1:2733 / 45 / 57 / 69

   So the transition is a TRANSLATE inside a clipped window, not an
   opacity swap. Reproducing that is what makes it read as one machine
   turning over rather than five slides changing.

   Static across all five variants: the hall, the figure, the ceiling
   ring, all four leader lines, the heading block, and — easy to miss —
   the leading "0", which is a separate 156x279 frame sitting OUTSIDE
   the clip window. Only the second glyph travels.
   ================================================================== */

/* ------------------------------------------------------------------
   STAGE

   The comp is a fixed 1440x914 artboard, and every number below is a
   literal Figma pixel. Rather than converting them all to percentages
   (which loses fidelity and makes them impossible to check against the
   file), the whole artboard is rendered at true size and scaled as one
   unit to fill the viewport.

   The scale is driven off the HALL PLATE, not the artboard. The plate
   is authored at 1682.687x1038.999 sitting at (-45.69, -6) — it
   deliberately overhangs the artboard on every side. Sizing the stage
   to the plate means the room always covers the screen, while the
   artboard's own content stays comfortably inside the safe area. Scale
   to the artboard instead and a wide display crops the heading off the
   top.
   ------------------------------------------------------------------ */
const PLATE_W = 1682.687;
const PLATE_H = 1038.999;

// Artboard origin within the plate — every Figma coordinate is offset
// by this, so the numbers below stay copy-pasteable from the file.
const OX = 45.69;
const OY = 6;

const at = (x, y) => ({ left: x + OX, top: y + OY });

/* ------------------------------------------------------------------
   ODOMETER WINDOWS

   window = the overflow-clip box (Figma's own w/h)
   pitch  = how far the stack travels per step

   Figma stacks items of natural height with a fixed gap, which gives a
   ragged pitch. Items here are pinned to the window height instead, so
   pitch = window + gap and step N always lands dead centre. Without
   that the stack drifts further out of frame on every advance.
   ------------------------------------------------------------------ */
const COUNT = { w: 150, h: 310, top: 16, item: 279, gap: 70 }; // 1:2679
const COUNT_PITCH = COUNT.item + COUNT.gap; // 349

const COPY = { w: 400, h: 240, inner: 386, gap: 60 }; // 1:2706
const COPY_PITCH = COPY.h + COPY.gap; // 300

/* Four corner label windows. Figma gives each its own height because
   some labels wrap to two lines. `pad` is the inner stack's own top
   offset within the window. */
const CORNERS = [
  { key: "leftTop", ...at(670, 410), w: 150, h: 30, pad: 6, align: "left" },
  { key: "leftBottom", ...at(663, 549), w: 140, h: 50, pad: 9, align: "left" },
  { key: "rightTop", ...at(1284, 394), w: 110, h: 40, pad: 5, align: "left" },
  { key: "rightBottom", ...at(1287, 566), w: 110, h: 44, pad: 2, align: "left" },
];
const CORNER_GAP = 10;

/* ------------------------------------------------------------------
   LEADER LINES — static in every variant.

   Each SVG carries its arrowhead outside the layout box, which is why
   Figma wraps them in negative insets. Resolving those insets gives a
   uniform (-3.2, -3.2) offset and the file's own viewBox size, so the
   art is never squashed — these exports are preserveAspectRatio="none"
   and would happily distort into whatever box they were given.
   ------------------------------------------------------------------ */
const LEADERS = [
  { src: leaderLeftTop, ...at(740 - 3.2, 417 - 3.2), w: 88.2034, h: 26.8, flipX: true },
  { src: leaderRightTop, ...at(1212 - 3.2, 416 - 3.2), w: 127.202, h: 26.8 },
  { src: leaderRightBottom, ...at(1196 - 3.2, 587 - 3.2), w: 124.202, h: 26.8 },
  { src: leaderLeftBottom, ...at(758 - 3.2, 579 - 3.2), w: 88.8, h: 26.8, flipX: true },
];

/* ------------------------------------------------------------------
   NUMERALS

   Each glyph ships as two plates: a fill and a wider "extra stroke"
   glow. Both overhang their layout box, by different amounts, and the
   two are not interchangeable — the insets below are Figma's own,
   resolved from percentages to the fractions used here.
   ------------------------------------------------------------------ */
const DIGITS = [
  { fill: digit1Fill, stroke: digit1Stroke, w: 86, fi: [-0.72, -2.33, -0.72, -2.33], si: [-4.08, -20.05, -8.27, -20.05] },
  { fill: digit2Fill, stroke: digit2Stroke, w: 144, fi: [-0.95, -1.83, -0.95, -1.83], si: [-4.37, -12.25, -8.28, -12.25] },
  { fill: digit3Fill, stroke: digit3Stroke, w: 132, fi: [-0.95, -2.0, -0.95, -2.0], si: [-4.3, -13.36, -8.34, -13.36] },
  { fill: digit4Fill, stroke: digit4Stroke, w: 148, fi: [-0.95, -1.78, -0.95, -1.78], si: [-4.3, -11.92, -8.34, -11.92] },
  { fill: digit5Fill, stroke: digit5Stroke, w: 129, fi: [-0.95, -2.05, -0.95, -2.15], si: [-4.3, -13.67, -8.34, -13.78] },
];

// Figma writes insets as [top, right, bottom, left] percentages.
const insetStyle = ([t, r, b, l]) => ({
  position: "absolute",
  top: `${t}%`,
  right: `${r}%`,
  bottom: `${b}%`,
  left: `${l}%`,
});

/* ------------------------------------------------------------------
   CONTENT — verbatim from the comp (nodes 1:2707 and 1:2733/45/57/69).

   `corners` is ordered to match CORNERS above:
     leftTop, leftBottom, rightTop, rightBottom
   ------------------------------------------------------------------ */
const MANIFESTO = [
  {
    number: "01",
    label: "Human Progress",
    heading: ["Technology matters when it improves human lives."],
    body: "We build with empathy, design with understanding, and create solutions that expand opportunities, dignity and possibilities for people everywhere.",
    corners: [
      "BETTER LIVES",
      "stronger organisations",
      "LARGER POSSIBILITIES",
      "meaningful impact",
    ],
  },
  {
    number: "02",
    label: "OWNERSHIP",
    heading: ["WE DON'T JUST BUILD.", "WE TAKE RESPONSIBILITY."],
    body: "We own the outcomes of what we create, staying committed beyond launch to improve, evolve, and make every solution stronger over time.",
    corners: [
      "OWN THE OUTCOME",
      "BUILD WITH ACCOUNTABILITY",
      "STAY BEYOND LAUNCH",
      "IMPROVE WHAT WE CREATE",
    ],
  },
  {
    number: "03",
    label: "LONG-TERM THINKING",
    heading: ["WE BUILD FOR WHAT LASTS,", "NOT WHAT'S TRENDING."],
    body: "We look beyond short-term wins, making thoughtful decisions and building products, companies, and systems designed to remain relevant for years to come.",
    corners: [
      "THINK IN DECADES",
      "BUILD TO ENDURE",
      "CHOOSE LASTING VALUE",
      "DESIGN FOR WHAT'S NEXT",
    ],
  },
  {
    number: "04",
    label: "INTELLIGENCE WITH PURPOSE",
    heading: ["AI IS A TOOL,", "IMPACT IS THE PURPOSE."],
    body: "We use intelligence to understand deeper, solve meaningful problems, and create real value—not simply to automate what already exists.",
    corners: [
      "UNDERSTAND DEEPER",
      "SOLVE REAL PROBLEMS",
      "INTELLIGENCE WITH INTENT",
      "CREATE REAL VALUE",
    ],
  },
  {
    number: "05",
    label: "RELENTLESS EVOLUTION",
    heading: ["WHAT WE BUILD IS", "NEVER TRULY FINISHED."],
    body: "We keep learning, questioning, improving, and adapting because meaningful progress comes from the willingness to evolve continuously.",
    corners: [
      "KEEP LEARNING",
      "QUESTION CONSTANTLY",
      "ADAPT WITH PURPOSE",
      "NEVER STOP IMPROVING",
    ],
  },
];

/* Every stack shares one transition, because in the comp they move as
   one mechanism. Tuned long and heavily eased-out so the glyph settles
   rather than snapping — a click transition and a scroll transition
   want the same shape here, only the trigger differs. */
const SLIDE = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };

/* Cover scale for the plate. This has to be measured rather than done
   in CSS: transform: scale() takes a unitless number, and there is no
   way to turn calc(100vw / 1682.687) into one. Percentage layout would
   avoid the measurement but would leave every font size fixed while the
   art around it grew, which pulls the callout labels off their leader
   lines. Scaling the whole artboard as one unit is what keeps Figma's
   pixel values true at any viewport. */
function useCoverScale(w, h) {
  const [scale, setScale] = useState(1);

  // Layout effect so the first paint is already at the right size —
  // useEffect would flash the artboard at 1:1 for a frame.
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

const About_Manifesto = () => {
  const sectionRef = useRef(null);
  const [step, setStep] = useState(0);
  const scale = useCoverScale(PLATE_W, PLATE_H);

  /* "start start" -> "end end": progress is 0 the instant the room pins
     and 1 as it unpins, so the five steps own exactly this section's
     scroll and nothing bleeds in from the section above. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Scroll picks WHICH step; motion runs the transition between them.
     A continuous scrub was the alternative, but it would park the
     odometer mid-glyph whenever the reader stops — half a digit and two
     clipped words. Snapping to a step keeps every resting state a
     readable one, exactly like the comp's five variants. */
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(
      MANIFESTO.length - 1,
      Math.max(0, Math.floor(p * MANIFESTO.length)),
    );
    setStep((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={sectionRef}
      className="manifesto relative w-full"
      /* One screen of scroll per belief, derived from the array so a
         sixth belief needs no change here. */
      style={{ height: `${MANIFESTO.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* STAGE — one artboard at true Figma size, scaled as a single
            unit so the room, the numeral, the leader lines and the type
            all stay in the exact relationship the comp defines. */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: PLATE_W,
            height: PLATE_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div className="absolute inset-0">
            {/* THE ROOM */}
            <Image
              src={hall}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* TEAL SPILL — mix-blend-screen, exactly as the comp has it */}
            <img
              src={glow.src}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute mix-blend-screen"
              style={{ ...at(979, 813), width: 461, height: 220 }}
            />

            {/* PLATFORM — the lit floor slab behind the numeral */}
            <div
              className="pointer-events-none absolute overflow-hidden rounded-[13.92px]"
              style={{ ...at(712, 469), width: 665, height: 294 }}
            >
              <img
                src={platform.src}
                alt=""
                aria-hidden="true"
                className="absolute max-w-none"
                style={{ width: "107%", height: "161.41%", left: "-3.44%", top: "-27.31%" }}
              />
            </div>

            {/* CEILING RING */}
            <img
              src={ceilingEllipse.src}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ ...at(1115.94, 757.2), width: 75.408, height: 9.196 }}
            />

            {/* ============ THE ODOMETER ============
                "0" frame and the rolling digit, side by side with the
                comp's 20px gap. Only the right half is clipped. */}
            <div
              className="absolute flex items-center"
              style={{ ...at(865, 373), gap: 20 }}
            >
              {/* THE LEADING ZERO — never moves. It sits outside the
                  clip window, which is why it holds still while the
                  digit beside it rolls. */}
              <div className="relative shrink-0" style={{ width: 156, height: 279 }}>
                <div
                  className="absolute overflow-hidden rounded-full border-2 border-[#2f2d2b]"
                  style={{ left: 37, top: 34, width: 82, height: 213 }}
                >
                  <img
                    src={archLandscape.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute max-w-none"
                    style={{ width: "1203.04%", height: "241.15%", left: "-555.68%", top: "-62.85%" }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-[2.632px] border-[#2f2d2b] shadow-[0px_5.843px_14.607px_0px_rgba(0,0,0,0.25)]" />
                <img
                  src={zeroFrame.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute"
                  style={{ inset: "-0.72% -1.28%", width: "102.56%", height: "101.44%" }}
                />
              </div>

              {/* THE ROLLING DIGIT */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: COUNT.w, height: COUNT.h }}
              >
                <motion.div
                  className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
                  style={{ top: COUNT.top, width: 148, gap: COUNT.gap }}
                  animate={{ y: -step * COUNT_PITCH }}
                  transition={SLIDE}
                >
                  {DIGITS.map((d, i) => (
                    <div
                      key={i}
                      className="relative shrink-0"
                      style={{ width: d.w, height: COUNT.item }}
                    >
                      <img src={d.fill.src} alt="" aria-hidden="true" style={insetStyle(d.fi)} />
                      <img src={d.stroke.src} alt="" aria-hidden="true" style={insetStyle(d.si)} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* LEADER LINES — static; they point at the glyph, and the
                glyph never moves, so neither do they. */}
            {LEADERS.map((l, i) => (
              <img
                key={i}
                src={l.src.src}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  left: l.left,
                  top: l.top,
                  width: l.w,
                  height: l.h,
                  transform: l.flipX ? "scaleX(-1)" : undefined,
                }}
              />
            ))}

            {/* CORNER LABELS — four more clipped stacks, all sliding on
                the same step as the digit. */}
            {CORNERS.map((c, ci) => (
              <div
                key={c.key}
                className="absolute overflow-hidden"
                style={{ left: c.left, top: c.top, width: c.w, height: c.h }}
              >
                <motion.div
                  className="absolute left-0 flex flex-col"
                  style={{ top: c.pad, gap: CORNER_GAP }}
                  animate={{ y: -step * (c.h + CORNER_GAP) }}
                  transition={SLIDE}
                >
                  {MANIFESTO.map((m) => (
                    <p
                      key={m.number}
                      className="shrink-0 text-[12px] font-normal uppercase leading-[1.5] tracking-[-0.24px] text-white"
                      style={{ width: c.w, height: c.h }}
                    >
                      {m.corners[ci]}
                    </p>
                  ))}
                </motion.div>
              </div>
            ))}

            {/* ============ HEADING ============
                Fixed in every variant — it frames all five beliefs
                rather than belonging to any one of them. */}
            <div
              className="absolute flex items-start"
              style={{ ...at(120, 90), width: 1200, gap: 16 }}
            >
              <div className="flex min-w-px flex-1 flex-col" style={{ gap: 24 }}>
                <h2
                  className="text-[52px] font-normal leading-[1.2] text-white"
                  style={{ width: 623 }}
                >
                  What We Build Changes.
                  <br />
                  What We Believe Doesn&rsquo;t.
                </h2>
                <p
                  className="text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
                  style={{ width: 525 }}
                >
                  We solve real human challenges with intelligent, scalable
                  products that create measurable impact.
                </p>
              </div>

              <div className="flex shrink-0 items-center" style={{ gap: 16 }}>
                <span className="h-[4px] w-[22px] shrink-0 bg-[#e3e3e3]" />
                <p className="whitespace-nowrap text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
                  THE AASHITA MANIFESTO
                </p>
              </div>
            </div>

            {/* ============ BELIEF COPY ============
                The sixth clipped stack. Each panel is pinned to the
                window height so the pitch stays constant. */}
            <div
              className="absolute overflow-hidden"
              style={{ ...at(113, 518), width: COPY.w, height: COPY.h }}
            >
              <motion.div
                className="absolute left-1/2 flex -translate-x-1/2 flex-col"
                style={{ top: 0, width: COPY.inner, gap: COPY.gap }}
                animate={{ y: -step * COPY_PITCH }}
                transition={SLIDE}
              >
                {MANIFESTO.map((m) => (
                  <div
                    key={m.number}
                    className="flex shrink-0 flex-col bg-[rgba(16,22,23,0.1)] backdrop-blur-[1px]"
                    style={{ height: COPY.h, gap: 22 }}
                  >
                    <p className="text-[16px] font-semibold uppercase leading-[1.5] tracking-[-0.32px] text-[#24f3e6]">
                      {m.label}
                    </p>
                    <div className="flex flex-col text-white" style={{ gap: 22 }}>
                      <p className="text-[22px] font-medium uppercase leading-[1.5] tracking-[-0.44px]">
                        {m.heading.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < m.heading.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <p className="text-[16px] font-normal leading-[1.5] tracking-[-0.32px]">
                        {m.body}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Accessible running state — the odometer is decorative to
                a screen reader, so the current belief is announced once
                rather than as five stacked copies. */}
            <p className="sr-only" aria-live="polite">
              {MANIFESTO[step].number}. {MANIFESTO[step].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Manifesto;
