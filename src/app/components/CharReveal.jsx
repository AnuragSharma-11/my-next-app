"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ==================================================================
   CHAR REVEAL — headings arrive character by character.

   GSAP owns this one (not motion): a heading is 20-60 tweens firing
   on one ScrollTrigger, which is exactly the granular-stagger work
   GSAP's timeline engine is built for, and ScrollTrigger is already
   wired to Lenis in SmoothScroll so the trigger fires on the eased
   scroll position.

   HOW THE SPLIT WORKS. Text is split into WORDS first, chars second:
   words are `inline-block whitespace-nowrap` so a word can never
   break across a line mid-reveal (chars are inline-blocks, and raw
   inline-block chars wrap individually — "Intelligence" snapping in
   half mid-animation is the classic artefact this avoids). Spaces are
   rendered as normal text nodes between word spans so the line still
   justifies exactly as the plain string did.

   THE MOVE. Each char starts 105% below its own line inside an
   overflow-clip word (a per-character wipe — the same clip-reveal
   language as the Industries heading rig), plus a small rotateX fall
   into place. 20ms per char, capped stagger so long headings never
   take longer than ~0.6s of stagger. once:true like every reveal on
   the site.

   ACCESSIBILITY. The split chars are aria-hidden and the plain string
   is served to screen readers via aria-label on the element — a
   reader announces "Turning Intelligence", never "T, u, r, n…".
   Reduced motion: no split animation runs; chars render in place.

   API:
     <CharReveal as="h2" className="...">Plain text</CharReveal>
     <CharReveal segments={[{ t: "Into " }, { t: "Outcomes.", c: "text-teal" }]} />
   Segments let one heading carry differently-coloured runs, split and
   staggered as one continuous sequence.
   ================================================================== */

const CharReveal = ({
  as: Tag = "h2",
  className = "",
  children,
  segments,
  delay = 0,
}) => {
  const ref = useRef(null);

  const segs = segments ?? [{ t: typeof children === "string" ? children : "" }];
  const label = segs.map((s) => s.t).join("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = el.querySelectorAll("[data-char]");
    if (!chars.length) return;

    const tween = gsap.fromTo(
      chars,
      { yPercent: 105, rotateX: -45, opacity: 0 },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        ease: "power4.out",
        duration: 0.9,
        delay,
        /* `amount` caps the TOTAL stagger: short headings ripple at
           ~20ms/char, long ones compress so the tail never drags. */
        stagger: { amount: Math.min(chars.length * 0.02, 0.6) },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, label]);

  return (
    <Tag ref={ref} className={className} aria-label={label}>
      <span aria-hidden className="inline">
        {segs.map((seg, si) =>
          seg.t.split(" ").map((word, wi, words) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`${si}-${wi}`} className={seg.c ?? ""}>
              <span className="inline-block overflow-clip whitespace-nowrap align-bottom [perspective:600px]">
                {[...word].map((ch, ci) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={ci} data-char className="inline-block will-change-transform">
                    {ch}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? " " : ""}
            </span>
          ))
        )}
      </span>
    </Tag>
  );
};

export default CharReveal;
