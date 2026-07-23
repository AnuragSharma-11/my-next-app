import React from "react";

import CareerDetail_RoleSummary from "./sections/CareerDetail_RoleSummary";
import CareerDetail_Humans from "./sections/CareerDetail_Humans";
import CareerDetail_Stories from "./sections/CareerDetail_Stories";
import CareerDetail_Gallery from "./sections/CareerDetail_Gallery";

/* Shared across every page — same Figma frames throughout. */
import Faq from "../../components/Faq";
import Footer from "../../components/Footer";

/* Section order follows the Carrier Detailed artboard (1:4961) top to
   bottom. Note this page has no CTA band — the comp goes straight from
   the gallery into the FAQ. */

const page = () => {
  return (
    /* PAGE BACKDROP — Figma keeps this on 1:4963 "Gredient layer", a
       page-level frame outside every section, so building the sections
       alone left the page on bare white with the nav and all the body
       copy invisible against it.

       NOT YET BUILT: the two large decorative sweeps on that frame
       (1:4981 Vector 111 at 2466x1776, 1:4982 Vector 112 at 1776x1194)
       and 1:4983 Group 1707480679. They are ambient glow over this
       base, not the base itself. */
    <div className="relative w-full bg-[#012532]">
      <CareerDetail_RoleSummary />
      <CareerDetail_Humans />
      <CareerDetail_Stories />
      <CareerDetail_Gallery />
      <Faq />
      <Footer />
    </div>
  );
};

export default page;
