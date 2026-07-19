"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import orbLogo from "./assets/footer/orb-logo.png";
import glowBackdrop from "./assets/footer/glow-backdrop.svg";
import iconFacebook from "./assets/footer/icon-facebook.svg";
import iconMail from "./assets/footer/icon-mail.svg";
import iconX from "./assets/footer/icon-x.svg";
import iconInstagram from "./assets/footer/icon-instagram.svg";
import iconArrowUp from "./assets/footer/icon-arrow-up.svg";

/* ------------------------------------------------------------------
   MOTION

   Same reasoning as About_Origin: no Figma variants means there is no
   authored animation to reproduce, so a scroll-reveal that follows the
   existing reading order is the honest choice rather than inventing
   motion the designer never asked for.

   Constants are kept identical to About_Origin so the two sections
   read as one system when the page is scrolled end to end.
   ------------------------------------------------------------------ */

const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------
   NAV COLUMNS

   Driven from data so the four columns share one markup path.

   NOTE: the Figma frame genuinely repeats "Newsroom" as the heading of
   both column 3 and column 4, and repeats each column's link label
   twice ("Technology / Technology", "Health / Health"). That is
   reproduced verbatim here — see the report; it looks like unfinished
   placeholder copy rather than intent.

   `size` follows the design: column 3 is set at 20px/#e6e6e6 while the
   other three are 16px/#cecece. Also inconsistent, also reproduced.
   ------------------------------------------------------------------ */

const columns = [
  {
    heading: "Business",
    size: "sm",
    links: [
      { label: "Technology", href: "/business/technology" },
      { label: "Technology", href: "/business/technology" },
    ],
  },
  {
    heading: "Community",
    size: "sm",
    links: [
      { label: "Health", href: "/community/health" },
      { label: "Health", href: "/community/health" },
    ],
  },
  {
    heading: "Newsroom",
    size: "lg",
    links: [
      { label: "Careers", href: "/career" },
      { label: "Jobs", href: "/career" },
    ],
  },
  {
    heading: "Newsroom",
    size: "sm",
    links: [
      { label: "Technology", href: "/newsroom/technology" },
      { label: "Technology", href: "/newsroom/technology" },
    ],
  },
];

/* Social row. The design mixes icon sets (iconoir facebook, lucide
   mail, prime twitter, line-md instagram) at four different sizes, so
   these ship as the exported assets rather than @hugeicons — see the
   report for the trade-off. Every export carries
   preserveAspectRatio="none", so width AND height are always set from
   the viewBox aspect; object-contain would not save them. */
