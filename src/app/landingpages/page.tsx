import React from "react";
import Navbar from "../../components/navbar/navbar";
import HeroCarousel from "../landingpages/herocarousel";
import HeroSection from "../landingpages/hero_section";
import Section from "../landingpages/section";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <HeroSection />
      <Section />
    </div>
  );
};

export default LandingPage;
