"use client";
import { motion, useReducedMotion } from "motion/react";

import caseStudyCover from "../assets/case-studies/case-study-cover.png";
import Container from "../../components/Container";
import InsightCard from "../../components/InsightCard";

/* ------------------------------------------------------------------
   MOTION

   Unlike the other sections on this page, this one DOES carry an
   authored animation, and the evidence is structural rather than in a
   keyframe track: both rows are instances of a master component named
   "Scroll Animation container" (1:1263) whose children are laid out
   absolutely from left:0 to left:2749.5 — 3033px of cards inside a
   frame that is 1200px wide and overflow-clip. Content that overruns
   its own clip box by 2.5x is not a layout mistake; it is a marquee
   captured at rest. Reproducing it as a horizontal loop is therefore
   honouring the design, not inventing motion for it.

   The loop translates rather than animating `left`, so it stays on the
   compositor instead of forcing layout on every frame.

   Seamlessness comes from geometry, not from a callback: the track
   renders the card set TWICE and travels exactly one set-width, so the
   moment the first set leaves the clip box the second is sitting
   pixel-identical in its place and the reset is invisible. That width
   is derived below rather than typed in, so changing the card count or
   the gutter cannot silently break the seam.
   ------------------------------------------------------------------ */

const CARD_WIDTH = 283.5;
const CARD_GAP = 22;

/* The heading still gets a restrained scroll reveal — the marquee is
   the section's motion, so the title should arrive quietly rather than
   compete with it. */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Figma ships all ten slots per row with identical placeholder copy,
   so that copy is reproduced as-is rather than invented. The array is
   the seam where real case studies drop in — the markup below never
   needs to change to add or remove one. */
const CASE_STUDIES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  category: "Case Study",
  date: "Mon,08,June,26",
  title:
    "The Real Economics of Peak: How to break the linear link between orders and headcount",
  href: "/blog/detail",
  image: caseStudyCover,
  imageAlt: "A consultant presenting findings during a client workshop",
}));

const TRACK_DISTANCE = CASE_STUDIES.length * (CARD_WIDTH + CARD_GAP);

/* CASE STUDY CARD — the shared InsightCard, pinned to the marquee's
   fixed slot size. This card and the All Insights grid card are the
   same design (photo above copy on a translucent ground); they differ
   only in photo height, date size and whether the box is fixed, so all
   three are props rather than a second implementation.

   It is NOT ArticleCard: that one is a photo-FILL tile with a frosted
   panel floating over its lower edge, which is a different composition
   rather than a variant of this one.

   sizes="264px" is the real painted width — the source is 450x600 and
   would otherwise ship whole into every one of the twenty slots. */
const CaseStudyCard = ({ study }) => (
  <InsightCard
    kicker={study.category}
    date={study.date}
    title={study.title}
    href={study.href}
    image={study.image}
    imageAlt={study.imageAlt}
    imageSizes="264px"
    photoHeight={320}
    dateSize={14}
    className="h-[580px] w-[283.5px] shrink-0"
  />
);

/* MARQUEE ROW — `reverse` starts the track already shifted one set
   left and travels back to zero, which reads as rightward travel while
   using the identical geometry as the forward row. */
const MarqueeRow = ({ reverse = false, duration, paused }) => (
  <div className="w-full overflow-hidden">
    <motion.div
      className="flex w-max"
      style={{ gap: CARD_GAP }}
      animate={
        paused
          ? { x: 0 }
          : { x: reverse ? [-TRACK_DISTANCE, 0] : [0, -TRACK_DISTANCE] }
      }
      transition={
        paused
          ? undefined
          : { duration, ease: "linear", repeat: Infinity, repeatType: "loop" }
      }
    >
      {/* Two passes of the same data: the duplicate is what the eye
          lands on when the original scrolls out, so it is decorative
          and hidden from assistive tech rather than announced twice. */}
      {CASE_STUDIES.map((study) => (
        <CaseStudyCard key={study.id} study={study} />
      ))}
      <div className="flex shrink-0" style={{ gap: CARD_GAP }} aria-hidden="true">
        {CASE_STUDIES.map((study) => (
          <CaseStudyCard key={`dup-${study.id}`} study={study} />
        ))}
      </div>
    </motion.div>
  </div>
);

const Blog_CaseStudies = () => {
  /* A continuous, never-ending translation is exactly the motion
     vestibular-sensitive users ask to be spared, and it can never be
     escaped by scrolling past it. Honouring the OS setting parks both
     tracks instead of slowing them. */
  const reduceMotion = useReducedMotion();

  return (
    <section className="blog-case-studies relative w-full pb-[180px]">
      <Container
        as={motion.div}
        className="relative z-10 flex flex-col gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        {/* HEADING */}
        <div className="flex w-full items-center justify-between">
          <motion.h2
            variants={riseIn}
            className="whitespace-nowrap text-[34px] font-normal leading-[1.2] text-[#1ef4d1] [word-break:break-word] md:text-[42px] lg:text-[52px]"
          >
            Case Studies
          </motion.h2>
        </div>

        {/* CASE STUDY CARDS — two counter-travelling marquee rows.
            Figma stacks two identical instances 60px apart and gives no
            direction for either; opposing them is the deliberate call,
            because two tracks moving in lockstep read as one tall band
            sliding rather than as two rows. Row two is also slower so
            the pair never lines up into a repeating beat. */}
        <div className="flex w-full flex-col gap-[60px]">
          <MarqueeRow duration={50} paused={reduceMotion} />
          <MarqueeRow reverse duration={62} paused={reduceMotion} />
        </div>
      </Container>
    </section>
  );
};

export default Blog_CaseStudies;
