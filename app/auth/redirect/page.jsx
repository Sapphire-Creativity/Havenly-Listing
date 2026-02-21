"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AuthRedirect() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/auth/login");
      return;
    }

    // User object not ready yet — retry up to 6 times (~3s) before giving up
    if (!user) {
      if (attempts < 6) {
        const timer = setTimeout(() => setAttempts((a) => a + 1), 500);
        return () => clearTimeout(timer);
      }
      // Gave up waiting — send to login
      router.replace("/auth/login");
      return;
    }

    const role = user?.unsafeMetadata?.role;

    if (role === "owner") {
      router.replace("/propertyowner/owner-dashboard");
    } else if (role === "client") {
      router.replace("/client/client-dashboard");
    } else {
      // Role missing or unrecognized — send to login with error flag
      router.replace("/auth/login?error=no_role");
    }
  }, [isLoaded, isSignedIn, user, router, attempts]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated Logo Mark */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-accent to-primary"
          />
          <div className="absolute inset-2 bg-gray-50 rounded-xl" />
          <div className="absolute inset-4 rounded-lg bg-gradient-to-tr from-primary-accent to-primary opacity-60" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Setting things up...
          </h2>
          <p className="text-sm text-gray-500">
            Please wait while we redirect you to your dashboard.
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary-accent"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Subtle warning if taking too long */}
        {attempts > 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-amber-500 text-center max-w-xs"
          >
            This is taking longer than expected. If nothing happens,{" "}
            <button
              onClick={() => router.replace("/auth/login")}
              className="underline font-medium hover:text-amber-600 transition-colors"
            >
              return to login
            </button>
            .
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
