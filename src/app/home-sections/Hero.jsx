"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import React from "react";
import Primarybtn from "../components/Primarybtn";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Facebook02Icon,
  InstagramIcon,
  Linkedin02Icon,
} from "@hugeicons/core-free-icons";

// Slider animation content 

const sliderContent = [
  {
    title: "Building The Future Across Industries",
    description: "",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  


  return (  
    <section className="hero min-h-screen overflow-hidden relative ">
      {/* BG VIDEO */}
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute w-full h-full object-cover opacity-20 top-0 left-0"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* CONTENT CONTAINER*/}
      <div className="flex relative z-10 px-120 w-full min-h-screen flex-col ">
        {/* HERO MAIN CONTENT */}
        <div className="pt-76">
          <h1 className="text-white text-[82px] font-regular leading-[1.2]">
            Turning bold
            <br />
            ambition into
            <br />
            <span className="text-[var(--color-primary)]">
              Operational Reality
            </span>
          </h1>

          <p className="text-[var(--color-secondwhite)] text-[28px] mt-8 leading-[1.6] max-w-[800px]">
            Orchestrating the technology, services, and AI transforming the
            world's most complex enterprises.
          </p>

          <Primarybtn />
        </div>

        {/* BOTTOM CONTENT */}

        <div className="flex justify-between mt-auto mb-20 items-end">
          {/* SOCIAL ICONS */}
          <div className=" flex gap-6 ">
            <Link href="https://www.instagram.com/aashita.ai/" target="_blank">
              <span className="flex p-4 bg-white/10 rounded-full">
                <HugeiconsIcon
                  icon={Facebook02Icon}
                  size={26}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
            <Link href="https://www.facebook.com/aashita.ai/" target="_blank">
              <span className="flex p-4 bg-white/10 rounded-full">
                <HugeiconsIcon
                  icon={InstagramIcon}
                  size={26}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/aashita.ai/"
              target="_blank"
            >
              <span className="flex p-4 bg-white/10 rounded-full">
                <HugeiconsIcon
                  icon={Linkedin02Icon}
                  size={26}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
          </div>

          {/* BOTTOM RIGHT CONTENT */}

          <div className="flex flex-col gap-4 ">
            <p className="flex items-center gap-2 text-[var(--color-greenprimary)] text-2xl text-semibold">
              <span>
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={26}
                  color="currentColor"
                  strokeWidth={2}
                  className="rotate-180"
                />
              </span>
              Building The Future Across Industries
            </p>

            <p className="text-xl max-w-[460px] text-semibold text-[var(--color-secondwhite)]">
              We build and scale organizations that solve real-world challenges
              across education, technology, healthcare, manufacturing,
              enterprise and financial services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
