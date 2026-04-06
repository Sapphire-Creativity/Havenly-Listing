"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../../lib/supabase";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoCallOutline,
  IoMailOutline,
  IoHomeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefreshCircle,
  IoChatbubbleEllipsesOutline,
  IoChevronDown,
  IoChevronUp,
  IoTimeSharp,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    icon: <IoTimeSharp className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
    icon: <IoCheckmarkCircle className="w-3.5 h-3.5" />,
  },
  declined: {
    label: "Declined",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-400",
    dot: "bg-rose-400",
    icon: <IoCloseCircle className="w-3.5 h-3.5" />,
  },
  rescheduled: {
    label: "Rescheduled",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
    icon: <IoRefreshCircle className="w-3.5 h-3.5" />,
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

// ─── Action Modal ─────────────────────────────────────────────────────────────
const ActionModal = ({ inquiry, action, onClose, onDone }) => {
  const [message, setMessage] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM",
  ];

  const actionConfig = {
    confirmed: {
      title: "Confirm Viewing",
      subtitle: "Let the client know their viewing is confirmed",
      buttonLabel: "Confirm Viewing",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700",
      icon: <IoCheckmarkCircle className="w-5 h-5" />,
      messagePlaceholder: "e.g. Your viewing is confirmed! Please arrive 5 minutes early.",
    },
    declined: {
      title: "Decline Request",
      subtitle: "Let the client know you're unable to accommodate this request",
      buttonLabel: "Decline Request",
      buttonClass: "bg-rose-600 hover:bg-rose-700",
      icon: <IoCloseCircle className="w-5 h-5" />,
      messagePlaceholder: "e.g. Sorry, the property is no longer available on this date.",
    },
    rescheduled: {
      title: "Propose New Time",
      subtitle: "Suggest an alternative date and time for the viewing",
      buttonLabel: "Send Reschedule",
      buttonClass: "bg-violet-600 hover:bg-violet-700",
      icon: <IoRefreshCircle className="w-5 h-5" />,
      messagePlaceholder: "e.g. The requested time isn't available, but I can do the new time below.",
    },
  };

  const config = actionConfig[action];
  if (!config) return null;

  const handleSubmit = async () => {
    if (action === "rescheduled" && (!rescheduleDate || !rescheduleTime)) return;
    setLoading(true);

    const update = {
      status: action,
      owner_message: message || null,
      responded_at: new Date().toISOString(),
      ...(action === "rescheduled" && {
        reschedule_date: rescheduleDate,
        reschedule_time: rescheduleTime,
      }),
    };

    const { error } = await supabase
      .from("inquiries")
      .update(update)
      .eq("id", inquiry.id);

    setLoading(false);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onDone(inquiry.id, update);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
      >
        {success ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <IoCheckmarkCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <p className="text-xl font-bold text-gray-900">Done!</p>
            <p className="text-gray-500 text-sm mt-1">The inquiry has been updated.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${config.buttonClass.split(" ")[0]}`}>
                {config.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{config.title}</h3>
                <p className="text-xs text-gray-400">{config.subtitle}</p>
              </div>
            </div>

            {/* Client Request Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Client's Request</p>
              <p className="font-semibold text-gray-800 text-sm">{inquiry.client_name}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <IoCalendarOutline className="w-3.5 h-3.5" /> {inquiry.viewing_date}
                </span>
                <span className="flex items-center gap-1">
                  <IoTimeOutline className="w-3.5 h-3.5" /> {inquiry.viewing_time}
                </span>
              </div>
            </div>

            {/* Reschedule fields */}
            {action === "rescheduled" && (
              <div className="mb-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Proposed New Schedule</p>
                <input
                  type="date"
                  min={today}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRescheduleTime(t)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        rescheduleTime === t
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-violet-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                Message to Client{" "}
                <span className="text-gray-300 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={config.messagePlaceholder}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (action === "rescheduled" && (!rescheduleDate || !rescheduleTime))}
                className={`flex-1 py-3 text-white rounded-full text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2 ${config.buttonClass}`}
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : config.buttonLabel}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ─── Inquiry Card ─────────────────────────────────────────────────────────────
const InquiryCard = ({ inquiry, onAction }) => {
  const [expanded, setExpanded] = useState(false);

  const initials = inquiry.client_name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const avatarColor = avatarColors[inquiry.client_name?.charCodeAt(0) % avatarColors.length];
  const isPending = inquiry.status === "pending";
  const statusBar = STATUS[inquiry.status]?.bar || "bg-amber-400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Status accent bar */}
      <div className={`h-1 w-full ${statusBar}`} />

      <div className="p-5">
        {/* Row 1: Avatar + Name + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{inquiry.client_name}</p>
              <p className="text-xs text-gray-400">
                {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </p>
            </div>
          </div>
          <StatusBadge status={inquiry.status} />
        </div>

        {/* Property */}
        {inquiry.properties && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-3">
            <IoHomeOutline className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-700 truncate">{inquiry.properties.title}</span>
            <span className="text-gray-300">·</span>
            <span className="truncate">{inquiry.properties.location}</span>
          </div>
        )}

        {/* Viewing Schedule Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            <IoCalendarOutline className="w-3.5 h-3.5" /> {inquiry.viewing_date}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            <IoTimeOutline className="w-3.5 h-3.5" /> {inquiry.viewing_time}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            <IoPeopleOutline className="w-3.5 h-3.5" /> {inquiry.attendees} {inquiry.attendees === 1 ? "person" : "people"}
          </span>
        </div>

        {/* Rescheduled new time */}
        {inquiry.status === "rescheduled" && inquiry.reschedule_date && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-violet-600 mb-1.5">Proposed New Time</p>
            <div className="flex gap-3 text-xs text-violet-700 font-medium">
              <span className="flex items-center gap-1">
                <IoCalendarOutline className="w-3.5 h-3.5" /> {inquiry.reschedule_date}
              </span>
              <span className="flex items-center gap-1">
                <IoTimeOutline className="w-3.5 h-3.5" /> {inquiry.reschedule_time}
              </span>
            </div>
          </div>
        )}

        {/* Owner message */}
        {inquiry.owner_message && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-1">Your message</p>
            <p className="text-sm text-gray-700">{inquiry.owner_message}</p>
          </div>
        )}

        {/* Expandable Contact Details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          <span className="font-semibold">Client Contact Details</span>
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
              <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                <a
                  href={`tel:${inquiry.client_phone}`}
                  className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <IoCallOutline className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{inquiry.client_phone}</span>
                </a>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <IoMailOutline className="w-4 h-4" />
                  </div>
                  <span>{inquiry.client_email}</span>
                </div>
                {inquiry.message && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-semibold mb-1">Client's note</p>
                    <p className="text-sm text-gray-600 italic">"{inquiry.message}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      {isPending ? (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium mb-3">How would you like to respond?</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAction(inquiry, "confirmed")}
              className="flex flex-col items-center gap-1.5 py-3 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <IoCheckmarkCircle className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-xs font-semibold text-gray-500 group-hover:text-emerald-700 transition-colors">Confirm</span>
            </button>
            <button
              onClick={() => onAction(inquiry, "rescheduled")}
              className="flex flex-col items-center gap-1.5 py-3 bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-300 rounded-xl transition-all group"
            >
              <IoRefreshCircle className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
              <span className="text-xs font-semibold text-gray-500 group-hover:text-violet-700 transition-colors">Reschedule</span>
            </button>
            <button
              onClick={() => onAction(inquiry, "declined")}
              className="flex flex-col items-center gap-1.5 py-3 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 rounded-xl transition-all group"
            >
              <IoCloseCircle className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
              <span className="text-xs font-semibold text-gray-500 group-hover:text-rose-700 transition-colors">Decline</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Responded{" "}
            {inquiry.responded_at &&
              new Date(inquiry.responded_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric",
              })}
          </p>
          <button
            onClick={() => onAction(inquiry, "pending")}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium underline underline-offset-2 transition-colors"
          >
            Reopen
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-1 bg-gray-200" />
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-8 bg-gray-200 rounded-xl mb-3" />
      <div className="flex gap-2">
        <div className="h-7 bg-gray-200 rounded-full w-28" />
        <div className="h-7 bg-gray-200 rounded-full w-24" />
        <div className="h-7 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const OwnerInquiries = () => {
  const { user } = useUser();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("inquiries")
        .select(`*, properties(title, location, state)`)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inquiries:", error);
      } else {
        setInquiries(data || []);
      }
      setLoading(false);
    };

    fetchInquiries();
  }, [user]);

  const handleAction = (inquiry, action) => {
    if (action === "pending") {
      supabase
        .from("inquiries")
        .update({
          status: "pending",
          owner_message: null,
          responded_at: null,
          reschedule_date: null,
          reschedule_time: null,
        })
        .eq("id", inquiry.id)
        .then(({ error }) => {
          if (!error) {
            setInquiries((prev) =>
              prev.map((inq) =>
                inq.id === inquiry.id
                  ? { ...inq, status: "pending", owner_message: null, responded_at: null, reschedule_date: null, reschedule_time: null }
                  : inq
              )
            );
          }
        });
      return;
    }
    setActionTarget(inquiry);
    setActionType(action);
  };

  const handleDone = (id, update) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, ...update } : inq))
    );
  };

  const filtered = inquiries.filter((inq) =>
    filter === "all" ? true : inq.status === filter
  );

  const stats = {
    all: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    confirmed: inquiries.filter((i) => i.status === "confirmed").length,
    declined: inquiries.filter((i) => i.status === "declined").length,
    rescheduled: inquiries.filter((i) => i.status === "rescheduled").length,
  };

 

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Rescheduled", value: "rescheduled" },
    { label: "Declined", value: "declined" },
  ];

  return (
    <div className="min-h-screen  py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inquiries</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage and respond to viewing requests from clients</p>
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
              {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Viewing requests from clients will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((inquiry) => (
                <InquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  onAction={handleAction}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {actionTarget && actionType && (
          <ActionModal
            inquiry={actionTarget}
            action={actionType}
            onClose={() => { setActionTarget(null); setActionType(null); }}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerInquiries;