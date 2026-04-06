"use client";
import { useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineMap,
} from "react-icons/hi";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { FiTrendingUp, FiClock } from "react-icons/fi";

export default function ClientDashboardOverview() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Mock data for statistics
  const stats = [
    { 
      id: 1, 
      title: "Saved Properties", 
      value: "24", 
      change: "+12%", 
      icon: HiOutlineHeart, 
      color: "rose",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600"
    },
    { 
      id: 2, 
      title: "Viewing Requests", 
      value: "6", 
      change: "3 pending", 
      icon: HiOutlineCalendar, 
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      id: 3, 
      title: "Properties Viewed", 
      value: "18", 
      change: "+5 this week", 
      icon: HiOutlineHome, 
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    { 
      id: 4, 
      title: "Budget Range", 
      value: "$350K", 
      change: "Avg. price", 
      icon: HiOutlineCurrencyDollar, 
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
  ];

  // Mock data for recent properties
  const recentProperties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Beverly Hills, CA",
      price: "$2.5M",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      type: "For Sale",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      saved: true,
      daysAgo: 2,
    },
    {
      id: 2,
      title: "Downtown Penthouse",
      location: "New York, NY",
      price: "$8,500/mo",
      beds: 3,
      baths: 2,
      sqft: "2,100",
      type: "For Rent",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      saved: false,
      daysAgo: 4,
    },
    {
      id: 3,
      title: "Beachfront Paradise",
      location: "Miami, FL",
      price: "$1,200/night",
      beds: 4,
      baths: 3,
      sqft: "3,000",
      type: "Shortlet",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      saved: true,
      daysAgo: 1,
    },
    {
      id: 4,
      title: "Modern Studio Apartment",
      location: "Austin, TX",
      price: "$1,800/mo",
      beds: 1,
      baths: 1,
      sqft: "750",
      type: "For Rent",
      image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      saved: false,
      daysAgo: 6,
    },
  ];

  // Mock data for upcoming viewings
  const upcomingViewings = [
    {
      id: 1,
      property: "Sunset Mansion",
      date: "Tomorrow, 2:00 PM",
      agent: "Sarah Johnson",
      status: "confirmed",
    },
    {
      id: 2,
      property: "Harbor View Loft",
      date: "Dec 15, 11:00 AM",
      agent: "Mike Chen",
      status: "pending",
    },
    {
      id: 3,
      property: "Garden Apartment",
      date: "Dec 18, 3:30 PM",
      agent: "Emma Davis",
      status: "confirmed",
    },
  ];

  // Mock data for recommendations
  const recommendations = [
    {
      id: 1,
      title: "Luxury Condo with City View",
      location: "Chicago, IL",
      price: "$650,000",
      match: "95%",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Cozy Family Home",
      location: "Denver, CO",
      price: "$425,000",
      match: "88%",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Modern Downtown Loft",
      location: "Seattle, WA",
      price: "$3,200/mo",
      match: "92%",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, John! 👋</h1>
              <p className="text-sm text-gray-500 mt-1">Here's what's happening with your property search</p>
            </div>
            
            {/* Search and Notification */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <HiOutlineBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "all" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Properties
            </button>
            <button 
              onClick={() => setActiveTab("buy")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "buy" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              For Sale
            </button>
            <button 
              onClick={() => setActiveTab("rent")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "rent" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              For Rent
            </button>
            <button 
              onClick={() => setActiveTab("shortlet")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "shortlet" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Shortlets
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Properties */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Header with View Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Properties</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <HiOutlineFilter className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <HiOutlineViewGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <HiOutlineViewList className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm transition-colors">
                    <HiOutlineMap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className={`grid ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } gap-4`}>
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.type === "For Sale" 
                          ? "bg-blue-500 text-white"
                          : property.type === "For Rent"
                          ? "bg-green-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}>
                        {property.type}
                      </span>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <HiOutlineHeart className={`w-4 h-4 ${
                          property.saved ? "text-red-500 fill-red-500" : "text-gray-600"
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <HiOutlineLocationMarker className="w-4 h-4" />
                      {property.location}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-gray-600">{property.beds} beds</span>
                      <span className="text-sm text-gray-600">{property.baths} baths</span>
                      <span className="text-sm text-gray-600">{property.sqft} sqft</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{property.price}</span>
                      <span className="text-xs text-gray-400">{property.daysAgo} days ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="flex justify-center">
              <button className="px-6 py-3 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors flex items-center gap-2">
                View All Properties
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Activity and Recommendations */}
          <div className="space-y-6">
            {/* Upcoming Viewings */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Viewings</h2>
                <FiClock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {upcomingViewings.map((viewing) => (
                  <div key={viewing.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiOutlineCalendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{viewing.property}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{viewing.date}</p>
                      <p className="text-xs text-gray-400 mt-1">Agent: {viewing.agent}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      viewing.status === "confirmed" 
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}>
                      {viewing.status}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Schedule New Viewing
              </button>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-xl border border-primary/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BsFillHouseHeartFill className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">Recommended for You</h2>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Based on your search history and saved properties
              </p>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm">{rec.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.location}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-primary">{rec.price}</span>
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                          {rec.match} match
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <FiTrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-gray-600 flex-1">You saved <span className="font-medium text-gray-800">Luxury Villa</span></p>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-600 flex-1">Viewing scheduled for <span className="font-medium text-gray-800">Downtown Loft</span></p>
                  <span className="text-xs text-gray-400">5h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-gray-600 flex-1">New message from <span className="font-medium text-gray-800">Agent Sarah</span></p>
                  <span className="text-xs text-gray-400">1d ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <p className="text-gray-600 flex-1">Price drop on <span className="font-medium text-gray-800">Beach House</span></p>
                  <span className="text-xs text-gray-400">2d ago</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all text-center">
                <HiOutlineHeart className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-600">Saved</span>
                <span className="block text-lg font-bold text-gray-800">24</span>
              </button>
              <button className="p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all text-center">
                <HiOutlinePhotograph className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-600">Tours</span>
                <span className="block text-lg font-bold text-gray-800">6</span>
              </button>
              <button className="p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all text-center">
                <HiOutlineStar className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-600">Reviews</span>
                <span className="block text-lg font-bold text-gray-800">12</span>
              </button>
              <button className="p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all text-center">
                <HiOutlineChartBar className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-600">Insights</span>
                <span className="block text-lg font-bold text-gray-800">New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}