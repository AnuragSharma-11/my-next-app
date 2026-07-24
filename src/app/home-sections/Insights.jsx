"use client"; // Tells Next.js this file runs in the browser (it uses animation + hover, which need the browser).

import Link from "next/link"; // Next.js link — makes each card clickable and navigates without a full page reload.
import Image from "next/image"; // Next.js image — shows the portrait photos and auto-optimises their size/format.
import { motion } from "motion/react"; // Animation library — used for the fade-up reveals when the section scrolls into view.
import { HugeiconsIcon } from "@hugeicons/react"; // Lets us render an icon from the HugeIcons set.
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"; // The specific "→" arrow icon used on the links.
import CharReveal from "../components/CharReveal"; // Our shared heading component that reveals text one character at a time.
import Parallax from "../components/Parallax"; // Drifts the card photos at a different speed than the scroll.

/* ==================================================================
   STORIES THAT INSPIRE
   ------------------------------------------------------------------
   Where it's used: the home page (src/app/page.js), sitting between
   the "How We Build" (Framework) section and the closing CTA.

   What it shows: a small label, a big heading, a "View All Stories"
   link, and three tall portrait cards (Employee / Client / Innovation
   story). Each card is a clickable photo with a coloured badge, a
   title and a "Read More" link.

   ------------------------------------------------------------------
   HOW TO CONTROL THE CARD SIZE  (three simple levers)

   1. CARD HEIGHT  — search below for `h-[460px] lg:h-[500px]`.
        h-[460px]     = height on phones/tablets (460 pixels tall).
        lg:h-[500px]  = height on laptops/desktops (500 pixels tall).
        Change these two numbers to make the cards taller or shorter.

   2. CARDS PER ROW — search below for `grid-cols`.
        grid-cols-1     = 1 card per row on small phones.
        sm:grid-cols-2  = 2 per row on larger phones/tablets.
        lg:grid-cols-3  = 3 per row on laptops/desktops.
        The card WIDTH is decided automatically by how many fit per
        row — fewer per row = wider cards, more per row = narrower.

   3. GAP BETWEEN CARDS — search below for `gap-[24px]`.
        24px is the space between cards. Raise it for more air,
        lower it for a tighter row.
   ================================================================== */

// The three portrait photos, supplied by the client, kept in this
// section's own asset folder. Imported so Next.js can optimise them.
import portraitEmployee from "./assets/insights/1.jpeg"; // Card 1 photo — the smiling employee.
import portraitClient from "./assets/insights/2.jpeg"; // Card 2 photo — the laughing client.
import portraitInnovation from "./assets/insights/3.jpeg"; // Card 3 photo — the man in glasses.

// The card CONTENT lives here as data. To change a card's words,
// badge, photo or link, edit this list — the layout below never
// needs to change. To add a fourth card, add a fourth object here.
const STORIES = [
  {
    chip: "EMPLOYEE STORY", // The small coloured badge text.
    title: "Empowering people to build meaningful solutions.", // The card headline.
    image: portraitEmployee, // Which photo this card shows.
    href: "/career", // Where the card links to when clicked.
  },
  {
    chip: "CLIENT STORY",
    title: "Delivering impact across every partnership.",
    image: portraitClient,
    href: "/blog",
  },
  {
    chip: "INNOVATION STORY",
    title: "Building AI solutions for a better tomorrow.",
    image: portraitInnovation,
    href: "/blog",
  },
];

// ANIMATION SETTINGS (shared with the rest of the site) --------------

// "stage" controls the HEADER: it plays its children (label + heading)
// one after another with a small delay, so they appear in sequence.
const stage = {
  hidden: {}, // Starting point (children handle their own hidden look).
  visible: { transition: { staggerChildren: 0.12 } }, // Each child starts 0.12s after the previous.
};

// "cardStage" controls the ROW OF CARDS: same idea, the three cards
// reveal left-to-right instead of all at once.
const cardStage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }, // Waits 0.1s, then reveals cards 0.12s apart.
};

// "riseIn" is the actual movement each element makes: start slightly
// lower, faded out and blurred → finish in place, sharp and visible.
const riseIn = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" }, // Before: invisible, 26px down, blurred.
  visible: {
    opacity: 1, // After: fully visible.
    y: 0, // After: moved up into its real position.
    filter: "blur(0px)", // After: sharp (no blur).
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, // Takes 0.8s with a smooth ease-out curve.
  },
};

