"use client";
import Image from "next/image";
import { motion } from "motion/react";

/* ------------------------------------------------------------------
   PRODUCT CARD

   Figma lays every child of the card out absolutely against a fixed
   259px canvas, and the artwork deliberately overhangs the right edge
   (the phone mockups are clipped by the card, not fitted inside it).
   Flow layout cannot express that overlap, so the absolute positions
   are kept and driven by props instead of being "corrected" into a
   column — correcting them would lose the crop the design depends on.

   Assets arrive as props rather than being imported here: this file
   sits one directory deeper than the section that owns the asset
   folder, so importing locally would mean a second, divergent set of
   relative paths to keep in sync.
   ------------------------------------------------------------------ */

const ProductCard = ({
  title,
  blurb,
  blurbWidth,
  image,
  imageAlt,
  imageStyle,
  imageClassName = "",
  imageSizes,
  glow = false,
  icon,
  blob,
  dot,
  variants,
}) => {
  return (
    <motion.article
      variants={variants}
      /* THE CARD IS ITS OWN CLIP BOX. Everything inside is placed against
         a fixed 259px canvas and the artwork deliberately overhangs the
         right edge, so overflow-hidden here is what stops that overhang
         ever reaching the page — it must survive every breakpoint.

         The basis steps 1 -> 2 -> 3 across the ladder. Three 385px cards
         need ~1200px of column; at 768 the same split gives 110px cards,
         which is narrower than the artwork's own left offset and leaves
         the copy sitting under the photo. */
      className={`relative h-[259px] flex-[0_0_100%] overflow-hidden rounded-[26px] border border-solid border-[#01211d] bg-[#272727] sm:flex-[0_0_calc((100%-22px)/2)] lg:flex-[0_0_calc((100%-44px)/3)] ${
        glow ? "shadow-[2px_3px_60px_0px_rgba(89,241,216,0.2)]" : ""
      }`}
    >
      {/* BACKDROP BLOB — a flat teal disc that the artwork sits on top
          of. It hangs off the card's right edge and is clipped by the
          card's own overflow, which is what makes it read as a wedge
          rather than a circle. Both axes are set because the export
          carries preserveAspectRatio="none" and would otherwise
          stretch to whatever box it lands in. */}
      <img
        src={blob.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[288px] top-[23px] h-[130px] w-[130px]"
      />

      {/* ARTWORK — every card ships a different crop box, so geometry
          comes in as a style object. next/image resizes these: the
          sources are 1000–1400px wide but never painted above 231px. */}
      <div
        className={`absolute overflow-hidden ${imageClassName}`}
        style={imageStyle}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={imageSizes}
          className="object-cover"
          placeholder="blur"
        />
      </div>

      {/* TITLE ROW */}
      <div className="absolute left-[21px] top-[15px] flex items-center gap-[16px]">
        <img
          src={icon.src}
          alt=""
          aria-hidden="true"
          className="h-[20px] w-[24.444px] shrink-0"
        />
        <p className="whitespace-nowrap text-[24px] font-medium leading-[36px] text-[#e4e1e6]">
          {title}
        </p>
      </div>

      <p
        className="absolute left-[21px] top-[67px] text-[16px] font-medium leading-[1.5] tracking-[-0.32px] text-[#e8e8e8] [word-break:break-word]"
        style={{ width: blurbWidth }}
      >
        {blurb}
      </p>

      {/* LINK ROW — the label is a gradient, which text cannot take
          directly. bg-clip-text paints the gradient onto the glyphs and
          text-transparent lets it show through. */}
      <div className="absolute left-[21px] top-[212px] flex items-center gap-[8px]">
        <img
          src={dot.src}
          alt=""
          aria-hidden="true"
          className="h-[8px] w-[8px] shrink-0"
        />
        <span className="whitespace-nowrap bg-gradient-to-r from-[#727272] to-[#006756] bg-clip-text text-[16px] font-medium leading-[1.5] text-transparent">
          Read more
        </span>
      </div>
    </motion.article>
  );
};

export default ProductCard;
