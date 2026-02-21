"use client";

import React, { useMemo, useState } from "react";
import { ALL_PROPERTIES } from "../../public/assets/data";
import PropertyForBuyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";
import PropertyCard from "../components/PropertyCard";

const Rent = () => {
  const [filter, setFilter] = useState("Residential");
  const [sort, setSort] = useState("latest");

  const router = useRouter();
  const filteredProperties = useMemo(() => {
    let result = ALL_PROPERTIES.filter(
      (property) => property.status === "For Rent",
    );

    // filter by category
    result = result.filter(
      (property) =>
        property.propertyCategory?.toLowerCase().trim() ===
        filter.toLowerCase().trim(),
    );
    // sort
    if (sort === "price-low") {
      result = result.sort(
        (a, b) => a.pricing.rentPerYear - b.pricing.rentPerYear,
      );
    }

    if (sort === "price-high") {
      result = result.sort(
        (a, b) => b.pricing.rentPerYear - a.pricing.rentPerYear,
      );
    }

    if (sort === "latest") {
      result = result.sort(
        (a, b) => new Date(b.dateListed) - new Date(a.dateListed),
      );
    }
    return result;
  }, [filter, sort]);

  const handleCardClick = (property) => {
    if (!property || !property.id) return;
    router.push(`/rent/${property.id}`);
  };

  return (
    <div className="w-full bg-[#fafafa]">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="max-w-8xl mx-auto p-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Find Your Next Property With Confidence
            </h1>
            <p className="text-gray-300 text-lg">
              Explore residential, commercial, and luxury properties curated for
              rent.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 bg-white rounded-2xl shadow-xl p-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-8xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* CATEGORY */}
          <div className="flex gap-2 bg-gray-100 p-2 rounded-full w-fit">
            {["Residential", "Commercial", "Luxury"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all
                  ${
                    filter === cat
                      ? "bg-primary-accent text-white shadow"
                      : "text-gray-600 hover:bg-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-black">
                {filteredProperties.length}
              </span>{" "}
              properties found
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent"
            >
              <option value="latest">Sort: Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= LISTINGS ================= */}
      <section className=" mx-auto px-6 py-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {filter} Properties for Rent
            </h2>
            <p className="text-gray-500 mt-1">
              Handpicked listings updated regularly
            </p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                handleCardClick={handleCardClick}
                listingType="rent"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">
                No properties found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Rent;
