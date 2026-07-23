"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";

import JobCard from "../components/JobCard";
import searchIcon from "../assets/hero/search-icon.svg";
import filterIcon from "../assets/hero/filter-icon.svg";
import Container from "../../components/Container";

/* ------------------------------------------------------------------
   MOTION

   Nothing in this subtree is a component instance — every node under
   1:4115 is a plain frame, so there are no variants standing in for an
   authored animation. That makes scroll-reveal the honest choice: it
   follows the reading order the layout already implies instead of
   inventing motion the designer never asked for.

   whileInView + viewport.once means it plays as the section arrives
   and then stays put — no replay on every scroll pass, which reads as
   nervous on a page this long.
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

/* Figma ships all eight slots with byte-identical placeholder copy —
   same title, same city, same skill. That copy is reproduced as-is
   rather than invented, and it lives in this array so that swapping in
   the real openings is a one-place edit that the markup below never
   has to hear about. */
const JOBS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  title: "Full Stack Engineer",
  meta: ["Jaipur", "Full Time", "Experience: 2-5 Years"],
  skill: "Java Full Stack Development",
  href: "/career/detail",
}));

const Career_Hero = () => {
  /* The comp draws a search field with placeholder copy but authors no
     behaviour for it. Shipping it as an inert decoration would be a
     control that lies about what it does, so it filters the same array
     that renders the cards — the cheapest way to make the affordance
     truthful. Matching is over every field a candidate would plausibly
     type, not just the title. */
  const [query, setQuery] = useState("");

  const visibleJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOBS;
    return JOBS.filter((job) =>
      [job.title, job.skill, ...job.meta].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  /* pt is 200px, not 120: Figma nests this at y=120 inside a
     Stack-Of-Sections that itself begins at y=80, below the 80px
     header. Navbar is absolutely positioned so it occupies no flow
     space — that 80px has to live here or the copy rides up under it. */
  return (
    <section className="career-hero relative w-full pb-[90px] pt-[140px] lg:pt-[200px]">
      <Container
        as={motion.div}
        className="relative z-10 flex flex-col gap-[64px] lg:gap-[120px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADING */}
        {/* The 160px band between headline and search is comp-literal at
            lg. On a phone it is most of a viewport of nothing, so it
            steps down with the rest of the vertical rhythm. */}
        <div className="flex w-full flex-col items-center gap-[72px] lg:gap-[160px]">
          <div className="flex w-full flex-col gap-[24px] [word-break:break-word]">
            <motion.h1
              variants={riseIn}
              /* The <br/>s are the comp's three-line break. They hold at
                 lg; below it the lines are already wrapping on their own
                 and a forced break just makes ragged orphans, so they are
                 neutralised rather than removed (the teal span has to stay
                 a span either way).

                 Size is the shared --text-heading token, so only the
                 line-break behaviour is breakpoint-aware here now. */
              className="w-full text-[length:var(--text-heading)] font-normal leading-[1.2] text-white [&>br]:hidden lg:[&>br]:block"
            >
              Your first job at Aashita
              <br />
              is just the beginning
              <br />
              {/* The third line turns teal in the comp — it is the one
                  emphasis in the headline, so it is a span rather than
                  a colour applied to the whole block. */}
              <span className="text-[#2dfbd9]">of your journey</span>
            </motion.h1>

            <motion.p
              variants={riseIn}
              className="w-[542px] max-w-full text-[length:var(--text-subheading)] font-normal leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
            >
              Find where your ambition can take you.
            </motion.p>
          </div>

          {/* SEARCH — the 1009px block is centred in the 1200 column
              rather than filling it, which is why this is its own
              width-constrained stack instead of a w-full child. */}
          <div className="flex w-[1009px] max-w-full flex-col items-center gap-[40px] lg:gap-[80px]">
            <motion.div
              variants={riseIn}
              className="flex w-full flex-col items-center gap-[12px] text-center leading-[1.2] text-white [word-break:break-word]"
            >
              <p className="w-full text-[18px] font-medium uppercase lg:text-[24px]">
                We selected just for you
              </p>
              <p className="w-full text-[28px] font-normal sm:text-[34px] lg:text-[42px]">
                Power your game-changing career
              </p>
            </motion.div>

            {/* The 200px-radius teal shadow is what lifts the field off
                the dark ground; the backdrop-blur is what makes the
                20%-white fill read as frosted glass rather than grey. */}
            <motion.div
              variants={riseIn}
              className="flex h-[74px] max-w-full items-center gap-[10px] rounded-full border border-solid border-white/40 bg-white/20 px-[16px] shadow-[4px_4px_200px_0px_#00584a] backdrop-blur-[5px]"
            >
              <div className="flex w-[792px] max-w-full items-center gap-[10px]">
                <img
                  src={searchIcon.src}
                  alt=""
                  aria-hidden="true"
                  className="h-[24px] w-[24px] shrink-0"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find your next opportunity..."
                  aria-label="Search open roles"
                  className="min-w-px flex-1 bg-transparent text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-white outline-none placeholder:text-white"
                />
              </div>

              {/* Figma gives this disc no behaviour and no panel to
                  open, so it stays decorative. Rendering it as a
                  <button> would put a dead tab stop in the middle of a
                  working search field. */}
              <div
                aria-hidden="true"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#001720]"
              >
                <img
                  src={filterIcon.src}
                  alt=""
                  className="h-[24px] w-[24px] shrink-0"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* JOB CARDS — four rows of two at a 20px gutter (590 + 20 +
            590 = 1200). flex-wrap rather than grid because each card
            declares its own fixed 246px height, so there is no row
            sizing left for grid to solve, and wrapping degrades more
            gracefully below 1440 than a pinned two-column track. */}
        <div className="flex w-full flex-wrap gap-[20px]">
          {visibleJobs.length > 0 ? (
            visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} variants={riseIn} />
            ))
          ) : (
            <p className="text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]">
              No roles match “{query.trim()}” right now.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Career_Hero;
