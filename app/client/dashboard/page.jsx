"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineChevronRight,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from "react-icons/hi";
import { FiTrendingUp, FiClock } from "react-icons/fi";
import { useUser } from "@clerk/nextjs";
import { useSaved } from "../../../hooks/useSaved";
import { supabase } from "../../../lib/supabase";
import PropertyCard from "../../(public)/components/PropertyCard";
import Link from "next/link";

// ─── Skeletons ────────────────────────────────────────────────────────────────
const StatSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="w-14 h-5 bg-gray-200 rounded-full" />
    </div>
    <div className="h-7 bg-gray-200 rounded w-12 mb-1.5" />
    <div className="h-3 bg-gray-200 rounded w-28" />
  </div>
);

const PropertySkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse flex">
    <div className="w-2/5 bg-gray-200 min-h-[160px]" />
    <div className="w-3/5 p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export default function ClientDashboardOverview() {
  const router = useRouter();
  const { user } = useUser();
  const { savedCount } = useSaved();

  const [viewMode, setViewMode] = useState("list"); // Changed default to "list"
  const [newListings, setNewListings] = useState([]);
  const [upcomingViewings, setUpcomingViewings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingViewings, setLoadingViewings] = useState(true);
  const [viewingStats, setViewingStats] = useState({ total: 0, pending: 0 });

  // ─── Fetch newest properties ───────────────────────────────────────────────
  useEffect(() => {
    const fetchNewListings = async () => {
      setLoadingListings(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_available", true)
        .order("date_listed", { ascending: false })
        .limit(4);
      if (error) console.error("Error fetching listings:", error);
      else setNewListings(data || []);
      setLoadingListings(false);
    };
    fetchNewListings();
  }, []);

  // ─── Fetch client's viewings ───────────────────────────────────────────────
  useEffect(() => {
    const fetchViewings = async () => {
      if (!user) return;
      setLoadingViewings(true);
      const { data, error } = await supabase
        .from("inquiries")
        .select(`*, properties(title, location)`)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching viewings:", error);
      } else {
        const all = data || [];
        setUpcomingViewings(
          all.filter((v) => v.status === "confirmed" || v.status === "pending").slice(0, 3)
        );
        setViewingStats({
          total: all.length,
          pending: all.filter((v) => v.status === "pending").length,
        });
        setRecentActivity(
          all.slice(0, 4).map((v) => ({
            id: v.id,
            property: v.properties?.title || "a property",
            status: v.status,
            date: new Date(v.created_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric",
            }),
            dotColor:
              v.status === "confirmed" ? "bg-green-500" :
              v.status === "declined" ? "bg-rose-500" :
              v.status === "rescheduled" ? "bg-violet-500" :
              "bg-amber-500",
          }))
        );
      }
      setLoadingViewings(false);
    };
    fetchViewings();
  }, [user]);

  // ─── Handle responsive view mode ───────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      // Force list view on screens smaller than 1024px (lg breakpoint)
      if (window.innerWidth < 1024) {
        setViewMode("list");
      }
    };
    
    // Set initial view mode based on screen size
    handleResize();
    
    // Add event listener for resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    {
      id: 1, title: "Saved Properties", value: savedCount,
      change: "View all →", href: "/client/dashoard/saved-properties",
      icon: HiOutlineHeart, bgColor: "bg-rose-50", textColor: "text-rose-600",
    },
    {
      id: 2, title: "Viewing Requests", value: viewingStats.total,
      change: `${viewingStats.pending} pending`, href: "/client/dashboard/contacted",
      icon: HiOutlineCalendar, bgColor: "bg-blue-50", textColor: "text-blue-600",
    },
    {
      id: 3, title: "New Listings", value: newListings.length,
      change: "Updated daily", href: "/buy",
      icon: HiOutlineHome, bgColor: "bg-emerald-50", textColor: "text-emerald-600",
    },
  ];

  const handleCardClick = (property) => {
    if (!property?.id) return;
    const map = { rent: "rent", buy: "buy", shortlet: "shortlet" };
    router.push(`/${map[property.listing_type] || "buy"}/${property.id}`);
  };

  const statusColor = (status) => ({
    confirmed: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    declined: "bg-rose-50 text-rose-600",
    rescheduled: "bg-violet-50 text-violet-600",
  }[status] || "bg-gray-50 text-gray-600");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Here's what's happening with your property search
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-6">

        {/* Stats — always 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {loadingViewings
            ? [1, 2, 3].map((i) => <StatSkeleton key={i} />)
            : stats.map((stat) => (
                <Link
                  href={stat.href}
                  key={stat.id}
                  className="bg-white rounded-xl p-3 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className={`w-8 h-8 sm:w-11 sm:h-11 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.textColor}`} />
                    </div>
                    <span className="text-xs text-gray-400 hidden md:block">{stat.change}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.title}</p>
                </Link>
              ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Left — Listings (takes 2/3 on desktop) */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">Newly Listed Properties</h2>
              {/* Only show toggle buttons on large screens and above */}
              <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-400"}`}
                >
                  <HiOutlineViewGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-gray-400"}`}
                >
                  <HiOutlineViewList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {loadingListings ? (
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((i) => <PropertySkeleton key={i} />)}
              </div>
            ) : newListings.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                <p className="text-sm text-gray-400">No properties found.</p>
              </div>
            ) : (
              <div className={`grid gap-3 ${
                viewMode === "grid" 
                  ? "grid-cols-1 xl:grid-cols-2" // Only 2 columns on xl screens and above
                  : "grid-cols-1"
              }`}>
                {newListings.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    handleCardClick={handleCardClick}
                    listingType={property.listing_type}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center pt-1">
              <Link
                href="/buy"
                className="px-4 py-2 text-xs sm:text-sm text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors flex items-center gap-1"
              >
                View All Properties
                <HiOutlineChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right — Compact sidebar (1/3 on desktop, full width on mobile) */}
          <div className="space-y-3 sm:space-y-4">

            {/* Upcoming Viewings */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Upcoming Viewings</h2>
                <FiClock className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {loadingViewings ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingViewings.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">No upcoming viewings</p>
              ) : (
                <div className="space-y-8">
                  {upcomingViewings.map((viewing) => (
                    <div key={viewing.id} className="flex items-start gap-2 my-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HiOutlineCalendar className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                          {viewing.properties?.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {viewing.viewing_date} · {viewing.viewing_time}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 px-1.5 py-0.5 text-xs font-medium rounded-full ${statusColor(viewing.status)}`}>
                        {viewing.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/client/dashboard/contacted"
                className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              >
                View All Bookings
                <HiOutlineChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Recent Activity</h2>
                <FiTrendingUp className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {loadingViewings ? (
                <div className="space-y-2.5 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-200 rounded-full flex-shrink-0" />
                      <div className="h-3 bg-gray-200 rounded flex-1" />
                      <div className="h-2.5 bg-gray-200 rounded w-10" />
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">No recent activity</p>
              ) : (
                <div className="space-y-2.5">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${item.dotColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Viewing request for{" "}
                          <span className="font-semibold text-gray-800">{item.property}</span>
                        </p>
                        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}