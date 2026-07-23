"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import PillButton from "../components/PillButton";
import CharReveal from "../components/CharReveal";

import sliderArrow from "./assets/hero/slider-arrow.svg";

/* ==================================================================
   HOME HERO  (Figma 1:3387, an instance of Container-Hero-Header)

   Every number below is the comp's own. They are collected here rather
   than scattered through the markup because the previous version had
   drifted badly on all of them — 82px type against a specified 62,
   28px body against 20, a 344px button against 240 — which is what
   made the whole hero read as zoomed in.

   The frame: a 1200x816 container at (120, 80), i.e. the standard
   120px gutter with the 80px header sitting above it. Copy is centred
   on that container but pulled 104px up, so it sits above the optical
   middle and leaves the lower band to the socials and the slider.
   ================================================================== */

/* The comp's hero frame is 946 tall and the content box occupies
   80 -> 896, so there is a 50px margin under it. `bottom` keeps that
   proportion when the box grows past 816 on a tall viewport — without
   it the socials and slider sit flush against the screen edge. */
/* Only this section's VERTICAL values live here. The horizontal ones
   come from the --gutter / --column variables in globals.css, so the
   hero cannot drift away from the header or any other section.

   These numbers are ALSO written literally into the `lg:` classes on
   the hero box. Tailwind scans for literal class strings, so a
   template built from these constants would compile to nothing — the
   duplication is the price of having the geometry be breakpoint-aware
   at all, so the numbers are recorded here as the reference:

     top 80   bottom 50   height 816   ->  lg:top-[80px]
                                           lg:h-[max(816px,calc(100vh-130px))]
*/

/* ------------------------------------------------------------------
   INDUSTRY SLIDER

   Seven statements cycling in a clipped window, bottom-right. Figma
   stacks them 173px tall with a 50px gap, so the travel per step is
   223px — the pitch is derived below rather than typed, so editing the
   copy cannot silently break the alignment.

   The list is rendered with its first item repeated at the end. That
   duplicate is what makes the wrap invisible: the track animates to
   the copy, then resets to 0 with the identical frame on screen.
   ------------------------------------------------------------------ */
const ITEM_HEIGHT = 173;
const ITEM_GAP = 50;
const PITCH = ITEM_HEIGHT + ITEM_GAP;

const SLIDES = [
  {
    title: "Building The Future Across Industries",
    body: "We build and scale organizations that solve real-world challenges across education, technology, healthcare, manufacturing, enterprise and financial services.",
  },
  {
    title: "Empowering Future-Ready Learners",
    body: "We build education platforms that help students, educators and institutions achieve better outcomes through technology, intelligence and personalized learning experiences.",
  },
  {
    title: "Building Intelligent Digital Products",
    body: "From SaaS platforms and enterprise software to AI-native applications, we create technology products designed to solve real-world business challenges at scale.",
  },
  {
    title: "Advancing Healthcare Through Innovation",
    body: "We are building healthcare ecosystems that combine medical expertise, technology and compassionate care to improve patient outcomes and accessibility.",
  },
  {
    title: "Engineering Industrial Excellence",
    body: "We develop and support manufacturing businesses focused on operational efficiency, product quality and sustainable industrial growth.",
  },
  {
    title: "Transforming Organizations For The Future",
    body: "We help build intelligent enterprise ecosystems powered by automation, data and AI, enabling organizations to operate smarter and scale faster.",
  },
  {
    title: "Creating Trust Through Financial Innovation",
    body: "We build financial platforms and services that enhance accessibility, transparency and security while enabling sustainable economic growth.",
  },
];

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const Hero = () => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => i + 1), 4000);
    return () => clearInterval(id);
  }, [reduceMotion]);

  /* Wrapping without a jump: the track keeps translating past the last
     real slide onto the duplicated first one, then snaps back to 0 with
     that same frame already showing. Resetting at the duplicate rather
     than at the end is what hides the seam. */
  const wrapped = index % (SLIDES.length + 1);
  const isSeam = wrapped === SLIDES.length;

  useEffect(() => {
    if (!isSeam) return;
    const id = setTimeout(() => setIndex(0), 1250);
    return () => clearTimeout(id);
  }, [isSeam]);

  return (
    <section
      /* HEIGHT — deliberately NOT a full screen from lg up, and FIXED
         rather than vh-based: the landing is composed like the
         enterprise reference (claim + the Impact band opening in one
         sweep), and with the slider top-aligned nothing anchors to the
         stage bottom any more — so growing with the viewport only
         manufactured dead space between the button and the band on
         tall screens. 80vh per review, with a 700px floor so the
         copy, slider and socials never collide on short laptop
         screens; the inner stage tracks it at section - 130
         (80 nav clearance + 50 bottom margin). Below lg the section is ordinary flow. */
      className="hero relative min-h-screen w-full overflow-hidden lg:min-h-0 lg:h-[max(700px,80vh)]"
    >
      {/* BACKGROUND — the section's own ramp (via .hero) with the wave
          video as texture. The video fades out over the last 15% so
          only the gradient touches the boundary with Impact — whose
          inverse ramp starts on the exact colour this one ends on. */}
      <video
        autoPlay
        muted
        playsInline
        loop
        aria-hidden
        className="absolute left-0 top-0 h-full w-full object-cover opacity-20 [mask-image:linear-gradient(180deg,black_0%,black_85%,transparent_100%)]"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* HERO CONTAINER — the comp's 1200x816 box at (120, 80). Held as
          a real box rather than padding because the socials and slider
          are anchored to ITS bottom edge, not the viewport's.

          The comp's 816 is a MINIMUM, not a cap. Capping it meant the
          socials and slider — which anchor to this box's bottom edge —
          stopped at an invisible 816px line on any viewport taller than
          896, leaving the lower third of the screen empty.

          BELOW lg THE BOX IS ORDINARY FLOW. The comp anchors three
          separate blocks to three corners of one fixed stage; there is
          no phone width at which those three do not collide, and copy
          pinned to a corner cannot reflow out of the way. So the stage
          only exists from lg up, and below it the same three blocks
          stack in reading order. */}
      <div className="relative mx-auto flex w-full max-w-[var(--frame)] flex-col gap-[48px] px-[var(--gutter)] pb-[50px] pt-[120px] lg:absolute lg:left-[max(var(--gutter),calc(50%_-_var(--column)/2))] lg:top-[80px] lg:block lg:h-[max(570px,calc(80vh_-_130px))] lg:w-[var(--column)] lg:max-w-[calc(100%_-_var(--gutter)*2)] lg:px-0 lg:pb-0 lg:pt-0">
        {/* COPY — 88px down from the stage top (air under the nav,
            which the comp's centre-anchor used to provide). The slider box
            sits at 168px so the visible slide's centre lands on the
            centre of the heading + subheading block: the copy spans
            88..443 in stage coords (centre ~265), and the slide's
            text centre sits ~97px into the slider box. */}
        <motion.div
          className="relative flex w-full flex-col items-start gap-[40px] lg:absolute lg:left-0 lg:top-1/2 lg:w-full lg:-translate-y-1/2 lg:gap-[48px]"
          variants={stage}
          initial="hidden"
          animate="visible"
        >
          {/* w-full is load-bearing. `items-start` makes this box
                content-sized, so the children's `max-w-full` resolved
                against a parent whose width THEY determined — circular,
                and it constrained nothing. The headline then ran past
                the screen and was silently clipped by the section's
                overflow-hidden rather than showing up as page overflow. */}
          <div className="flex w-full flex-col items-start gap-[24px] [word-break:break-word]">
            {/* CHAR REVEAL — the headline arrives character by
                character (GSAP, clip-wipe per char). Size still comes
                from the shared --text-heading token. delay lets the
                nav and backdrop land first. */}
            <CharReveal
              as="h1"
              delay={0.25}
              className="w-[700px] max-w-full text-[length:var(--text-heading)] font-normal leading-[1.2] text-white"
              segments={[
                { t: "Turning bold ambition into " },
                { t: "Operational Reality", c: "text-[#03ceb4]" },
              ]}
            />

            <motion.p
              variants={riseIn}
              className="w-[700px] max-w-full text-[length:var(--text-subheading)] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3]"
            >
              Orchestrating the technology, services, and AI transforming the
              world&rsquo;s most complex enterprises.
            </motion.p>
          </div>

          <motion.div variants={riseIn}>
            <PillButton label="How we do it" href="/about" width={240} />
          </motion.div>
        </motion.div>

        {/* INDUSTRY SLIDER — right column, TOP-aligned with the
            heading from xl so the two read as one row (the enterprise
            reference places its second detail beside the headline, not
            below it). Only from xl: below that the column is too
            narrow for a 700px headline and a 480px slider to share a
            row, so the slider keeps the comp's bottom-right anchor.

            Inside a 390x224 clip.

            The clip is what makes the wrap invisible, so it survives at
            every width; only the box it clips gets to shrink. The 173px
            item pitch stays fixed because the reset arithmetic depends
            on it — narrow copy wraps into the 50px gap below it, which
            the 205px window still covers. */}
        <div className="relative h-[224px] w-full max-w-[480px] overflow-hidden lg:absolute lg:bottom-0 lg:right-0 lg:w-[480px] xl:bottom-auto xl:top-[calc(50%_-_97px)]">
          <div className="absolute bottom-0 left-1/2 h-[205px] w-full max-w-full -translate-x-1/2 overflow-hidden">
            <motion.div
              className="absolute left-[16px] top-[16px] flex w-[480px] max-w-[calc(100%_-_32px)] flex-col"
              style={{ gap: ITEM_GAP }}
              animate={{ y: -wrapped * PITCH }}
              transition={
                isSeam || reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
              }
            >
              {[...SLIDES, SLIDES[0]].map((slide, i) => (
                <div
                  key={`${slide.title}-${i}`}
                  className="flex w-full shrink-0 flex-col items-start gap-[4px]"
                  style={{ height: ITEM_HEIGHT }}
                  aria-hidden={i !== wrapped}
                >
                  <div className="flex items-center gap-[12px]">
                    {/* Figma rotates this glyph -90deg to point right.
                        Both axes pinned: the export sets
                        preserveAspectRatio="none" and would otherwise
                        stretch to whatever box it is handed. */}
                    <span className="flex h-[14px] w-[16.333px] shrink-0 items-center justify-center">
                      <img
                        src={sliderArrow.src}
                        alt=""
                        className="h-[16.333px] w-[14px] -rotate-90 "
                      />
                    </span>
                    {/* Slider titles and body both sit on --text-body —
                        the token's 18px ceiling is SMALLER than the old
                        24px title, which is what keeps every slide
                        safely inside the fixed 173px item pitch. */}
                    <p className="text-[length:var(--text-body)] font-semibold leading-normal text-[#00d286] text-wrap">
                      {slide.title}
                    </p>
                  </div>

                  <p className="w-full text-[length:var(--text-body)] font-semibold leading-[1.5] tracking-[-0.36px] text-[#e3e3e3]">
                    {slide.body}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
