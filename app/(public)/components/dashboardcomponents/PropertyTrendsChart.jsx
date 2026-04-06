"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", views: 8450, inquiries: 812 },
  { month: "Feb", views: 10230, inquiries: 985 },
  { month: "Mar", views: 12450, inquiries: 1156 },
  { month: "Apr", views: 15670, inquiries: 1432 },
  { month: "May", views: 18230, inquiries: 1678 },
  { month: "Jun", views: 21450, inquiries: 1987 },
];

export default function PropertyTrendsChart() {
  const totalViews = monthlyData.reduce((sum, item) => sum + item.views, 0);
  const totalInquiries = monthlyData.reduce(
    (sum, item) => sum + item.inquiries,
    0,
  );

  return (
    <div className=" ">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Performance Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Views and inquiries across your listed properties
        </p>
      </div>

      

      {/* Chart */}
      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
              formatter={(value) => value.toLocaleString()}
            />

            <Line
              type="monotone"
              dataKey="views"
              stroke="#2563EB"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="inquiries"
              stroke="#059669"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
