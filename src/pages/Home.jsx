import React from "react";
import { Hero } from "../parts/Hero";
import { HowItWorks } from "../parts/HowItWorks";
import { ProjectConfigurator } from "../parts/ProjectConfigurator";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <HowItWorks />
      <ProjectConfigurator />
    </div>
  );
};

export default Home;
