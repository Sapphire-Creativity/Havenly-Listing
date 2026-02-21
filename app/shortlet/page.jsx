"use client";

import React, { useMemo, useState } from "react";
import { ALL_PROPERTIES } from "../../public/assets/data";
import PropertyForBuyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";
import PropertyCard from "../components/PropertyCard";

const Shortlet = () => {
  const [filter, setFilter] = useState("Shortlet Stay");
  const [sort, setSort] = useState("latest");

  const router = useRouter();

  const shortletPropertyTypes = [
    ...new Set(
      ALL_PROPERTIES.filter((property) => property.status === "Shortlet").map(
        (property) => property.propertyType,
      ),
    ),
  ];

  const filteredProperties = useMemo(() => {
    let data = ALL_PROPERTIES.filter(
      (property) => property.status === "Shortlet",
    );

    // filter by category

    data = data.filter(
      (property) =>
        property.propertyType?.toLocaleLowerCase().trim() ===
        filter.toLowerCase().trim(),
    );

    if (sort === "price-low") {
      data = data.sort((a, b) => a.pricing.nightlyRate - b.pricing.nightlyRate);
    }
    if (sort === "price-high") {
      data = data.sort((a, b) => b.pricing.nightlyRate - a.pricing.nightlyRate);
    }
    if (sort === "latest") {
      data = data.sort(
        (a, b) => new Date(b.dateListed) - new Date(a.dateListed),
      );
    }

    return data;
  }, [filter, sort]);

  const handleCardClick = (property) => {
    if (!property || !property.id) return;
    router.push(`/shortlet/${property.id}`);
  };

  return (
    <div className="w-full bg-[#fafafa]">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="max-w-8xl mx-auto p-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Find Your Shortlet Stay With Confidence
            </h1>
            <p className="text-gray-300 text-lg">
              Explore shortlet properties curated for you.
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
        <div className="flex gap-2 overflow-x-auto scrollbar-hide bg-gray-100 p-2 rounded-2xl max-w-full">
          {/* CATEGORY */}
          <div className="whitespace-nowrap shrink-0 px-4 py-3 flex gap-2 bg-gray-100 text-sm font-semibold rounded-full">
            {shortletPropertyTypes.map((cat) => (
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
              {filter} Properties
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
                listingType="shortlet"
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

export default Shortlet;
