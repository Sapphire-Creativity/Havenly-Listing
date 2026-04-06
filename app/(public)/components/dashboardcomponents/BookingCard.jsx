import React from 'react'
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

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";



const STATUS = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    icon: <IoTimeSharp className="w-3.5 h-3.5" />,
    description: "Waiting for the owner to respond",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
    icon: <IoCheckmarkCircle className="w-3.5 h-3.5" />,
    description: "Your viewing has been confirmed!",
  },
  declined: {
    label: "Declined",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-400",
    dot: "bg-rose-400",
    icon: <IoCloseCircle className="w-3.5 h-3.5" />,
    description: "The owner couldn't accommodate this request",
  },
  rescheduled: {
    label: "Rescheduled",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
    icon: <IoRefreshCircle className="w-3.5 h-3.5" />,
    description: "The owner has proposed a new time",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};


const BookingCard = ({ booking, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const s = STATUS[booking.status] || STATUS.pending;
  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";
  const isRescheduled = booking.status === "rescheduled";
  const isDeclined = booking.status === "declined";

  const listingTypeToRoute = {
    rent: "rent",
    buy: "buy",
    shortlet: "shortlet",
  };

  const handleViewProperty = () => {
    const route = listingTypeToRoute[booking.properties?.listing_type] || "buy";
    router.push(`/${route}/${booking.property_id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Status accent bar */}
      <div className={`h-1 w-full ${s.bar}`} />

      <div className="p-5">
        {/* Property Info */}
        <div className="flex gap-3 mb-4">
          {/* Property Image */}
          <div
            className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={handleViewProperty}
          >
            {booking.properties?.images?.[0] ? (
              <Image
                src={booking.properties.images[0]}
                alt={booking.properties.title}
                fill
                className="object-cover hover:scale-105 transition-transform"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <IoHomeOutline className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                onClick={handleViewProperty}
              >
                {booking.properties?.title}
              </h3>
              <StatusBadge status={booking.status} />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <IoLocationOutline className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {booking.properties?.location}, {booking.properties?.state}
              </span>
            </div>
            <p className="text-xs text-gray-400 italic">{s.description}</p>
          </div>
        </div>

        {/* Requested Schedule */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Your Requested Schedule
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
              <IoCalendarOutline className="w-3.5 h-3.5" /> {booking.viewing_date}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
              <IoTimeOutline className="w-3.5 h-3.5" /> {booking.viewing_time}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
              <IoPeopleOutline className="w-3.5 h-3.5" /> {booking.attendees} {booking.attendees === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        {/* Confirmed Schedule Banner */}
        {isConfirmed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3">
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-700">Viewing Confirmed!</p>
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              Your viewing is scheduled for {booking.viewing_date} at {booking.viewing_time}.
            </p>
          </div>
        )}

        {/* Rescheduled Banner */}
        {isRescheduled && booking.reschedule_date && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs font-bold text-violet-700 mb-1.5">
              Owner Proposed a New Time
            </p>
            <div className="flex gap-3 text-xs text-violet-700 font-medium">
              <span className="flex items-center gap-1">
                <IoCalendarOutline className="w-3.5 h-3.5" /> {booking.reschedule_date}
              </span>
              <span className="flex items-center gap-1">
                <IoTimeOutline className="w-3.5 h-3.5" /> {booking.reschedule_time}
              </span>
            </div>
          </div>
        )}

        {/* Declined Banner */}
        {isDeclined && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-3">
            <div className="flex items-center gap-2">
              <IoCloseCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-xs font-bold text-rose-600">Request Declined</p>
            </div>
            <p className="text-xs text-rose-500 mt-1">
              You can schedule a new viewing at a different time.
            </p>
          </div>
        )}

        {/* Owner Message */}
        {booking.owner_message && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs font-semibold text-gray-400 mb-1">Message from Owner</p>
            <p className="text-sm text-gray-700 italic">"{booking.owner_message}"</p>
          </div>
        )}

        {/* Expandable - Your submitted message */}
        {booking.message && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              <span className="font-semibold">Your Note</span>
              {expanded ? <IoChevronUp className="w-4 h-4" /> : <IoChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 border-t border-gray-100 mt-1">
                    <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Submitted{" "}
          {new Date(booking.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewProperty}
            className="text-xs text-primary font-semibold hover:underline underline-offset-2 transition-colors"
          >
            View Property
          </button>
          {(isPending || isDeclined) && (
            <button
              onClick={() => onCancel(booking)}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default BookingCard
