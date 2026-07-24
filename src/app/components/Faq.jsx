"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

import faqGlow from "./assets/faq/faq-glow.svg";
import Container from "./Container";
import Eyebrow from "./Eyebrow";

/* ------------------------------------------------------------------
   CONTENT

   The Figma frame shipped literal placeholder copy ("Question-1" five
   times over). These questions were DRAFTED for the enterprise pass —
   every answer is grounded in claims the site already makes (the
   Impact band, the Industries section, the Overview copy, the CTA),
   so nothing here asserts anything the rest of the page does not.
   Edit freely: the rows are data, the markup renders whatever is in
   this array.
   ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What does Aashita build?",
    answer:
      "We build AI-powered products and platforms — from decision intelligence and learning systems to healthcare and operations tools — designed to create real, measurable impact for businesses and people.",
  },
  {
    id: "faq-2",
    question: "Which industries do you work across?",
    answer:
      "We operate across five frontier industries: education, healthcare, manufacturing, automobile and enterprise technology — each treated as a long-term commitment, not a project.",
  },
  {
    id: "faq-3",
    question: "How do you approach responsible AI?",
    answer:
      "Our AI governance practices are ISO 42001 certified — the global standard for responsible and ethical AI — and that discipline shapes how every product is designed, built and operated.",
  },
  {
    id: "faq-4",
    question: "Where is Aashita based?",
    answer:
      "We were founded in Jaipur, India in 2012, and have grown into a global presence expanding across India, China, Indonesia and Vietnam.",
  },
  {
    id: "faq-5",
    question: "How do we start working together?",
    answer:
      "Start a conversation through our contact page. We'll help you scope the problem, identify the right solution and map the path from first idea to real-world scale.",
  },
];

/* APPEAR — the site's standard rise-and-settle with a soft blur
   resolve; the header leads and the rows follow one by one. */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

const Faq = () => {
  /* SINGLE-OPEN ACCORDION — one open id, not a set of booleans; the
     id (not the index) stays correct if the array is reordered.
     Clicking the open row collapses it — the standard disclosure
     contract. */
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  /* Surface comes from .about-faq in globals.css — the shared
     hero-family navy, so the whole site's background is tuned in one
     place. */
  return (
    <section className="about-faq relative w-full overflow-hidden py-[var(--section-pad)]">
      {/* AMBIENT GLOW — a 202px circle carrying a 150px Gaussian blur
          (hence the 802x802 export canvas); its centre sits above the
          section's top edge so only the lower falloff shows. Both axes
          pinned: the export carries preserveAspectRatio="none". */}
      <div className="pointer-events-none absolute left-[-180px] top-[-360px] h-[802px] w-[802px]">
        <img src={faqGlow.src} alt="" className="h-[802px] w-[802px]" />
      </div>

      {/* Two columns from lg: a sticky-feeling intro block on the left
          (eyebrow, heading, sub, contact link) and the accordion on
          the right — the enterprise FAQ shape. Stacks below lg. */}
      <Container
        as={motion.div}
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        className="relative z-10 flex flex-col items-start justify-between gap-[40px] lg:flex-row lg:gap-[16px]"
      >
        {/* INTRO COLUMN — fixed 430px like the comp's eyebrow column,
            now carrying the full header so the accordion column stays
            pure Q&A. */}
        <motion.div
          variants={riseIn}
          className="flex w-full shrink-0 flex-col items-start gap-[20px] lg:w-[430px]"
        >
          <Eyebrow label="FAQ" color="#e3e3e3" />
          <h2 className="text-[length:clamp(1.5rem,2.5vw,2.25rem)] font-normal leading-[1.25] text-white">
            Learn More About Us
          </h2>
          <p className="max-w-[360px] text-[length:var(--text-body)] font-medium leading-[1.6] text-[#9fb1b5]">
            The questions we hear most from teams evaluating Aashita.
          </p>
          <Link
            href="/contact-us"
            className="group mt-[8px] flex items-center gap-[8px] text-[15px] font-semibold text-[#2dfbd9] transition-opacity duration-200 hover:opacity-80"
          >
            Still have questions? Contact us
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={18}
              color="currentColor"
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-[4px]"
            />
          </Link>
        </motion.div>

        {/* ACCORDION — card rows, not hairlines: each question is a
            rounded bordered surface that warms when open. The open row
            gets the teal border + a faint teal tint, so the current
            answer is findable at a glance from across the section. */}
        <div className="flex w-full min-w-px flex-1 flex-col gap-[14px]">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <motion.div
                key={item.id}
                variants={riseIn}
                className={`w-full rounded-[16px] border backdrop-blur-[2px] transition-colors duration-300 ${
                  isOpen
                    ? "border-[#0cffd7]/30 bg-[rgba(12,255,215,0.04)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                {/* A REAL BUTTON — Tab-reachable, fires on Enter/Space,
                    announces its state via aria-expanded/controls. */}
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-[16px] px-[24px] py-[20px] text-left"
                >
                  <span className="text-[length:var(--text-body)] font-semibold leading-[1.5] tracking-[-0.36px] text-white">
                    {item.question}
                  </span>

                  {/* PLUS -> MINUS morph in a circled chip: two
                      MinusSignIcons, one rotated 90deg; opening rotates
                      the vertical bar onto the horizontal one — a real
                      morph, not a glyph swap. The chip flips to the
                      accent when open. */}
                  <span
                    aria-hidden="true"
                    className={`relative flex size-[32px] shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-[#03CEB4] text-[#012532]" : "bg-white/10 text-[#e3e3e3]"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={MinusSignIcon}
                      size={16}
                      color="currentColor"
                      strokeWidth={2}
                      className="absolute"
                    />
                    <motion.span
                      className="absolute flex items-center justify-center"
                      initial={false}
                      animate={{ rotate: isOpen ? 0 : 90, opacity: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <HugeiconsIcon
                        icon={MinusSignIcon}
                        size={16}
                        color="currentColor"
                        strokeWidth={2}
                      />
                    </motion.span>
                  </span>
                </button>

                {/* PANEL — height animated to/from "auto" (the copy will
                    change length), AnimatePresence holds the node for
                    the exit, overflow-hidden makes it read as a reveal. */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.25 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] px-[24px] pb-[22px] text-[15px] font-medium leading-[1.7] tracking-[-0.3px] text-[#b8c6c9]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Faq;
