"use client";
import Link from "next/link";
import { motion } from "motion/react";

import cardGlow from "../assets/hero/card-glow.svg";
import roleIcon from "../assets/hero/role-icon.svg";
import dotTeal from "../assets/hero/dot-teal.svg";
import dotWhite from "../assets/hero/dot-white.svg";

/* ------------------------------------------------------------------
   JOB CARD — one open role: title, meta pills, required skill, apply.

   This is its own file because the Careers hero repeats it eight times
   and Figma's own construction has two details that are easy to lose
   when inlined, and expensive to re-derive:

   1. The card is a FIXED 590x246 box with its two content groups
      absolutely positioned (left:23/top:23 and left:23/top:197). The
      apply row is NOT in flow beneath the copy — it is pinned to the
      card's lower edge, so the copy block growing does not push it
      down. Laying this out as a flow column would drift the apply row
      on any card whose title wraps.

   2. The teal disc sits at left:-9, i.e. it hangs OFF the card's left
      edge and is cut in half by the card's own overflow-clip. That
      half-disc silhouette is the intended shape, so the clip is
      load-bearing rather than incidental.

   The 29px indent on the skill line is likewise Figma's: the copy
   group is 531 wide, the skill row 502, and the group is items-end —
   so the row is right-aligned inside it. `self-end` reproduces that
   without hardcoding a margin that would break if the width changes.

   BELOW lg THE PINNING IS LIFTED. Both details above are correct at
   590x246 and only there: a 335px card cannot hold a 32px nowrap title
   plus a three-up meta row inside a 246px box, and because the card
   clips, the failure would be silent amputation rather than a visible
   overflow the audit could catch. So under lg the two absolute groups
   become ordinary flow children of a padded, auto-height card and the
   copy is allowed to wrap. The clip stays — it is still what cuts the
   teal disc in half.
   ------------------------------------------------------------------ */

const JobCard = ({ job, variants }) => (
  <motion.article
    variants={variants}
    className="relative w-full max-w-full shrink-0 overflow-clip rounded-[26px] border border-solid border-white/16 bg-white/20 p-[23px] backdrop-blur-[5px] lg:h-[246px] lg:w-[590px] lg:p-0"
  >
    {/* The export is a plain 56x56 circle at 40% opacity — the soft
        "glow" read comes from the card's own backdrop-blur sitting
        over it, not from a blur baked into the file. Both axes are
        pinned because Figma writes preserveAspectRatio="none", which
        makes any single-axis sizing stretch the art. */}
    <img
      src={cardGlow.src}
      alt=""
      aria-hidden="true"
      className="absolute left-[-9px] top-[124px] h-[56px] w-[56px]"
    />

    <div className="flex w-full flex-col items-end gap-[20px] lg:absolute lg:left-[23px] lg:top-[23px] lg:w-[531px] lg:gap-[31px]">
      <div className="flex w-full flex-col items-end gap-[16px] lg:gap-[20px]">
        {/* ROLE */}
        <div className="flex w-full items-center gap-[16px]">
          {/* viewBox is 24.4444x20 — genuinely non-square, so the box
              must carry both numbers rather than a square size-[24px]. */}
          <img
            src={roleIcon.src}
            alt=""
            aria-hidden="true"
            className="h-[20px] w-[24.444px] shrink-0"
          />
          <h3 className="min-w-px flex-1 text-[24px] font-semibold leading-[1.2] text-[#e4e1e6] [word-break:break-word] lg:whitespace-nowrap lg:text-[32px] lg:leading-[36px]">
            {job.title}
          </h3>
        </div>

        {/* META — location, commitment, experience */}
        {/* The three pills total ~470px, so they only sit on one line
            at the comp's width. flex-wrap lets them fall to a second
            line rather than being clipped by the card. */}
        <ul className="flex w-full flex-wrap items-center gap-x-[16px] gap-y-[8px] lg:flex-nowrap">
          {job.meta.map((item) => (
            <li key={item} className="flex shrink-0 items-center gap-[6px]">
              <img
                src={dotTeal.src}
                alt=""
                aria-hidden="true"
                className="h-[8px] w-[8px] shrink-0"
              />
              <span className="whitespace-nowrap text-[18px] font-normal leading-[1.5] tracking-[-0.36px] text-[#ddd]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="w-full self-end text-[18px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e8e8e8] [word-break:break-word] lg:w-[502px] lg:text-[22px]">
        Required Skill: {job.skill}
      </p>
    </div>

    {/* APPLY — the card's only interactive target. It is a link rather
        than the whole card being clickable because the card carries no
        other affordance in the comp and a 590x246 hit area with no
        visible boundary reads as accidental when clicked. */}
    <Link
      href={job.href}
      className="group mt-[20px] flex w-[108px] items-center justify-center gap-[8px] lg:absolute lg:left-[23px] lg:top-[197px] lg:mt-0"
    >
      <img
        src={dotWhite.src}
        alt=""
        aria-hidden="true"
        className="h-[10px] w-[10px] shrink-0"
      />
      <span className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-white transition-colors duration-300 group-hover:text-[#2dfbd9]">
        Apply Now
      </span>
      <span className="sr-only">for {job.title}</span>
    </Link>
  </motion.article>
);

export default JobCard;
