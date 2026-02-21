import Image from "next/image";
import React from "react";
import { CiHeart } from "react-icons/ci";
import {
  IoBedOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa";

const PropertyCard = ({ property, handleCardClick, listingType }) => {
  const image = property.propertyImages?.[0] || "/images/placeholder.jpg";

  const formatPrice = () => {
    if (listingType === "rent")
      return `₦${property.pricing.rentPerYear.toLocaleString()} / yr`;
    if (listingType === "shortlet")
      return `₦${property.pricing.nightlyRate.toLocaleString()} / night`;
    if (listingType === "buy")
      return `₦${property.pricing.salePrice.toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Recently added";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article
      onClick={() => handleCardClick(property)}
      className="group cursor-pointer flex bg-white rounded-2xl overflow-hidden 
  border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1 
  transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-[40%] min-h-[210px] overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={property.propertyTitle || "Property image"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark overlay for boldness */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* Favourite */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md 
      p-2.5 rounded-full shadow-lg hover:scale-110 transition"
          aria-label="Add to favourites"
        >
          <CiHeart className="text-xl text-gray-700 hover:text-red-500" />
        </button>

        {/* Status badge */}
        <span
          className="absolute bottom-4 left-4 bg-primary-accent 
      text-white text-xs font-bold uppercase tracking-wide 
      px-3 py-1.5 rounded-full shadow-lg"
        >
          {property.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 w-[60%]">
        {/* Top */}
        <div className="space-y-3">
          <h3 className="font-bold text-[18px] leading-snug line-clamp-2 text-gray-900 group-hover:text-primary-accent transition">
            {property.propertyTitle}
          </h3>

          <p className="text-primary-accent font-extrabold text-2xl tracking-tight">
            {formatPrice()}
          </p>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <IoLocationOutline className="text-base" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              Listed {formatDate(property.dateListed)}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 pt-2 text-sm">
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
              <IoBedOutline className="text-primary-accent text-base" />
              {property.beds} Beds
            </span>

            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
              <PiBathtubLight className="text-primary-accent text-base" />
              {property.baths} Baths
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Contact Owner
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-full bg-gray-100 
          hover:bg-primary-accent hover:text-white shadow-sm transition"
              aria-label="Call owner"
            >
              <IoCallOutline className="text-lg" />
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-full bg-green-100 text-green-600 
          hover:bg-green-600 hover:text-white shadow-sm transition"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
