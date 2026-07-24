"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import Container from "../../../components/Container";
import PillButton from "../../../components/PillButton";

import saveShareIcons from "../assets/role-summary/save-share-icons.svg";
import caret from "../assets/role-summary/caret.svg";
import plus from "../assets/role-summary/plus.svg";
import minus from "../assets/role-summary/minus.svg";

/* ==================================================================
   ROLE SUMMARY  (Figma 1:4989 "Hero container", 1200x2604)

   WHY THIS HERO IS 2604px TALL

   It is not decorative overrun and it is not scroll-revealed content.
   The frame is tall because it carries the entire job posting: a
   380px title block, then a 2048px accordion stack whose first panel
   (JOB DESCRIPTION, 1:5013) is authored OPEN and runs to 1660px of
   prose on its own. The remaining four panels are collapsed 81px
   bars. 120 + 380 + 86 + 2048 = 2634, less the 90px bottom inset.

   So this is a plain document hero. The only motion it wants is the
   accordion itself plus a scroll-in for the title block.
   ================================================================== */

/* ------------------------------------------------------------------
   TYPE SCALE

   Figma reports each text node's height as fontSize x lineHeight, and
   every paragraph in the open panel lands on an exact multiple of 35:
   one line 35, the description 140 (4), the summary 210 (6), the
   responsibilities block 875 (25). 20px at 1.75 is the only pairing
   that produces 35 while matching the 20px body size used site-wide,
   so the long prose gets a deliberately generous measure rather than
   the 1.5 leading the rest of the site uses.
   ------------------------------------------------------------------ */
const PANEL_LEADING = "leading-[1.75]";

/* ------------------------------------------------------------------
   COPY — verbatim from the comp.

   Two things worth knowing before anyone edits this:

   1. The comp applies text-transform: capitalize to the whole panel
      body ("Responsible For Developing And/Or Engineering..."). The
      strings below are therefore stored in real sentence case and the
      Title Case is produced by CSS. That keeps the source copy
      readable and correctable without fighting the design.

   2. This is placeholder copy for one specific requisition. It is
      driven from these arrays so replacing it with a real posting —
      or wiring it to a CMS — is a one-place edit rather than a hunt
      through JSX.
   ------------------------------------------------------------------ */

const ROLE = {
  title: "Full Stack Engineer",
  meta: [
    ["Custom Software Engineering Team Lead/Consultant", "Full Time", "Experience: 5-10 Years"],
    ["Location: Jaipur", " Required Skill: Internet of Things (IoT) Platforms"],
  ],
};

/* Label/value pairs render as a definition list — this is exactly the
   term-and-description shape the markup exists for. */
const FACTS = [
  {
    term: "Project Role",
    detail:
      "Full Stack Engineer",
  },
  {
    term: "Project Role Description",
    detail:
      "Responsible for developing and/or engineering the end-to-end features of a system, from user experience to backend code. Use development skills to deliver innovative solutions that help our clients improve the services they provide. Leverage new technologies that can be applied to solve challenging business problems with a cloud first and agile mindset.",
  },
  {
    term: "Must have skills",
    detail: "Internet of Things (IoT) Platforms",
  },
  {
    term: "Good to have skills",
    detail:
      "Python (Programming Language), Amazon Web Services (AWS), React.js",
  },
  /* These two carry no colon in the comp, so they render as plain
     statements rather than term/value rows. */
  { statement: "Minimum 5 year(s) of experience is required" },
  {
    term: "Educational Qualification",
    detail: "15 years full time education",
  },
];

const SUMMARY =
  "The Full Stack Developer is responsible for designing, developing, testing, and deploying robust web applications and APIs, leveraging Python (with AWS Lambda), React JS, and MongoDB. This role requires hands-on expertise in both backend and frontend development, cloud-native architectures, and secure coding practices. The developer will collaborate with cross-functional teams to deliver scalable, high-quality solutions aligned with organizational standards.";

/* The comp ships this as ONE text node with hard line breaks. It is a
   numbered set of headed bullet lists, so it is stored — and rendered
   — as one, with real <ul>/<li>. */