const socials = [
  { name: "Facebook", href: "https://www.facebook.com/aashita.ai/", src: iconFacebook, w: 20, h: 20 },
  { name: "Email", href: "mailto:hello@aashita.ai", src: iconMail, w: 18.17, h: 14.83 },
  { name: "X", href: "https://x.com/", src: iconX, w: 16, h: 14.5 },
  { name: "Instagram", href: "https://www.instagram.com/aashita.ai/", src: iconInstagram, w: 24, h: 24 },
];

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up newsletter signup — no backend exists for this yet.
  };

  return (
    <section className="about-footer relative h-[564px] w-full overflow-hidden bg-[#000101]">
      {/* GLOW BACKDROP — a stack of heavily blurred teal ellipses. Figma
          floats it at 2730x2357, far taller than the 564px section, so
          only the upper band of the glow is ever visible; the section's
          overflow-hidden does the cropping. Centre sits 9px left of the
          section centre, which is why this is calc() and not left-1/2. */}
      <div
        className="pointer-events-none absolute left-[calc(50%-9px)] top-[-203px] h-[2357px] w-[2730px] -translate-x-1/2"
        aria-hidden="true"
      >
        <img src={glowBackdrop.src} alt="" className="h-full w-full" />
      </div>

      <motion.div
        className="absolute inset-x-[120px] inset-y-[60px] flex flex-col items-center justify-end gap-[22px] overflow-clip"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* TOP ROW — link columns on the left, social + email capture on
            the right, split by a vertical gradient rule. */}
        <div className="relative flex w-full flex-1 items-start justify-center gap-[60px]">
          <div className="relative flex h-full shrink-0 items-start gap-[10px]">
            <div className="flex w-[798px] shrink-0 items-start justify-between">
              {columns.map((column, i) => (
                <motion.div
                  key={`${column.heading}-${i}`}
                  variants={riseIn}
                  className="flex h-[181px] shrink-0 flex-col items-start"
                >
                  {/* HEADING + the short teal underscore beneath it */}
                  <div className="flex w-full shrink-0 flex-col items-start justify-center gap-[4px] p-[16px]">
                    <p className="whitespace-nowrap text-[22px] font-semibold leading-[1.2] tracking-[-0.44px] text-[#00c8a7]">
                      {column.heading}
                    </p>
                    <span className="h-[2px] w-[34px] shrink-0 bg-[#00c8a7]" />
                  </div>

                  <ul
                    className={`flex w-full shrink-0 flex-col items-start ${
                      column.size === "lg" ? "gap-[4px]" : "gap-[2px]"
                    }`}
                  >
                    {column.links.map((link, j) => (
                      <li key={`${link.label}-${j}`} className="w-full">
                        <Link
                          href={link.href}
                          className={`flex w-full items-center px-[16px] py-[8px] whitespace-nowrap font-medium leading-[1.2] transition-colors hover:text-[#00c8a7] ${
                            column.size === "lg"
                              ? "text-[20px] tracking-[-0.4px] text-[#e6e6e6]"
                              : "text-[16px] tracking-[-0.32px] text-[#cecece]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* VERTICAL RULE — fades top-to-bottom in the design */}
            <div className="h-full w-px shrink-0 bg-gradient-to-b from-[#727272] to-[#2c2c2c]" />
          </div>

          <div className="flex shrink-0 flex-col items-start gap-[60px]">
            {/* SOCIAL HANDLES */}
            <motion.div variants={riseIn} className="flex shrink-0 flex-col items-start gap-[8px]">
              <p className="whitespace-nowrap text-[14px] font-medium leading-[1.5] tracking-[-0.28px] text-[#cdcdcd]">
                Social handles:
              </p>
              <div className="flex w-[150px] shrink-0 items-center justify-between">
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                    style={{ width: 24, height: 24 }}
                  >
                    <img
                      src={social.src.src}
                      alt=""
                      style={{ width: social.w, height: social.h }}
                    />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* EMAIL CAPTURE — real form, intentionally not wired to a
                backend. The rule before the button is part of the
                design, not a border on the button itself. */}
            <motion.form
              variants={riseIn}
              onSubmit={handleSubmit}
              className="flex h-[42px] w-[320px] shrink-0 items-center overflow-clip border border-solid border-[#8e8e8e]"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                placeholder="enter your mail..."
                className="h-full min-w-px flex-1 bg-transparent px-[15.5px] text-[16px] font-medium leading-[1.5] tracking-[-0.32px] text-[#cdcdcd] outline-none placeholder:text-[#cdcdcd]"
              />
              <span className="h-[30px] w-px shrink-0 bg-[#8e8e8e]" />
              <button
                type="submit"
                aria-label="Submit email address"
                className="flex h-full w-[66.5px] shrink-0 items-center justify-center transition-opacity hover:opacity-70"
              >
                {/* gg:arrow-up rotated a quarter turn to point right */}
                <img
                  src={iconArrowUp.src}
                  alt=""
                  className="rotate-90"
                  style={{ width: 24, height: 24 }}
                />
              </button>
            </motion.form>
          </div>
        </div>

        {/* ORB — the source PNG is 1254x1254 but only ever drawn at
            216x216, so next/image resizes and re-encodes it instead of
            shipping the full 1.4MB original. */}
        <motion.div variants={riseIn} className="relative size-[216px] shrink-0">
          <Image
            src={orbLogo}
            alt="Aashita"
            fill
            sizes="216px"
            className="object-cover"
            placeholder="blur"
          />
        </motion.div>

        {/* COPYRIGHT — Figma paints this as a gradient rather than a flat
            colour, so bg-clip-text puts the gradient on the glyphs and
            text-transparent lets it through. Angle/stops verbatim. */}
        <motion.p
          variants={riseIn}
          className="shrink-0 bg-clip-text whitespace-nowrap text-[16px] font-medium leading-[1.2] tracking-[-0.32px] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(-66.7652142547035deg, rgb(29, 29, 29) 22.034%, rgb(27, 27, 27) 49.686%, rgb(255, 255, 255) 66.888%)",
          }}
        >
          2026 Aashita . All Rights Reserved.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Footer;
