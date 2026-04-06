"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";
import PropertyCard from "../components/PropertyCard";
import { supabase } from "../../../lib/supabase";

const Buy = () => {
  const [filter, setFilter] = useState("Residential");
  const [sort, setSort] = useState("latest");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "For Sale")
        .eq("is_available", true)
        .ilike("property_category", filter); // filter by category

      // sorting
      if (sort === "price-low") {
        query = query.order("pricing->salePrice", { ascending: true });
      } else if (sort === "price-high") {
        query = query.order("pricing->salePrice", { ascending: false });
      } else {
        query = query.order("date_listed", { ascending: false }); // latest
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    };

    fetchProperties();

    // ✅ REALTIME SUBSCRIPTION
    const channel = supabase
      .channel("properties-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
        },
        () => {
          fetchProperties();
        },
      )
      .subscribe();

    // cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, sort]); // re-fetch when filter or sort changes

  const handleCardClick = (property) => {
    if (!property || !property.id) return;
    router.push(`/buy/${property.id}`);
  };

  return (
    <div className="w-full bg-[#fafafa]">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="max-w-8xl mx-auto p-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Find Your Next Property With Confidence
            </h1>
            <p className="text-gray-300 text-lg">
              Explore residential, commercial, and luxury properties curated for
              smart buyers.
            </p>
          </div>
          <div className="mt-10 bg-white rounded-2xl shadow-xl p-4">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-8xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-black">
                {loading ? "..." : properties.length}
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
              {filter} Properties for Sale
            </h2>
            <p className="text-gray-500 mt-1">
              Handpicked listings updated regularly
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
                  No properties found in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Buy;
