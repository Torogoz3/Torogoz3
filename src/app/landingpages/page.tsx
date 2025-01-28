import React from "react";
import Head from "next/head";
import Navbar from "../../components/navbar/navbar";
import HeroCarousel from "../landingpages/herocarousel";
import HeroSection from "../landingpages/hero_section";
import Section from "../landingpages/section";
import Footer from "./footer";
import "@fortawesome/fontawesome-svg-core/styles.css";

const LandingPage = () => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Torogoz3</title>
        
      </Head>
      <div>
        <Navbar />
        <HeroCarousel />
        <HeroSection />
        <Section />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
