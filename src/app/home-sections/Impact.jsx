"use client";
import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView, useReducedMotion } from "motion/react";
import CharReveal from "../components/CharReveal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  Building02Icon,
  ChartIncreaseIcon,
  CubeIcon,
  Shield01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

/* ------------------------------------------------------------------
   PATTERN — a flat, uniform proof band (reference: the enterprise
   stat rows under hero sections at NVIDIA/Accenture-class sites).

   Every stat gets the SAME treatment: icon, teal value, white label,
   muted caption, all centre-aligned in equal columns. No timeline
   rail, no glow, no hero-sized first number — the earlier layout
   promoted 100K+ into a display element, which read as marketing;
   uniform columns read as reporting, and reporting is the credible
   register for a claims row. 100K+ still leads, but as first among
   equals.

   The copy is ours — only the pattern is borrowed.
   ------------------------------------------------------------------ */

const IMPACTS = [
  {
    value: "100K+",
    title: "People Impacted",
    description:
      "Lives touched through digital products and AI experiences we’ve built.",
    icon: UserMultipleIcon,
  },
  {
    value: "15+",
    title: "Products Built",
    description: "Scalable digital products designed and delivered.",
    icon: CubeIcon,
  },
  {
    value: "5+",
    title: "Industries Served",
    description: "Education, Healthcare, Enterprise, IT and more.",
    icon: Building02Icon,
  },
  {
    value: "45%",
    title: "Business Growth",
    description: "Average growth achieved by our clients.",
    icon: ChartIncreaseIcon,
  },
  {
    value: "50%",
    title: "Higher Engagement",
    description: "Increase in user engagement across platforms.",
    icon: UserGroupIcon,
  },
  {
    value: "200+",
    title: "AI Solutions Delivered",
    description: "Intelligent solutions that solve real-world problems.",
    icon: AiBrain01Icon,
  },
  {
    value: "ISO 42001",
    title: "AI Governance Certified",
    description: "Global standard for responsible and ethical AI practices.",
    icon: Shield01Icon,
  },
];

/* ------------------------------------------------------------------
   APPEAR — the site's rise-and-settle, with two organic touches.

   1. A 6px blur that resolves as each element lands. Opacity alone
      reads as a video fading in; blur-to-sharp reads as the element
      arriving into focus, which is the difference between "sleek" and
      merely "animated". Kept small because blur is the one filter
      cheap enough to animate without jank.

   2. The band staggers per column, 70ms apart, AFTER the header block
      has led — so the reveal travels left to right across the row like
      a wave rather than the whole grid popping at once. whileInView
      with once:true, same as every section: it plays on arrival and
      never fidgets on re-scroll.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const bandStage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------
   COUNT-UP — numeric stat values count from 0 to their target as the
   band arrives, which makes the numbers read as measured rather than
   typeset. Only the LEADING integer animates ("100" in "100K+"); the
   suffix renders immediately so the line never changes width class.
   Non-numeric values ("ISO 42001") render as-is. Reduced motion skips
   straight to the final value.
   ------------------------------------------------------------------ */
const CountUp = ({ value }) => {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!match || !inView || reduceMotion) return;
    const controls = animate(0, parseInt(match[1], 10), {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  if (!match) return <span>{value}</span>;
  if (reduceMotion) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {display}
      {match[2]}
    </span>
  );
};

const Impact = () => (
  <section className="impact relative overflow-hidden pt-[clamp(40px,4vw,64px)] pb-[var(--section-pad)]">
    {/* Gutter lives on THIS box, not the section, so the content column
        is frame - 2*gutter like every Container section — with it on
        the section the column ran 160px wide past 1760. */}
    <div className="relative mx-auto max-w-[var(--frame)] px-[var(--gutter)]">
      <motion.div
        className="mx-auto flex max-w-[760px] flex-col items-center text-center"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* CHAR REVEAL — chars ripple in as the band arrives. */}
        <CharReveal
          as="h2"
          className="text-[length:var(--text-section)] font-light leading-[1.18] tracking-[-0.045em] text-white"
          segments={[
            { t: "Intelligence Into " },
            { t: "Measurable Outcomes.", c: "text-[#02e2c5]" },
          ]}
        />
        

      </motion.div>

      {/* THE BAND — equal columns at every width, centre-aligned like
          the reference. 7 items: one row at xl, 4+3 at lg, then 3- and
          2-up on the way down. Fixed icon/value gaps (not space-between)
          so the value line sits at the same height in every column —
          that shared baseline is most of what makes the pattern read
          as a system. */}
      <motion.div
        className="mt-[48px] grid grid-cols-2 gap-x-[24px] gap-y-[56px] sm:grid-cols-3 lg:mt-[56px] lg:grid-cols-4 xl:grid-cols-7"
        variants={bandStage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
      >
        {IMPACTS.map((item) => (
          <motion.article
            key={item.title}
            variants={riseIn}
            className="group flex flex-col items-center text-center"
          >
            {/* Icon lifts on hover — the row is informational, so the
                response stays small and physical. */}
            <HugeiconsIcon
              icon={item.icon}
              size={44}
              strokeWidth={1.5}
              className="text-[#0cffd7] transition-transform duration-300 ease-out group-hover:-translate-y-[4px]"
            />
            {/* Values share ONE size — the reference sizes "Billions"
                and "ISO 42001:2023" identically, and that uniformity is
                the point: no stat outranks another. */}
            <p className="mt-[32px] font-number text-[26px] font-semibold leading-none tracking-[-0.03em] text-[#0cffd7]">
              <CountUp value={item.value} />
            </p>
            {/* Caption scale, below the token ladder: seven columns at
                xl leave ~200px each, and body-size captions would wrap
                the grid apart. */}
            <p className="mt-[12px] max-w-[210px] text-[14px] font-medium leading-[1.6] text-[#e3e3e3]">
              {item.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Impact;
