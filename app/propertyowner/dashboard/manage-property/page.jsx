"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../../lib/supabase";
import { FaPlus, FaEdit, FaTrash, FaBed, FaBath, FaCar } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { TbDimensions } from "react-icons/tb";
import DeleteModal from "../../../(public)/components/dashboardcomponents/DeleteModal";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    "For Rent": "bg-blue-100 text-blue-700",
    "For Sale": "bg-green-100 text-green-700",
    "For Shortlet": "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

// ─── Property Card ────────────────────────────────────────────────────────────
const PropertyCard = ({ property, onEdit, onDelete }) => {
  const formatPrice = () => {
    if (property.status === "For Shortlet" && property.pricing?.nightlyRate) {
      return `₦${Number(property.pricing.nightlyRate).toLocaleString()}/night`;
    } else if (
      property.status === "For Rent" &&
      property.pricing?.rentPerYear
    ) {
      return `₦${Number(property.pricing.rentPerYear).toLocaleString()}/yr`;
    } else if (property.status === "For Sale" && property.pricing?.salePrice) {
      return `₦${Number(property.pricing.salePrice).toLocaleString()}`;
    }
    return "Price on request";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} />
        </div>
        {/* Available Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              property.is_available
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {property.is_available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <CiLocationOn />
          <span>
            {property.location}, {property.state}
          </span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-primary mb-4">{formatPrice()}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.beds > 0 && (
            <span className="flex items-center gap-1">
              <FaBed className="text-primary-accent" /> {property.beds} beds
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaBath className="text-primary-accent" /> {property.baths} baths
          </span>
          {property.square_meters && (
            <span className="flex items-center gap-1">
              <TbDimensions className="text-primary-accent" />{" "}
              {property.square_meters}m²
            </span>
          )}
        </div>

        {/* Property type */}
        <p className="text-xs text-gray-400 mb-4">
          {property.property_category} · {property.property_type}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(property)}
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-full text-sm font-medium transition-colors"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(property)}
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded-full text-sm font-medium transition-colors"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded-full" />
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ManageProperties = () => {
  const { user } = useUser();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // ─── Fetch owner's properties ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("date_listed", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();

    // ✅ refetch when user comes back from edit page
    window.addEventListener("focus", fetchProperties);
    return () => window.removeEventListener("focus", fetchProperties);
  }, [user]);
  // ─── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", deleteTarget.id)
      .eq("owner_id", user.id); // extra safety check

    setDeleteLoading(false);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete property. Please try again.");
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // ─── Filter properties ──────────────────────────────────────────────────────
  const filteredProperties = properties.filter((p) => {
    if (filter === "all") return true;
    if (filter === "rent") return p.status === "For Rent";
    if (filter === "buy") return p.status === "For Sale";
    if (filter === "shortlet") return p.status === "For Shortlet";
    if (filter === "unavailable") return !p.is_available;
    return true;
  });

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total: properties.length,
    forRent: properties.filter((p) => p.status === "For Rent").length,
    forSale: properties.filter((p) => p.status === "For Sale").length,
    shortlet: properties.filter((p) => p.status === "For Shortlet").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-500 mt-1">Manage your listed properties</p>
          </div>
          <button
            onClick={() => router.push("/propertyowner/dashboard/add-property")}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-accent text-white rounded-full font-medium transition-colors"
          >
            <FaPlus /> Add Property
          </button>
        </div>

        

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: "All", value: "all" },
            { label: "For Rent", value: "rent" },
            { label: "For Sale", value: "buy" },
            { label: "Shortlet", value: "shortlet" },
            { label: "Unavailable", value: "unavailable" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-primary hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">
              {filter === "all"
                ? "You haven't listed any properties yet."
                : `No ${filter} properties found.`}
            </p>
            {filter === "all" && (
              <button
                onClick={() =>
                  router.push("/propertyowner/dashboard/add-property")
                }
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium mx-auto transition-colors hover:bg-primary-accent"
              >
                <FaPlus /> Add Your First Property
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={(p) =>
                  router.push(
                    `/propertyowner/dashboard/manage-property/${p.id}/edit`,
                  )
                }
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          property={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ManageProperties;
