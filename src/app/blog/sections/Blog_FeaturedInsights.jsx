"use client";
import { motion } from "motion/react";

import ArticleCard from "../components/ArticleCard";

import featuredTeamWorkspace from "../assets/featured-insights/featured-team-workspace.png";
import insightAnalystScreens from "../assets/featured-insights/insight-analyst-screens.png";

/* ------------------------------------------------------------------
   MOTION

   This section has no Figma variants — every child of 1:4526 is a
   plain frame, not a component instance — so there is no authored
   animation to reproduce. That makes scroll-reveal the honest choice:
   it respects the reading order the layout already implies instead of
   inventing motion the designer never asked for.

   whileInView + viewport.once means it plays as the section arrives
   and then stays put — no replay on every scroll pass, which reads as
   nervous on a long page like this one.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* The three cards differ only in copy, artwork and scale, so all of it
   lives as data — a fourth article is a content edit here, not a
   markup change.

   Figma carries no destinations for these, so every card points at the
   real /blog/detail route rather than inventing slugs that would 404.

   The two stacked cards share one photo in the comp, so the import is
   referenced twice rather than duplicated on disk. */
const ARTICLES = [
  {
    id: "peak-economics",
    category: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    href: "/blog/detail",
    image: featuredTeamWorkspace,
    imageAlt: "A studio team mapping ideas across a wall of notes and screens",
    imageSizes: "738px",
    featured: true,
  },
  {
    id: "peak-economics-analysis",
    category: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    href: "/blog/detail",
    image: insightAnalystScreens,
    imageAlt: "An analyst reviewing planning dashboards on a wall of displays",
    imageSizes: "400px",
  },
  {
    id: "peak-economics-forecast",
    category: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    href: "/blog/detail",
    image: insightAnalystScreens,
    imageAlt: "An analyst reviewing forecast data on a wall of displays",
    imageSizes: "400px",
  },
];

const Blog_FeaturedInsights = () => {
  const [featured, ...stacked] = ARTICLES;

  return (
    <section className="blog-featured-insights relative w-full">
      <motion.div
        className="relative z-10 mx-auto flex w-[1200px] max-w-full flex-col gap-[80px] px-[120px] xl:px-0"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADING STACK */}
        <div className="flex flex-col gap-[24px] [word-break:break-word]">
          <motion.h2
            variants={riseIn}
            className="text-[52px] font-normal leading-[1.2] text-[#1ef4d1]"
          >
            Featured Insights
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="w-[456px] max-w-full text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
          >
            Explore stories that show how bold ideas become business
            breakthroughs.
          </motion.p>
        </div>

        {/* CARD GRID — deliberately asymmetric: 758 + 22 + 420 = 1200.
            The right column is the fixed 420px side and the featured
            card takes the remainder, so the split holds at 1200 without
            hard-coding 758 anywhere. min-w-px stops the long headline
            inside the featured card from forcing the flex item wider
            than its share. */}
        <div className="flex h-[562px] w-full items-stretch gap-[22px]">
          <ArticleCard
            {...featured}
            className="min-w-px flex-1"
            variants={riseIn}
          />

          {/* STACKED COLUMN — two equal cards, so basis-0 + flex-1
              splits the 562px minus the gutter rather than repeating a
              270px literal on each. */}
          <div className="flex w-[420px] shrink-0 flex-col gap-[22px]">
            {stacked.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                className="min-h-px flex-1 basis-0"
                variants={riseIn}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Blog_FeaturedInsights;
