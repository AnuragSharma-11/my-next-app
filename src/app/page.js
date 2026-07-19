import React from "react";
import Hero from "./home-sections/Hero";
import Overview from "./home-sections/Overview";
import Footer from "./components/Footer";

const page = () => {
  return (
    <>
      <Hero />
      <Overview />
      <Footer />
    </>
  );
};

export default page;
