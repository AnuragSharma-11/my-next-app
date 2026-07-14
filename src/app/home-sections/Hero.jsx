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
    description:
      "We build and scale organizations that solve real-world challenges across education, technology, healthcare, manufacturing, enterprise and financial services.",
  },
  {
    title: "Empowering Future-Ready Learners",
    description:
      "We build education platforms that help students, educators and institutions achieve better outcomes through technology, intelligence and personalized learning experiences.",
  },
  {
    title: "Building Intelligent Digital Products",
    description:
      "From SaaS platforms and enterprise software to AI-native applications, we create technology products designed to solve real-world business challenges at scale.",
  },
  {
    title: "Advancing Healthcare Through Innovation",
    description:
      "We are building healthcare ecosystems that combine medical expertise, technology and compassionate care to improve patient outcomes and accessibility.",
  },
  {
    title: "Engineering Industrial Excellence",
    description:
      "We develop and support manufacturing businesses focused on operational efficiency, product quality and sustainable industrial growth.",
  },
  {
    title: "Transforming Organizations For The Future",
    description:
      "We help build intelligent enterprise ecosystems powered by automation, data and AI, enabling organizations to operate smarter and scale faster.",
  },
  {
    title: "Creating Trust Through Financial Innovation",
    description:
      "We build financial platforms and services that enhance accessibility, transparency and security while enabling sustainable economic growth.",
  },
  {
    title: "Building The Future Across Industries",
    description:
      "We build and scale organizations that solve real-world challenges across education, technology, healthcare, manufacturing, enterprise and financial services.",
  },
];

// CONTAINER HEIGHT

const ITEM_HEIGHT = 223;

// HERO COMPONENT

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % sliderContent.length;
      });
    }, 4000);

    // TIMER STOP WHEN HERO MOUNT;
    return () => clearInterval(interval);
  }, []);

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

          <div className="mt-24"> 
            <Primarybtn text="How we do it" href="/contact-us" />
            </div>
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

          <div
            className="h-[223px] w-[480] overflow-hidden"
            style={{ height: ITEM_HEIGHT }}
          >
            <motion.div  animate={{ y: -(currentIndex * ITEM_HEIGHT), }}
              transition={{ duration: 1.2, ease: [0.76, 0.0, 0.24, 1.0], }} 
              >
             
              {/* CONTENT ITEMS */}
              {sliderContent.map((item, index) => (
                <div key={index} className="h-[223px] flex flex-col justify-end align-right">
                  <p className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      size={26}
                      strokeWidth={3}
                      className="rotate-180 text-[var(--color-greenprimary)]"
                    />

                    <span className="text-[24px] text-[var(--color-greenprimary)] font-semibold leading-[1.2]">{item.title}</span>
                  </p>

                  <p className="text-[20px] font-medium leading-[1.5]">{item.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
