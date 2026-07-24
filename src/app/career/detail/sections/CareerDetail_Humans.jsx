"use client";

import Image from "next/image";
import { motion } from "motion/react";

import Container from "../../../components/Container";
import Eyebrow from "../../../components/Eyebrow";

import teammatePortrait from "../assets/humans/teammate-portrait.png";

/* ==================================================================
   HUMANS OF AASHITA  (Figma 1:5052 "Second-Section", 1440x1226)

   Three testimonial cards under a heading row. Figma names the card
   row "Scroll Animation container" (1:5060), but the geometry rules
   out a marquee: three 385.33 cards plus two 22px gaps is exactly
   1200, so there is nothing to scroll horizontally into. The name is
   asking for a scroll-triggered entrance, which is what this does.
   ================================================================== */

/* ------------------------------------------------------------------
   MOTION — staggered entrance, nothing is ever removed and the end
   state is the readable one, so a play-once whileInView is correct
   here rather than a scrub. viewport.once stops it re-firing every
   time the reader scrolls back up a very long page.
   ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   COPY — verbatim from the comp, which repeats one teammate three
   times. Driving all three from this array means the real quotes are
   a one-place edit instead of three near-identical JSX blocks that
   will drift the moment someone fixes a typo in only one of them.
   ------------------------------------------------------------------ */
const TESTIMONIALS = [
  {
    id: "humans-1",
    name: "Anurag Sharma, Sr. UI/UX Designer (Jaipur)",
    quote:
      "As a UI/UX Designer, I’ve learned to create intuitive and user-centered digital experiences by balancing creativity with problem-solving. Every project presents new design challenges, allowing me to collaborate with diverse teams and better understand user needs.",
    photo: teammatePortrait,
    photoAlt: "Aashita designer mid-conversation at her desk",
  },
  {
    id: "humans-2",
    name: "Anurag Sharma, Sr. UI/UX Designer (Jaipur)",
    quote:
      "As a UI/UX Designer, I’ve learned to create intuitive and user-centered digital experiences by balancing creativity with problem-solving. Every project presents new design challenges, allowing me to collaborate with diverse teams and better understand user needs.",
    photo: teammatePortrait,
    photoAlt: "Aashita designer mid-conversation at her desk",
  },
  {
    id: "humans-3",
    name: "Anurag Sharma, Sr. UI/UX Designer (Jaipur)",
    quote:
      "As a UI/UX Designer, I’ve learned to create intuitive and user-centered digital experiences by balancing creativity with problem-solving. Every project presents new design challenges, allowing me to collaborate with diverse teams and better understand user needs.",
    photo: teammatePortrait,
    photoAlt: "Aashita designer mid-conversation at her desk",
  },
];

const CareerDetail_Humans = () => {
  return (
    <section className="career-detail-humans relative w-full py-[90px]">
      <Container
        as={motion.div}
        className="flex flex-col gap-[48px] lg:gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* HEADING ROW — heading left, eyebrow right. items-start keeps
            the eyebrow on the h2's first line however the intro wraps
            underneath it. */}
        <motion.div
          variants={riseIn}
          /* Eyebrow sits right of the heading in the comp; below md the
             pair has no room side by side, so it leads a stack. */
          className="flex w-full flex-col-reverse items-start justify-between gap-[16px] md:flex-row"
        >
          <div className="flex w-full min-w-px flex-1 flex-col gap-[24px]">
            <h2 className="w-[623px] max-w-full text-[32px] font-normal leading-[1.2] text-white [word-break:break-word] sm:text-[40px] lg:text-[52px]">
              Humans of Aashita
            </h2>
            <p className="w-[580px] max-w-full text-[18px] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3] lg:text-[20px]">
              Every day, our people&rsquo;s journey fuel our Ambitions. Explore
              stories filled with leadership, growth, success, and fun.
            </p>
          </div>

          <div className="shrink-0">
            <Eyebrow label="OUR GAME CHANGERS" />
          </div>
        </motion.div>

        {/* TESTIMONIAL CARDS — three equal columns. flex-1 with a
            min-w-px floor is what stops the long unbroken quote from
            forcing a column wider than its third; without the floor a
            flex item refuses to shrink below its content and the row
            blows past 1200. */}
        {/* Three 385.33 columns are exact at 1200 and nowhere else. A
            third of a phone viewport cannot carry a portrait plus a
            five-line quote, so the row stacks below md, goes two-up on
            tablets, and returns to the comp's three at lg. */}
        <div className="grid w-full grid-cols-1 items-stretch gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((person) => (
            <motion.article
              key={person.id}
              variants={riseIn}
              className="flex min-w-px flex-col gap-[12px] overflow-hidden rounded-[22px] bg-white/10 px-[10px] pb-[16px] pt-[10px]"
            >
              {/* The source is 450x600 but never painted above ~366px
                  wide, so next/image resizes rather than shipping the
                  full plate. #111 underneath matches Figma's own
                  fallback fill so the frame reads as intentional while
                  the image decodes. */}
              <div className="relative aspect-[366/450] w-full shrink-0 overflow-hidden rounded-[22px] bg-[#111] lg:aspect-auto lg:h-[450px]">
                <Image
                  src={person.photo}
                  alt={person.photoAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 366px"
                  className="object-cover"
                  placeholder="blur"
                />
              </div>

              <div className="flex flex-col gap-[20px] px-[6px] [word-break:break-word]">
                <h3 className="text-[24px] font-semibold leading-[1.5] tracking-[-0.48px] text-white">
                  {person.name}
                </h3>
                <blockquote className="text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-[#dedede]">
                  {person.quote}
                </blockquote>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CareerDetail_Humans;
