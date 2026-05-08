"use client";

import { Suspense } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaBuilding, FaEnvelope, FaLock, FaPhone, FaIdBadge } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { useSignUp } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { signupSchema } from "../../../../schemas/auth";

export const dynamic = "force-dynamic";

function SignupContent() {
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ safe inside Suspense

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "client" },
  });

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setValue("role", selectedRole);
  };

  const onSubmit = async (data) => {
    if (!isLoaded) return;
    const toastId = toast.loading("Creating your account...");
    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          phone: data.phone,
          businessName: data.businessName || null,
          role: data.role,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Account created! Check your email for a verification code.", {
        id: toastId,
        duration: 3000,
      });
      const redirectUrl = searchParams.get("redirect_url");
      const verificationPath = redirectUrl
        ? `/auth/email-verification?redirect_url=${redirectUrl}`
        : "/auth/email-verification";
      window.location.replace(verificationPath);
    } catch (err) {
      console.error(err);
      toast.error(err.errors?.[0]?.message || "Signup failed. Please try again.", { id: toastId });
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-4 rounded-full border transition-all duration-200 focus:ring-2 focus:ring-primary-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
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
        className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-2">Join and start buying, renting or listing properties</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-100 p-2 rounded-full">
          {[
            { value: "client", label: "Client", icon: <FaUser /> },
            { value: "owner", label: "Property Owner", icon: <FaBuilding /> },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRoleSwitch(r.value)}
              className={`flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
                role === r.value ? "bg-primary-accent text-white shadow-md" : "text-gray-600 hover:bg-white"
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            {role === "owner" && (
              <motion.div
                key="businessName"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <FaIdBadge className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Business / Brand Name" {...register("businessName")} disabled={isSubmitting} className={inputClass(errors.businessName)} />
                  </div>
                  <AnimatePresence>
                    {errors.businessName && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-red-500 text-xs ml-4">
                        {errors.businessName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {[
            { name: "firstName", placeholder: "First Name", icon: <FaUser />, type: "text" },
            { name: "lastName", placeholder: "Last Name", icon: <FaUser />, type: "text" },
            { name: "email", placeholder: "Email Address", icon: <FaEnvelope />, type: "email" },
            { name: "phone", placeholder: "Phone Number", icon: <FaPhone />, type: "tel" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">{field.icon}</span>
                <input type={field.type} placeholder={field.placeholder} {...register(field.name)} disabled={isSubmitting} className={inputClass(errors[field.name])} />
              </div>
              <AnimatePresence>
                {errors[field.name] && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-red-500 text-xs ml-4">
                    {errors[field.name].message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")} disabled={isSubmitting} className={inputClass(errors.password)} />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} tabIndex={-1} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-red-500 text-xs ml-4">
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || !isLoaded}
            whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-primary-accent hover:opacity-90 text-white font-semibold py-4 rounded-full shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><FiLoader className="w-4 h-4 animate-spin" /><span>Creating account...</span></>
            ) : (
              <span>{role === "owner" ? "Create Owner Account" : "Create Account"}</span>
            )}
          </motion.button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href={`/auth/login${searchParams.get("redirect_url") ? `?redirect_url=${searchParams.get("redirect_url")}` : ""}`}
            className="text-primary-accent font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}