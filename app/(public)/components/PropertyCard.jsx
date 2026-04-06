import Image from "next/image";
import React from "react";
import { CiHeart } from "react-icons/ci";
import {
  IoBedOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { PiBathtubLight } from "react-icons/pi";
import { FaHeart, FaWhatsapp } from "react-icons/fa";
import { useIsSaved, useSaved } from "../../../hooks/useSaved";

const PropertyCard = ({ property, handleCardClick, listingType }) => {
  const { toggleSaved } = useSaved();
  const isSaved = useIsSaved(property.id);


  const image = property.images?.[0] || "/images/placeholder.jpg";

  const formatPrice = () => {
    if (listingType === "rent" && property.pricing?.rentPerYear)
      return `₦${Number(property.pricing.rentPerYear).toLocaleString()} / yr`;
    if (listingType === "shortlet" && property.pricing?.nightlyRate)
      return `₦${Number(property.pricing.nightlyRate).toLocaleString()} / night`;
    if (listingType === "buy" && property.pricing?.salePrice)
      return `₦${Number(property.pricing.salePrice).toLocaleString()}`;
    return "Price on request";
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
  className="
    group cursor-pointer
    flex flex-col sm:flex-row
    bg-white rounded-2xl overflow-hidden
    border border-gray-200
    shadow-md hover:shadow-2xl hover:-translate-y-1
    transition-all duration-300
  "
>
  {/* ================= IMAGE ================= */}
  <div
    className="
      relative w-full sm:w-[42%]
      h-[220px]
      sm:h-auto sm:self-stretch
      sm:min-h-[240px] lg:min-h-[260px]
      overflow-hidden bg-gray-200
    "
  >
    <Image
      src={image}
      alt={property.title || "Property image"}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="
        object-cover object-center
        transition-transform duration-700
        group-hover:scale-110
      "
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

    {/* Favourite Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSaved(property);
      }}
      className="
        absolute top-4 right-4
        p-2 bg-white/90 backdrop-blur-sm
        rounded-full hover:bg-white
        shadow-md transition-all duration-200
      "
    >
      {isSaved ? (
        <span className="flex items-center justify-center gap-2 text-sm">
          <FaHeart className="w-5 h-5 text-red-500 fill-red-500" />
        </span>
      ) : (
        <CiHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
      )}
    </button>

    {/* Status Badge */}
    <span
      className="
        absolute bottom-4 left-4
        bg-primary-accent text-white
        text-xs font-bold uppercase tracking-wide
        px-3 py-1.5 rounded-full shadow-lg
      "
    >
      {property.status}
    </span>
  </div>

  {/* ================= CONTENT ================= */}
  <div className="flex flex-col justify-between p-4 sm:p-6 flex-1">
    <div className="space-y-3">
      {/* Title */}
      <h3
        className="
          font-bold text-base sm:text-lg
          leading-snug line-clamp-2
          text-gray-900
          group-hover:text-primary-accent
          transition
        "
      >
        {property.title}
      </h3>

      {/* Price */}
      <p className="text-primary-accent font-extrabold text-xl sm:text-2xl tracking-tight">
        {formatPrice()}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <IoLocationOutline className="text-base flex-shrink-0" />
        <span className="line-clamp-1">
          {property.location}, {property.state}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-gray-400 rounded-full" />
          Listed {formatDate(property.date_listed)}
        </span>
      </div>

      {/* Features */}
      <div className="flex flex-wrap items-center gap-2 pt-2 text-sm">
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

    {/* ================= FOOTER ================= */}
    <div className="mt-5 pt-4 border-t flex items-center justify-between">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Contact Owner
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            p-2.5 rounded-full bg-gray-100
            hover:bg-primary-accent hover:text-white
            shadow-sm transition
          "
          aria-label="Call owner"
        >
          <IoCallOutline className="text-lg" />
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="
            p-2.5 rounded-full
            bg-green-100 text-green-600
            hover:bg-green-600 hover:text-white
            shadow-sm transition
          "
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
