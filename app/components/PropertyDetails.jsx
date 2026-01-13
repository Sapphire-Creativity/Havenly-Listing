"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CiLocationOn, CiCalendar, CiHome, CiStar } from "react-icons/ci";
import {
  FaBed,
  FaBath,
  FaCar,
  FaShareAlt,
  FaHeart,
  FaPhoneAlt,
  FaCheck,
  FaCrown,
} from "react-icons/fa";
import { TbDimensions, TbBuildingSkyscraper, TbTools } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { MdSecurity, MdOutlinePool } from "react-icons/md";
import { ALL_PROPERTIES } from "../../public/assets/data";

const PropertyDetails = ({ property, listingType }) => {
  const [favorite, setFavorite] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Determine property characteristics
  const isCommercial = property.propertyType === "Commercial Property";
  const isShortlet =
    property.status === "Shortlet" || listingType === "shortlet";
  const isForSale = property.status === "For Sale" || listingType === "buy";

  // Format price based on property type
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

  // Get the price label
  const getPriceLabel = () => {
    if (isShortlet) return "nightly rate";
    if (!isForSale) return "annual rent";
    if (isForSale) return "sale price";
    return "";
  };

  // Get status color for badge
  const getStatusColor = () => {
    if (isShortlet) return "bg-red-500";
    if (isForSale) return "bg-green-500";
    return "bg-blue-500";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <section className="mx-auto">
        <div className="flex items-center justify-between mb-20">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <IoIosArrowBack className="mr-2" />
            Back
          </button>

          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor()}`}
            >
              {property.status}
            </span>

            {/* Property Type Badge */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                isCommercial
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {property.propertyType}
            </span>

            {/* Favorite Button */}
            <button
              onClick={() => setFavorite(!favorite)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {favorite ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaHeart className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2 relative h-96 rounded-2xl overflow-hidden">
              <Image
                src={property.propertyImages[currentImageIndex]}
                alt={property.propertyTitle}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 gap-2">
              {property.propertyImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-44 rounded-lg overflow-hidden ${
                    currentImageIndex === idx ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${property.propertyTitle} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Title and Price */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.propertyTitle}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {formatPrice(property)}
                </span>
                {/* <span className="text-gray-500">{getPriceLabel()}</span> */}
              </div>
            </div>
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CiHome /> Property Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.beds > 0 && (
                  <div className="text-center">
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaBed className="text-primary-accent" />
                    </div>
                    <span className="text-sm text-gray-600">Bedrooms</span>
                    <p className="font-bold text-lg">{property.beds}</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaBath className="text-primary-accent" />
                  </div>
                  <span className="text-sm text-gray-600">Bathrooms</span>
                  <p className="font-bold text-lg">{property.baths}</p>
                </div>

                {property.squareMeters && (
                  <div className="text-center">
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TbDimensions className="text-primary-accent" />
                    </div>
                    <span className="text-sm text-gray-600">Area</span>
                    <p className="font-bold text-lg">
                      {property.squareMeters}m²
                    </p>
                  </div>
                )}

                {property.parkingSpaces > 0 && (
                  <div className="text-center">
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaCar className="text-primary-accent" />
                    </div>
                    <span className="text-sm text-gray-600">Parking</span>
                    <p className="font-bold text-lg">
                      {property.parkingSpaces}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Condition</span>
                  <p className="font-medium">{property.condition}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Year Built</span>
                  <p className="font-medium">{property.yearBuilt}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date Listed</span>
                  <p className="font-medium">
                    {formatDate(property.dateListed)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Property Type</span>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Features */}
            {property.propertyFeatures?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Property Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.propertyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estate Features */}
            {property.estateFeatures?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MdSecurity /> Estate Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.estateFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-accent rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Features */}
            {property.specialFeatures?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCrown /> Special Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.specialFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CiStar className="text-yellow-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CiLocationOn /> Location
              </h2>
              <div className="flex items-start gap-2 mb-4">
                <div>
                  <p className="font-medium text-gray-900 text-lg">
                    {property.location}
                  </p>
                  <p className="text-gray-600">{property.state}</p>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">
                  Map view will be implemented here
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Fees & Contact (1/3 width) */}
          <div className="space-y-6">
            {/* Fees Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TbTools /> Fees Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Agency Fee</span>
                  <span className="font-bold text-lg">
                    {property.feesBreakdown.agencyFee}%
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Legal Fee</span>
                  <span className="font-bold text-lg">
                    {property.feesBreakdown.legalFee}%
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Caution Fee</span>
                  <span className="font-bold text-lg">
                    {property.feesBreakdown.cautionFee}%
                  </span>
                </div>
                {property.feesBreakdown.serviceCharge > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-bold text-lg">
                      ₦{property.feesBreakdown.serviceCharge.toLocaleString()}
                      /yr
                    </span>
                  </div>
                )}

                {/* Note about fees */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Note:</span> These fees are
                    calculated as a percentage of the{" "}
                    {isShortlet ? "nightly rate" : "annual rent"}.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Agent */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Contact Agent
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <div>
                  <p className="font-bold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">
                    Licensed Real Estate Agent
                  </p>
                  <p className="text-sm text-primary-accent font-medium mt-1">
                    ✓ Verified Agent
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-primary-accent text-white font-medium py-4 rounded-full flex items-center justify-center gap-2 transition-colors">
                  <FaPhoneAlt />
                  Call Agent
                </button>
                <button className="w-full border-2 border-primary text-primary hover:bg-primary-accent hover:border-none hover:text-white font-medium py-4 rounded-full transition-colors">
                  Send Message
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CiCalendar /> Listing Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-bold">#{property.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date Listed</span>
                  <span className="font-bold">
                    {formatDate(property.dateListed)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-bold ${getStatusColor().replace(
                      "bg-",
                      "text-"
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-bold">{property.condition}</span>
                </div>
              </div>
            </div>

            {/* Share Property */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Share Property
              </h2>
              <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <FaShareAlt />
                Share with Friends
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
