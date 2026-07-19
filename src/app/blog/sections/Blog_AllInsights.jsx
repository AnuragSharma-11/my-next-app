"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterMailIcon } from "@hugeicons/core-free-icons";

import insightStrategyWall from "../assets/all-insights/insight-strategy-wall.png";
import insightTeamWorkspace from "../assets/all-insights/insight-team-workspace.png";

/* ------------------------------------------------------------------
   CATEGORIES

   Read verbatim off the comp's four tab frames. Note the casing is
   inconsistent in Figma ("Data intelligence" against "Industries at
   Work") — that is reproduced rather than tidied, because silently
   re-casing a label means the code and the design no longer agree and
   nobody can tell which one is wrong later.

   There is no "All" tab in the comp. The first tab ships pre-selected
   (Figma names that frame "Filter-Active-Tab"), so the grid is always
   filtered — never showing everything at once. Adding an "All" tab
   would be inventing UI the designer did not draw.
   ------------------------------------------------------------------ */

const CATEGORIES = [
  "Human + AI Collaboration",
  "Data intelligence",
  "Industries at Work",
  "Client Stories",
];

/* ------------------------------------------------------------------
   CONTENT

   All six cards in the comp carry identical placeholder copy — same
   title, same "Case Study" kicker, same "Mon,08,June,26". That is
   left as-is for the same reason About_Faq keeps "Question-1":
   inventing six plausible article titles would bake fake editorial
   into the page and nobody downstream would know it was fabricated.

   The `category` values ARE invented, and deliberately so: the comp
   assigns no category to any card, but the tabs cannot demonstrably
   work unless the articles are distributed across them. Spreading six
   articles over four categories is the minimum needed to prove the
   filter; swap these for real values when the copy lands.

   Only two photographs exist across all six cards — Figma serves the
   same two asset URLs repeatedly — so the imports are referenced
   multiple times rather than duplicated on disk.
   ------------------------------------------------------------------ */

const ARTICLES = [
  {
    id: "insight-1",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Human + AI Collaboration",
    image: insightStrategyWall,
    imageAlt: "An analyst reviewing a strategy wall covered in sticky notes",
  },
  {
    id: "insight-2",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Human + AI Collaboration",
    image: insightTeamWorkspace,
    imageAlt: "A team working late together in an open-plan workspace",
  },
  {
    id: "insight-3",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Data intelligence",
    image: insightTeamWorkspace,
    imageAlt: "Colleagues comparing notes across a shared desk",
  },
  {
    id: "insight-4",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Data intelligence",
    image: insightStrategyWall,
    imageAlt: "An analyst mapping a plan across a glass planning board",
  },
  {
    id: "insight-5",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Industries at Work",
    image: insightTeamWorkspace,
    imageAlt: "An engineering team at work on a shared production floor",
  },
  {
    id: "insight-6",
    kicker: "Case Study",
    date: "Mon,08,June,26",
    title:
      "The Real Economics of Peak: How to break the linear link between orders and headcount",
    category: "Client Stories",
    image: insightTeamWorkspace,
    imageAlt: "A client team reviewing results around a workspace table",
  },
];

/* Figma carries no link destinations on any card, so every card points
   at the one blog detail route that actually exists. Give each article
   a real slug and this becomes `/blog/detail/${article.slug}`. */
const ARTICLE_HREF = "/blog/detail";

/* Card geometry, so the `sizes` hint below is traceable rather than a
   guess: the 1200px content column splits into three 385.33px cards at
   a 22px gutter, and each card insets its artwork by 10px per side —
   365.33px of real painted width at the desktop breakpoint. */
const CARD_IMAGE_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 366px";

