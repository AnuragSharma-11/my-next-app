import React from "react";

import Hero from "./home-sections/Hero";
import Impact from "./home-sections/Impact";
import Overview from "./home-sections/Overview";
import Founder from "./home-sections/Founder";
import Locations from "./home-sections/Locations";
import Industries from "./home-sections/Industries";
import Approach from "./home-sections/Approach";
import Insights from "./home-sections/Insights";

/* Shared with About, Products and Blog — same Figma frames everywhere. */
import Cta from "./components/Cta";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

/* Wraps a section so it blurs + fades as it scrolls up out of the top —
   the "previous section" hand-off. Only used on ordinary flow sections;
   the sticky/scrub ones (Overview) and the scroll-draw one (Industries)
   must NOT get a filter ancestor, which would break their positioning. */
import ScrollFade from "./components/ScrollFade";

/* Section order follows the Home artboard (1:3386) top to bottom.

   NOT YET BUILT: node 1:3584, "One vision, Many Solutions" with the
   THE INTELLIGENCE ECOSYSTEM eyebrow (844px). It belongs between
   Industries and Framework. */

const page = () => {
  return (
    <>
      {/* Hero and Impact are SEPARATE sections again (per review): the
          hero owns its ramp and its video texture; Impact receives the
          hero's bright bottom edge on the inverse ramp and settles the
          page down — the same colours meet at the boundary, so the
          pair still reads seamless without sharing one element. */}
      <Hero />
      <ScrollFade>
        <Impact />
      </ScrollFade>
      <Overview />

      <ScrollFade>
        <Founder />
      </ScrollFade>
      <ScrollFade>
        <Locations />
      </ScrollFade>
      <Industries />
      <ScrollFade>
        <Approach />
      </ScrollFade>
      <ScrollFade>
        <Insights />
      </ScrollFade>
      <ScrollFade>
        <Cta />
      </ScrollFade>
      <Faq />
      <Footer />
    </>
  );
};

export default page;
