"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

import hall from "../assets/manifesto/hall-background.png";
import glow from "../assets/manifesto/glow-bottom-right.png";
import platform from "../assets/manifesto/platform-floor.png";
import ceilingEllipse from "../assets/manifesto/ceiling-ellipse.svg";

/* THE NUMERAL FRAMES — six ready-made glyphs the designer supplied,
   each a single SVG with the sunrise landscape filling the digit and
   the border baked in. These REPLACE the old composited odometer
   (leading-zero frame + per-digit fill/stroke plates + border rings +
   the arch-landscape masked inside the zero). One image per state,
   nothing to assemble. Index 0 is the initial "0"; 1..5 are the
   counts that pair with the five beliefs. */
import frameInitial from "../assets/manifesto/Initial Frame.svg";
import frameCount1 from "../assets/manifesto/Count-one.svg";
import frameCount2 from "../assets/manifesto/Count-2.svg";
import frameCount3 from "../assets/manifesto/Count-3.svg";
import frameCount4 from "../assets/manifesto/Count-4.svg";
import frameCount5 from "../assets/manifesto/Count-5.svg";

import Eyebrow from "../../components/Eyebrow";

/* The numeral is TWO glyphs side by side, reading "01" -> "05":

     INITIAL  the fixed leading "0" — always on screen, on the LEFT.
     COUNTS   the changing digit 1..5 — on the RIGHT, one per belief.

   Only the right digit changes as the reader scrolls; the "0" never
   moves. Each frame carries its Figma viewBox aspect, because an
   absolutely-positioned <img> with only a height set collapses to
   zero width (w-auto can't resolve the ratio, and Tailwind's
   `img { max-width: 100% }` clamps it) — so the width is computed
   explicitly from height * (w / h). */
const INITIAL = { src: frameInitial, w: 191, h: 314 };
const COUNTS = [
  { src: frameCount1, w: 121, h: 314 },
  { src: frameCount2, w: 180, h: 315 },
  { src: frameCount3, w: 168, h: 315 },
  { src: frameCount4, w: 184, h: 315 },
  { src: frameCount5, w: 165, h: 315 },
];
// Widest count, so the right digit sits in a fixed box and the crossfade
// never shifts the "0" or the gap the figure stands in.
const COUNT_MAX_W = Math.max(...COUNTS.map((c) => c.w));

/* ==================================================================
   THE AASHITA MANIFESTO  (Figma 1:4801, component set 2:7743)

   In Figma the five variants advance ON CLICK. Here they advance ON
   SCROLL. The scene is a fixed 1440x914 room; a single large numeral
   stands on the lit platform and counts up as the reader descends,
   while the belief copy, the four corner labels and their leader
   lines cycle underneath the heading.

   THE NUMERAL is now one image per state — the six frames above,
   crossfaded — rather than the earlier two-part construction (a
   static "0" beside a rolling second digit assembled from fill and
   stroke plates). It reads "0 -> 1 -> 2 -> 3 -> 4 -> 5": the initial
   frame greets the reader, then each of the five counts arrives with
   its belief.
   ================================================================== */

/* ------------------------------------------------------------------
   STAGE — the comp is a fixed 1440x914 artboard; every number below
   is a literal Figma pixel, and the whole artboard is scaled as one
   unit to cover the viewport (see useCoverScale). The scale is driven
   off the HALL PLATE (1682.687x1038.999 at (-45.69,-6)), which
   overhangs the artboard so the room always fills the screen.
   ------------------------------------------------------------------ */
const PLATE_W = 1682.687;
const PLATE_H = 1038.999;

// Artboard origin within the plate — every Figma coordinate is offset
// by this, so the numbers below stay copy-pasteable from the file.
const OX = 45.69;
const OY = 6;

const at = (x, y) => ({ left: x + OX, top: y + OY });

/* THE NUMERAL — "0" + count, standing on the platform slab.

   cx / cy is the CENTRE of the gap between the two glyphs — where the
   figure in the photo stands. The "0" sits to its left and the count
   to its right, each pushed out by half the gap, so the figure reads
   as standing between them (as in the comp). h is the glyph height;
   gap is the space the figure occupies. */
const NUMERAL = { cx: 1044.5, cy: 540, h: 300, gap: 44 };