const RESPONSIBILITIES = [
  {
    heading: "1. Application Development",
    items: [
      "Design, develop, and maintain backend services using Python, AWS Lambda, and API Gateway.",
      "Build and enhance frontend interfaces using React JS, ensuring responsive and intuitive user experiences.",
      "Integrate MongoDB for data storage and retrieval, optimizing queries for performance and scalability.",
      "Implement unit testing for both backend and frontend components to ensure code quality and reliability.",
      "Write secure code, following best practices for authentication, authorization, and data protection.",
    ],
  },
  {
    heading: "2. Cloud & DevOps",
    items: [
      "Utilize AWS components (Lambda, API Gateway, S3, IAM, CloudWatch, etc.) for application deployment and monitoring.",
      "Collaborate with DevOps teams to automate build, test, and deployment pipelines.",
      "Monitor application performance and troubleshoot issues in cloud environments.",
    ],
  },
  {
    heading: "3. Collaboration & Agile Delivery",
    items: [
      "Work closely with product owners, designers, and other developers in Agile ceremonies (sprint planning, stand-ups, reviews, retrospectives).",
      "Participate in backlog grooming, task estimation, and sprint execution.",
      "Communicate progress, risks, and dependencies to project leads.",
    ],
  },
  {
    heading: "4. Code Quality & Best Practices",
    items: [
      "Conduct code reviews and ensure adherence to coding standards, documentation, and security guidelines.",
      "Leverage GitHub Copilot to accelerate development and maintain high code quality.",
      "Continuously improve development processes and share knowledge with the team.",
    ],
  },
];

/* The four trailing panels are authored collapsed with no body copy in
   the file. They are listed here so the accordion is driven by data
   and a real body is a one-line addition. */
const PANELS = [
  { id: "job-description", label: "JOB DESCRIPTION" },
  { id: "qualification", label: "qualification" },
  { id: "additional-information", label: "Additional information" },
  { id: "about-aashita", label: "About AASHITA" },
  { id: "important-notice", label: "iMPORTAnt Notice" },
];

