"use client";

import React, { useEffect, useState } from "react";
import { ALL_PROPERTIES } from "../../../public/assets/data";
 
const Listings = () => {
  const [propertyFilter, setPropertyFilter] = useState(null);
  // Filter function

  const filteredProperties = ALL_PROPERTIES.filter(
    (property) => property.listingType === "buy"
  );

  const getPropertiesInLagos = ALL_PROPERTIES.filter(
    (property) => property.state === "lagos"
  );

  const getAffordableShortlet = ALL_PROPERTIES.filter(
    (property) =>
      property.listingType.toLowerCase() ||n
      (property.propertyCategory.toLowerCase === "shortlet" &&
        property.pricing.nightlyRate <= 100000)
  );

  return (
    <div className="h-screen bg-white">
      {/* Listings for buy
      {filteredProperties.map((item) => (
        <div key={item.id}>
          <h2>{item.propertyTitle}</h2>
          <h2>{item.listingType}</h2>
        </div>
      ))}
      Listings in lagos
      {getPropertiesInLagos.map((item) => (
        <div key={item.id}>
          <h2>{item.propertyTitle}</h2>
          <h2>{item.listingType}</h2>
          <h2>{item.location}</h2>
        </div>
      ))} */}

      <hr />

      Shortlet under 100,000
      {getAffordableShortlet.map((item) => (
        <div key={item.id}>
          <h2>{item.propertyTitle}</h2>
          <h2>{item.listingType}</h2>
          <h2>{item.location}</h2>
          <h2>{item.pricing.nightlyRate}</h2>
        </div>
      ))}
    </div>
  );
};

export default Listings;