const Blog_AllInsights = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [query, setQuery] = useState("");

  /* Category and search compose rather than override each other — a
     search inside a selected tab stays inside that tab, which is what
     the two controls sitting side by side implies. Purely client-side
     over a static array; nothing here talks to a backend. */
  const visibleArticles = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return ARTICLES.filter((article) => {
      const inCategory = article.category === activeCategory;
      const matchesQuery =
        needle === "" || article.title.toLowerCase().includes(needle);

      return inCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="blog-all-insights relative w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-[120px]">
        {/* HEADING AND SEARCH */}
        <div className="flex w-full flex-wrap items-center justify-between gap-[24px]">
          <h2 className="text-[52px] font-normal leading-[1.2] text-[#1ef4d1]">
            All Insights
          </h2>

          {/* The search field is a label wrapping its input, so the
              whole 626px pill is a click target and the control is
              named without a floating id/htmlFor pair to keep in sync.
              The visible "Search articles" string in Figma is the
              placeholder, so the accessible name is carried by an
              sr-only span instead — a placeholder alone disappears the
              moment someone types. */}
          <label className="flex h-[66px] w-[626px] max-w-full cursor-text items-center justify-between gap-[10px] rounded-full border border-solid border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.1)] px-[20px]">
            <span className="sr-only">Search articles</span>

            <span className="flex items-center gap-[10px]">
              {/* Figma's export is literally named `search-01-stroke-
                  rounded`, and its path data is byte-identical to
                  HugeIcons' Search01Icon — same 24px viewBox, same two
                  paths, same 1.5 stroke. Using the package instead of
                  committing the export means the glyph inherits
                  currentColor rather than hardcoding #E3E3E3. */}
              <HugeiconsIcon
                icon={Search01Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
                className="shrink-0 text-[#e3e3e3]"
              />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles"
                className="w-full bg-transparent text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3] outline-none placeholder:text-[#e3e3e3] [&::-webkit-search-cancel-button]:appearance-none"
              />
            </span>

            {/* Decorative in the comp — it has no menu behind it, so it
                is hidden from assistive tech rather than exposed as a
                control that does nothing. Same story as the magnifier:
                exact path match against HugeIcons' FilterMailIcon. */}
            <HugeiconsIcon
              icon={FilterMailIcon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 text-[#e3e3e3]"
            />
          </label>
        </div>

        {/* FILTER TABS */}
        {/* Real buttons in a tablist, not divs with onClick — this is
            what makes the set reachable by Tab, operable on Enter and
            Space, and announced with its selected state. aria-selected
            is the tab-specific equivalent of aria-pressed and pairs
            with role="tab" on each button.

            The container is inline-flex, not w-[984px]: Figma's 984 is
            the measured result of four auto-width pills at a 20px gap,
            not an authored width. Pinning it would break the moment a
            category is renamed. */}
        <div
          role="tablist"
          aria-label="Filter insights by category"
          className="mt-[80px] inline-flex w-fit max-w-full flex-wrap items-center gap-[20px] rounded-full border border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] px-[7px] py-[7px] backdrop-blur-[5px]"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`relative flex h-[60px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-[20px] text-[22px] font-bold leading-[1.5] tracking-[-0.44px] transition-colors duration-200 ${
                  isActive ? "text-white" : "text-[#e3e3e3]"
                }`}
              >
                {/* The selected pill is a shared layoutId element, so
                    switching tabs slides one #0fb596 pill across the
                    row instead of cross-fading two separate fills.
                    It sits behind the label as an absolutely
                    positioned sibling — painting the background on the
                    button itself would animate a real background-color
                    and could not travel between elements. */}
                {isActive && (
                  <motion.span
                    layoutId="insights-active-tab"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#0fb596]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* ARTICLE GRID */}
        {/* CSS grid rather than the flex-wrap Figma emits. Figma's
            generated markup puts `flex-[1_0_0] min-w-px` on cards
            inside two hardcoded rows of three — correct only while the
            count is exactly six. Filtering changes that count, and
            those same classes on a single wrapping container let four
            cards squeeze into one row instead of wrapping. Three fixed
            grid columns keep every card at the comp's 385.33px
            regardless of how many survive the filter. */}
        <motion.div
          layout
          className="mt-[32px] grid w-full grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* AnimatePresence is load-bearing here, not decorative:
              React removes a filtered-out card from the tree the
              instant the category changes, which means an `exit`
              transition would never get a frame to run on.
              AnimatePresence keeps the node mounted until its exit
              animation finishes, then unmounts it. Without it, cards
              would fade in but vanish instantly.

              `layout` on both the grid and each card is what turns the
              reflow into movement — surviving cards slide to their new
              positions rather than teleporting. popLayout lets exiting
              cards leave the layout flow immediately so the remaining
              ones start closing the gap during the exit rather than
              after it. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleArticles.map((article) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col gap-[16px] overflow-hidden rounded-[22px] bg-[rgba(255,255,255,0.1)] px-[10px] pb-[20px] pt-[10px]"
              >
                {/* The whole card is one link. Nesting a second link on
                    "Learn More" would produce two tab stops pointing at
                    the same place, so that line is styled text inside
                    this anchor rather than a separate control. */}
                <Link href={ARTICLE_HREF} className="flex flex-col gap-[16px]">
                  {/* #111 underneath the photo matches Figma's own
                      fallback fill, so the rounded frame reads as
                      intentional while the image decodes. */}
                  <div className="relative h-[240px] w-full overflow-hidden rounded-[22px] bg-[#111]">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      sizes={CARD_IMAGE_SIZES}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-[20px] px-[6px] [word-break:break-word]">
                    <div className="flex items-center justify-between whitespace-nowrap text-[20px] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3]">
                      <span>{article.kicker}</span>
                      {/* A machine-readable date sits alongside the
                          comp's display string so the markup carries a
                          real timestamp even while the copy is
                          placeholder. */}
                      <time dateTime="2026-06-08" className="text-right">
                        {article.date}
                      </time>
                    </div>

                    <h3 className="text-[20px] font-semibold leading-[1.5] tracking-[-0.4px] text-white">
                      {article.title}
                    </h3>

                    <p className="text-right text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#2dfbd9]">
                      Learn More
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* A filter that can return nothing needs to say so — an
            unexplained empty grid reads as a broken page. aria-live
            announces it, since the change is triggered by a control
            that keeps focus elsewhere. */}
        {visibleArticles.length === 0 && (
          <p
            aria-live="polite"
            className="mt-[32px] text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
          >
            No insights match that search in {activeCategory}.
          </p>
        )}
      </div>
    </section>
  );
};

export default Blog_AllInsights;
