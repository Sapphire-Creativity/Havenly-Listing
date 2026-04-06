"use client";

import { Typewriter } from "react-simple-typewriter";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");

  const handleSearch = () => {
    e.preventDefault();
    // Add your search logic here
    console.log("Searching for:", searchQuery, propertyType);
  };

  return (
    <section className="relative  h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Enhanced Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('../../assets/background-image.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/30"></div>
         
      </div>

      {/* Floating Elements for Depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-3 md:px-6 pt-40 lg:pt-20 w-full">
        <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between lg:gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              <span className="text-sm font-medium">
                Trusted by 10,000+ users
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Find Your
              <br />
              <span className="relative">
                <span className="text-primary-accent relative">
                  <Typewriter
                    words={[
                      "Dream Home",
                      "Perfect Office",
                      "Shortlet Stay",
                      "Commercial Space",
                      "Investment Property",
                    ]}
                    loop
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-accent rounded-full"></span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg mx-auto text-center lg:text-left lg:mx-0 md:text-xl text-gray-200 max-w-xl lg:max-w-2xl leading-relaxed">
              Discover verified listings for homes, offices, shortlets, and
              commercial spaces — all with transparent pricing and virtual
              tours.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5K+</div>
                <div className="text-sm text-gray-300">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}

      
      <div className="lg:w-1/2 mt-12 lg:mt-0">
        <div className="bg-white/10 backdrop-blur-lg rounded-full p-3 md:p-8 border border-white/20 shadow-2xl">
          {/* Property Type Filter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Buy", "Rent", "Shortlet", "Commercial"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type.toLowerCase())}
                className={`px-4 py-3 rounded-full text-xs font-medium transition-all ${
                  propertyType === type.toLowerCase()
                    ? "bg-primary-accent text-white"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
