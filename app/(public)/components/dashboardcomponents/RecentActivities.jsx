import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { HiOutlineCalendar, HiOutlineEye } from "react-icons/hi2";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../../lib/supabase";
import Link from "next/link";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// ─── Format relative time ──────────────────────────────────────────────────────
const timeAgo = (dateString) => {
  if (!dateString) return "Just now";
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Status color config ──────────────────────────────────────────────────────
const statusConfig = {
  pending: { color: "text-amber-500", bgColor: "bg-amber-50", dot: "bg-amber-400" },
  confirmed: { color: "text-green-500", bgColor: "bg-green-50", dot: "bg-green-400" },
  declined: { color: "text-rose-500", bgColor: "bg-rose-50", dot: "bg-rose-400" },
  rescheduled: { color: "text-violet-500", bgColor: "bg-violet-50", dot: "bg-violet-400" },
};

const RecentActivities = () => {
  const { user } = useUser();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          id,
          status,
          client_name,
          viewing_date,
          viewing_time,
          created_at,
          properties(title)
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching activities:", error);
      } else {
        // map each inquiry into an activity item
        const mapped = (data || []).map((inq) => {
          const s = statusConfig[inq.status] || statusConfig.pending;

          let message = "";
          let icon = FiMessageSquare;

          if (inq.status === "pending") {
            message = `New inquiry from ${inq.client_name}`;
            icon = FiMessageSquare;
          } else if (inq.status === "confirmed") {
            message = `Viewing confirmed with ${inq.client_name}`;
            icon = HiOutlineCalendar;
          } else if (inq.status === "declined") {
            message = `Inquiry declined for ${inq.properties?.title}`;
            icon = FiMessageSquare;
          } else if (inq.status === "rescheduled") {
            message = `Viewing rescheduled for ${inq.client_name}`;
            icon = HiOutlineCalendar;
          }

          const subtitle = inq.properties?.title
            ? `${inq.properties.title} · ${inq.viewing_date || "No date set"}`
            : inq.viewing_date || "";

          return {
            id: inq.id,
            message,
            subtitle,
            time: timeAgo(inq.created_at),
            icon,
            color: s.color,
            bgColor: s.bgColor,
            dot: s.dot,
          };
        });

        setActivities(mapped);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [user]);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    >
      <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Activities</h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 p-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiMessageSquare className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">No recent activities yet</p>
          <p className="text-xs text-gray-300 mt-1">Inquiries will appear here</p>
        </div>
      )}

      {/* Activities list */}
      {!loading && activities.length > 0 && (
        <div className="space-y-1">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-default"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg flex-shrink-0 ${activity.bgColor}`}>
                <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {activity.message}
                </p>
                {activity.subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{activity.subtitle}</p>
                )}
                <span className="text-xs text-gray-300 mt-0.5 block">{activity.time}</span>
              </div>

              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${activity.dot}`} />
            </motion.div>
          ))}
        </div>
      )}

      {/* View all */}
      <Link href="/propertyowner/dashboard/inquiries">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full mt-4 py-3 text-center text-xs text-primary font-semibold hover:bg-primary/5 rounded-full transition-all"
        >
          View All Inquiries →
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default RecentActivities;