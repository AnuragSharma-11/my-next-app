"use client";
import { motion } from "motion/react";

import ArticleCard from "../components/ArticleCard";

import featuredTeamWorkspace from "../assets/featured-insights/featured-team-workspace.png";
import insightAnalystScreens from "../assets/featured-insights/insight-analyst-screens.png";
import Container from "../../components/Container";

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
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
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
    <section className="blog-featured-insights relative w-full pb-[120px]">
      <Container as={motion.div}
        className="relative z-10 flex flex-col gap-[80px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
      >
        {/* HEADING STACK */}
        <div className="flex flex-col gap-[24px] [word-break:break-word]">
          <motion.h2
            variants={riseIn}
            className="text-[34px] font-normal leading-[1.2] text-[#1ef4d1] md:text-[42px] lg:text-[52px]"
          >
            Featured Insights
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="w-[456px] max-w-full text-[18px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3] lg:text-[22px]"
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
        {/* Below lg the 758+420 split has nowhere to go — 420px alone is
            wider than a 375px screen minus its gutter — so the band
            becomes one column and the fixed 562px band height gives way
            to per-card aspect ratios. The comp's geometry is restored
            verbatim at lg. */}
        <div className="flex w-full flex-col items-stretch gap-[22px] lg:h-[562px] lg:flex-row">
          <ArticleCard
            {...featured}
            className="aspect-[758/562] min-w-px lg:aspect-auto lg:flex-1"
            variants={riseIn}
          />

          {/* STACKED COLUMN — two equal cards, so basis-0 + flex-1
              splits the 562px minus the gutter rather than repeating a
              270px literal on each. */}
          <div className="flex w-full flex-col gap-[22px] sm:flex-row lg:w-[420px] lg:shrink-0 lg:flex-col">
            {stacked.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                className="aspect-[420/270] min-h-px sm:flex-1 lg:aspect-auto lg:basis-0"
                variants={riseIn}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Blog_FeaturedInsights;
