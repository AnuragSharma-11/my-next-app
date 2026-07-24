"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Target02Icon,
  PenTool01Icon,
  SourceCodeIcon,
  Rocket01Icon,
  ChartIncreaseIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

import Container from "../components/Container";
import Eyebrow from "../components/Eyebrow";
import CharReveal from "../components/CharReveal";

/* ==================================================================
   OUR APPROACH — replaces the old "How We Build" (Framework) section.

   Requested build: the CONTENT of the "Our Approach" reference (the
   six-step process — Research, Strategy, Experience, Engineering,
   Launch, Scale) presented in the PATTERN of the "Services" reference
   (a header with a lead + a button on the right, then a row of
   rounded glass cards, each carrying a title, a description and a
   link). Brand teal, not the reference's yellow.
   ================================================================== */

const STEPS = [
  {
    n: "01",
    icon: Search01Icon,
    title: "Research",
    body: "We explore, validate and understand the real problems deeply before a line is built.",
  },
  {
    n: "02",
    icon: Target02Icon,
    title: "Strategy",
    body: "We define the right opportunity and shape the roadmap that gets there.",
  },
  {
    n: "03",
    icon: PenTool01Icon,
    title: "Experience",
    body: "We craft intuitive, human-centred experiences that people genuinely love to use.",
  },
  {
    n: "04",
    icon: SourceCodeIcon,
    title: "Engineering",
    body: "We build with precision, performance and intelligence at enterprise scale.",
  },
  {
    n: "05",
    icon: Rocket01Icon,
    title: "Launch",
    body: "We launch with purpose and ensure seamless, confident adoption from day one.",
  },
  {
    n: "06",
    icon: ChartIncreaseIcon,
    title: "Scale",
    body: "We scale impact with data, AI and continuous growth — long after go-live.",
  },
];

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardStage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
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

const Approach = () => (
  <section className="approach relative w-full py-[var(--section-pad)]">
    <Container className="relative z-10">
      {/* HEADER — lead block on the left, button on the right (the
          "Services" reference layout). */}
      {/* HEADER — heading + subheading on the LEFT; the eyebrow title
          and the button on the RIGHT (per request). Stacks on phones. */}
      <motion.div
        className="flex flex-col gap-[32px] lg:flex-row lg:items-stretch lg:justify-between"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* LEFT — heading + subheading. */}
        <div className="flex max-w-[760px] flex-col gap-[16px]">
          <CharReveal
            as="h2"
            className="text-[length:var(--text-section)] font-normal leading-[1.15] tracking-[-0.02em] text-white"
          >
            Every great product starts with a better question.
          </CharReveal>
          <motion.p
            variants={riseIn}
            className="max-w-[560px] text-[length:var(--text-body)] font-medium leading-[1.65] text-[#cfd8da]"
          >
            We blend curiosity, technology and human insight to build
            intelligent products that create real impact and stand the test
            of time.
          </motion.p>
        </div>

        {/* RIGHT — the eyebrow title (top) and the button (below it),
            right-aligned on desktop so they read as one column. */}
        <div className="flex shrink-0 flex-col items-start gap-[24px] lg:items-end lg:justify-between lg:gap-0">
          <motion.div variants={riseIn}>
            <Eyebrow label="OUR APPROACH" color="#ffffff" barColor="#02e5c0" barWidth={36} />
          </motion.div>
          <motion.div variants={riseIn}>
            <Link
              href="/about"
              className="group inline-flex h-[52px] items-center gap-[10px] rounded-full border border-[#0cffd7]/40 bg-[rgba(12,255,215,0.06)] px-[26px] text-[15px] font-semibold text-[#0cffd7] transition-colors duration-300 hover:bg-[rgba(12,255,215,0.12)]"
            >
              Explore Our Process
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={18}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-[4px]"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* STEP CARDS — rounded glass cards, the "Services" card pattern,
          carrying the approach content. 2-up on phones, 3-up on
          laptops. */}
      <motion.div
        className="mt-[48px] grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-3"
        variants={cardStage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        {STEPS.map((step) => (
          <motion.article
            key={step.n}
            variants={riseIn}
            className="group flex flex-col gap-[20px] rounded-[30px] border border-white/10 bg-white/[0.03] p-[clamp(18px,2vw,26px)] backdrop-blur-[2px] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-[4px] hover:border-[#0cffd7]/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
          >
            {/* Icon chip — WHITE glyph on the teal-tinted chip. The step
                number was removed per request. */}
            <span className="flex size-[52px] items-center justify-center rounded-[14px] border border-[#0cffd7]/25 bg-[rgba(12,255,215,0.06)] text-white">
              <HugeiconsIcon icon={step.icon} size={26} strokeWidth={1.6} color="currentColor" />
            </span>

            <div className="flex flex-col gap-[10px]">
              {/* Heading — +2px over the title token (22 -> 26 at desktop). */}
              <h3 className="text-[length:clamp(1.375rem,1.8vw,1.625rem)] font-medium leading-[1.25] text-white">
                {step.title}
              </h3>
              {/* Description — +2px (14 -> 16). */}
              <p className="text-[18px] font-medium leading-[1.6] text-[#cfd8da]">
                {step.body}
              </p>
            </div>

            {/* Link row — +6px (14 -> 20). */}
            <span className="mt-auto flex items-center gap-[6px] text-[20px] font-semibold text-[#0cffd7]">
              View Capabilities
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                color="currentColor"
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:translate-x-[4px]"
              />
            </span>
          </motion.article>
        ))}
      </motion.div>
    </Container>
  </section>
);

export default Approach;