const Insights = () => (
  // The whole section. `.insights` sets the background colour (in
  // globals.css). `py-[var(--section-pad)]` adds the standard top/
  // bottom spacing every section uses, so this one lines up with them.
  <section className="insights relative w-full overflow-hidden py-[var(--section-pad)]">
    {/* This box centres the content and limits how wide it can get
        (max-w-[var(--frame)]), then adds the standard left/right side
        spacing (px-[var(--gutter)]) shared by every section. */}
    <div className="relative z-10 mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)]">
      {/* ---------- HEADER ROW ---------- */}
      {/* Stacks vertically on phones; on wider screens (sm:) it becomes
          a row with the heading on the left and the link on the right. */}
      <motion.div
        className="flex flex-col gap-[16px] sm:flex-row sm:items-end sm:justify-between"
        variants={stage} // Use the header animation settings above.
        initial="hidden" // Start in the "hidden" state.
        whileInView="visible" // Play to "visible" when scrolled into view.
        viewport={{ once: false, amount: 0.5 }} // Only play once, when 50% is on screen.
      >
        {/* Left side: the small label above the big heading. */}
        <div className="flex flex-col gap-[16px]">
          {/* The teal eyebrow label. Colour + size come from design tokens. */}
          <motion.p
            variants={riseIn} // Fades/rises in with the shared animation.
            className="text-[length:var(--text-eyebrow)] font-semibold tracking-[0.22em] text-[#0cffd7]"
          >
            PEOPLE BEHIND THE INNOVATION
          </motion.p>
          {/* The big heading. CharReveal makes it appear letter by letter.
              Its size uses the shared section-heading token. */}
          <CharReveal
            as="h2"
            className="text-[length:var(--text-section)] font-normal leading-[1.18] tracking-[-0.045em] text-white"
          >
            Stories That Inspire
          </CharReveal>
        </div>

        {/* Right side: the "View All Stories" text link with an arrow. */}
        <motion.div variants={riseIn}>
          <Link
            href="/blog" // Where this link goes.
            className="group flex items-center gap-[8px] whitespace-nowrap text-[length:var(--text-body)] font-medium text-[#2dfbd9] transition-opacity duration-200 hover:opacity-80"
          >
            View All Stories
            {/* The arrow icon. It slides right a little when you hover
                the link (group-hover). */}
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color="currentColor" // Uses the link's text colour.
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-[4px]"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* ---------- CARDS ROW ---------- */}
      {/* mt-[48px]      = space between the header and the cards.
          grid           = lay the cards out in a grid.
          gap-[24px]     = space BETWEEN cards (size lever #3).
          grid-cols-*    = how many cards per row (size lever #2). */}
      <motion.div
        className="mt-[48px] grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3"
        variants={cardStage} // Reveal the cards one after another.
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }} // Play once when 20% is on screen.
      >
        {/* Loop over the STORIES list — one card is drawn per item. */}
        {STORIES.map((story) => (
          // Wrapper so each card can fade/rise in on its own.
          <motion.div key={story.chip} variants={riseIn}>
            {/* THE CARD ITSELF (the clickable link).
                group            = lets the photo AND the text react when THIS card is hovered.
                relative         = so the photo/gradient/text can layer inside it.
                h-[460px] lg:h-[600px] = the CARD HEIGHT (size lever #1).
                rounded-[20px]   = rounded corners.
                overflow-hidden  = clips the photo to those rounded corners.
                border           = the thin outline around the card.
                The card frame itself STAYS PUT on hover (no lift) — only
                the border warms and a soft shadow appears. The movement
                on hover is the text block sliding up (see below). */}
            <Link
              href={story.href}
              className="group relative block h-[460px] overflow-hidden rounded-[20px] border border-white/10 transition-[border-color,box-shadow] duration-300 ease-out hover:border-[#0cffd7]/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] lg:h-[600px]"
            >
              {/* THE PHOTO — wrapped in Parallax so it drifts slowly
                  against the scroll (moves at a different speed than the
                  page). Parallax over-sizes and clips the image so the
                  drift never exposes an edge. The hover zoom still lives
                  on the Image itself. */}
              <Parallax className="absolute inset-0" speed={0.1}>
                <Image
                  src={story.image}
                  alt="" // Empty because the card's title already describes it.
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                />
              </Parallax>

              {/* DARK FADE — a see-through-to-dark gradient over the
                  lower part of the photo, so the white text on top of
                  it stays readable no matter what the photo looks like. */}
              <div
                aria-hidden // Decorative only — hidden from screen readers.
                className="absolute inset-0 bg-gradient-to-t from-[#010f14] via-[#010f14]/55 to-transparent"
              />

              {/* THE TEXT BLOCK — pinned to the bottom of the card.
                  inset-x-0 bottom-0 = stick to the bottom, full width.
                  p-[24px]           = padding inside so text isn't on the edge.
                  gap-[16px]         = space between badge, title and link.

                  THE HOVER EFFECT (before → after): at rest the block
                  sits low; on hover the whole block slides UP 14px, so
                  the badge, title and Read More lift together and more
                  of the photo shows below. Smooth over 0.4s. */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-[16px] p-[24px] transition-transform duration-[400ms] ease-out group-hover:-translate-y-[14px]">
                {/* THE BADGE — teal pill with the category text. */}
                <span className="rounded-[6px] bg-[#0cffd7] px-[12px] py-[5px] text-[11px] font-bold uppercase tracking-[0.1em] text-[#012532]">
                  {story.chip}
                </span>
                {/* THE TITLE — white, bold, size from the shared title token. */}
                <h3 className="text-[length:var(--text-title)] font-semibold leading-[1.3] text-white">
                  {story.title}
                </h3>
                {/* THE "READ MORE" LINK — teal text with an arrow that
                    slides right when the card is hovered. */}
                <span className="flex items-center gap-[6px] text-[14px] font-semibold text-[#2dfbd9]">
                  Read More
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-[4px]"
                  />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Insights; // Makes this section available to import in page.js.
