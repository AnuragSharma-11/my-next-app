"use client";
import Image from "next/image";
import { motion } from "motion/react";

import teammatePortrait from "../assets/culture/teammate-portrait.png";
import Container from "../../components/Container";
import Eyebrow from "../../components/Eyebrow";

/* ------------------------------------------------------------------
   MOTION

   1:4323 is named "Scroll Animation container" — the same name the
   Blog page's marquee master (1:1263) carries — so it was checked
   against that geometry before anything was written here. It is NOT
   the marquee, and the numbers say so plainly:

     Blog:    ten cards laid out absolutely from left:0 to left:2749.5,
              i.e. 3033px of content inside a 1200px overflow-clip box.
     Careers: three cards at flex-[1_0_0] measuring 385.33 each, laid
              out at x=0, 407.33 and 814.67 — 385.33*3 + 22*2 = 1200,
              exactly the frame width, with nothing to clip.

   Content overrunning its clip box by 2.5x is a marquee at rest.
   Content that fits its clip box to the pixel is a row. The shared
   name is a naming convention the designer reused, not a shared
   behaviour, so reproducing this as a loop would be inventing motion
   rather than honouring it. The overflow-clip here is doing nothing
   but rounding the corners.

   Nothing under 1:4316 is a component instance either, so there are no
   variants standing in for an authored animation. Scroll-reveal is
   therefore the honest choice, matching the rest of the site.
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

/* All three slots ship the same name, role and testimonial in Figma,
   and all three point at one shared image fill — so the placeholder is
   reproduced verbatim and lives here, where real testimonials replace
   it without the markup below changing. */
const TESTIMONIALS = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  name: "Anurag Sharma, Sr. UI/UX Designer (Jaipur)",
  quote:
    "As a UI/UX Designer, I’ve learned to create intuitive and user-centered digital experiences by balancing creativity with problem-solving. Every project presents new design challenges, allowing me to collaborate with diverse teams and better understand user needs.",
  image: teammatePortrait,
  imageAlt: "A designer talking through her work in a team session",
}));

const Career_Culture = () => {
  return (
    <section className="career-culture relative w-full py-[90px]">
      <Container
        as={motion.div}
        className="relative z-10 flex flex-col gap-[48px] lg:gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADING ROW — display type left, eyebrow pinned top-right.
            items-start keeps the eyebrow on the heading's first
            baseline regardless of how the copy wraps. */}
        {/* The eyebrow is pinned top-right of the heading in the comp.
            Below md there is no room for a 52px display line and a
            label side by side, so the pair becomes a stack with the
            eyebrow leading — reading order, not decoration. */}
        <div className="flex w-full flex-col-reverse items-start gap-[16px] md:flex-row">
          {/* The heading STACK is what flexes (Figma gives it 911px);
              the heading itself is pinned to 623 inside it, which is
              what forces the two-line wrap. Collapsing these into one
              flex-1 element would let the text run the full 911 and
              silently unwrap it. */}
          <div className="flex w-full min-w-px flex-1 flex-col items-start">
            <motion.h2
              variants={riseIn}
              className="w-[623px] max-w-full text-[32px] font-normal leading-[1.2] text-white [word-break:break-word] sm:text-[40px] lg:text-[52px]"
            >
              Here’s what life is really like with us
            </motion.h2>
          </div>

          <motion.div variants={riseIn} className="shrink-0">
            {/* Pale blue rather than the usual teal, and a light-grey
                bar rather than a matching one — both are the comp's,
                which is exactly why Eyebrow takes them as two props. */}
            <Eyebrow
              label="OUR GAME CHANGERS"
              color="#a3e4ff"
              barColor="#e3e3e3"
            />
          </motion.div>
        </div>

        {/* TESTIMONIAL CARDS — three equal columns at a 22px gutter.

            Deliberately NOT InsightCard: that shape is kicker + date +
            title + a "Learn More" link, whereas this is a portrait
            above a name and a body paragraph with no destination. Same
            family, different composition — forcing one into the other
            would mean props that switch off half of it. */}
        {/* 385.33*3 + 22*2 = 1200 holds only at the comp width. A third
            of a phone viewport is ~100px, which is narrower than the
            portrait it has to carry, so the row stacks below md and
            goes two-up before returning to three at lg. */}
        <div className="grid w-full grid-cols-1 items-stretch gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((person) => (
            <motion.figure
              key={person.id}
              variants={riseIn}
              className="flex min-w-px flex-col gap-[12px] overflow-clip rounded-[22px] bg-white/10 px-[10px] pb-[16px] pt-[10px]"
            >
              {/* The source is 450x600 but each slot only ever paints
                  385px wide, so `sizes` stops next/image from shipping
                  the full-resolution original three times over.
                  #111 under it matches Figma's own fallback fill, so
                  the rounded frame reads as intentional while the image
                  decodes. */}
              <div className="relative aspect-[386/450] w-full shrink-0 overflow-hidden rounded-[22px] bg-[#111] lg:aspect-auto lg:h-[450px]">
                <Image
                  src={person.image}
                  alt={person.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 386px"
                  className="object-cover"
                  placeholder="blur"
                />
              </div>

              <figcaption className="flex w-full flex-col gap-[20px] px-[6px] [word-break:break-word]">
                <p className="w-full text-[24px] font-semibold leading-[1.5] tracking-[-0.48px] text-white">
                  {person.name}
                </p>
                <blockquote className="w-full text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-[#dedede]">
                  {person.quote}
                </blockquote>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Career_Culture;
