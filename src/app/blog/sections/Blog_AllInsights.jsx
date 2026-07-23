"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterMailIcon } from "@hugeicons/core-free-icons";

import insightStrategyWall from "../assets/all-insights/insight-strategy-wall.png";
import insightTeamWorkspace from "../assets/all-insights/insight-team-workspace.png";
import Container from "../../components/Container";
import InsightCard from "../../components/InsightCard";

/* ------------------------------------------------------------------
   CATEGORIES

   Read verbatim off the comp's four tab frames. Note the casing is
   inconsistent in Figma ("Data intelligence" against "Industries at
   Work") — that is reproduced rather than tidied, because silently
   re-casing a label means the code and the design no longer agree and
   nobody can tell which one is wrong later.

   There is no "All" tab in the comp. The first tab ships pre-selected
   (Figma names that frame "Filter-Active-Tab") and the comp still shows
   ALL SIX cards beneath it — so in the design the first tab is the
   unfiltered view, not a filter that happens to match everything.

   That matters: treating it as a real filter dropped the default page
   to two cards and collapsed the grid from two rows to one, which is
   why the page rendered ~830px shorter than the artboard. The first
   tab now shows everything, matching the comp; the other three filter.
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
      // First tab is the unfiltered view — see the CATEGORIES note.
      const inCategory =
        activeCategory === CATEGORIES[0] || article.category === activeCategory;
      const matchesQuery =
        needle === "" || article.title.toLowerCase().includes(needle);

      return inCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="blog-all-insights relative w-full pb-[120px]">
      <Container className="flex flex-col">
        {/* HEADING AND SEARCH */}
        <div className="flex w-full flex-wrap items-center justify-between gap-[24px]">
          <h2 className="text-[34px] font-normal leading-[1.2] text-[#1ef4d1] md:text-[42px] lg:text-[52px]">
            All Insights
          </h2>

          {/* The search field is a label wrapping its input, so the
              whole 626px pill is a click target and the control is
              named without a floating id/htmlFor pair to keep in sync.
              The visible "Search articles" string in Figma is the
              placeholder, so the accessible name is carried by an
              sr-only span instead — a placeholder alone disappears the
              moment someone types. */}
          {/* w-full below lg so the pill spans the column instead of
              sitting at a 626px literal that max-w-full merely clamps —
              the comp's 626px returns at lg. min-w-px on the inner group
              is what lets the input shrink rather than force the pill
              wider than its shell. */}
          <label className="flex h-[56px] w-full max-w-full cursor-text items-center justify-between gap-[10px] rounded-full border border-solid border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.1)] px-[20px] lg:h-[66px] lg:w-[626px]">
            <span className="sr-only">Search articles</span>

            <span className="flex min-w-px flex-1 items-center gap-[10px]">
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
                className="w-full min-w-px bg-transparent text-[17px] lg:text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3] outline-none placeholder:text-[#e3e3e3] [&::-webkit-search-cancel-button]:appearance-none"
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
          /* Below lg the four pills cannot sit on one line and wrapping
             them inside a rounded-full shell turns the strip into a
             lozenge stack. A horizontal scroller keeps the row reading
             as a row; the overflow is SCOPED to this element, so the
             page itself still never scrolls sideways. From lg the pills
             fit and the strip goes back to the comp's single row. */
          className="mt-[48px] flex w-full max-w-full items-center gap-[12px] overflow-x-auto rounded-[33px] border border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] px-[7px] py-[7px] backdrop-blur-[5px] [scrollbar-width:none] xl:mt-[80px] xl:inline-flex xl:w-fit xl:gap-[20px] xl:overflow-visible xl:rounded-full"
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
                className={`relative flex h-[48px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-[16px] text-[16px] font-bold leading-[1.5] tracking-[-0.44px] transition-colors duration-200 xl:h-[60px] xl:px-[20px] xl:text-[22px] ${
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
              >
                {/* The shared card. This grid and the Case Studies
                    marquee are the same design — photo above copy on a
                    translucent ground — so the markup lives in one
                    place and the two differ only by props. motion.article
                    stays the wrapper because `layout` has to be on the
                    element the grid actually positions. */}
                <InsightCard
                  kicker={article.kicker}
                  date={article.date}
                  title={article.title}
                  href={ARTICLE_HREF}
                  image={article.image}
                  imageAlt={article.imageAlt}
                  imageSizes={CARD_IMAGE_SIZES}
                  photoHeight={240}
                  dateSize={20}
                  className="h-full"
                />
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
      </Container>
    </section>
  );
};

export default Blog_AllInsights;
