import React from "react";
import { useNavigate } from "react-router-dom";
import Templates from "../components/Templates";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <NavBar/>
      <Hero/>
      <HowItWorks/>
      <Templates />
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;