import React from "react";
import Templates from "../components/Templates";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
const Home = () => {
  return (
    <>
      <NavBar/>
      <Hero/>
      <HowItWorks/>
      <Templates />
    </>
  );
};

export default Home;