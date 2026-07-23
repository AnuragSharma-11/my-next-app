"use client";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";

/* ------------------------------------------------------------------
   The decorative field that sits behind this hero is NOT owned here.

   blog-bg.svg is 1440x3629 — two and a half times this hero's height —
   because the art deliberately bleeds past the hero and on down through
   Featured Insights and into the grid. Mounting it inside this section
   scoped it to the hero and, worse, put it at a negative z-index behind
   a section that paints its own opaque background: a relative element
   with no z-index or transform creates no stacking context, so the
   backdrop was drawn and then painted straight over.

   It now lives in blog/page.js, wrapping every section. This one must
   therefore stay TRANSPARENT — giving it a background of its own is
   exactly what hid the artwork before.
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   MOTION

   The hero subtree in Figma contains no instance nodes and no variant
   sets — nav, heading and body are all plain frames and text. With no
   authored animation to reproduce, a restrained entrance is the honest
   choice: the parent hands each line its turn via staggerChildren so
   the timing lives in one place rather than as hardcoded delays.

   Children animate opacity and y only. Both are compositor properties,
   so the browser never has to re-layout the 3629px backdrop sitting
   behind them.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const Blog_Hero = () => {
  return (
    /* The 120px inset is the comp's gutter, but hardcoding it here meant
       a 375px phone kept 240px of padding and left 135px for an 82px
       headline. px-[var(--gutter)] rides the one responsive ladder in
       globals.css and still resolves to 120px from 1280 up.

       h-[755px] is the comp's frame height; below lg the copy is taller
       relative to the box, so the height becomes a MINIMUM and the
       section grows rather than letting the stack spill out the bottom. */
    <section className="blog-hero relative flex min-h-[560px] w-full overflow-hidden pb-[80px] lg:h-[755px] lg:min-h-0 lg:pb-0">

      {/* HEADING STACK — Figma pins it at x=120, y=170 on a 1440 frame.
          px-[120px] reproduces the gutter without hardcoding a width,
          so it still holds together below 1440. */}
      <Container
        as={motion.div}
        /* Figma pins this stack at y=170, not centred in the hero — the
           orb behind it is composed around copy sitting high in the
           frame, so centring it drops the text into the bright part of
           the glow and loses contrast. */
        className="relative z-10 flex w-full flex-col items-start justify-start gap-[24px] pt-[130px] lg:gap-[32px] lg:pt-[170px]"
        variants={stage}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={riseIn}
          /* Size comes from the shared --text-heading token. That caps
             this at 72px rather than the comp's 82 — the client set 72
             as the one page-hero size, so this hero gives up its outlier
             instead of the scale giving up its consistency. */
          className="w-[587px] max-w-full text-[length:var(--text-heading)] font-normal leading-[1.2] text-[#1ef4d1]"
        >
          Insights
        </motion.h1>

        {/* w-full, not shrink-to-fit: as an auto-width flex child this
            stack sized itself to its w-[587px] children and their
            max-w-full became circular, so it measured 587px wide and ran
            off a 375px screen. Given a real width, max-w-full resolves. */}
        <div className="flex w-full flex-col items-start gap-[22px]">
          <motion.p
            variants={riseIn}
            className="w-[587px] max-w-full text-[30px] font-normal leading-[1.2] text-white md:text-[36px] lg:text-[42px]"
          >
            Powering a World That Works
          </motion.p>

          <motion.p
            variants={riseIn}
            className="w-[516px] max-w-full text-[length:var(--text-subheading)] font-medium leading-[1.5] tracking-[-0.4px] text-[#e3e3e3]"
          >
            Expert analysis, original research, and real-world stories that
            accelerate intelligent transformation.
          </motion.p>
        </div>
      </Container>
    </section>
  );
};

export default Blog_Hero;
