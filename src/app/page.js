import React from "react";

import Hero from "./home-sections/Hero";
import Impact from "./home-sections/Impact";
import Overview from "./home-sections/Overview";
import Founder from "./home-sections/Founder";
import Locations from "./home-sections/Locations";
import Industries from "./home-sections/Industries";
import Framework from "./home-sections/Framework";
import Insights from "./home-sections/Insights";

/* Shared with About, Products and Blog — same Figma frames everywhere. */
import Cta from "./components/Cta";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

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
      <Impact />
      <Overview />
      <Founder />
      <Locations />
      <Industries />
      <Framework />
      <Insights />
      <Cta />
      <Faq />
      <Footer />
    </>
  );
};

export default page;
