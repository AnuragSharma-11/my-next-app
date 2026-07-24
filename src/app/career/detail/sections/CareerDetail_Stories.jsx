"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import Container from "../../../components/Container";

import teammateGraffiti from "../assets/stories/teammate-graffiti.jpg";
import teammateBridge from "../assets/stories/teammate-bridge.jpg";
import teammateOrange from "../assets/stories/teammate-orange.jpg";

/* ==================================================================
   THE UNTOLD STORIES  (Figma 1:5079 "Second-Three", 1440x878)

   Three profile cards — photo, name, role, pull-quote, Learn More.

   NOT InsightCard, despite sharing its 22px radius, white/10 ground
   and teal "Learn More". InsightCard's meta band is a justify-between
   row of kicker + <time>, because everything it was built for is
   dated editorial. This card stacks an untimed name over a role and
   uses a 20px gutter rather than 16. Passing a person's job title in
   through a prop called `date` to reach a layout that is wrong anyway
   would be a worse outcome than the ~20 lines below, and components/
   is owned by another agent this pass.
   ================================================================== */

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
   COPY — verbatim from the comp, which repeats one profile three
   times over three different photographs. "Stretegy" is the comp's
   own spelling and is reproduced as authored rather than silently
   corrected; fixing it is an editorial call, and this array is the
   one place it has to happen.
   ------------------------------------------------------------------ */
const STORIES = [
  {
    id: "story-1",
    name: "Tanushree Gupta",
    role: "Head of Growth and Stretegy",
    quote:
      "My journey from Salesforce Developer to Delivery Manager taught me the true essence.",
    photo: teammateGraffiti,
    photoAlt: "Aashita teammate photographed against a graffiti mural",
    href: "/career/detail",
  },
  {
    id: "story-2",
    name: "Tanushree Gupta",
    role: "Head of Growth and Stretegy",
    quote:
      "My journey from Salesforce Developer to Delivery Manager taught me the true essence.",
    photo: teammateBridge,
    photoAlt: "Aashita teammate photographed beside a park bridge",
    href: "/career/detail",
  },
  {
    id: "story-3",
    name: "Tanushree Gupta",
    role: "Head of Growth and Stretegy",
    quote:
      "My journey from Salesforce Developer to Delivery Manager taught me the true essence.",
    photo: teammateOrange,
    photoAlt: "Aashita teammate laughing outdoors in an orange hoodie",
    href: "/career/detail",
  },
];

const CareerDetail_Stories = () => {
  return (
    <section className="career-detail-stories relative w-full py-[90px]">
      <Container
        as={motion.div}
        className="flex flex-col gap-[48px] lg:gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {/* SECTION HEADING */}
        <motion.div variants={riseIn} className="flex w-full flex-col gap-[24px]">
          <h2 className="w-[623px] max-w-full text-[32px] font-normal leading-[1.2] text-white [word-break:break-word] sm:text-[40px] lg:text-[52px]">
            The Untold Stories
          </h2>
          <p className="w-full text-[18px] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3] lg:text-[20px]">
            Journey through the lives of our people, rich with untold stories,
            hurdles overcome, and victories achieved.
          </p>
        </motion.div>

        {/* PROFILE CARDS */}
        {/* Same three-up row as Humans and it reduces the same way, so
            the two sections keep reading as a pair down the ladder. */}
        <div className="grid w-full grid-cols-1 items-stretch gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((person) => (
            <motion.article
              key={person.id}
              variants={riseIn}
              className="flex min-w-px flex-col gap-[16px] overflow-hidden rounded-[22px] bg-white/10 px-[10px] pb-[20px] pt-[10px]"
            >
              {/* The whole card is the link. A second anchor on "Learn
                  More" would add a tab stop to the same destination. */}
              <Link href={person.href} className="flex h-full flex-col gap-[16px]">
                <div className="relative aspect-[366/240] w-full shrink-0 overflow-hidden rounded-[22px] bg-[#111] lg:aspect-auto lg:h-[240px]">
                  <Image
                    src={person.photo}
                    alt={person.photoAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 366px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-[20px] px-[6px] leading-[1.5] [word-break:break-word]">
                  <header className="flex flex-col text-[#e3e3e3]">
                    <h3 className="text-[24px] font-semibold tracking-[-0.48px]">
                      {person.name}
                    </h3>
                    <p className="text-[16px] font-medium tracking-[-0.32px]">
                      {person.role}
                    </p>
                  </header>

                  <blockquote className="text-[20px] font-semibold tracking-[-0.4px] text-white">
                    {person.quote}
                  </blockquote>

                  {/* mt-auto pins this to the card's bottom edge so all
                      three align even when a quote runs short — the
                      comp gets that from a fixed 83px quote box, which
                      would clip any real quote longer than the
                      placeholder. */}
                  <p className="mt-auto w-full text-right text-[22px] font-semibold tracking-[-0.44px] text-[#2dfbd9]">
                    Learn More
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CareerDetail_Stories;
