"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiHome,
  FiSearch,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-[#f5f1eb]">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Large soft circle */}
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-[#2f6b4f]/10 sm:h-[560px] sm:w-[560px]" />

        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-[#2f6b4f]/10 sm:h-[420px] sm:w-[420px]" />

        {/* Bottom-left organic shape */}
        <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-[#2f6b4f]/[0.04] blur-2xl sm:h-[420px] sm:w-[420px]" />

        {/* Small decorative dots */}
        <div className="absolute left-[12%] top-[20%] h-2 w-2 rounded-full bg-[#2f6b4f]/30" />
        <div className="absolute right-[18%] top-[42%] h-1.5 w-1.5 rounded-full bg-[#d6bfaf]" />
        <div className="absolute bottom-[22%] left-[25%] h-2 w-2 rounded-full bg-[#2f6b4f]/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* LEFT — Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            {/* Small label */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f6b4f]/15 bg-white/60 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-[#2f6b4f]" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f6b4f]">
                Page not found
              </span>
            </div>

            {/* 404 */}
            <div className="relative mb-5">
              <h1 className="font-heading text-[clamp(7rem,18vw,13rem)] font-extrabold leading-[0.78] tracking-[-0.08em] text-[#2f6b4f]/10">
                404
              </h1>

              <div className="absolute inset-0 flex items-end pb-2">
                <span className="font-heading text-4xl font-extrabold tracking-tight text-[#1f2937] sm:text-5xl">
                  Looks like you've wandered off.
                </span>
              </div>
            </div>

            <p className="max-w-lg text-base leading-7 text-[#1f2937]/60 sm:text-lg">
              The page you're looking for doesn't exist or may have been
              moved. Let's get you back to finding the right place.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#2f6b4f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2f6b4f]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#25563f] hover:shadow-xl hover:shadow-[#2f6b4f]/15"
              >
                <FiHome className="h-4 w-4" />
                Back to home
                <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/buy"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2f6b4f]/20 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#2f6b4f] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2f6b4f]/35 hover:bg-white"
              >
                <FiSearch className="h-4 w-4" />
                Browse listings
              </Link>
            </div>

            {/* Back */}
            <button
              onClick={() => window.history.back()}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1f2937]/50 transition-colors hover:text-[#2f6b4f]"
            >
              <FiArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </motion.div>

          {/* RIGHT — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="relative aspect-square">
              {/* Outer decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[5%] rounded-full border border-dashed border-[#2f6b4f]/15"
              />

              {/* Inner circle */}
              <div className="absolute inset-[12%] rounded-full bg-white/70 shadow-[0_30px_80px_rgba(47,107,79,0.08)]" />

              {/* Floating 404 badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[10%] top-[15%] z-20 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2f6b4f]/10 bg-white shadow-xl shadow-[#1f2937]/10 sm:h-20 sm:w-20"
              >
                <span className="font-heading text-lg font-extrabold text-[#2f6b4f] sm:text-xl">
                  404
                </span>
              </motion.div>

              {/* House illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[48%] w-[58%]">
                  {/* House shadow */}
                  <div className="absolute -bottom-5 left-[8%] right-[8%] h-6 rounded-[50%] bg-[#2f6b4f]/10 blur-md" />

                  {/* Roof */}
                  <div
                    className="absolute left-1/2 top-[8%] h-[42%] w-[72%] -translate-x-1/2 rotate-45 rounded-tl-[22px] border-l-[14px] border-t-[14px] border-[#2f6b4f] bg-[#f5f1eb]"
                  />

                  {/* Main house */}
                  <div className="absolute bottom-[8%] left-[15%] right-[15%] top-[30%] rounded-b-2xl rounded-t-lg border-2 border-[#2f6b4f]/20 bg-white shadow-xl">
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 h-[52%] w-[25%] -translate-x-1/2 rounded-t-xl bg-[#2f6b4f]">
                      <div className="absolute right-2 top-1/2 h-1.5 w-1.5 rounded-full bg-white/70" />
                    </div>

                    {/* Windows */}
                    <div className="absolute left-[12%] top-[25%] grid h-[24%] w-[22%] grid-cols-2 overflow-hidden rounded-md border border-[#2f6b4f]/20 bg-[#f5f1eb]">
                      <div className="border-r border-[#2f6b4f]/15" />
                      <div />
                      <div className="border-t border-[#2f6b4f]/15" />
                      <div className="border-l border-t border-[#2f6b4f]/15" />
                    </div>

                    <div className="absolute right-[12%] top-[25%] grid h-[24%] w-[22%] grid-cols-2 overflow-hidden rounded-md border border-[#2f6b4f]/20 bg-[#f5f1eb]">
                      <div className="border-r border-[#2f6b4f]/15" />
                      <div />
                      <div className="border-t border-[#2f6b4f]/15" />
                      <div className="border-l border-t border-[#2f6b4f]/15" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating location pin */}
              <motion.div
                animate={{ y: [0, 7, 0], rotate: [-3, 3, -3] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[16%] left-[7%] flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f6b4f] text-white shadow-xl shadow-[#2f6b4f]/20"
              >
                <FiSearch className="h-6 w-6" />
              </motion.div>

              {/* Small decorative card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[12%] right-[5%] hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-xl shadow-[#1f2937]/10 sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#2f6b4f]">
                    <FiHome className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#1f2937]">
                      Find your way home
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#1f2937]/45">
                      Explore available properties
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}