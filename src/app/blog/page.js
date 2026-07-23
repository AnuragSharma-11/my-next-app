import React from 'react'

import Blog_Hero from './sections/Blog_Hero'
import Blog_FeaturedInsights from './sections/Blog_FeaturedInsights'
import Blog_AllInsights from './sections/Blog_AllInsights'
import Blog_CaseStudies from './sections/Blog_CaseStudies'

/* Shared with About and Products — same Figma frames on all three pages. */
import Cta from '../components/Cta'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

import bg from './assets/hero/blog-bg.svg'

/* ------------------------------------------------------------------
   PAGE BACKDROP

   blog-bg.svg is the whole decorative field flattened into one file —
   in Figma it is ~29 loose siblings (22 ellipses, some 2797px across,
   plus 7 vectors) each carrying its own Gaussian blur. As one export
   those 26 blurs ship as baked SVG filters rather than 26 live CSS
   filters the GPU would re-composite on every scroll frame.

   It belongs to the PAGE, not the hero. At 1440x3629 it spans the hero,
   Featured Insights and part of the grid, so scoping it to any single
   section clips it mid-ellipse and leaves a hard seam.

   TWO THINGS THIS LAYOUT IS DELIBERATELY AVOIDING:

   1. No negative z-index. The backdrop sits at z-0 and the content at
      z-10, both inside a positioned wrapper. A negative z-index would
      drop it behind the wrapper's own background and it would simply
      never be seen — a relative element with no z-index or transform
      creates no stacking context to be "behind".

   2. No overflow-hidden and no fixed height. The wrapper is normal
      flow, so it grows to whatever the sections need; the backdrop is
      absolute with height derived from its own aspect, so it keeps the
      artwork's proportions instead of being squashed to fit.

   Unlike most Figma exports this file does NOT set
   preserveAspectRatio="none", so it scales honestly on width alone.
   ------------------------------------------------------------------ */
const BG_ASPECT = 1440 / 3629

/* The export's base rect starts at stop-opacity 0, i.e. fully
   transparent at the top, so it needs real colour underneath or the
   first several hundred pixels render as bare page. These are the
   export's own gradient stops at full opacity, and the band is sized to
   the artwork so the two line up exactly. Below the artwork the page
   settles on #009A81 — the gradient's own final stop — so the join is
   invisible rather than a visible edge. */
const BG_GRADIENT =
  'linear-gradient(180deg, #012532 0%, #02534B 38.676%, #047D6B 57.751%, #009A81 100%)'
const BG_SETTLE = '#009A81'

const Blog = () => {
  return (
    <div className="relative w-full" style={{ backgroundColor: BG_SETTLE }}>
      {/* BACKDROP BAND — gradient and artwork share one box so they
          cannot drift apart at any viewport width. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 w-screen select-none"
        style={{ aspectRatio: BG_ASPECT, backgroundImage: BG_GRADIENT }}
      >
        <img src={bg.src} alt="" className="w-full" />
      </div>

      {/* CONTENT — z-10 keeps every section above the backdrop without
          any of them needing a background of their own. */}
      <div className="relative z-10">
        <Blog_Hero />
        <Blog_FeaturedInsights />
        <Blog_AllInsights />
        <Blog_CaseStudies />
        {/* Same CTA frame as About (1:4640 vs 1:4830) — identical
            layout, different words. Verbatim from the comp, including
            its space before the question mark. */}
        <Cta
          heading="stay ahead with smart insights ?"
          body="Subscribe to our newsletter for the latest stories and industry updates."
          buttonLabel="Subscribe Now"
          href="/contact-us"
        />
        <Faq />
        <Footer />
      </div>
    </div>
  )
}

export default Blog
