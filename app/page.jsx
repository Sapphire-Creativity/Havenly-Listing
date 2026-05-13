import React from "react";
import ExploreLocations from "./(public)/components/ExploreLocations";
import TrendingSection from "./(public)/components/TrendingSection";
import GeometricMapUI from "./(public)/components/GeometricMapUI";
import ListPropertyCTA from "./(public)/components/ListPropertyCTA";
import SearchBar from "./(public)/components/SearchBar";
import Hero from "./(public)/components/Hero";
import Navbar from "./(public)/components/Navbar";
import Footer from "./(public)/components/Footer";

const page = () => {
  return (
    <>
      {/* content */}
       <Navbar />
      <Hero />    

      <ExploreLocations />
      <TrendingSection />
      <GeometricMapUI />
      <ListPropertyCTA />
      <Footer/>
    </>
  );
};

export default page;
