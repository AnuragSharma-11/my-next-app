"use client";
import React, { useRef } from "react";
import Primarybtn from "../components/Primarybtn";
import { useScroll, useTransform  } from "motion/react";

const Overview = () => {
  const sectionRef = useRef(null);

  const {scrollYProgress} = useScroll({
    target:sectionRef,
    offset:["start start", "end end"],
  });

  const imageWidth = useTransform(scrollYProgress, [0, 0.7], ["100%", "calc(100vw - 240px)"]);

  return (
    <section className="overview h-[300vh] relative" ref={sectionRef}>
      {/*CONTENT CONTAINER */}
      <div className="sticky top-0 h-screen  z-10 px-120 py-20 ">
        {/* TOP CONTENT */}
        <div className="grid grid-cols-[380px_1fr] gap-[80px] items-start">
          {/* TOP LEFT CONTENT */}
          <div className="inline">
            <span className="flex items-center gap-4 ">
              <span className="tag_line h-1 w-11"></span>
              <p className="text-[var(--color-tagcolor)] text-[24px] font-semibold leading-[1.5]">
                OVERVIEW
              </p>
            </span>
          </div>

          {/* TOP RIGHT HEADING CONTENT */}
          <div className="flex flex-col gap-16 ">
            <h2 className="text-[64px] leading-[1.2] max-w-[900px]">
              We build businesses <br /> Designed for decades, Not <br />{" "}
              Projects.
            </h2>
            {/* PRIMARY BUTTON  */}
            <Primarybtn text="Overview" href="/overview" />
          </div>
        </div>

        {/* BOTTOM CONTENT CONTAINER */}
        <div className="grid grid-cols-[380px_1fr] gap-[80px] mt-40 items-start">
          {/* LEFT CONTENT */}
          <div className="flex flex-col h-full justify-between">
            <span className="flex flex-col gap-12">
              {/* FIRST HEADING */}
              <p className="text-[24px] font-medium text-white leading-[1.5]">
                Founded in 2012 by Mr. Pankaj Gupta in Jaipur, India, we have
                grown from our local roots into a global presence, expanding
                rapidly across India, China, Indonesia, and Vietnam.
              </p>
              {/* SECOND HEADING */}
              <p className="text-[24px] font-medium text-white leading-[1.5]">
                <span className="font-bold text-[26px] leading-[1.5]">
                  Our mission :
                </span>
                <br /> is simple to build innovative businesses that create new
                opportunities and shape a better and equitable future for
                everyone. We design our solutions to last for decades, not just
                for today.
              </p>
            </span>
            {/* END LINE */}
            <div className="endline w-30 h-2"></div>
          </div>
          {/* RIGHT CONTENT IMAGE CONTAINER */}
          <div className="w-full ">
            <img
              src="/Home-Page-assets/Images/Overview-image.png"
              className="w-full h-full object-cover "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
