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

const PropertyForBuyCard = ({ property, handleCardClick }) => {
  return (
    <div className="w-full  group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image section */}
      <div
        className="relative w-[35%] min-h-[180px]"
        onClick={() => handleCardClick(property)}
      >
        <Image
          src={property.propertyImages[0]}
          alt={property.propertyTitle}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Favorite */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition">
          <CiHeart className="text-xl text-gray-700 hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-4 w-[65%]">
        {/* Top */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-snug line-clamp-2">
            {property.propertyTitle}
          </h3>

          <p className="text-primary font-bold text-xl">{property.price}</p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <IoLocationOutline />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
              <IoBedOutline className="text-primary" />
              {property.bed} Beds
            </span>

            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
              <PiBathtubLight className="text-primary" />
              {property.bath} Baths
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            Connect with owner
          </p>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition">
              <IoCallOutline className="text-lg" />
            </button>

            <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition">
              <FaWhatsapp className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForBuyCard;
