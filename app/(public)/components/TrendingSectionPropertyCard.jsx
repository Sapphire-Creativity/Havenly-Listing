import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { CiHeart, CiLocationOn, CiShare2 } from "react-icons/ci";
import { FaBath, FaBed, FaHeart } from "react-icons/fa";
import { TbDimensions } from "react-icons/tb";
import { useIsSaved, useSaved } from "../../../hooks/useSaved";

const TrendingSectionPropertyCard = ({
  property,
  openShareModal,
  showRemoveButton = false,
}) => {
  const router = useRouter();
  const { toggleSaved, removeFromSaved } = useSaved();
  const isSaved = useIsSaved(property.id);

  const handleCardClick = (property) => {
    let route = "";

    if (property.listing_type === "shortlet") {
      route = `/shortlet/${property.id}`;
    } else if (property.listing_type === "buy") {
      route = `/buy/${property.id}`;
    } else {
      route = `/rent/${property.id}`;
    }

    router.push(route);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "For Rent":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "For Shortlet":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatPrice = (property) => {
    if (property?.status === "For Shortlet" && property?.pricing?.nightlyRate) {
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

  // safely get first image
  const firstImage = property.images?.[0] || null;

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
      onClick={() => handleCardClick(property)}
    >
      {/* Property Image */}
      <div className="relative h-64 w-full overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          // fallback if no image
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🏠</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClass(
              property.status,
            )}`}
          >
            {property.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {showRemoveButton ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromSaved(property.id);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-md hover:bg-red-600 transition-all duration-200"
            >
              ✕ Remove
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(property);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all duration-200"
            >
              {isSaved ? (
                <span className="flex items-center justify-center gap-2 text-sm">
                  <FaHeart className="w-5 h-5 text-red-500 fill-red-500" />
                  saved
                </span>
              ) : (
                <CiHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
              )}
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={(e) => openShareModal(property.id, e, property.listing_type)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all duration-200"
            aria-label="Share property"
          >
            <CiShare2 className="w-5 h-5 text-gray-700 hover:text-blue-500" />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          📸 {property.images?.length || 0} photos
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(property)}
            </h3>
          </div>
          {property.fees_breakdown?.serviceCharge > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              + ₦{property.fees_breakdown.serviceCharge.toLocaleString()} service charge
            </p>
          )}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {property.title}
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
          {property.square_meters && (
            <div className="flex items-center gap-2">
              <TbDimensions className="text-gray-500" />
              <span className="text-sm font-medium">
                {property.square_meters}m²
              </span>
            </div>
          )}
        </div>

        {/* Quick Features */}
        {property.features?.property?.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {property.features.property.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                >
                  {feature}
                </span>
              ))}
              {property.features.property.length > 3 && (
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                  +{property.features.property.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingSectionPropertyCard;