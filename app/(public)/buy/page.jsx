"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import { supabase } from "../../../lib/supabase";
import { searchProperties } from "../../../lib/searchProperties";

const CATEGORIES = ["All", "Residential", "Commercial", "Luxury"];

const BuyContent = () => {
  const [filter, setFilter] = useState("Residential");
  const [sort, setSort] = useState("latest");
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString(); // changes whenever the search bar submits

  useEffect(() => {
    let cancelled = false;

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const sp = new URLSearchParams(searchKey);
        const result = await searchProperties({
          listingType: "buy",
          category: filter === "All" ? "" : filter,
          q: sp.get("q") || "",
          propertyType: sp.get("ptype") || "",
          minBeds: sp.get("beds") || "",
          minPrice: sp.get("minPrice") || "",
          maxPrice: sp.get("maxPrice") || "",
          availableOnly: true,
          sort,
          pageSize: 60,
        });
        if (!cancelled) {
          setProperties(result.properties);
          setTotal(result.total);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProperties();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel("properties-changes-buy")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => fetchProperties(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [filter, sort, searchKey]); // re-fetch when category, sort or search changes

  const handleCardClick = (property) => {
    if (!property || !property.id) return;
    router.push(`/buy/${property.id}`);
  };

  const isSearching = searchKey !== "";

  return (
    <div className="w-full bg-[#fafafa]">
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('../assets/property.png')",
          }}
        />

        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f4635]/90 via-[#2f6b4f]/85 to-[#2f6b4f]/20" />

        <div className="relative z-10 max-w-8xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Find Your Next Property With Confidence
            </h1>

            <p className="text-white/80 text-lg">
              Explore residential, commercial, and luxury properties curated for
              smart buyers.
            </p>
          </div>

          <div className="mt-10">
            <SearchBar listingType="buy" onDark />
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-8xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-full w-fit">
            {CATEGORIES.map((cat) => (
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

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-black">
                {loading ? "..." : total}
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

      {/* LISTINGS */}
      <section className="mx-auto px-6 py-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {filter === "All" ? "All" : filter} Properties for Sale
            </h2>
            <p className="text-gray-500 mt-1">
              {isSearching
                ? "Results for your search"
                : "Handpicked listings updated regularly"}
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Properties */}
        {!loading && (
          <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-3">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  handleCardClick={handleCardClick}
                  listingType="buy"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">
                  {isSearching
                    ? "No properties match your search."
                    : "No properties found in this category."}
                </p>
                {isSearching && filter !== "All" && (
                  <button
                    onClick={() => setFilter("All")}
                    className="mt-3 text-primary underline underline-offset-4"
                  >
                    Search all categories
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

// useSearchParams needs a Suspense boundary or `next build` fails
const Buy = () => (
  <Suspense fallback={null}>
    <BuyContent />
  </Suspense>
);

export default Buy;
