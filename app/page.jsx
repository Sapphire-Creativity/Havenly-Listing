import React from "react";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import PropertyLocations from "./components/PropertyLocations";
import ExploreLocations from "./components/ExploreLocations";
import TrendingSection from "./components/TrendingSection";
import GeometricMapUI from "./components/GeometricMapUI";

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
    </>
  );
};

export default page;
