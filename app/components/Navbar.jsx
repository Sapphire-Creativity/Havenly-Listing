"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBriefcase,
  FiLogIn,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingEstate } from "react-icons/tb";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const role = user?.unsafeMetadata?.role;

  const handleSignOut = async () => {
    await signOut();
    window.location.replace("/auth/login");
  };

  const dashboardHref =
    role === "owner"
      ? "/propertyowner/owner-dashboard"
      : "/client/client-dashboard";

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome className="w-5 h-5" /> },

    {
      name: "Buy",
      href: "/buy",
      icon: <MdOutlineRealEstateAgent className="w-5 h-5" />,
    },
    {
      name: "Rent",
      href: "/rent",
      icon: <HiOutlineBuildingOffice2 className="w-5 h-5" />,
    },
    {
      name: "Shortlet",
      href: "/shortlet",
      icon: <FiBriefcase className="w-5 h-5" />,
    },
  ];

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 20);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <nav className="sticky top-0 z-90 transition-all duration-300 bg-white py-4 ">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-9 h-9 bg-linear-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500"></div>
                <div className="absolute inset-2 bg-white rounded-md"></div>
              </div>
              <span className="text-md font-bold bg-linear-to-r from-primary-accent to-primary bg-clip-text text-transparent">
                Havenly Listing
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between  space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 "
              >
                <div className="flex items-center space-x-2">
                  {link.icon}
                  <span className="font-medium text-gray-700 group-hover:text-primary-accent transition-colors">
                    {link.name}
                  </span>
                </div>
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-primary-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}

          <div className="hidden lg:flex items-center space-x-4">
            {!isLoaded ? null : isSignedIn ? (
              <>
                <>
                  <Link
                    href={dashboardHref}
                    className="group flex items-center space-x-2 px-5 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:border-primary-accent hover:text-primary-accent hover:shadow-md"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="group flex items-center space-x-2 px-7 py-3 rounded-full bg-linear-to-r from-primary-accent to-primary text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-accent/25"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              </>
            ) : (
              <>
                <button className="group relative px-7 py-3 rounded-full bg-linear-to-r from-primary-accent to-primary text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-accent/25">
                  <span className="relative z-10">List Property</span>
                </button>

                <Link
                  href="/auth/signup/"
                  className="group flex items-center space-x-2 px-7 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:border-primary-accent hover:text-primary-accent hover:shadow-md"
                >
                  <FiLogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Sign In / Out Button */}
          {isSignedIn ? (
            <button
              onClick={handleSignOut}
              className="lg:hidden group flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:border-primary-accent hover:text-primary-accent"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/auth/signup/"
              className="lg:hidden group flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium transition-all duration-300 hover:border-primary-accent hover:text-primary-accent"
            >
              <FiLogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? "rotate-45 top-2.5" : ""
                }`}
              ></span>
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`absolute bottom-0 left-0 w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 bottom-2.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Modern Mobile Menu with Glass Morphism */}
      <div
        className={`lg:hidden fixed inset-0 z-100 transition-all duration-500 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {/* Logo with animation */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="w-9 h-9 bg-linear-to-r from-primary-accent to-primary rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-500"></div>
                    <div className="absolute inset-2 bg-white rounded-md"></div>
                  </div>
                  <span className="text-md font-bold bg-linear-to-r from-primary-accent to-primary bg-clip-text text-transparent">
                    Havenly Listing
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-6">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-3 p-4 rounded-xl hover:bg-linear-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300 group"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors">
                      {link.icon}
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-primary-accent">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Footer */}
          {/* <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
            

            <button
              className="w-full py-3.5 px-6 rounded-full bg-linear-to-r from-primary-accent to-primary border text-white font-medium transition-all duration-600 hover:bg-none hover:border-primary hover:text-primary active:scale-95"
              onClick={() => setMobileOpen(false)}
            >
              List Property
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
