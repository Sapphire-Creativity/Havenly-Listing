"use client";

import React, { useState } from "react";
import { BsBuildings } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { MdBed, MdBathtub } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const propertyTypes = [
    "Any",
    "Apartment / Flat",
    "Detached House",
    "Semi-Detached House",
    "Duplex",
    "Terrace / Townhouse",
    "Bungalow",
    "Studio Apartment",
    "Penthouse",
    "Commercial Property",
    "Office Space",
    "Retail / Shop",
    "Warehouse / Industrial",
    "Land / Plot",
    "Short-let / Vacation Rental",
  ];

  const [selectedProperty, setSelectedProperty] = useState("Select");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl flex flex-wrap items-center gap-4 drop-shadow-2xl max-w-8xl mx-auto">
      {/* Location */}
      <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
        <span className="text-xs text-gray-500">Location</span>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-5 hover:border-gray-400 transition-colors">
          <SlLocationPin className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter city or area"
            className="outline-none w-full text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Property Type - Custom Dropdown */}
      <div className="flex flex-col gap-1 flex-1 min-w-[160px] relative">
        <span className="text-xs text-gray-500">Property Type</span>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-5 hover:border-gray-400 transition-colors relative">
          <BsBuildings className="text-gray-400" />
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-sm bg-transparent text-gray-700 cursor-pointer text-left flex items-center justify-between focus:outline-none"
          >
            <span>{selectedProperty}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Custom Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {propertyTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedProperty(type);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Beds & Baths */}
      <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
        <span className="text-xs text-gray-500">Beds & Baths</span>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-5 hover:border-gray-400 transition-colors relative">
          <MdBed className="text-gray-400" />
          <select className="w-full text-sm bg-transparent text-gray-700 cursor-pointer outline-none appearance-none">
            <option value="">Any</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
          </select>
          <svg
            className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
        <span className="text-xs text-gray-500">Price Range</span>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-5 hover:border-gray-400 transition-colors relative">
          <BiMoney className="text-gray-400" />
          <select className="w-full text-sm bg-transparent text-gray-700 cursor-pointer outline-none appearance-none">
            <option value="">Any</option>
            <option>$0 – $50,000</option>
            <option>$50,000 – $100,000</option>
            <option>$100,000 – $300,000</option>
            <option>$300,000+</option>
          </select>
          <svg
            className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <button className="bg-primary text-white p-4 items-center justify-center rounded-full text-xl font-medium hover:bg-primary-accent transition-all hover:scale-105 shadow-md">
          <FiSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
