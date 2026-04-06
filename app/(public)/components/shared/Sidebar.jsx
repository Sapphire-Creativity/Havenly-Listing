"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineExclamation,
  HiOutlineX,
  HiOutlineCheck,
} from "react-icons/hi";
import { useClerk, useUser } from "@clerk/nextjs";
import { clientLinks } from "./clientSidebarLinks";
import { propertyOwnerLinks } from "./propertyOwnerSidebarLinks";

const linkMap = {
  client: clientLinks,
  "property-owner": propertyOwnerLinks,
};

export default function Sidebar({ variant = "client" }) {
  const links = linkMap[variant];
  const pathname = usePathname();

  // On desktop: user can toggle. On mobile: always collapsed.
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // force collapsed on mobile
      if (mobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = () => {
    // only allow expand on desktop
    if (!isMobile) setIsCollapsed((prev) => !prev);
  };

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

  // collapsed state — true on mobile always, toggleable on desktop
  const collapsed = isMobile ? true : isCollapsed;

  if (!mounted) return null;

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeInScale">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary-accent to-primary rounded-full" />
            <button
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="p-6 pt-8">
              <div className="relative mx-auto w-20 h-20 mb-4">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
                <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-full w-20 h-20 flex items-center justify-center">
                  <HiOutlineExclamation className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Sign Out?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to sign out? You'll need to log in again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <HiOutlineCheck className="w-5 h-5" />
                  Stay
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/25"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
              <p className="text-xs text-center text-gray-400 mt-4">Your session will be securely ended</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          sticky top-0
          h-screen
          flex-shrink-0
          transition-all duration-300 ease-in-out
          flex flex-col
          bg-white text-gray-700
          shadow-lg
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center h-16 px-3 border-b border-gray-100 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed ? (
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500" />
                <div className="absolute inset-2 bg-white rounded-md" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-primary-accent to-primary bg-clip-text text-transparent whitespace-nowrap">
                Havenly Listing
              </span>
            </Link>
          ) : (
            <Link href="/">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-accent to-primary rounded-xl rotate-45" />
                <div className="absolute inset-2 bg-white rounded-md" />
              </div>
            </Link>
          )}

          {/* Toggle button — desktop only */}
          {!isMobile && (
            <button
              onClick={handleToggle}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-primary-accent/10 transition-colors text-gray-400 hover:text-primary flex-shrink-0"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <HiOutlineChevronDoubleRight className="w-3.5 h-3.5" />
              ) : (
                <HiOutlineChevronDoubleLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="space-y-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const IconComponent = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    group relative flex items-center px-2.5 py-3 rounded-xl
                    transition-all duration-200
                    ${collapsed ? "justify-center" : "justify-start"}
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-white hover:bg-primary-accent"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-full" />
                  )}

                  {/* Icon */}
                  <IconComponent
                    className={`
                      w-5 h-5 flex-shrink-0 transition-transform duration-200
                      ${isActive ? "text-primary scale-110" : "group-hover:scale-110 group-hover:text-white"}
                    `}
                  />

                  {/* Label */}
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium truncate">{link.name}</span>
                  )}

                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                      {link.name}
                      {/* tooltip arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className={`relative p-3 bg-primary rounded-t-2xl ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
          {/* User info */}
          <div className={`flex ${collapsed ? "justify-center" : "items-center gap-3"} mb-3`}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                <HiOutlineUser className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-white/70 truncate capitalize">{user?.unsafeMetadata?.role}</p>
              </div>
            )}
          </div>

          {/* Settings & Logout */}
          <div className={`${collapsed ? "flex flex-col items-center gap-1.5 w-full" : "space-y-1"}`}>
            <button
              className={`
                transition-all duration-200 group
                ${collapsed
                  ? "w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
                  : "w-full px-3 py-2.5 text-sm text-white/70 hover:text-gray-700 hover:bg-white rounded-xl flex items-center gap-3"
                }
              `}
            >
              <HiOutlineCog className={`w-4 h-4 flex-shrink-0 ${collapsed ? "text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300" : "group-hover:rotate-90 transition-all duration-300"}`} />
              {!collapsed && <span className="font-medium">Settings</span>}
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`
                transition-all duration-200 group
                ${collapsed
                  ? "w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
                  : "w-full px-3 py-2.5 text-sm text-white/70 hover:text-red-500 hover:bg-white rounded-xl flex items-center gap-3"
                }
              `}
            >
              <HiOutlineLogout className="w-4 h-4 flex-shrink-0 text-white/70 group-hover:text-red-500" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.2s ease-out;
        }
      `}</style>
    </>
  );
}