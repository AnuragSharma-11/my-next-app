"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon } from "@hugeicons/core-free-icons";

import faqGlow from "./assets/faq/faq-glow.svg";

/* ------------------------------------------------------------------
   CONTENT

   The Figma frame ships literal placeholder copy — "Question-1" five
   times over, "answer" once. That is deliberate: the designer had not
   written the real FAQ yet, so inventing plausible-sounding questions
   here would quietly bake fake product claims into the page. The copy
   stays as-is until someone hands us the real text.

   Driving the rows off an array (rather than five copy-pasted blocks)
   means swapping in that real copy later is a one-place edit, and the
   open/closed logic only has to be written once.
   ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  { id: "faq-1", question: "Question-1", answer: "answer" },
  { id: "faq-2", question: "Question-1", answer: "answer" },
  { id: "faq-3", question: "Question-1", answer: "answer" },
  { id: "faq-4", question: "Question-1", answer: "answer" },
  { id: "faq-5", question: "Question-1", answer: "answer" },
];

const Faq = () => {
  /* SINGLE-OPEN ACCORDION — Figma shows exactly one row expanded, so we
     track one open id rather than a set of booleans. Storing the id (not
     an index) keeps this correct if the array is ever reordered.

     Clicking the open row collapses it back to null — that is the
     standard disclosure contract, and a header that visibly responds to
     every click beats one that goes dead once its row is open. */
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section className="about-faq relative w-full overflow-hidden bg-[#000101] py-[80px]">
      {/* AMBIENT GLOW — Figma is a 202px circle carrying a 150px Gaussian
          blur, which is why the export's viewBox is 802x802: the blur
          bleeds ~300px past the circle on every side. Its centre sits
          ABOVE this section's top edge, so most of it is clipped by
          overflow-hidden and only the lower falloff shows.

          Both width and height are pinned because Figma exports carry
          preserveAspectRatio="none" — leaving either to `auto` lets the
          SVG stretch to its container instead of staying circular. */}
      <div className="pointer-events-none absolute left-[-180px] top-[-360px] h-[802px] w-[802px]">
        <img src={faqGlow.src} alt="" className="h-[802px] w-[802px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-start justify-between gap-[16px] px-[120px] py-[20px]">
        {/* EYEBROW — fixed 430px column in Figma. shrink-0 stops the
            accordion column, which is the flexible one, from squeezing
            it as the answer text reflows. */}
        <div className="flex w-[430px] shrink-0 items-center gap-[20px]">
          <span className="h-[4px] w-[22px] bg-[#e3e3e3]" />
          <p className="whitespace-nowrap text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]">
            FAQ
          </p>
        </div>

        <div className="flex min-w-px flex-1 flex-col gap-[32px]">
          <h2 className="w-[623px] max-w-full text-[36px] font-normal leading-[1.2] text-white">
            Learn More About Us
          </h2>

          {/* ACCORDION — Figma draws a rule above every row plus one
              closing rule at the bottom, so the divider is rendered as
              part of each row and a final one is appended after the map.
              gap-[16px] is the space between the first rule and the
              heading; rows themselves sit 8px apart. */}
          <div className="flex w-full flex-col gap-[8px]">
            <div className="h-px w-full bg-[#565656]" />

            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div key={item.id} className="flex w-full flex-col gap-[8px]">
                  <div className="flex w-full flex-col gap-[8px]">
                    {/* A REAL BUTTON, not a div with onClick — this is
                        the only way the row is reachable by Tab, fires on
                        Enter/Space, and reports its state to a screen
                        reader. aria-expanded announces open/closed and
                        aria-controls points at the panel it owns. */}
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="flex w-full cursor-pointer items-center justify-between gap-[16px] text-left"
                    >
                      <span className="text-[18px] font-semibold leading-[1.5] tracking-[-0.36px] text-[#e3e3e3]">
                        {item.question}
                      </span>

                      {/* PLUS/MINUS — Figma's exported glyphs are named
                          `plus-sign-stroke-rounded` and `minus-stroke-
                          rounded`, i.e. they came straight out of
                          HugeIcons, which this project already depends
                          on. So we use the package rather than commit
                          exported SVGs: identical geometry, but it takes
                          currentColor and can be animated.

                          The plus is composed as two MinusSignIcons —
                          one fixed horizontal, one rotated 90deg — so
                          opening rotates the vertical bar down onto the
                          horizontal one and fades it out. That genuinely
                          morphs plus into minus, where cross-fading two
                          different glyphs would just pop. */}
                      <span
                        aria-hidden="true"
                        className="relative flex size-[20px] shrink-0 items-center justify-center text-[#e3e3e3]"
                      >
                        <HugeiconsIcon
                          icon={MinusSignIcon}
                          size={20}
                          color="currentColor"
                          strokeWidth={1.5}
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
                            size={20}
                            color="currentColor"
                            strokeWidth={1.5}
                          />
                        </motion.span>
                      </span>
                    </button>

                    {/* PANEL — height is animated to and from "auto"
                        rather than a hard pixel value because the answer
                        copy will change length once real content lands,
                        and a hardcoded height would clip or gap.

                        AnimatePresence is required here: without it the
                        element unmounts the instant isOpen flips false
                        and the closing animation never gets to run.
                        With it, motion holds the node in the tree until
                        the exit transition finishes.

                        opacity rides alongside height so the text fades
                        rather than being guillotined by the shrinking
                        box, and overflow-hidden is what actually makes
                        the height clip read as a reveal. */}
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
                          <p className="w-[642px] max-w-full text-[16px] font-medium leading-[1.5] tracking-[-0.32px] text-[#e3e3e3]">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="h-px w-full bg-[#565656]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
