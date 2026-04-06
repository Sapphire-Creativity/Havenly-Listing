"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  HiOutlineHome,
  HiOutlineEye,
  HiOutlineChartBar,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineStar,
  HiOutlinePlus,
} from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { BsFillGridFill, BsListUl } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import StatsCard from "../../(public)/components/dashboardcomponents/StatsCard";
import RecentActivities from "../../(public)/components/dashboardcomponents/RecentActivities";
import PropertyTrendsChart from "../../(public)/components/dashboardcomponents/PropertyTrendsChart";
import Link from "next/link";

// ─── Skeletons ────────────────────────────────────────────────────────────────
const StatSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 bg-gray-200 rounded-xl" />
      <div className="w-16 h-5 bg-gray-200 rounded-full" />
    </div>
    <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-32" />
  </div>
);

const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function OwnerDashboardOverview() {
  const { user } = useUser();
  const router = useRouter();

  const [viewMode, setViewMode] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  // ─── Fetch owner profile (business name) ──────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("full_name, business_name, phone")
        .eq("id", user.id)
        .single();
      if (data) setOwnerProfile(data);
    };
    fetchProfile();
  }, [user]);

  // ─── Fetch owner's properties ─────────────────────────────────────────────
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      setLoadingProps(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("date_listed", { ascending: false })
        .limit(6);
      if (error) console.error("Error fetching properties:", error);
      else setProperties(data || []);
      setLoadingProps(false);
    };
    fetchProperties();
  }, [user]);

  // ─── Fetch owner's inquiries ──────────────────────────────────────────────
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("owner_id", user.id);
      if (error) console.error("Error fetching inquiries:", error);
      else setInquiries(data || []);
      setLoading(false);
    };
    fetchInquiries();
  }, [user]);

  // ─── Derived stats ────────────────────────────────────────────────────────
  const totalProperties = properties.length;
  const activeListings = properties.filter((p) => p.is_available).length;
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter((i) => i.status === "pending").length;

  const statsCards = [
    {
      id: 1, title: "Total Properties", value: loading ? "—" : String(totalProperties),
      change: `${activeListings} active`,
      icon: HiOutlineHome, gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50", iconColor: "text-blue-600",
    },
    {
      id: 2, title: "Active Listings", value: loading ? "—" : String(activeListings),
      change: `${totalProperties - activeListings} inactive`,
      icon: HiOutlineEye, gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50", iconColor: "text-green-600",
    },
    {
      id: 3, title: "Total Inquiries", value: loading ? "—" : String(totalInquiries),
      change: `${pendingInquiries} pending`,
      icon: FiMessageSquare, gradient: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50", iconColor: "text-orange-600",
    },
    {
      id: 4, title: "Listed Properties", value: loading ? "—" : String(totalProperties),
      change: "View all →",
      icon: HiOutlineChartBar, gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50", iconColor: "text-purple-600",
    },
  ];

  const formatPrice = (property) => {
    if (property.status === "For Shortlet" && property.pricing?.nightlyRate)
      return `₦${Number(property.pricing.nightlyRate).toLocaleString()}/night`;
    if (property.status === "For Rent" && property.pricing?.rentPerYear)
      return `₦${Number(property.pricing.rentPerYear).toLocaleString()}/yr`;
    if (property.status === "For Sale" && property.pricing?.salePrice)
      return `₦${Number(property.pricing.salePrice).toLocaleString()}`;
    return "Price on request";
  };

  const statusStyle = (status) => ({
    "For Rent": "bg-blue-100 text-blue-600",
    "For Sale": "bg-green-100 text-green-600",
    "For Shortlet": "bg-purple-100 text-purple-600",
  }[status] || "bg-gray-100 text-gray-600");

  // display name — business name takes priority
  const displayName = user?.unsafeMetadata?.businessName || user?.firstName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">

      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 sm:mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
             <div className="space-y-1">
  <p className="text-gray-500">Welcome back,</p>

  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
    <span className="text-primary">{displayName}</span> 👋
  </h1>
</div>
           
            <p className="text-sm text-gray-400 mt-1">
              Here's what's happening with your properties
            </p>
          </div>

          <Link
            href="/propertyowner/dashboard/add-property"
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-accent text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Property
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        {loading
          ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
          : statsCards.map((card) => (
              <StatsCard key={card.id} card={card} />
            ))}
      </motion.div>

      {/* Analytics + Recent Activities */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <PropertyTrendsChart />
        </motion.div>
        <RecentActivities />
      </motion.div>

      {/* Properties Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Your Properties</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage and monitor your property listings
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-md text-blue-500" : "text-gray-400"}`}
              >
                <BsFillGridFill className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-md text-blue-500" : "text-gray-400"}`}
              >
                <BsListUl className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              href="/propertyowner/dashboard/manage-property"
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5"
            >
              Manage All
              <HiOutlineChevronDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loadingProps ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3].map((i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineHome className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium mb-4">No properties listed yet</p>
            <Link
              href="/propertyowner/dashboard/add-property"
              className="px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-accent transition-colors"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {properties.map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all ${viewMode === "list" ? "flex" : ""}`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden bg-gray-100 ${viewMode === "list" ? "w-40 sm:w-48 flex-shrink-0" : "w-full h-44"}`}>
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiOutlineHome className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  {/* Available badge */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${property.is_available ? "bg-green-400" : "bg-gray-400"}`} />
                </div>

                {/* Details */}
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-medium ${statusStyle(property.status)}`}>
                      {property.status}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400 text-xs mt-1 mb-3">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.location}, {property.state}</span>
                  </div>

                  <p className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                    {formatPrice(property)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{property.beds > 0 ? `${property.beds} beds` : "—"}</span>
                      <span>{property.baths} baths</span>
                      {property.square_meters && <span>{property.square_meters}m²</span>}
                    </div>

                    {/* Actions on hover */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push(`/propertyowner/dashboard/manage-property/${property.id}/edit`)}
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-all"
                        title="Edit"
                      >
                        <HiOutlineDocumentText className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push(`/${property.listing_type}/${property.id}`)}
                        className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-all"
                        title="View"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All */}
        {properties.length > 0 && (
          <div className="text-center mt-6">
            <Link
              href="/propertyowner/dashboard/manage-property"
              className="px-6 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all font-medium text-sm inline-block"
            >
              View All Properties
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}