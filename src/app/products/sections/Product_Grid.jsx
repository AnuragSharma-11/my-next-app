"use client";
import Image from "next/image";
import { motion } from "motion/react";

import ProductCard from "../components/ProductCard";

import torusRing from "../assets/product-grid/torus-ring.png";
import cardEducation from "../assets/product-grid/card-education.png";
import cardTechnology from "../assets/product-grid/card-technology.png";
import cardEnterprise from "../assets/product-grid/card-enterprise.png";
import cardFinance from "../assets/product-grid/card-finance.png";
import glowEllipse from "../assets/product-grid/glow-ellipse.svg";
import iconCard from "../assets/product-grid/icon-card.svg";
import cardBlob from "../assets/product-grid/card-blob.svg";
import dot from "../assets/product-grid/dot.svg";

/* ------------------------------------------------------------------
   MOTION

   This section has no Figma variants, so there is no authored
   animation to reproduce. That makes scroll-reveal the honest choice:
   it respects the reading order the layout already implies instead of
   inventing motion the designer never asked for.

   whileInView + viewport.once means it plays as the section arrives
   and then stays put — no replay on every scroll pass, which reads as
   nervous on a long page like this one.
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

/* The six cards differ only in copy and in where their artwork is
   cropped, so both live as data. A seventh product is a content edit
   here, not a markup change.

   Two screenshots are reused across four cards at different crop
   boxes — education/healthcare share one device shot, technology/
   manufacturing share another — so the imports are referenced twice
   rather than duplicated on disk. */
const PRODUCTS = [
  {
    title: "Education",
    blurb: "Building the future of learning with intelligent solutions.",
    blurbWidth: 171,
    image: cardEducation,
    imageAlt: "A student learning with an AI tutor on a phone",
    imageStyle: { left: 223, top: 44, width: 172, height: 250 },
    imageClassName: "shadow-[2px_2px_20px_0px_rgba(3,158,134,0.2)]",
    imageSizes: "172px",
    glow: true,
  },
  {
    title: "Technology",
    blurb: "Powering digital transformation with scalable and secure solutions.",
    blurbWidth: 194,
    image: cardTechnology,
    imageAlt: "A robotic arm on an automated production line",
    imageStyle: { left: 218, top: 59, width: 167, height: 208 },
    imageClassName:
      "rounded-[30px] border-4 border-solid border-white shadow-[2px_2px_20px_0px_rgba(3,158,134,0.2)]",
    imageSizes: "167px",
  },
  {
    title: "Healthcare",
    blurb: "Intelligent care systems for better diagnosis, treatment and outcomes.",
    blurbWidth: 171,
    image: cardEducation,
    imageAlt: "A care assistant app running on a phone",
    imageStyle: { left: 223, top: 44, width: 172, height: 250 },
    imageClassName: "shadow-[2px_2px_20px_0px_rgba(3,158,134,0.2)]",
    imageSizes: "172px",
  },
  {
    title: "Manufacturing",
    blurb:
      "Smart manufacturing solutions to optimize operations and improve productivity.",
    blurbWidth: 171,
    image: cardTechnology,
    imageAlt: "A factory floor dashboard tracking production and efficiency",
    imageStyle: { left: 226, top: 67, width: 167, height: 208 },
    imageClassName:
      "rounded-[30px] border-4 border-solid border-white shadow-[2px_2px_20px_0px_rgba(3,158,134,0.2)]",
    imageSizes: "167px",
  },
  {
    title: "Enterprise",
    blurb: "Enabling intelligent business operations with data-driven insights.",
    blurbWidth: 171,
    image: cardEnterprise,
    imageAlt: "A business overview dashboard showing revenue by department",
    imageStyle: { left: 189, top: 71, width: 231, height: 197 },
    imageClassName:
      "rounded-[16px] shadow-[2px_2px_20px_0px_rgba(3,158,134,0.2)]",
    imageSizes: "231px",
  },
  {
    title: "Finance",
    blurb:
      "Building trust and driving growth with secure and intelligent financial solutions.",
    blurbWidth: 171,
    image: cardFinance,
    imageAlt: "A banking app showing an account balance and recent transactions",
    imageStyle: { left: 219, top: 41, width: 182, height: 266 },
    imageClassName: "shadow-[2px_2px_20px_0px_rgba(32,32,32,0.2)]",
    imageSizes: "182px",
  },
];

