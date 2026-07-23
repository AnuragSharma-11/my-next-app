"use client";
import Link from "next/link";

/* The trailing arrow ships with the button rather than being passed in.
   Six byte-identical copies of this 16x12 glyph had accumulated across
   the asset folders — one per section that happened to need a button —
   because each section downloaded its own. One copy, one importer. */
import defaultArrow from "./assets/shared/arrow-right.svg";

/* ------------------------------------------------------------------
   PILL BUTTON — the site's ONE button, used on the home hero, the CTA
   band, the product hero and the locations band.

   THE AUTHORED CORE (from Figma, unchanged): a second, gradient-filled
   copy of the label parked EXACTLY 49px below centre inside an
   overflow-clip pill. Both labels slide up together on hover, so the
   resting label leaves as the gradient one arrives — the 49px offset
   must match between the two layers or the swap tears.

   ONE ANIMATION ONLY (per review): the authored slide is the site's
   single button behaviour. The sheen sweep, border glow and press
   scale that were layered on during the enterprise pass are removed —
   every button on the site now answers a hover the same one way: the
   filled layer slides up from the bottom.
   ------------------------------------------------------------------ */

const PillButton = ({
  label,
  href,
  hoverLabel = "How we do it",
  width = 240,
  arrow = defaultArrow.src,
  arrowDown = false,
  className = "",
}) => {
  const Face = ({ gradient }) => (
    <span
      className={
        gradient
          ? "absolute left-[calc(50%+1px)] top-[calc(50%+49px)] flex h-[50px] w-[240px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[8px] rounded-[1200px] bg-gradient-to-r from-[#029c88] to-[#1b6d57] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[calc(50%+49px)]"
          : "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[8px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[calc(50%+49px)]"
      }
    >
      <span className="whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.4px] text-white">
        {gradient ? hoverLabel : label}
      </span>
      {arrow ? (
        /* The export is 16x12 with preserveAspectRatio="none", so both
           axes are pinned — left to `auto` it stretches to its box. */
        <img
          src={arrow}
          alt=""
          className={`h-[12px] w-[16px] shrink-0 ${arrowDown ? "rotate-90" : ""}`}
        />
      ) : null}
    </span>
  );

  return (
    <Link
      href={href}
      style={{ width }}
      className={`group relative block h-[50px] overflow-clip rounded-[1200px] border border-solid border-white ${className}`}
    >
      <Face />
      <Face gradient />
    </Link>
  );
};

export default PillButton;
