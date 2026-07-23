"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Facebook02Icon,
  InstagramIcon,
  Linkedin02Icon,
} from "@hugeicons/core-free-icons";

import glowBackdrop from "./assets/footer/glow-backdrop.svg";

/* ==================================================================
   FOOTER — the enterprise reference structure, three tiers:

     1. Newsletter band, centred: heading, one-line pitch, pill form.
     2. Brand column + four link columns + Follow Us.
     3. Legal bar: copyright left, policy links right.

   The accent is the site's teal, not the reference's yellow — the
   pattern is borrowed, the palette is ours.

   LINK DESTINATIONS, stated honestly:
   - Company points at real routes.
   - Products entries all land on /products (no per-product pages yet).
   - Industries entries land on the home page's industries section via
     /#industries (no industry pages exist).
   - Case Studies lands on /blog, where the case-studies band lives.
   - Whitepapers, Events, Privacy Policy and Terms of Use have NO
     destination yet — they render as links to "#" so the layout is
     complete, and are flagged in the report as pending real pages.
   ================================================================== */

const COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/career" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Aashita IQ", href: "/products" },
      { label: "Aashita Learn", href: "/products" },
      { label: "Aashita Health", href: "/products" },
      { label: "Aashita Ops", href: "/products" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Education", href: "/#industries" },
      { label: "Healthcare", href: "/#industries" },
      { label: "Manufacturing", href: "/#industries" },
      { label: "Enterprise", href: "/#industries" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/blog" },
      { label: "Whitepapers", href: "#" },
      { label: "Events", href: "#" },
    ],
  },
];

/* Same set as the header — one identity, everywhere. */
const SOCIALS = [
  {
    icon: Facebook02Icon,
    label: "Aashita on Facebook",
    href: "https://www.facebook.com/aashita.ai/",
  },
  {
    icon: InstagramIcon,
    label: "Aashita on Instagram",
    href: "https://www.instagram.com/aashita.ai/",
  },
  {
    icon: Linkedin02Icon,
    label: "Aashita on LinkedIn",
    href: "https://www.linkedin.com/company/aashita.ai/",
  },
];

/* The site's standard rise-and-settle with the blur resolve — same
   constants as Impact, Insights and Faq, so the page closes on the
   same motion language it opened with. */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up newsletter signup — no backend exists for this yet.
  };

  return (
    <footer
      /* Surface comes from .about-footer in globals.css — the shared
         hero-family navy, so the page ends in the same colour family
         it opened with. A real <footer> landmark, not a section. */
      className="about-footer relative w-full overflow-hidden"
    >
      {/* GLOW BACKDROP — the same teal glow stack as before, kept as
          the one piece of life on an otherwise calm closing surface.
          Only its upper band is visible; overflow-hidden crops it. */}
      <div
        className="pointer-events-none absolute left-[calc(50%-9px)] top-[-203px] h-[2357px] w-[2730px] -translate-x-1/2 opacity-60"
        aria-hidden="true"
      >
        <img src={glowBackdrop.src} alt="" className="h-full w-full" />
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)] pb-[32px] pt-[72px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* ============ TIER 1 — NEWSLETTER ============ */}
        <div className="flex flex-col items-center text-center">
          <motion.h2
            variants={riseIn}
            className="text-[length:var(--text-section)] font-normal leading-[1.2] text-white"
          >
            Ready to build the future?
          </motion.h2>
          <motion.p
            variants={riseIn}
            className="mt-[12px] text-[length:var(--text-body)] font-medium text-[#cfd8da]"
          >
            Subscribe to get the latest insights, stories and updates.
          </motion.p>

          {/* PILL FORM — input and circular submit in one rounded
              capsule, per the reference. The button is a 38px teal
              disc; the input stays borderless inside the capsule so
              the pill reads as a single control. */}
          <motion.form
            variants={riseIn}
            onSubmit={handleSubmit}
            className="mt-[28px] flex h-[52px] w-full max-w-[440px] items-center rounded-full border border-white/15 bg-white/[0.04] p-[7px] pl-[22px] backdrop-blur-[2px] transition-colors duration-300 focus-within:border-[#0cffd7]/50"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="h-full min-w-px flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-[#8fa3a8]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#03CEB4] text-[#012532] transition-transform duration-300 hover:scale-105"
            >
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                color="currentColor"
                strokeWidth={2}
              />
            </button>
          </motion.form>
        </div>

        {/* ============ TIER 2 — BRAND + LINK COLUMNS ============ */}
        <motion.div
          variants={riseIn}
          className="mt-[56px] h-px w-full bg-white/10"
        />

        <div className="mt-[48px] grid grid-cols-2 gap-x-[24px] gap-y-[40px] sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_0.9fr]">
          {/* BRAND — logo + one-line mission, spanning wider than the
              link columns like the reference. */}
          <motion.div
            variants={riseIn}
            className="col-span-2 flex flex-col items-start gap-[16px] sm:col-span-3 lg:col-span-1 lg:pr-[40px]"
          >
            <Link href="/" aria-label="Aashita — home">
              <Image
                src="/logo/Aashita_logo.svg"
                alt="Aashita"
                width={103}
                height={33}
              />
            </Link>
            <p className="max-w-[260px] text-[14px] font-medium leading-[1.7] text-[#9fb1b5]">
              We build AI-powered products and solutions that create real
              value for businesses and people.
            </p>
          </motion.div>

          {COLUMNS.map((column) => (
            <motion.div
              key={column.heading}
              variants={riseIn}
              className="flex flex-col gap-[16px]"
            >
              <p className="text-[15px] font-semibold text-white">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-[10px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-[#9fb1b5] transition-colors duration-200 hover:text-[#0cffd7]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* FOLLOW US — same icon set and treatment as the header. */}
          <motion.div variants={riseIn} className="flex flex-col gap-[16px]">
            <p className="text-[15px] font-semibold text-white">Follow Us</p>
            <div className="flex items-center gap-[10px]">
              {SOCIALS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center rounded-full bg-white/10 p-[8px] text-white transition-colors duration-200 hover:bg-white/20"
                >
                  <HugeiconsIcon
                    icon={social.icon}
                    size={18}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ============ TIER 3 — LEGAL BAR ============ */}
        <motion.div
          variants={riseIn}
          className="mt-[48px] h-px w-full bg-white/10"
        />

        <motion.div
          variants={riseIn}
          className="mt-[24px] flex flex-col items-center justify-between gap-[12px] sm:flex-row"
        >
          <p className="text-[13px] font-medium text-[#8fa3a8]">
            © 2026 Aashita.AI. All rights reserved.
          </p>
          <div className="flex items-center gap-[12px] text-[13px] font-medium text-[#8fa3a8]">
            <Link href="#" className="transition-colors duration-200 hover:text-[#0cffd7]">
              Privacy Policy
            </Link>
            <span aria-hidden className="h-[12px] w-px bg-white/20" />
            <Link href="#" className="transition-colors duration-200 hover:text-[#0cffd7]">
              Terms of Use
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
