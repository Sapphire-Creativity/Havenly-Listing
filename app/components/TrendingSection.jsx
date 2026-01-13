"use client";

import React, { useState } from "react";
import { ALL_PROPERTIES } from "../../public/assets/data";
import Image from "next/image";
import { CiLocationOn, CiHeart, CiShare2 } from "react-icons/ci";
import { FaBath, FaBed, FaHeart } from "react-icons/fa";
import { TbDimensions } from "react-icons/tb";
import { useRouter } from "next/navigation";

const TrendingSection = () => {
  const [filter, setFilter] = useState("For Rent");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // Track favorite property IDs
  const [shareModal, setShareModal] = useState({
    open: false,
    propertyId: null,
  });

  const router = useRouter();

  // Group properties by status for filter buttons
  const filterButtons = [
    {
      label: "For Sale",
      count: ALL_PROPERTIES.filter((p) => p.status === "For Sale").length,
    },
    {
      label: "For Rent",
      count: ALL_PROPERTIES.filter((p) => p.status === "For Rent").length,
    },
    {
      label: "Shortlet",
      count: ALL_PROPERTIES.filter((p) => p.status === "Shortlet").length,
    },
  ];

  const filteredProperties = ALL_PROPERTIES.filter(
    (property) => property.propertyType === filter || property.status === filter
  );

  const formatPrice = (property) => {
    if (property?.status === "Shortlet" && property?.pricing?.nightlyRate) {
      const price = Number(property.pricing.nightlyRate);
      return `₦${price.toLocaleString()}/night`;
    } else if (
      property?.status === "For Rent" &&
      property?.pricing?.rentPerYear
    ) {
      const price = Number(property.pricing.rentPerYear);
      return `₦${price.toLocaleString()}/year`;
    } else if (
      property?.status === "For Sale" &&
      property?.pricing?.salePrice
    ) {
      const price = Number(property.pricing.salePrice);
      return `₦${price.toLocaleString()}`;
    }

    return "Price on request";
  };

  // Helper function to get status badge color
  const getStatusClass = (status) => {
    switch (status) {
      case "For Rent":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Shortlet":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Toggle favorite status
  const toggleFavorite = (propertyId, e) => {
    e.stopPropagation(); // Prevent card click when clicking heart
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  // Open share modal
  const openShareModal = (propertyId, e) => {
    e.stopPropagation(); // Prevent card click when clicking share
    setShareModal({ open: true, propertyId });
  };

  // Close share modal
  const closeShareModal = () => {
    setShareModal({ open: false, propertyId: null });
  };

  // Copy link to clipboard
  const copyLink = (propertyId) => {
    const link = `${window.location.origin}/property/${propertyId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
        closeShareModal();
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleCardClick = (property) => {
    let route = "";

    if (property.listingType === "shortlet") {
      route = `/shortlet/${property.id}`;
    } else if (property.listingType === "buy") {
      route = `/buy/${property.id}`;
    } else {
      route = `/rent/${property.id}`;
    }

    router.push(route);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className=" mx-auto px-4">
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
              onClick={() =>
                setFilter(
                  btn.label === "Commercial" ? "Commercial Property" : btn.label
                )
              }
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center ${
                filter === btn.label ||
                (btn.label === "Commercial" && filter === "Commercial Property")
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredProperties.slice(0, 8).map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
              onClick={() => handleCardClick(property)}
            >
              {/* Property Image with Overlay Actions */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={property.propertyImages[0]}
                  alt={property.propertyTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Status Badge - Moved to top-right for better visibility */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClass(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(property.id, e)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all duration-200"
                    aria-label={
                      favorites.has(property.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.has(property.id) ? (
                      <FaHeart className="w-5 h-5 text-red-500 fill-red-500" />
                    ) : (
                      <CiHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                    )}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={(e) => openShareModal(property.id, e)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all duration-200"
                    aria-label="Share property"
                  >
                    <CiShare2 className="w-5 h-5 text-gray-700 hover:text-blue-500" />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  📸 {property.propertyImages.length} photos
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5">
                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatPrice(property)}
                    </h3>
                    {/* <span className="text-sm text-gray-500">
                      {property.status === "For Rent" ? "annual" : "nightly"}
                    </span> */}
                  </div>
                  {property.feesBreakdown?.serviceCharge > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      + ₦{property.feesBreakdown.serviceCharge.toLocaleString()}{" "}
                      service charge
                    </p>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                  {property.propertyTitle}
                </h4>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-4">
                  <CiLocationOn className="mr-2 w-5 h-5" />
                  <span className="text-sm">
                    {property.location}, {property.state}
                  </span>
                </div>

                {/* Property Specs */}
                <div className="flex items-center gap-6 mb-4 text-gray-700 pb-4 border-b border-gray-100">
                  {property.beds > 0 && (
                    <div className="flex items-center gap-2">
                      <FaBed className="text-gray-500" />
                      <span className="text-sm font-medium">
                        {property.beds} {property.beds === 1 ? "Bed" : "Beds"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaBath className="text-gray-500" />
                    <span className="text-sm font-medium">
                      {property.baths} {property.baths === 1 ? "Bath" : "Baths"}
                    </span>
                  </div>
                  {property.squareMeters && (
                    <div className="flex items-center gap-2">
                      <TbDimensions className="text-gray-500" />
                      <span className="text-sm font-medium">
                        {property.squareMeters}m²
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Features */}
                {property.propertyFeatures?.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {property.propertyFeatures
                        .slice(0, 3)
                        .map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                          >
                            {feature}
                          </span>
                        ))}
                      {property.propertyFeatures.length > 3 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                          +{property.propertyFeatures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
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
                    {window.location.origin}/property/{shareModal.propertyId}
                  </code>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyLink(shareModal.propertyId)}
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
        {filteredProperties.length > 8 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-primary hover:bg-primary-accent  text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              View All Properties ({filteredProperties.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
