"use client";

import { useState, useEffect } from "react";
import properties from "../../public/assets/data";
import Image from "next/image";

const GeometricMapUI = () => {
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Featured properties for the map (first 8 properties)
  const featuredProperties = properties.slice(0, 8);

  // Geometric positions for the points
  const positions = [
    { top: "20%", left: "15%", color: "bg-blue-500" },
    { top: "35%", left: "70%", color: "bg-green-500" },
    { top: "60%", left: "25%", color: "bg-purple-500" },
    { top: "45%", left: "85%", color: "bg-red-500" },
    { top: "75%", left: "60%", color: "bg-yellow-500" },
    { top: "25%", left: "40%", color: "bg-pink-500" },
    { top: "55%", left: "45%", color: "bg-indigo-500" },
    { top: "80%", left: "80%", color: "bg-teal-500" },
  ];

  // Handle hover
  const handleMouseEnter = (property, index) => {
    setHoveredProperty({ ...property, index });
  };

  const handleMouseLeave = () => {
    setHoveredProperty(null);
  };

  const handlePointClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  // Format price
  const formatPrice = (property) => {
    if (property.status === "Shortlet" && property.nightlyRate) {
      return `₦${property.nightlyRate.toLocaleString()}/night`;
    } else if (property.status === "For Rent" && property.annualRent) {
      return `₦${property.annualRent.toLocaleString()}/year`;
    }
    return "Price on request";
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProperty(null), 300);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-white/30"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-white/30"></div>
          <div className="absolute top-2/4 left-0 w-full h-px bg-white/30"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-white/30"></div>
          <div className="absolute left-0 top-0 h-full w-px bg-white/30"></div>
          <div className="absolute left-1/4 top-0 h-full w-px bg-white/30"></div>
          <div className="absolute left-2/4 top-0 h-full w-px bg-white/30"></div>
          <div className="absolute left-3/4 top-0 h-full w-px bg-white/30"></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 border-2 border-purple-500/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 border-2 border-green-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 border-2 border-pink-500/20 rotate-12 animate-pulse"></div>

        {/* Glowing dots in background */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Explore Premium Properties
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover exclusive properties across prime locations. Hover over the
            glowing points to explore featured listings.
          </p>
        </div>

        {/* Interactive Map Container */}
        <div className="relative h-[600px] bg-gradient-to-br from-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:40px_40px]"></div>

          {/* City Labels (Optional) */}
          <div className="absolute top-10 left-20">
            <span className="text-sm font-medium text-blue-300">LAGOS</span>
          </div>
          <div className="absolute top-40 right-32">
            <span className="text-sm font-medium text-purple-300">ABUJA</span>
          </div>
          <div className="absolute bottom-32 left-32">
            <span className="text-sm font-medium text-green-300">
              PORT HARCOURT
            </span>
          </div>

          {/* Interactive Property Points */}
          {featuredProperties.map((property, index) => (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                top: positions[index].top,
                left: positions[index].left,
              }}
              onMouseEnter={() => handleMouseEnter(property, index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handlePointClick(property)}
            >
              {/* Glowing Point */}
              <div className="relative">
                {/* Outer glow */}
                <div
                  className={`absolute inset-0 ${positions[index].color.replace(
                    "bg-",
                    "bg-"
                  )} rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                {/* Inner point */}
                <div
                  className={`relative w-6 h-6 ${positions[index].color} rounded-full border-2 border-white shadow-lg transform group-hover:scale-125 transition-transform duration-300 flex items-center justify-center`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Pulse animation */}
                <div
                  className={`absolute inset-0 ${positions[index].color.replace(
                    "bg-",
                    "bg-"
                  )} rounded-full animate-ping opacity-20`}
                ></div>
              </div>

              {/* Property label on hover */}
              {hoveredProperty?.id === property.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-48 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-2xl transform transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={property.propertyImages[0]}
                        alt={property.propertyTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">
                        {property.propertyTitle}
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">
                        {property.location}
                      </p>
                      <p className="text-sm font-bold text-blue-300 mt-2">
                        {formatPrice(property)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900/90 rotate-45 border-b border-r border-white/10"></div>
                </div>
              )}
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h4 className="font-bold text-sm mb-2">Property Types</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">For Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Shortlet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">For Sale</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            <p>👆 Click on points for details</p>
            <p>👋 Hover to preview</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {properties.filter((p) => p.status === "For Rent").length}+
            </div>
            <div className="text-gray-300 mt-2">Properties for Rent</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-red-400">
              {properties.filter((p) => p.status === "Shortlet").length}+
            </div>
            <div className="text-gray-300 mt-2">Shortlet Stays</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400">
              {
                properties.filter(
                  (p) => p.propertyType === "Commercial Property"
                ).length
              }
              +
            </div>
            <div className="text-gray-300 mt-2">Commercial Properties</div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {isModalOpen && selectedProperty && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 rounded-3xl max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden transform animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedProperty.propertyTitle}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProperty.status === "For Rent"
                        ? "bg-blue-500"
                        : selectedProperty.status === "Shortlet"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {selectedProperty.status}
                  </span>
                  <span className="text-gray-300">
                    {selectedProperty.propertyType}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src={selectedProperty.propertyImages[0]}
                    alt={selectedProperty.propertyTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-4">
                    {formatPrice(selectedProperty)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
                        📍
                      </div>
                      <span>
                        {selectedProperty.location}, {selectedProperty.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {selectedProperty.beds > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
                            🛏️
                          </div>
                          <span>{selectedProperty.beds} Beds</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
                          🚿
                        </div>
                        <span>{selectedProperty.baths} Baths</span>
                      </div>
                    </div>

                    {selectedProperty.squareMeters && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
                          📐
                        </div>
                        <span>{selectedProperty.squareMeters}m²</span>
                      </div>
                    )}
                  </div>

                  {/* Features Preview */}
                  <div className="mt-6">
                    <h4 className="font-bold mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.propertyFeatures
                        .slice(0, 3)
                        .map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    const route =
                      selectedProperty.listingType === "shortlet"
                        ? "shortlet"
                        : selectedProperty.listingType === "buy"
                        ? "buy"
                        : "rent";
                    window.location.href = `/${route}/${selectedProperty.id}`;
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  View Full Details
                </button>
                <button className="flex-1 border border-white/20 hover:bg-white/10 font-medium py-3 rounded-lg transition-colors">
                  Save Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default GeometricMapUI;
