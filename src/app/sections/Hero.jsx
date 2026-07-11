import React from "react";

const Hero = () => {
  return (
    <section className="hero min-h-screen overflow-hidden relative flex items-center justify-center">
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
    <div className="relative gap-8 items-center z-10 px-120px w-full min-h-screen ">
        <h1 className = "text-white text-5xl">Hero section</h1>
    </div>
    </section>
  );
};

export default Hero;
