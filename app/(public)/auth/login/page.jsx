"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { signinSchema } from "../../../../schemas/auth";
import { useSearchParams } from "next/navigation";
//
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data) => {
    if (!isLoaded || isSubmitting) return;

    const toastId = toast.loading("Signing you in...");

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        if (!result.createdSessionId) {
          toast.error("Login failed. Please try again.", { id: toastId });
          return;
        }

        await setActive({ session: result.createdSessionId });
        toast.success("Welcome back! Redirecting...", { id: toastId });

        const redirectUrl = searchParams.get("redirect_url");
        const destination = redirectUrl
          ? `/auth/redirect?redirect_url=${redirectUrl}`
          : "/auth/redirect";

        setTimeout(() => {
          window.location.replace(destination);
        }, 600);
        return;
      }

      toast.error("Additional verification required.", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.errors?.[0]?.longMessage || "Invalid email or password", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Toast container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontWeight: 500 },
          success: { style: { background: "#f0fdf4", color: "#166534" } },
          error: { style: { background: "#fef2f2", color: "#991b1b" } },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">
            Login to manage your properties or find your next stay
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                disabled={isSubmitting}
                className={`w-full pl-11 pr-4 py-4 rounded-full border transition-all duration-200 focus:ring-2 focus:ring-primary-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-red-500 text-xs ml-4"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
                className={`w-full pl-11 pr-12 py-4 rounded-full border transition-all duration-200 focus:ring-2 focus:ring-primary-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-red-500 text-xs ml-4"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-primary-accent font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !isLoaded}
            whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            className="w-full flex items-center justify-center gap-2 bg-primary-accent hover:opacity-90 text-white font-semibold py-4 rounded-full shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            href={`/auth/signup${searchParams.get("redirect_url") ? `?redirect_url=${searchParams.get("redirect_url")}` : ""}`}
            className="text-primary-accent font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
