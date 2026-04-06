"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import TrendingSectionPropertyCard from "./TrendingSectionPropertyCard";

const TrendingSection = () => {
  const [filter, setFilter] = useState("For Rent");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    "For Sale": 0,
    "For Rent": 0,
    "For Shortlet": 0,
  });

  const [shareModal, setShareModal] = useState({
    open: false,
    propertyId: null,
    listingType: null,
  });

  const router = useRouter();

  // Fetch counts once on mount
  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase.from("properties").select("status");

      if (data) {
        setCounts({
          "For Sale": data.filter((p) => p.status === "For Sale").length,
          "For Rent": data.filter((p) => p.status === "For Rent").length,
          "For Shortlet": data.filter((p) => p.status === "For Shortlet")
            .length,
        });
      }
    };

    fetchCounts();
  }, []);

  // Fetch properties when filter changes
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", filter);

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data);
      }

      setLoading(false);
    };

    fetchProperties();
  }, [filter]);

  const filterButtons = [
    { label: "For Sale", count: counts["For Sale"] },
    { label: "For Rent", count: counts["For Rent"] },
    { label: "Shortlet", count: counts["For Shortlet"] },
  ];

  const copyLink = (propertyId, listingType) => {
    const link = `${window.location.origin}/${listingType}/${propertyId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
        closeShareModal();
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const openShareModal = (propertyId, e, listingType) => {
    e.stopPropagation();
    setShareModal({ open: true, propertyId, listingType });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, propertyId: null, listingType: null });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Trending Properties
          </h2>
          <p className="text-gray-600">
            Discover properties matching your preferences
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                if (btn.label === "For Sale") setFilter("For Sale");
                if (btn.label === "For Rent") setFilter("For Rent");
                if (btn.label === "Shortlet") setFilter("For Shortlet");
              }}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center ${
                (btn.label === "For Sale" && filter === "For Sale") ||
                (btn.label === "For Rent" && filter === "For Rent") ||
                (btn.label === "Shortlet" && filter === "For Shortlet")
                  ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>{btn.label}</span>
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-black/10">
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <TrendingSectionPropertyCard
                key={property.id}
                property={property}
                openShareModal={openShareModal}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No properties found
            </h3>
            <p className="text-gray-500">Try selecting a different filter</p>
          </div>
        )}

        {/* Share Modal */}
        {shareModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Share Property
                </h3>
                <button
                  onClick={closeShareModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Copy the link below to share this property with others:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <code className="text-sm text-gray-800 break-all">
                    {window.location.origin}/{shareModal.listingType}/
                    {shareModal.propertyId}
                  </code>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    copyLink(shareModal.propertyId, shareModal.listingType)
                  }
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={closeShareModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View More Button */}
        {!loading && properties.length >= 8 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-primary hover:bg-primary-accent text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              View All Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