/* Count odometer: each digit occupies one window-tall slot; the gap
   is the empty roll between them, and pitch is how far the stack
   travels per belief. Same idea as COPY_PITCH / the corner pitch. */
const COUNT_GAP = 70;
const COUNT_PITCH = NUMERAL.h + COUNT_GAP;

/* ------------------------------------------------------------------
   CORNER LABELS + LEADER LINES — the numeral's annotations, four
   short phrases per belief pointing in along the leader lines. Static
   geometry, cycling text.
   ------------------------------------------------------------------ */
const CORNERS = [
  { key: "leftTop", ...at(670, 410), w: 150, h: 30, pad: 6 },
  { key: "leftBottom", ...at(663, 549), w: 140, h: 50, pad: 9 },
  { key: "rightTop", ...at(1284, 394), w: 110, h: 40, pad: 5 },
  { key: "rightBottom", ...at(1287, 566), w: 110, h: 44, pad: 2 },
];
const CORNER_GAP = 10;

import leaderLeftTop from "../assets/manifesto/leader-left-top.svg";
import leaderRightTop from "../assets/manifesto/leader-right-top.svg";
import leaderLeftBottom from "../assets/manifesto/leader-left-bottom.svg";
import leaderRightBottom from "../assets/manifesto/leader-right-bottom.svg";

const LEADERS = [
  { src: leaderLeftTop, ...at(740 - 3.2, 417 - 3.2), w: 88.2034, h: 26.8, flipX: true },
  { src: leaderRightTop, ...at(1212 - 3.2, 416 - 3.2), w: 127.202, h: 26.8 },
  { src: leaderRightBottom, ...at(1196 - 3.2, 587 - 3.2), w: 124.202, h: 26.8 },
  { src: leaderLeftBottom, ...at(758 - 3.2, 579 - 3.2), w: 88.8, h: 26.8, flipX: true },
];

const COPY = { w: 400, h: 240, inner: 386, gap: 60 };
const COPY_PITCH = COPY.h + COPY.gap; // 300

/* ------------------------------------------------------------------
   CONTENT — verbatim from the comp. `corners` is ordered to match
   CORNERS above: leftTop, leftBottom, rightTop, rightBottom.
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

/* One shared transition — the belief stacks, the corner labels and
   the count odometer all slide on this curve, so the whole scene
   turns over as one machine. */
const SLIDE = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };

