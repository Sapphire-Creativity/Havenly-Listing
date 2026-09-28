"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBriefcase,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useClerk, useUser } from "@clerk/nextjs";

function NavbarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = user?.unsafeMetadata?.role;

  const dashboardHref =
    role === "owner" ? "/propertyowner/dashboard" : "/client/dashboard";

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: <FiHome className="w-[18px] h-[18px]" />,
    },
    {
      name: "Buy",
      href: "/buy",
      icon: <MdOutlineRealEstateAgent className="w-[19px] h-[19px]" />,
    },
    {
      name: "Rent",
      href: "/rent",
      icon: <HiOutlineBuildingOffice2 className="w-[19px] h-[19px]" />,
    },
    {
      name: "Shortlet",
      href: "/shortlet",
      icon: <FiBriefcase className="w-[18px] h-[18px]" />,
    },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.replace("/auth/login");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const signInHref = `/auth/signup${
    searchParams.get("redirect_url")
      ? `?redirect_url=${searchParams.get("redirect_url")}`
      : ""
  }`;

  return (
    <>
      <nav className="sticky top-0 z-[90] w-full border-b border-black/[0.06] bg-[#f5f1eb]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-[10px] bg-[#2f6b4f] transition-transform duration-300 group-hover:rotate-[55deg]" />
                <div className="relative h-4 w-4 rounded-[5px] bg-[#f5f1eb]" />
              </div>

              <span className="font-heading text-[17px] font-extrabold tracking-[-0.02em] text-[#2f6b4f]">
                Havenly Listing
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 rounded-full border border-black/[0.05] bg-white/60 p-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      relative flex items-center gap-2 rounded-full px-4 py-2.5
                      text-sm font-semibold transition-all duration-200
                      ${
                        active
                          ? "bg-[#2f6b4f] text-white shadow-sm"
                          : "text-[#1f2937]/70 hover:bg-white hover:text-[#2f6b4f]"
                      }
                    `}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {!isLoaded ? null : isSignedIn ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-full border border-[#2f6b4f]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#2f6b4f] transition-all hover:border-[#2f6b4f]/40 hover:bg-[#2f6b4f]/5"
                  >
                    <FiUser className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-full bg-[#2f6b4f] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#25563f] hover:shadow-lg hover:shadow-[#2f6b4f]/15"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button className="rounded-full bg-[#2f6b4f] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#25563f] hover:shadow-lg hover:shadow-[#2f6b4f]/15">
                    List Property
                  </button>

                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-2 rounded-full border border-[#2f6b4f]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#2f6b4f] transition-all hover:border-[#2f6b4f]/40 hover:bg-[#2f6b4f]/5"
                  >
                    <FiLogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {!isLoaded ? null : isSignedIn ? (
                <button
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  className="flex h-10 items-center gap-2 rounded-full border border-[#2f6b4f]/20 bg-white px-3.5 text-[#2f6b4f] transition hover:bg-[#2f6b4f]/5"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-semibold">
                    Sign Out
                  </span>
                </button>
              ) : (
                <Link
                  href={signInHref}
                  className="flex h-10 items-center gap-2 rounded-full border border-[#2f6b4f]/20 bg-white px-3.5 text-[#2f6b4f] transition hover:bg-[#2f6b4f]/5"
                >
                  <FiLogIn className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-semibold">
                    Sign In
                  </span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white text-[#1f2937] transition hover:border-[#2f6b4f]/20 hover:text-[#2f6b4f]"
              >
                <FiMenu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={closeMobileMenu}
          className={`
            absolute inset-0 bg-[#1f2937]/40 backdrop-blur-sm
            transition-opacity duration-300
            ${mobileOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Sidebar */}
        <aside
          className={`
            absolute left-0 top-0 flex h-full w-[320px] max-w-[88vw]
            flex-col bg-[#f5f1eb]
            shadow-2xl
            transition-transform duration-300 ease-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-[10px] bg-[#2f6b4f]" />
                <div className="relative h-4 w-4 rounded-[5px] bg-[#f5f1eb]" />
              </div>

              <span className="font-heading text-[16px] font-extrabold text-[#2f6b4f]">
                Havenly Listing
              </span>
            </Link>

            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1f2937] transition hover:text-[#2f6b4f]"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f2937]/40">
              Explore
            </p>

            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`
                      group flex items-center justify-between rounded-2xl
                      px-3 py-3.5 transition-all duration-200
                      ${
                        active
                          ? "bg-[#2f6b4f] text-white shadow-md shadow-[#2f6b4f]/10"
                          : "text-[#1f2937]/75 hover:bg-white hover:text-[#2f6b4f]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-10 w-10 items-center justify-center rounded-xl
                          ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-white text-[#2f6b4f]"
                          }
                        `}
                      >
                        {link.icon}
                      </div>

                      <span className="text-sm font-semibold">{link.name}</span>
                    </div>

                    <FiChevronRight
                      className={`h-4 w-4 transition-transform ${
                        active
                          ? "text-white/70"
                          : "text-[#1f2937]/20 group-hover:translate-x-0.5"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Authenticated User Section */}
            {isLoaded && isSignedIn && (
              <>
                <div className="my-6 border-t border-black/[0.06]" />

                <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f2937]/40">
                  Account
                </p>

                {/* Dashboard */}
                <Link
                  href={dashboardHref}
                  onClick={closeMobileMenu}
                  className={`
                    group flex items-center justify-between rounded-2xl
                    px-3 py-3.5 transition-all duration-200
                    ${
                      pathname.startsWith(
                        role === "owner"
                          ? "/propertyowner/dashboard"
                          : "/client/dashboard",
                      )
                        ? "bg-[#2f6b4f] text-white shadow-md shadow-[#2f6b4f]/10"
                        : "text-[#1f2937]/75 hover:bg-white hover:text-[#2f6b4f]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2f6b4f]">
                      <FiUser className="h-[18px] w-[18px]" />
                    </div>

                    <div>
                      <span className="block text-sm font-semibold">
                        Dashboard
                      </span>
                      <span className="mt-0.5 block text-[11px] opacity-50">
                        Manage your account
                      </span>
                    </div>
                  </div>

                  <FiChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              </>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-black/[0.06] p-5">
            {!isLoaded ? null : isSignedIn ? (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href={signInHref}
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f6b4f] py-3.5 text-sm font-semibold text-white transition hover:bg-[#25563f]"
              >
                <FiLogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