/* ------------------------------------------------------------------
   MOTION — the title block only.

   Same stage/riseIn pair the rest of the site uses, so the entrance
   here reads as the same gesture as About_Origin rather than a second
   dialect. The accordion is user-driven and deliberately excluded.
   ------------------------------------------------------------------ */
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const CareerDetail_RoleSummary = () => {
  /* The comp ships panel one open, and a job posting whose description
     is hidden behind a click is a worse page, so that is the initial
     state rather than all-collapsed. */
  const [open, setOpen] = useState("job-description");

  return (
    <section className="career-detail-role-summary relative w-full pb-[90px] pt-[120px]">
      <Container className="flex flex-col gap-[86px]">
        {/* ROLE HEADER */}
        <motion.div
          className="flex flex-col gap-[40px]"
          variants={stage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="flex flex-col gap-[24px]">
            <motion.div
              variants={riseIn}
              className="flex w-full items-center justify-between gap-[16px]"
            >
              {/* nowrap is the comp's, and at 1440 the title still fits
                  the row beside the save/share pair. Below that it is the
                  single widest thing on the page, so the nowrap is lifted
                  and the token's clamp takes the size down with it — the
                  wrap is cheaper than a sideways scroll on the page's own
                  h1. Size itself is the shared --text-heading token. */}
              <h1 className="min-w-px flex-1 text-[length:var(--text-heading)] font-medium leading-[1.2] text-white [word-break:break-word] lg:whitespace-nowrap">
                {ROLE.title}
              </h1>

              {/* SAVE / SHARE — Figma exports both glyphs plus their
                  outlines as a single 87x52 frame, so there is no way
                  to split them into two real controls without redrawing
                  vector data we do not have. Decorative until the
                  orchestrator wires actual save/share behaviour.
                  preserveAspectRatio="none" on the export means both
                  axes must be pinned or the pair stretches. */}
              <img
                src={saveShareIcons.src}
                alt=""
                aria-hidden="true"
                className="h-[52px] w-[87px] shrink-0"
              />
            </motion.div>

            <motion.div
              variants={riseIn}
              className="flex flex-col gap-[12px] text-[18px] font-medium leading-[1.5] tracking-[-0.36px] text-[#e3e3e3]"
            >
              {ROLE.meta.map((row, r) => (
                <div key={r} className="flex flex-wrap items-start gap-[20px]">
                  {row.map((fact, i) => (
                    <span key={i} className="flex items-start gap-[12px] lg:gap-[20px]">
                      {/* Each fact is nowrap in the comp so the rule
                          glyphs land between whole phrases. The longest
                          ("Custom Software Engineering Team
                          Lead/Consultant") is ~400px, i.e. wider than a
                          375 viewport on its own, so below lg the phrase
                          is allowed to break internally. */}
                      <span className="lg:whitespace-nowrap">{fact}</span>
                      {/* The rule between facts is presentational, so it
                          is a styled span rather than a literal "|"
                          glyph that a screen reader would announce. */}
                      {i < row.length - 1 && (
                        <span aria-hidden="true" className="text-[20px] tracking-[-0.4px]">
                          |
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={riseIn}>
            {/* Figma's 1:5009 is the same 240x50 pill as every other
                button on this site — outlined, with a gradient twin
                parked below centre. Both faces carry the same label
                here because the comp does. */}
            <PillButton
              label="Apply for this job"
              hoverLabel="Apply for this job"
              href="/career"
              width={240}
            />
          </motion.div>
        </motion.div>

        {/* JOB DETAIL ACCORDION */}
        <div className="flex flex-col gap-[16px]">
          {PANELS.map((panel) => {
            const isOpen = open === panel.id;

            return (
              <div
                key={panel.id}
                /* One frosted shell for both states. Figma authors the
                   open and closed panels as separate frames, but every
                   surface value matches — 30px radius, white/16 ground,
                   5px backdrop blur, white/16 hairline and the same
                   inset 20px glow — so they are one component with one
                   ground rather than two that can drift apart. */
                className="relative overflow-hidden rounded-[30px] border border-solid border-white/16 bg-white/16 backdrop-blur-[5px] [box-shadow:inset_0_0_20px_0_rgba(255,255,255,0.16)]"
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : panel.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${panel.id}-panel`}
                    className="flex w-full items-center justify-between p-[24px] text-left"
                  >
                    <span className="flex items-center gap-[10px]">
                      {/* The 8x6 caret is authored rotate-90 (pointing
                          right) when closed. Turning it a further 90
                          on open is the cheapest possible open/close
                          affordance and costs no second asset. */}
                      <motion.img
                        src={caret.src}
                        alt=""
                        aria-hidden="true"
                        className="h-[6px] w-[8px] shrink-0"
                        animate={{ rotate: isOpen ? 180 : 90 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span
                        className={`whitespace-nowrap uppercase leading-[1.5] text-white ${
                          isOpen
                            ? "text-[24px] font-semibold tracking-[-0.48px]"
                            : "text-[22px] font-medium tracking-[-0.44px]"
                        }`}
                      >
                        {panel.label}
                      </span>
                    </span>

                    {/* Two separate 24x24 exports rather than one glyph
                        rotated, because the comp's minus is not the
                        plus with a bar removed — they are drawn
                        differently. */}
                    <img
                      src={isOpen ? minus.src : plus.src}
                      alt=""
                      aria-hidden="true"
                      className="size-[24px] shrink-0"
                    />
                  </button>
                </h2>

                <AnimatePresence initial={false}>
                  {isOpen && panel.id === "job-description" && (
                    <motion.div
                      id={`${panel.id}-panel`}
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`flex flex-col gap-[22px] px-[24px] pb-[24px] text-[20px] capitalize text-white ${PANEL_LEADING}`}
                      >
                        {/* ROLE FACTS */}
                        <dl className="flex flex-col gap-[22px]">
                          {FACTS.map((fact, i) =>
                            fact.statement ? (
                              <dt key={i} className="font-semibold">
                                {fact.statement}
                              </dt>
                            ) : (
                              <div key={i} className="flex flex-wrap gap-x-[6px]">
                                <dt className="font-semibold">{fact.term} :</dt>
                                <dd className="flex-1 font-normal text-[#e3e3e3]">
                                  {fact.detail}
                                </dd>
                              </div>
                            ),
                          )}
                        </dl>

                        {/* SUMMARY */}
                        <div className="flex flex-col">
                          <h3 className="font-semibold">Summary:</h3>
                          <p className="font-normal text-[#e3e3e3]">{SUMMARY}</p>
                        </div>

                        {/* RESPONSIBILITIES */}
                        <div className="flex flex-col gap-[22px]">
                          <h3 className="font-semibold">
                            Roles &amp; Responsibilities:
                          </h3>

                          {RESPONSIBILITIES.map((group) => (
                            <div key={group.heading} className="flex flex-col">
                              <h4 className="font-semibold">{group.heading}</h4>
                              {/* A real list. The comp draws the dashes
                                  as literal characters inside one text
                                  node; a marker::before reproduces them
                                  exactly while keeping the semantics. */}
                              <ul className="flex flex-col font-normal text-[#e3e3e3]">
                                {group.items.map((item) => (
                                  <li
                                    key={item}
                                    className="pl-[14px] -indent-[14px] before:content-['-_']"
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default CareerDetail_RoleSummary;
