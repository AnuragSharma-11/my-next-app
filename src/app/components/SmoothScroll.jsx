"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------
   SMOOTH SCROLL — one Lenis instance for the whole site, now also
   driving GSAP's ScrollTrigger.

   Lenis eases the REAL window scroll, so everything already built on
   scroll (motion's useScroll scrubs, whileInView reveals, the navbar's
   scrolled state) keeps working untouched. ScrollTrigger needs two
   wires on top of that:

     1. lenis.on("scroll", ScrollTrigger.update) — Lenis tells
        ScrollTrigger every eased frame, so GSAP-driven reveals track
        the smoothed position, not the raw wheel.
     2. gsap.ticker drives lenis.raf — ONE clock for the whole page.
        Two competing rAF loops (Lenis's own + GSAP's) drift a frame
        apart and animations shimmer; sharing GSAP's ticker removes
        the second loop entirely. lagSmoothing(0) stops GSAP from
        "catching up" after a long frame, which on a scrub reads as
        the page jumping.

   duration 1.05 with an exponential-out ease is the "expensive" feel:
   the page leaves your finger instantly, then settles like it has
   mass.

   Reduced motion: Lenis never starts and ScrollTrigger still works
   against native scroll — the accessible behaviour, not a downgrade.
   ------------------------------------------------------------------ */

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