/* Cover scale for the plate — measured, because transform: scale()
   takes a unitless number and there is no CSS way to derive it. */
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

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const About_Manifesto = () => {
  const sectionRef = useRef(null);
  const [step, setStep] = useState(0); // 0..4 -> which belief + which count digit
  const scale = useCoverScale(PLATE_W, PLATE_H);

  /* "start start" -> "end end": progress is 0 as the room pins and 1
     as it unpins, so the whole count owns exactly this section's
     scroll. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Scroll picks the dwell; motion runs the transition. Snapping to a
     step keeps every resting state readable (a whole numeral, whole
     words) rather than parking mid-glyph. The "0" is always shown; the
     count digit is COUNTS[step], one per belief. */
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const beliefStep = clamp(Math.floor(p * MANIFESTO.length), 0, MANIFESTO.length - 1);
    setStep((current) => (current === beliefStep ? current : beliefStep));
  });

  return (
    <section
      ref={sectionRef}
      /* One screen of scroll per belief. Below lg the scene is not
         rendered, so the runway collapses. */
      className="manifesto relative h-auto w-full lg:h-[var(--manifesto-runway)]"
      style={{ "--manifesto-runway": `${MANIFESTO.length * 100}vh` }}
    >
      {/* ============ STATIC FALLBACK (below lg) ============
          The room cannot be scaled to cover a narrow viewport without
          throwing the type off-screen, so the odometer does not run
          here. The five beliefs read as ordinary stacked copy. */}
      <div className="flex flex-col gap-[56px] px-[var(--gutter)] py-[80px] lg:hidden">
        <div className="flex flex-col gap-[24px]">
          <Eyebrow label="THE AASHITA MANIFESTO" barColor="#e3e3e3" />
          <h2 className="text-[32px] font-normal leading-[1.2] text-white sm:text-[40px]">
            What We Build Changes. What We Believe Doesn&rsquo;t.
          </h2>
          <p className="text-[18px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]">
            We solve real human challenges with intelligent, scalable products
            that create measurable impact.
          </p>
        </div>

        <ol className="flex flex-col gap-[40px]">
          {MANIFESTO.map((m) => (
            <li key={m.number} className="flex flex-col gap-[12px]">
              <p className="font-number text-[40px] font-normal leading-none text-[#0cffd7]">
                {m.number}
              </p>
              <p className="text-[14px] font-semibold uppercase leading-[1.5] tracking-[-0.32px] text-[#24f3e6]">
                {m.label}
              </p>
              <p className="text-[20px] font-medium uppercase leading-[1.5] tracking-[-0.44px] text-white">
                {m.heading.join(" ")}
              </p>
              <p className="text-[16px] font-normal leading-[1.5] tracking-[-0.32px] text-white">
                {m.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="sticky top-0 hidden h-screen w-full overflow-hidden lg:block">
        {/* STAGE — one artboard at true Figma size, scaled as a single
            unit so the room, numeral, leaders and type keep the exact
            relationship the comp defines. */}
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

            {/* TEAL SPILL — mix-blend-screen, exactly as the comp. */}
            <img
              src={glow.src}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute mix-blend-screen"
              style={{ ...at(979, 813), width: 461, height: 220 }}
            />

            {/* PLATFORM — the lit floor slab the numeral stands on. */}
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

            {/* ============ THE NUMERAL ============
                Two glyphs reading "0" + count. The fixed "0" is on the
                left; the count on the right is an ODOMETER — all five
                digits stacked in one clip window that slides by exactly
                one slot per belief, the SAME mechanism (and the same
                SLIDE transition) as the belief copy and the corner
                labels, so the whole scene turns over as one machine on
                scroll. `gap` is the space the figure stands in.

                max-w-none on every glyph because Tailwind preflight
                caps img at max-width:100% and these parents have no
                width, which would clamp them to 0. */}
            <div
              className="pointer-events-none absolute flex items-center"
              style={{
                left: NUMERAL.cx + OX,
                top: NUMERAL.cy + OY,
                transform: "translate(-50%, -50%)",
                gap: NUMERAL.gap,
              }}
            >
              {/* THE FIXED "0" — never changes. */}
              <img
                src={INITIAL.src.src}
                alt=""
                aria-hidden="true"
                className="block max-w-none"
                style={{
                  height: NUMERAL.h,
                  width: (NUMERAL.h * INITIAL.w) / INITIAL.h,
                }}
              />

              {/* THE COUNT ODOMETER — one clip window (a single digit
                  tall), holding the five count glyphs stacked with a
                  gap. The stack slides up one pitch per belief; the
                  window shows exactly the current digit. Digits
                  left-align, so each width sits from the same edge. */}
              <div
                className="relative overflow-hidden"
                style={{ height: NUMERAL.h, width: (NUMERAL.h * COUNT_MAX_W) / COUNTS[0].h }}
              >
                <motion.div
                  className="absolute left-0 top-0 flex flex-col"
                  style={{ gap: COUNT_GAP }}
                  animate={{ y: -step * COUNT_PITCH }}
                  transition={SLIDE}
                >
                  {COUNTS.map((c, i) => (
                    <img
                      key={i}
                      src={c.src.src}
                      alt=""
                      aria-hidden="true"
                      className="block max-w-none shrink-0"
                      style={{
                        height: NUMERAL.h,
                        width: (NUMERAL.h * c.w) / c.h,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>

            {/* LEADER LINES — static; they point at the numeral zone. */}
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

            {/* CORNER LABELS — four clipped stacks, sliding on the same
                step as the beliefs. */}
            {CORNERS.map((c, ci) => (
              <div
                key={c.key}
                className="absolute overflow-hidden"
                style={{
                  left: c.left,
                  top: c.top,
                  width: c.w,
                  height: c.h,
                }}
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

            {/* ============ HEADING — fixed across every state. ======= */}
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

              <div className="shrink-0">
                <Eyebrow label="THE AASHITA MANIFESTO" barColor="#e3e3e3" />
              </div>
            </div>

            {/* ============ BELIEF COPY ============
                The clipped stack of five belief panels. */}
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

            {/* Accessible running state — decorative to a screen
                reader, so the current belief is announced once. */}
            <p className="sr-only" aria-live="polite">
              {`${MANIFESTO[step].number}. ${MANIFESTO[step].label}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Manifesto;
