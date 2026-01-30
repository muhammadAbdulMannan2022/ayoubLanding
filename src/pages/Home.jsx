import React from "react";
import { Hero } from "../parts/Hero";
import { HowItWorks } from "../parts/HowItWorks";
import { ProjectConfigurator } from "../parts/ProjectConfigurator";
import { TrustSection } from "../parts/TrustSection";
import { Testimonials } from "../parts/Testimonials";
import { CTA } from "../parts/CTA";
import { Footer } from "../parts/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <HowItWorks />
      <ProjectConfigurator />
      <TrustSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
