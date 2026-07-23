"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Cancel01Icon,
  Facebook02Icon,
  InstagramIcon,
  Linkedin02Icon,
} from "@hugeicons/core-free-icons";

/* ------------------------------------------------------------------
   SITE HEADER

   Menu: Home / About / Products / Career / Blog, a hairline divider,
   then Contact Us — matching the About, Blog, Products and Career
   comps, which agree with each other.

   Figma's HOME comp is the lone exception: it drops "Home", adds
   "Industries", renames Career to "Careers" and sets the wordmark as
   Raleway Bold text instead of the script mark. That single frame was
   followed for a while and is not what the rest of the design does.
   Note the consequence: "Industries" has no nav entry, so /indusries
   is currently unreachable from the header.

   RESPONSIVE: no mobile comp exists for any page in this file, so the
   small-screen treatment is designed rather than transcribed. The full
   row needs ~700px before its items start colliding, so below lg it
   collapses to a toggle plus a panel. The wordmark and toggle stay in
   the bar at every width, which keeps the header a predictable height —
   every hero positions artwork against it.

   Absolutely positioned so heroes can run artwork up underneath it.
   ------------------------------------------------------------------ */

/* Moved here from the home hero ("for now", per request) — living in
   the header means they appear on every page, not just home. */
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

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Career", href: "/career" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  /* Persistent nav, enterprise-style: transparent while the hero owns
     the top of the screen, gaining a blurred dark surface once content
     starts passing underneath — without it, white nav labels land on
     whatever the page happens to scroll to. 24px of travel is enough
     to know the user has left the top; listening passively keeps the
     scroll handler off the layout path. */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* A fixed panel over a scrollable page lets the body scroll behind
     it, which reads as the menu drifting. Locking the body is the
     standard fix, and it is released on unmount so a route change can
     never strand the page unscrollable. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed z-50 h-fit w-full transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#012532]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Same box as Container, borrowed rather than re-typed, so the
          header can never drift out of line with the content below it. */}
      <nav className="mx-auto flex w-full max-w-[var(--frame)] items-center justify-between gap-[24px] bg-transparent px-[var(--gutter)] py-[24px] lg:gap-[40px]">
        <Link href="/" aria-label="Aashita — home" className="shrink-0">
          <Image
            src="/logo/Aashita_logo.svg"
            alt="Aashita"
            width={103}
            height={33}
            priority
            className="h-[28px] w-auto lg:h-[33px]"
          />
        </Link>

        {/* DESKTOP ROW — hidden below lg rather than allowed to wrap.
            Wrapping would make the header taller and shift every hero
            that positions artwork against its height. */}
        <ul className="hidden items-center gap-[34px] text-[20px] font-normal leading-[1.52] tracking-[-0.4px] text-white lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {/* Underline grows from the left on hover — a drawn
                  line reads more deliberate than a fade. */}
              <Link
                href={link.href}
                className="relative pb-[2px] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#0cffd7] after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-[32px] lg:flex xl:gap-[48px]">
          <span aria-hidden className="h-[30px] w-px bg-[#2dfbd9]" />
          <Link
            href="/contact-us"
            className="whitespace-nowrap text-[22px] font-medium leading-[1.46] tracking-[-0.44px] text-[#2dfbd9] transition-opacity duration-200 hover:opacity-80"
          >
            Contact Us
          </Link>

          {/* SOCIALS — the hero's 36px circles (20px glyph + 8px pad),
              unchanged, just relocated. */}
          <div className="flex items-center gap-[10px]">
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex items-center justify-center rounded-full bg-white/10 p-[8px] transition-colors duration-200 hover:bg-white/20"
              >
                <HugeiconsIcon
                  icon={social.icon}
                  size={20}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="text-white"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* A real button with aria-expanded and aria-controls, so the
            panel's state is announced rather than inferred from a glyph. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex shrink-0 items-center justify-center rounded-full bg-white/10 p-[10px] text-white lg:hidden"
        >
          <HugeiconsIcon
            icon={open ? Cancel01Icon : Menu01Icon}
            size={22}
            color="currentColor"
            strokeWidth={1.8}
          />
        </button>
      </nav>

      {/* MOBILE PANEL — full-screen rather than a dropdown, because the
          heroes behind it are bright animated artwork and a translucent
          dropdown over that is unreadable. */}
      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col gap-[8px] bg-[#012532]/95 px-[var(--gutter)] pb-[40px] pt-[100px] backdrop-blur-md lg:hidden"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-[18px] text-[24px] font-normal text-white"
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/contact-us"
          onClick={() => setOpen(false)}
          className="mt-[24px] text-[24px] font-medium text-[#2dfbd9]"
        >
          Contact Us
        </Link>

        <div className="mt-[24px] flex items-center gap-[10px]">
          {SOCIALS.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex items-center justify-center rounded-full bg-white/10 p-[8px] text-white"
            >
              <HugeiconsIcon
                icon={social.icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
