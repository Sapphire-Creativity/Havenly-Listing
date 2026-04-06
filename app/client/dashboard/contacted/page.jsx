"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoHomeOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshCircle,
  IoTimeSharp,
  IoChevronDown,
  IoChevronUp,
  IoChatbubbleEllipsesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { supabase } from "../../../../lib/supabase";

import { motion, AnimatePresence } from "framer-motion";
import BookingCard from "../../../(public)/components/dashboardcomponents/BookingCard"

 

// ─── Cancel Modal ─────────────────────────────────────────────────────────────
const CancelModal = ({ booking, onClose, onCancelled }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", booking.id);

    setLoading(false);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      onCancelled(booking.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IoTrashOutline className="w-6 h-6 text-rose-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
          Cancel Booking?
        </h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          You're about to cancel your viewing request for:
        </p>
        <p className="text-sm font-semibold text-gray-800 text-center mb-5">
          "{booking.properties?.title}"
        </p>
        <p className="text-xs text-rose-600 bg-rose-50 rounded-xl p-3 text-center mb-5">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Yes, Cancel"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Booking Card ─────────────────────────────────────────────────────────────


// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-1 bg-gray-200" />
    <div className="p-5">
      <div className="flex gap-3 mb-4">
        <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-gray-200 rounded-full w-28" />
        <div className="h-7 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ClientBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          *,
          properties(id, title, location, state, images, listing_type)
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  const handleCancelled = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const filtered = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  const stats = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    rescheduled: bookings.filter((b) => b.status === "rescheduled").length,
    declined: bookings.filter((b) => b.status === "declined").length,
  };

 
  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Rescheduled", value: "rescheduled" },
    { label: "Declined", value: "declined" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-gray-400 mt-1 text-sm">Track your viewing requests and owner responses</p>
        </div>

        

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === tab.value
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {stats[tab.value] > 0 && tab.value !== "all" && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {stats[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IoChatbubbleEllipsesOutline className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-400">
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Your viewing requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={setCancelTarget}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelModal
            booking={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onCancelled={handleCancelled}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientBookings;