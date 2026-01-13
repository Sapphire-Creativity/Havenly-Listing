"use client";

import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaHome, 
  FaBuilding, 
  FaHotel, 
  FaCity,
  FaChevronLeft, 
  FaChevronRight,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaStar,
  FaRegHeart,
  FaShoppingBag,
  FaBriefcase
} from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";

const NigeriaPropertyLocations = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Nigerian property locations with detailed real estate data
  const propertyLocations = [
    // Lagos - Commercial & Luxury
    {
      id: 1,
      name: "Victoria Island, Lagos",
      image: "https://images.unsplash.com/photo-1542345817-d3e4c7d9bb5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "commercial",
      propertyCount: 245,
      avgPrice: "₦150M - ₦800M",
      trending: true,
      popularTags: ["Luxury", "Business", "Waterfront"],
      description: "Premium commercial district with luxury apartments and office spaces",
      icon: <FaBuilding className="text-blue-500" />
    },
    {
      id: 2,
      name: "Lekki Phase 1",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 189,
      avgPrice: "₦80M - ₦350M",
      trending: true,
      popularTags: ["Gated", "Modern", "Family"],
      description: "Upcoming residential area with modern developments",
      icon: <FaHome className="text-green-500" />
    },
    {
      id: 3,
      name: "Ikoyi, Lagos",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "luxury",
      propertyCount: 92,
      avgPrice: "₦200M - ₦1.2B",
      trending: false,
      popularTags: ["Prestige", "Secure", "Exclusive"],
      description: "Most prestigious residential area in Lagos",
      icon: <FaStar className="text-yellow-500" />
    },
    {
      id: 4,
      name: "Ikeja GRA",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 156,
      avgPrice: "₦70M - ₦300M",
      trending: true,
      popularTags: ["Central", "Government", "Established"],
      description: "Government Residential Area with classic architecture",
      icon: <FaHome className="text-green-500" />
    },

    // Abuja - Administrative & Modern
    {
      id: 5,
      name: "Maitama, Abuja",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "luxury",
      propertyCount: 78,
      avgPrice: "₦180M - ₦900M",
      trending: true,
      popularTags: ["Diplomatic", "Affluent", "Spacious"],
      description: "Diplomatic zone with luxury properties",
      icon: <FaStar className="text-yellow-500" />
    },
    {
      id: 6,
      name: "Wuse 2, Abuja",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "commercial",
      propertyCount: 210,
      avgPrice: "₦50M - ₦400M",
      trending: true,
      popularTags: ["Business", "Shopping", "Central"],
      description: "Commercial hub with mixed-use developments",
      icon: <FaBuilding className="text-blue-500" />
    },
    {
      id: 7,
      name: "Jabi, Abuja",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 145,
      avgPrice: "₦60M - ₦250M",
      trending: false,
      popularTags: ["Lakefront", "Modern", "Lifestyle"],
      description: "Modern residential area with lake views",
      icon: <FaHome className="text-green-500" />
    },
    {
      id: 8,
      name: "Garki, Abuja",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "commercial",
      propertyCount: 189,
      avgPrice: "₦40M - ₦350M",
      trending: true,
      popularTags: ["Administrative", "Central", "Mixed-Use"],
      description: "Administrative and commercial district",
      icon: <FaBriefcase className="text-purple-500" />
    },

    // Shortlets & Vacation
    {
      id: 9,
      name: "Eko Atlantic",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "shortlet",
      propertyCount: 67,
      avgPrice: "₦50K - ₦300K/night",
      trending: true,
      popularTags: ["Luxury", "Beachfront", "Modern"],
      description: "Luxury shortlets with ocean views",
      icon: <FaHotel className="text-red-500" />
    },
    {
      id: 10,
      name: "Asokoro, Abuja",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "shortlet",
      propertyCount: 45,
      avgPrice: "₦40K - ₦200K/night",
      trending: true,
      popularTags: ["Executive", "Secure", "Serviced"],
      description: "Executive shortlets for business travelers",
      icon: <FaHotel className="text-red-500" />
    },

    // Commercial & Retail
    {
      id: 11,
      name: "Adeniran Ogunsanya, Lagos",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "commercial",
      propertyCount: 312,
      avgPrice: "₦30M - ₦200M",
      trending: false,
      popularTags: ["Retail", "Shopping", "High-Traffic"],
      description: "Prime retail and commercial strip",
      icon: <FaShoppingBag className="text-orange-500" />
    },
    {
      id: 12,
      name: "Port Harcourt GRA",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 89,
      avgPrice: "₦60M - ₦280M",
      trending: true,
      popularTags: ["Oil & Gas", "Executive", "Gated"],
      description: "Executive residences for oil & gas professionals",
      icon: <FaHome className="text-green-500" />
    },

    // Emerging Areas
    {
      id: 13,
      name: "Ajah, Lagos",
      image: "https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 234,
      avgPrice: "₦40M - ₦180M",
      trending: true,
      popularTags: ["Affordable", "Growing", "Bridge"],
      description: "Fast-growing affordable residential area",
      icon: <FaCity className="text-teal-500" />
    },
    {
      id: 14,
      name: "Kubwa, Abuja",
      image: "https://images.unsplash.com/photo-1560185007-cde436f7a4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "residential",
      propertyCount: 198,
      avgPrice: "₦35M - ₦150M",
      trending: true,
      popularTags: ["Middle-Class", "Suburban", "Family"],
      description: "Popular middle-class residential district",
      icon: <GiModernCity className="text-indigo-500" />
    },
    {
      id: 15,
      name: "Yaba, Lagos",
      image: "https://images.unsplash.com/photo-1552749412-09190f15088a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "commercial",
      propertyCount: 167,
      avgPrice: "₦25M - ₦120M",
      trending: false,
      popularTags: ["Tech", "Education", "Startups"],
      description: "Tech and education hub with commercial spaces",
      icon: <FaBuilding className="text-blue-500" />
    },
    {
      id: 16,
      name: "Calabar GRA",
      image: "https://images.unsplash.com/photo-1527030280866-2cbcb42bcb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "shortlet",
      propertyCount: 56,
      avgPrice: "₦25K - ₦150K/night",
      trending: true,
      popularTags: ["Tourism", "Vacation", "Scenic"],
      description: "Tourist-friendly shortlets and vacation homes",
      icon: <FaHotel className="text-red-500" />
    },
  ];

  // Filter types
  const filterTypes = [
    { id: "all", label: "All Locations", icon: <FaMapMarkerAlt />, count: propertyLocations.length },
    { id: "residential", label: "Residential", icon: <FaHome />, count: propertyLocations.filter(l => l.type === "residential").length },
    { id: "commercial", label: "Commercial", icon: <FaBuilding />, count: propertyLocations.filter(l => l.type === "commercial").length },
    { id: "luxury", label: "Luxury", icon: <FaStar />, count: propertyLocations.filter(l => l.type === "luxury").length },
    { id: "shortlet", label: "Shortlets", icon: <FaHotel />, count: propertyLocations.filter(l => l.type === "shortlet").length },
  ];

  // Filter locations based on active filter
  const filteredLocations = activeFilter === "all" 
    ? propertyLocations 
    : propertyLocations.filter(location => location.type === activeFilter);

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  // Navigation functions
  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get color based on property type
  const getTypeColor = (type) => {
    switch(type) {
      case 'residential': return 'bg-green-100 text-green-700 border-green-200';
      case 'commercial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'luxury': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'shortlet': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaMapMarkerAlt className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover <span className="text-green-600">Prime Locations</span> in Nigeria
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore the most sought-after areas for buying, renting, or investing in properties across Nigeria
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filterTypes.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-green-500 text-white border-green-500 shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:shadow-md"
                }`}
              >
                <span className="text-sm">{filter.icon}</span>
                <span className="font-medium">{filter.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === filter.id ? "bg-green-600" : "bg-gray-100"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a specific location or area..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-green-500 focus:shadow-lg transition-all duration-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Property Locations Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={goToPrevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white border-2 border-green-200 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:border-green-500 group"
                aria-label="Previous locations"
              >
                <FaChevronLeft className="text-green-600 group-hover:text-green-700 transition-colors" />
              </button>
              
              <button
                onClick={goToNextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white border-2 border-green-200 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:border-green-500 group"
                aria-label="Next locations"
              >
                <FaChevronRight className="text-green-600 group-hover:text-green-700 transition-colors" />
              </button>
            </>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentLocations.map((location) => (
              <div
                key={location.id}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer bg-white"
                onMouseEnter={() => setHoveredCard(location.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Type Badge */}
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(location.type)}`}>
                    <div className="flex items-center gap-1">
                      {location.icon}
                      <span>{location.type.charAt(0).toUpperCase() + location.type.slice(1)}</span>
                    </div>
                  </div>
                  
                  {/* Trending Badge */}
                  {location.trending && (
                    <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      TRENDING
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button className="absolute top-16 right-4 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300">
                    <FaRegHeart className="text-gray-700 hover:text-red-500" />
                  </button>
                  
                  {/* Location Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                    <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                    <p className="text-gray-200 text-sm mb-3">{location.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaHome className="text-gray-300" />
                          {location.propertyCount} properties
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-300">Avg: {location.avgPrice}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-green-600/90 via-green-600/70 to-transparent z-10 transition-opacity duration-500 ${
                    hoveredCard === location.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 translate-y-0 group-hover:translate-y-0">
                      <div className="text-white">
                        <h4 className="text-lg font-bold mb-3">Popular Tags</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {location.popularTags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                          View Properties
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-12">
              <div className="flex items-center gap-8">
                <button
                  onClick={goToPrevPage}
                  className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                  aria-label="Previous page"
                >
                  <FaChevronLeft className="text-gray-600 group-hover:text-green-600 transition-colors" />
                </button>

                {/* Dots with preview */}
                <div className="flex items-center gap-4">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    const pageIndex = currentPage < 3 
                      ? index 
                      : currentPage > totalPages - 3 
                        ? totalPages - 5 + index 
                        : currentPage - 2 + index;
                    
                    if (pageIndex >= 0 && pageIndex < totalPages) {
                      return (
                        <button
                          key={pageIndex}
                          onClick={() => goToPage(pageIndex)}
                          className="flex flex-col items-center"
                        >
                          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentPage === pageIndex
                              ? "bg-green-500 scale-125"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`} />
                          <span className={`text-xs mt-2 transition-colors ${
                            currentPage === pageIndex ? "text-green-600 font-bold" : "text-gray-500"
                          }`}>
                            {pageIndex + 1}
                          </span>
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                  aria-label="Next page"
                >
                  <FaChevronRight className="text-gray-600 group-hover:text-green-600 transition-colors" />
                </button>
              </div>
              
              {/* Page Indicator */}
              <div className="mt-4 text-gray-600 text-sm font-medium">
                Showing <span className="text-green-600 font-bold">{startIndex + 1}-{Math.min(endIndex, filteredLocations.length)}</span> of{" "}
                <span className="font-bold">{filteredLocations.length}</span> locations
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Find Your Perfect Property?
              </h3>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied clients who found their dream homes and profitable investments through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-green-600 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Explore All Properties
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10">
                  Talk to an Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NigeriaPropertyLocations;