const Product_Grid = () => {
  return (
    <section
      className="product-grid relative w-full overflow-hidden drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(1, 23, 32) 0%, rgb(2, 83, 75) 49.971%, rgb(4, 125, 107) 74.981%, rgb(2, 197, 165) 100%)",
      }}
    >
      {/* DECORATIVE CORNER — a blurred disc behind a rotated torus.
          Both hang above this section's top edge, so overflow-hidden on
          the section is what keeps the seam invisible.

          The glow's export canvas is 606px for a 286px node: Figma pads
          the file to hold the 80px gaussian, so the art is inset ~56%
          from its own bounds. Positioning the 286px box would clip the
          bloom, so the full 606px canvas is placed and offset by that
          same 160px on both axes to land the disc where Figma has it. */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[1440px] -translate-x-1/2">
        <img
          src={glowEllipse.src}
          alt=""
          aria-hidden="true"
          className="absolute left-[912px] top-[-238px] h-[606px] w-[606px]"
        />
        {/* Rotation lives on an inner element because rotating the
            positioned box would move it; the wrapper holds the spot and
            the child only spins. */}
        <div className="absolute left-[980.71px] top-[-252.29px] flex h-[722.093px] w-[722.093px] items-center justify-center">
          <div className="relative h-[571.797px] w-[571.797px] rotate-[-108.25deg]">
            <Image
              src={torusRing}
              alt=""
              aria-hidden="true"
              fill
              sizes="572px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <motion.div
        className="relative z-10 mx-auto w-[1440px] max-w-full px-[120px] pb-[116px] pt-[90px]"
        variants={stage}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* HEADING ROW — display type and intro on the left, eyebrow
            pinned top-right. items-start keeps the eyebrow on the
            heading's first baseline regardless of how the copy wraps. */}
        <div className="flex w-full items-start gap-[16px]">
          <div className="flex min-w-px flex-1 flex-col gap-[24px] [word-break:break-word]">
            <motion.h2
              variants={riseIn}
              className="w-[623px] max-w-full text-[52px] font-normal leading-[1.2] text-white"
            >
              Every Product Solves
              <br />A Different Challenge
            </motion.h2>

            <motion.p
              variants={riseIn}
              className="w-[525px] max-w-full text-[22px] font-medium leading-[1.5] tracking-[-0.44px] text-[#e3e3e3]"
            >
              From education to enterprise, our products solve real-world
              challenges with intelligent solutions.
            </motion.p>
          </div>

          <motion.div
            variants={riseIn}
            className="flex shrink-0 items-center gap-[16px]"
          >
            <span className="h-[4px] w-[22px] shrink-0 bg-[#e3e3e3]" />
            <p className="whitespace-nowrap text-[22px] font-semibold leading-[1.5] tracking-[-0.44px] text-[#0cffd7]">
              EXPLORE OUR PRODUCTS
            </p>
          </motion.div>
        </div>

        {/* CARD GRID — two rows of three at a 22px gutter. flex-wrap
            rather than grid because each card already declares its own
            fixed height, so there is no row sizing left for grid to
            solve, and wrapping degrades more gracefully if the viewport
            cannot hold three across. */}
        <div className="mt-[160px] flex w-full flex-wrap gap-[22px]">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.title}
              {...product}
              icon={iconCard}
              blob={cardBlob}
              dot={dot}
              variants={riseIn}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Product_Grid;
