"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CiLocationOn,
  CiCalendar,
  CiHome,
  CiStar,
  CiHeart,
} from "react-icons/ci";
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
import Head from "next/head";
import { useIsSaved, useSaved } from "../../../hooks/useSaved";
import ViewingInspectionModal from "./ViewingInspectionModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const InfoBox = ({ label, value }) => (
  <div className="p-4 rounded-xl border bg-white">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const PropertyDetails = ({ property, listingType }) => {
  const { toggleSaved, removeFromSaved } = useSaved();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSaved = useIsSaved(property.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  //
  const role = user?.unsafeMetadata?.role;

  const handleScheduleViewing = () => {
    if (!isSignedIn) {
      const currentPath = window.location.pathname;
      router.push(
        `/auth/signup?redirect_url=${encodeURIComponent(currentPath)}`,
      );
      return;
    }

    setIsModalOpen(true);
  };

  // Determine property characteristics
  const isCommercial = property.property_type === "Commercial Property"; // ✅ fixed
  const isShortlet =
    property.status === "For Shortlet" || listingType === "shortlet"; // ✅ fixed
  const isForSale = property.status === "For Sale" || listingType === "buy";

  // Format price based on property type
  const formatPrice = (property) => {
    if (property?.status === "For Shortlet" && property?.pricing?.nightlyRate) {
      // ✅ fixed
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    console.log(url);

    const title = property?.title || "Property Listing"; // ✅ fixed
    const text = `Check out this property: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Head>
        <title>{property.title}</title> {/* ✅ fixed */}
        <meta name="description" content={property.description} />
        {/* Open Graph */}
        <meta property="og:title" content={property.title} /> {/* ✅ fixed */}
        <meta property="og:description" content={property.description} />
        <meta
          property="og:image"
          content={property.images?.[0] || "/images/placeholder.jpg"} // ✅ fixed
        />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={property.title} /> {/* ✅ fixed */}
        <meta name="twitter:description" content={property.description} />
        <meta
          name="twitter:image"
          content={property.images?.[0] || "/images/placeholder.jpg"} // ✅ fixed
        />
      </Head>

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
                {property.property_type} {/* ✅ fixed */}
              </span>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(property);
                }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all duration-200"
              >
                {isSaved ? (
                  <span className="flex items-center justify-center gap-2 text-sm">
                    <FaHeart className="w-5 h-5 text-red-500 fill-red-500" />{" "}
                    saved
                  </span>
                ) : (
                  <CiHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                )}
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-2 relative h-120 rounded-2xl overflow-hidden">
                <Image
                  src={
                    property.images?.[currentImageIndex] ||
                    "/images/placeholder.jpg"
                  } // ✅ fixed
                  alt={property.title} // ✅ fixed
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 gap-2">
                {property.images?.slice(0, 4).map(
                  (
                    img,
                    idx, // ✅ fixed
                  ) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-44 rounded-lg overflow-hidden ${
                        currentImageIndex === idx ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${property.title} view ${idx + 1}`} // ✅ fixed
                        fill
                        className="object-cover"
                      />
                    </button>
                  ),
                )}
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
                  {property.title} {/* ✅ fixed */}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-primary">
                    {formatPrice(property)}
                  </span>
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

                  {property.square_meters && ( // ✅ fixed
                    <div className="text-center">
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TbDimensions className="text-primary-accent" />
                      </div>
                      <span className="text-sm text-gray-600">Area</span>
                      <p className="font-bold text-lg">
                        {property.square_meters}m²
                      </p>{" "}
                      {/* ✅ fixed */}
                    </div>
                  )}

                  {property.parking_spaces > 0 && ( // ✅ fixed
                    <div className="text-center">
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FaCar className="text-primary-accent" />
                      </div>
                      <span className="text-sm text-gray-600">Parking</span>
                      <p className="font-bold text-lg">
                        {property.parking_spaces}
                      </p>{" "}
                      {/* ✅ fixed */}
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
                    <p className="font-medium">{property.year_built}</p>{" "}
                    {/* ✅ fixed */}
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Date Listed</span>
                    <p className="font-medium">
                      {formatDate(property.date_listed)}
                    </p>{" "}
                    {/* ✅ fixed */}
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Property Type</span>
                    <p className="font-medium">{property.property_type}</p>{" "}
                    {/* ✅ fixed */}
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
              {property.features?.property?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Property Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.property.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <FaCheck className="text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estate Features */}
              {property.features?.estate?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MdSecurity /> Estate Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.estate.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-accent rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Features */}
              {property.features?.special?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCrown /> Special Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.special.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CiStar className="text-yellow-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shortlet Features */}
              {isShortlet && (
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-8">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TbBuildingSkyscraper /> Shortlet Information
                  </h2>

                  {/* Booking Highlights */}
                  {property.features?.special?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Why this place is special
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {property.features.special.map((item, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-full bg-primary-accent/10 text-primary-accent text-sm font-semibold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stay Info */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Stay Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InfoBox label="Max Guests" value={property.max_guests} />{" "}
                      {/* ✅ fixed */}
                      <InfoBox
                        label="Minimum Nights"
                        value={property.pricing?.minimumStay}
                      />
                      <InfoBox
                        label="Check-in"
                        value={property.check_in_time}
                      />{" "}
                      {/* ✅ fixed */}
                      <InfoBox
                        label="Check-out"
                        value={property.check_out_time}
                      />{" "}
                      {/* ✅ fixed */}
                    </div>
                  </div>

                  {/* Amenities */}
                  {property.features?.amenities?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Amenities
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {property.features.amenities.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <FaCheck className="text-green-500" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* House Rules */}
                  {property.house_rules?.length > 0 && ( // ✅ fixed
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        House Rules
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {property.house_rules.map(
                          (
                            rule,
                            index, // ✅ fixed
                          ) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span className="text-gray-700">{rule}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancellation Policy */}
                  {property.cancellation_policy && ( // ✅ fixed
                    <div className="p-5 rounded-xl border bg-yellow-50">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Cancellation Policy
                      </h3>
                      <p className="text-sm text-gray-700">
                        {property.cancellation_policy}
                      </p>
                    </div>
                  )}
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
                  {property.fees_breakdown?.agencyFee && ( // ✅ fixed
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Agency Fee</span>
                      <span className="font-bold text-lg">
                        {property.fees_breakdown.agencyFee}%
                      </span>
                    </div>
                  )}
                  {property.fees_breakdown?.legalFee && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Legal Fee</span>
                      <span className="font-bold text-lg">
                        {property.fees_breakdown.legalFee}%
                      </span>
                    </div>
                  )}
                  {property.fees_breakdown?.cautionFee && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Caution Fee</span>
                      <span className="font-bold text-lg">
                        {property.fees_breakdown.cautionFee}%
                      </span>
                    </div>
                  )}
                  {property.fees_breakdown?.serviceCharge > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Service Charge</span>
                      <span className="font-bold text-lg">
                        ₦
                        {Number(
                          property.fees_breakdown.serviceCharge,
                        ).toLocaleString()}
                        /yr
                      </span>
                    </div>
                  )}
                  {property.fees_breakdown?.cleaningFee > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Cleaning Fee</span>
                      <span className="font-bold text-lg">
                        ₦
                        {Number(
                          property.fees_breakdown.cleaningFee,
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {property.fees_breakdown?.securityDeposit > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-bold text-lg">
                        ₦
                        {Number(
                          property.fees_breakdown.securityDeposit,
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Note about fees */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-bold">Note:</span> These fees are
                      calculated as a percentage of the{" "}
                      {isShortlet
                        ? "nightly rate"
                        : isForSale
                          ? "sale price"
                          : "annual rent"}
                      .
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
                    {property.owner?.full_name?.charAt(0) || "?"}{" "}
                    {/* ✅ real owner initial */}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {property.owner?.business_name ||
                        property.owner?.full_name ||
                        "Property Owner"}{" "}
                      {/* ✅ real owner name */}
                    </p>
                    <p className="text-sm text-gray-600">
                      {property.owner?.business_name
                        ? property.owner?.full_name
                        : "Property Owner"}{" "}
                      {/* ✅ show full name under business name */}
                    </p>
                    <p className="text-sm text-primary-accent font-medium mt-1">
                      ✓ Verified Agent
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {!user || !isSignedIn ? (
                    <button
                      onClick={() => {
                        const currentPath = window.location.pathname;
                        router.push(
                          `/auth/login?redirect_url=${encodeURIComponent(currentPath)}`,
                        );
                      }}
                      className="w-full bg-primary hover:bg-primary-accent text-white font-medium py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaPhoneAlt />
                      Sign in to view contact
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${property.owner?.phone}`)
                      } // ✅ real phone
                      className="w-full bg-primary hover:bg-primary-accent text-white font-medium py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaPhoneAlt />
                      {property.owner?.phone || "Phone unavailable"}
                    </button>
                  )}

                  {/*  */}

                  {role !== "owner" && (
                    <button
                      onClick={handleScheduleViewing}
                      className="w-full border-2 border-primary text-primary hover:bg-primary-accent hover:border-none hover:text-white font-medium py-4 rounded-full transition-colors"
                    >
                      Schedule Viewing
                    </button>
                  )}
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
                      {formatDate(property.date_listed)}
                    </span>{" "}
                    {/* ✅ fixed */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-bold ${getStatusColor().replace("bg-", "text-")}`}
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
                <button
                  onClick={handleShare}
                  className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FaShareAlt />
                  Share with Friends
                </button>
              </div>
            </div>
          </div>

          {/* Display Modal Component */}
          <ViewingInspectionModal
            isOpen={isModalOpen}
            propertyDetails={property}
            onClose={() => setIsModalOpen(false)}
          />
        </section>
      </div>
    </>
  );
};

export default PropertyDetails;
