"use client";
// import React, { useRef } from "react";
import Primarybtn from "../components/Primarybtn";
// import { useScroll, useTransform, useSpring, motion } from "motion/react";

const Overview = () => {
  // const sectionRef = useRef(null);

  // // const { scrollYProgress } = useScroll({
  // //   target: sectionRef,
  // //   offset: ["start start", "end end"],
  // // });

  // const imageWidth = useTransform(
  //   scrollYProgress,
  //   [0.15, 0.65],
  //   ["100%", "calc(100vw - 240px)"],
  // );

  // const imageHight = useTransform(
  //   scrollYProgress,
  //   [0.15, 0.65],
  //   ["520px", "100vh"]
  // );

  // // const imageX = useTransform(scrollYProgress, [0.25, 0.65], [0, -320]);

  // // const imageY = useTransform(scrollYProgress, [0.25, 0.65], [0, -40]);

  // const smoothProgress = useSpring(scrollYProgress, {
  //   stiffness: 120,
  //   damping: 15,
  //   mass:0.4
  // });

  return (
    <section className="overview h-[300vh] relative">
      {/*CONTENT CONTAINER */}
      <div className="sticky top-0 h-screen px-120 py-20 ">

        {/* TOP CONTENT IN GRID*/}
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

        {/* ----BOTTOM CONTENT CONTAINER---- */}

        <div className="grid grid-cols-2 grid-cols-[380px_1fr] flex gap-[80px] mt-40 h-[620px]">

          {/* LEFT CONTENT */}
          <div className="w-[380px] flex flex-col h-full justify-between">
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
          <div
            className="top-0 overflow-hidden"
            // style={{
            //   // width: imageWidth,
            //   // height: imageHight,
            // }}
          >
            <img
              src="/Home-Page-assets/Images/Overview-image.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* bottom structure end */}
      </div>
    </section>
  );
};
export default Overview;
