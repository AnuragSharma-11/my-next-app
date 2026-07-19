"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

/* ------------------------------------------------------------------
   ARTICLE CARD

   The featured card and the two stacked cards are the same object at
   two scales: a 10px-padded shell, a rounded photo that fills it, and
   a frosted panel pinned to the photo's bottom edge carrying meta row,
   title and link. Only the panel's padding and type scale change, so
   `featured` selects between the two scales rather than this being
   forked into two components — a fork would leave two copies of the
   glass-panel treatment to keep in sync.

   Assets arrive as props rather than being imported here: this file
   sits one directory deeper than the section that owns the asset
   folder, so importing locally would mean a second, divergent set of
   relative paths to keep in sync.
   ------------------------------------------------------------------ */

const ArticleCard = ({
  category,
  date,
  title,
  href,
  image,
  imageAlt,
  imageSizes,
  featured = false,
  className = "",
  variants,
}) => {
  return (
    <motion.article
      variants={variants}
      className={`overflow-hidden rounded-[22px] bg-white/10 p-[10px] ${className}`}
    >
      {/* PHOTO FRAME — the panel is pinned with mt-auto inside a column
          rather than absolutely positioned, so the photo's height is
          whatever the card has left over and the panel never overlaps
          text it cannot push. */}
      <Link
        href={href}
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[20px] bg-[#111]"
      >
        {/* The sources are ~1535px wide but painted at 738px at most, so
            next/image re-encodes them down; sizes carries each card's
            real painted width so it does not generate the widest one. */}
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={imageSizes}
          className="object-cover"
          placeholder="blur"
        />

        {/* DETAIL PANEL — backdrop-blur over a 6% white wash is what
            keeps the copy legible on an arbitrary photo without a hard
            scrim. relative lifts it above the fill image, which is
            absolutely positioned by next/image. */}
        <div
          className={`relative flex w-full flex-col gap-[12px] bg-white/6 leading-[1.5] backdrop-blur-[2px] [word-break:break-word] ${
            featured ? "px-[22px] py-[16px]" : "p-[12px]"
          }`}
        >
          <div
            className={`flex w-full items-center justify-between whitespace-nowrap font-semibold text-[#e3e3e3] ${
              featured
                ? "text-[20px] tracking-[-0.4px]"
                : "text-[16px] tracking-[-0.32px]"
            }`}
          >
            <p>{category}</p>
            <p className="text-right">{date}</p>
          </div>

          <p
            className={`w-full font-semibold text-white ${
              featured
                ? "text-[20px] tracking-[-0.4px]"
                : "text-[16px] tracking-[-0.32px]"
            }`}
          >
            {title}
          </p>

          <p
            className={`w-full text-right font-medium text-[#2dfbd9] ${
              featured
                ? "text-[18px] tracking-[-0.36px]"
                : "text-[16px] tracking-[-0.32px]"
            }`}
          >
            Learn More
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
