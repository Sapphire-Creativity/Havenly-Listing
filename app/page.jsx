import React from "react";
  import ExploreLocations from "./(public)/components/ExploreLocations";
import TrendingSection from "./(public)/components/TrendingSection";
import GeometricMapUI from "./(public)/components/GeometricMapUI";
import ListPropertyCTA from "./(public)/components/ListPropertyCTA";
import SearchBar from "./(public)/components/SearchBar";
import Hero from "./(public)/components/Hero";
 

const page = () => {
  const propertyLocation = [
    {
      name: "Lagos",
      image: "",
    },
  ];
  return (
    <>
      {/* content */}
      <Hero />
      <SearchBar />

      <ExploreLocations />

      <TrendingSection />
      <GeometricMapUI />
      <ListPropertyCTA/>
    </>
  );
};

export default page;
