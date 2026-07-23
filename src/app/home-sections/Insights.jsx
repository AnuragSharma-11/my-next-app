"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import CharReveal from "../components/CharReveal";

/* ------------------------------------------------------------------
   INSIGHTS — a three-card blog teaser between Framework and the CTA.

   Pattern from the enterprise reference: eyebrow + heading on the
   left, a "Visit Blog" text-link on the right, then three split cards
   (copy left, photo right), each carrying a category tag, a two-line
   title and a date • read-time meta row with an arrow.

   PHOTOS are imported from the blog page's own asset folders rather
   than copied into home-sections/assets — these are the same articles
   the blog page shows, so duplicating the files would double their
   weight in the bundle for no benefit. When real article art lands,
   both pages pick it up from one place.
   ------------------------------------------------------------------ */

import strategyWall from "../blog/assets/all-insights/insight-strategy-wall.png";
import caseStudyCover from "../blog/assets/case-studies/case-study-cover.png";
/* NOT insight-analyst-screens.png: that file is byte-identical to
   insight-strategy-wall.png (same 1,896,364 bytes under two names),
   and the first card already wears it. */
import teamWorkspace from "../blog/assets/all-insights/insight-team-workspace.png";

const ARTICLES = [
  {
    tag: "AI TRENDS",
    title: "The Future of Work in the Age of AI",
    date: "May 20, 2024",
    readTime: "5 min read",
    image: strategyWall,
    href: "/blog",
  },
  {
    tag: "CASE STUDY",
    title: "How AI is Transforming Healthcare Delivery",
    date: "May 15, 2024",
    readTime: "6 min read",
    image: caseStudyCover,
    href: "/blog",
  },
  {
    tag: "PERSPECTIVE",
    title: "Building Responsible AI That Scales",
    date: "May 10, 2024",
    readTime: "4 min read",
    image: teamWorkspace,
    href: "/blog",
  },
];

/* The site's standard rise-and-settle with the blur resolve, same
   constants as Impact and Faq. Header leads, then the three cards
   follow 90ms apart so the row reveals left to right. */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardStage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
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

const Insights = () => (
  <section className="insights relative w-full py-[var(--section-pad)]">
    <div className="mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)]">
      {/* HEADER ROW — eyebrow + heading left, blog link right, link
          sitting on the heading's baseline like the reference. */}
      <motion.div
        className="flex flex-col gap-[16px] sm:flex-row sm:items-end sm:justify-between"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col gap-[16px]">
          <motion.p
            variants={riseIn}
            className="text-[length:var(--text-eyebrow)] font-semibold tracking-[0.22em] text-[#0cffd7]"
          >
            INSIGHTS THAT MATTER
          </motion.p>
          <CharReveal
            as="h2"
            className="text-[length:var(--text-section)] font-normal leading-[1.18] tracking-[-0.045em] text-white"
          >
            Ideas. Trends. Perspectives.
          </CharReveal>
        </div>

        <motion.div variants={riseIn}>
          <Link
            href="/blog"
            className="group flex items-center gap-[8px] whitespace-nowrap text-[length:var(--text-body)] font-medium text-[#2dfbd9] transition-opacity duration-200 hover:opacity-80"
          >
            Visit Blog
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-[4px]"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* CARDS — split layout, copy left and photo right, matching the
          reference. The photo column is capped at 45% and fades into
          the card surface on its left edge so the title never fights
          the image for contrast. */}
      <motion.div
        className="mt-[48px] grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3"
        variants={cardStage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {ARTICLES.map((article) => (
          <motion.div key={article.title} variants={riseIn}>
            <Link
              href={article.href}
              className="group relative flex h-[224px] overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.04] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-[4px] hover:border-[#0cffd7]/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]"
            >
              <div className="relative z-10 flex w-[58%] shrink-0 flex-col justify-between p-[24px]">
                <div className="flex flex-col gap-[12px]">
                  <p className="text-[12px] font-semibold tracking-[0.18em] text-[#0cffd7]">
                    {article.tag}
                  </p>
                  {/* Body token, not --text-title: in this ~250px
                      column the 24px title wrapped to four lines and
                      burst the card. 18px semibold is the reference's
                      own title scale at this card size. */}
                  <h3 className="text-[length:var(--text-body)] font-semibold leading-[1.45] text-white">
                    {article.title}
                  </h3>
                </div>

                <div className="flex items-center gap-[10px] text-[13px] font-medium text-[#cfd8da]">
                  <span className="whitespace-nowrap">{article.date}</span>
                  <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-[#cfd8da]/60" />
                  <span className="whitespace-nowrap">{article.readTime}</span>
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                    className="ml-[4px] text-[#2dfbd9] transition-transform duration-300 group-hover:translate-x-[4px]"
                  />
                </div>
              </div>

              {/* Photo bleeds to the card's right edge; the mask fades
                  it into the surface on the left so the split reads as
                  one composed card. The fade is kept SHORT (28% ramp)
                  and the photo near-full opacity — the first cut faded
                  over a third of the width at 80%, which stacked into
                  a heavy dark gradient across the card's middle. */}
              <div className="absolute inset-y-0 right-0 w-[52%] [mask-image:linear-gradient(90deg,transparent_0%,black_28%)]">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 250px, (min-width: 768px) 40vw, 90vw"
                  placeholder="blur"
                  className="object-cover opacity-95 transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Insights;
