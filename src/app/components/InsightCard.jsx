"use client";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------
   INSIGHT CARD — photo on top, copy panel beneath.

   The comp uses this shape twice on the Blog page: the All Insights
   grid (1:4582, 385.33x479) and the Case Studies marquee (1:1263's
   children, 283.5x580). They were built as two separate inline cards
   and had already diverged on details that are not design decisions —
   one used `p-[10px]`, the other `px-[10px] pb-[20px] pt-[10px]`; one
   set gap-12, the other gap-16.

   What genuinely differs between the two is only:
     - photo height   240 in the grid, 320 in the marquee
     - date type      20px in the grid, 14px in the marquee
     - fixed sizing   the marquee card is pinned, the grid card fluid

   Everything else — the 22px radius, the white/10 ground, the 6px
   inner gutter, the meta row, the 20px title, the right-aligned teal
   "Learn More" — is one design, so it lives in one place.

   NOT the same as ArticleCard: that one is a photo-FILL tile with a
   frosted panel floating over the lower edge, which is a different
   composition rather than a variant of this one.
   ------------------------------------------------------------------ */

const InsightCard = ({
  kicker,
  date,
  title,
  href,
  image,
  imageAlt,
  imageSizes,
  photoHeight = 240,
  dateSize = 20,
  className = "",
  style,
  /* Machine-readable date. The comp's "Mon,08,June,26" is display copy;
     a real <time> value keeps the markup meaningful while that string
     is still placeholder. */
  dateTime = "2026-06-08",
}) => (
  <article
    className={`flex flex-col overflow-hidden rounded-[22px] bg-white/10 px-[10px] pb-[20px] pt-[10px] ${className}`}
    style={style}
  >
    {/* The whole card is one link. A second link on "Learn More" would
        add a tab stop pointing at the same destination. */}
    <Link href={href} className="flex h-full flex-col gap-[16px]">
      {/* #111 under the photo matches Figma's own fallback fill, so the
          rounded frame reads as intentional while the image decodes. */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-[22px] bg-[#111]"
        style={{ height: photoHeight }}
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

      <div className="flex flex-1 flex-col gap-[16px] px-[6px] leading-[1.5] [word-break:break-word]">
        <div className="flex w-full items-center justify-between whitespace-nowrap font-medium text-[#e3e3e3]">
          <span className="text-[20px] tracking-[-0.4px]">{kicker}</span>
          <time
            dateTime={dateTime}
            className="text-right"
            style={{ fontSize: dateSize, letterSpacing: "-0.02em" }}
          >
            {date}
          </time>
        </div>

        <h3 className="w-full text-[20px] font-semibold tracking-[-0.4px] text-white">
          {title}
        </h3>

        <p className="mt-auto w-full text-right text-[22px] font-semibold tracking-[-0.44px] text-[#2dfbd9]">
          Learn More
        </p>
      </div>
    </Link>
  </article>
);

export default InsightCard;
