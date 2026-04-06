"use client"

import { HiOutlineUser } from "react-icons/hi2";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Topbar() {
  const { user } = useUser();
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Search */}
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-primary focus:primary-accent
                   transition-all duration-200 bg-gray-50/50 hover:bg-white
                   placeholder:text-gray-400 text-gray-700 text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 text-gray-600 hover:text-gray-900 
                         hover:bg-gray-100 rounded-xl transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <span className="sr-only">View notifications</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-medium text-gray-700">{user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs font-medium text-gray-700">{user?.unsafeMetadata?.phone}</p>
          </div>

          <button className="flex items-center gap-2 focus:outline-none group">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl">
                <HiOutlineUser className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary-accent rounded-full border-2 border-white" />
            </div>
            <svg
              className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
