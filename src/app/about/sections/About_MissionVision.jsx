"use client";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target02Icon, Rocket01Icon } from "@hugeicons/core-free-icons";

import Container from "../../components/Container";
import Eyebrow from "../../components/Eyebrow";

/* ------------------------------------------------------------------
   MISSION & VISION

   No Figma frame for this — it is a new section requested to sit on
   the About page. It follows the site's design language rather than a
   comp: shared type tokens, the Eyebrow component, the quiet surface,
   and the same rise-and-settle reveal (replaying on re-entry, like the
   rest of the site).

   Two blocks, side by side from lg: MISSION and VISION. Each is a card
   on the standard glass surface with an icon, an eyebrow, a heading
   and a paragraph. The copy is grounded in claims the site already
   makes (the Overview mission line, the Impact outcomes, the
   long-term-thinking manifesto) — flagged as editable placeholder
   wording, not invented product claims.
   ------------------------------------------------------------------ */

const BLOCKS = [
  {
    eyebrow: "OUR MISSION",
    icon: Target02Icon,
    heading: "Build intelligence that creates real-world impact.",
    body: "We build AI-powered products, platforms and companies that solve real human challenges — turning technology into measurable outcomes for the businesses and people we serve, from the first idea to real-world scale.",
  },
  {
    eyebrow: "OUR VISION",
    icon: Rocket01Icon,
    heading: "A future shaped by responsible, enduring AI.",
    body: "We see a world where intelligent systems expand opportunity, dignity and possibility for everyone — built responsibly, governed to a global standard, and designed to stay relevant for decades, not just for today.",
  },
];

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

const About_MissionVision = () => {
  return (
    <section className="mission-vision relative w-full py-[var(--section-pad)]">
      <Container
        as={motion.div}
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="flex flex-col gap-[48px]"
      >
        {/* SECTION HEADER */}
        <motion.div variants={riseIn} className="flex flex-col items-start gap-[16px]">
          <Eyebrow label="WHY WE EXIST" color="#ffffff" barColor="#02e5c0" barWidth={36} />
          <h2 className="max-w-[720px] text-[length:var(--text-section)] font-normal leading-[1.15] tracking-[-0.02em] text-white">
            The purpose behind everything we build.
          </h2>
        </motion.div>

        {/* THE TWO BLOCKS */}
        <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-2">
          {BLOCKS.map((block) => (
            <motion.article
              key={block.eyebrow}
              variants={riseIn}
              className="group flex flex-col gap-[24px] rounded-[24px] border border-white/10 bg-white/[0.03] p-[clamp(24px,3vw,40px)] backdrop-blur-[2px] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-[4px] hover:border-[#0cffd7]/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
            >
              {/* Icon chip */}
              <span className="flex size-[56px] items-center justify-center rounded-[16px] border border-[#0cffd7]/25 bg-[rgba(12,255,215,0.06)] text-[#0cffd7]">
                <HugeiconsIcon icon={block.icon} size={28} strokeWidth={1.6} color="currentColor" />
              </span>

              <div className="flex flex-col gap-[14px]">
                <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#0cffd7]">
                  {block.eyebrow}
                </p>
                <h3 className="text-[length:clamp(1.375rem,2vw,1.75rem)] font-semibold leading-[1.25] text-white">
                  {block.heading}
                </h3>
                <p className="text-[length:var(--text-body)] font-medium leading-[1.65] text-[#cfd8da]">
                  {block.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default About_MissionVision;
