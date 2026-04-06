"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlineScale,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineExclamation,
  HiOutlineX,
  HiOutlineCheck,
} from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { useClerk, useUser } from "@clerk/nextjs";

const icons = {
  Overview: HiOutlineHome,
  Saved: HiOutlineHeart,
  Compare: HiOutlineScale,
  Contacted: HiOutlinePhone,
  "Safety Center": HiOutlineShieldCheck,
  Profile: HiOutlineUser,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
     setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      window.location.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const role = user?.unsafeMetadata?.role;

  const links = [
    { name: "Overview", href: "/client/dashboard", icon: icons.Overview },
    {
      name: "Saved",
      href: "/client/dashboard/saved-properties",
      icon: icons.Saved,
      badge: 12,
    },
    {
      name: "Compare",
      href: "/client/dashboard/compare-properties",
      icon: icons.Compare,
    },
    {
      name: "Contacted",
      href: "/client/dashboard/contacted",
      icon: icons.Contacted,
      badge: 3,
    },
    {
      name: "Safety Center",
      href: "/client/dashboard/safety",
      icon: icons["Safety Center"],
    },
    { name: "Profile", href: "/client/dashboard/profile", icon: icons.Profile },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeInScale">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary-accent to-primary rounded-full" />

            {/* Close button */}
            <button
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoggingOut}
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="p-6 pt-8">
              {/* Icon with pulse animation */}
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
                <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-full w-20 h-20 flex items-center justify-center">
                  <HiOutlineExclamation className="w-10 h-10 text-red-500" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                Sign Out?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to sign out? You'll need to log in again
                to access your account.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  Stay
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing out...
                    </>
                  ) : (
                    <>
                      <HiOutlineLogout className="w-5 h-5" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>

              {/* Footer note */}
              <p className="text-xs text-center text-gray-400 mt-4">
                Your session will be securely ended
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"}
          shadow-xl md:shadow-xl
          flex flex-col
          bg-white text-gray-700 
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header with logo and collapse toggle */}
        <div
          className={`
          relative flex items-center h-16 px-4 border-b border-slate-700/50
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}
        >
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-9 h-9 bg-linear-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500"></div>
                <div className="absolute inset-2 bg-white rounded-md"></div>
              </div>
              <span className="text-md font-bold bg-linear-to-r from-primary-accent to-primary bg-clip-text text-transparent">
                Havenly Listing
              </span>
            </Link>
          )}

          {isCollapsed && (
            <Link href="/client/dashboard">
              <div className="relative">
                <div className="w-8 h-8 bg-linear-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500"></div>
                <div className="absolute inset-2 bg-white rounded-md"></div>
              </div>
            </Link>
          )}

          {/* Collapse toggle button - hidden on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary-accent transition-colors text-gray-700 hover:text-white"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <HiOutlineChevronDoubleRight className="w-4 h-4" />
            ) : (
              <HiOutlineChevronDoubleLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const IconComponent = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    group relative flex items-center px-3 py-4 rounded-xl
                    transition-all duration-200
                    ${isCollapsed ? "justify-center" : "justify-start"}
                    ${
                      isActive
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-700 hover:text-white hover:bg-primary-accent"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-accent rounded-r-full shadow-lg shadow-blue-500/50" />
                  )}

                  {/* Icon */}
                  <IconComponent
                    className={`
                    w-5 h-5 transition-transform duration-200
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                    ${isActive ? "text-primary" : "text-gray-700 group-hover:text-white"}
                  `}
                  />

                  {/* Label (hidden when collapsed) */}
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium flex-1">
                      {link.name}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                      {link.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer section */}
        <div
          className={`
    relative p-4 bg-primary rounded-t-2xl
    ${isCollapsed ? "flex flex-col items-center" : ""}
  `}
        >
          {/* User section - always visible */}
          <div
            className={`
      flex ${isCollapsed ? "flex-col items-center" : "items-center space-x-3"}
    `}
          >
            {/* Avatar - always visible */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl">
                <HiOutlineUser className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-800" />
            </div>

            {/* User info - only when expanded */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-100 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  {user?.unsafeMetadata?.role}
                </p>
              </div>
            )}
          </div>

          {/* Settings and Logout buttons */}
          <div
            className={`
    ${isCollapsed ? "mt-4 flex flex-col items-center space-y-2" : "mt-4 space-y-1.5"}
  `}
          >
            {/* Settings button - icon always visible, text only when expanded */}
            <button
              className={`
      transition-all duration-200 group
      ${
        isCollapsed
          ? "w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
          : "w-full px-3 py-3 text-sm text-slate-300 hover:text-gray-700 hover:bg-white rounded-xl flex items-center space-x-3"
      }
    `}
            >
              <HiOutlineCog
                className={`
        w-5 h-5 flex-shrink-0
        ${
          isCollapsed
            ? "text-slate-400 group-hover:text-white"
            : "text-slate-400 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-300"
        }
      `}
              />
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </button>

            {/* Logout button - icon always visible, text only when expanded */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`
      transition-all duration-200 group
      ${
        isCollapsed
          ? "w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
          : "w-full px-3 py-3 text-sm text-slate-300 hover:text-red-400 hover:bg-white rounded-xl flex items-center space-x-3"
      }
    `}
            >
              <HiOutlineLogout
                className={`
        w-5 h-5 flex-shrink-0
        ${
          isCollapsed
            ? "text-slate-400 group-hover:text-red-400"
            : "text-slate-400 group-hover:text-red-400"
        }
      `}
              />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Add this to your global CSS file for the animation */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
