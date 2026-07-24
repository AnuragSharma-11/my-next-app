import bgRibbon from "../home-sections/assets/industries/bgimg.svg";

/* ==================================================================
   SECTION BG — the teal light-ribbon as a section backdrop.

   One full ribbon covers the section (object-cover), blended with
   mix-blend-screen so its black drops out and only the glow adds light
   over the section's surface — plus a primary-gradient wash for the
   brand colour. Drop it in as the first child of a `relative` section
   and give the section's own content a higher stacking level.

   `opacity` tunes how present the glow is; `position` lets a section
   pull the brightest part of the wave to a side.
   ================================================================== */
export default function SectionBg({ opacity = 0.7, position = "center" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img
        src={bgRibbon.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
        style={{ opacity, objectPosition: position }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-primary)", opacity: 0.28 }}
      />
    </div>
  );
}
