import React from "react";

import CareerBackdrop from "./components/CareerBackdrop";
import Career_Hero from "./sections/Career_Hero";
import Career_Culture from "./sections/Career_Culture";

/* Shared across every page — same Figma frames throughout. */
import Cta from "../components/Cta";
import Faq from "../components/Faq";
import Footer from "../components/Footer";

/* Section order follows the Carrier artboard (1:4083) top to bottom. */

const page = () => {
  return (
    /* NO background on this wrapper. The backdrop is a child at z-0 and
       the content sits at z-10 above it; giving the wrapper its own
       background would paint straight over the artwork. */
    <div className="relative w-full">
      <CareerBackdrop />

      <div className="relative z-10">
        <Career_Hero />
        <Career_Culture />
        <Cta />
        <Faq />
        <Footer />
      </div>
    </div>
  );
};

export default page;
