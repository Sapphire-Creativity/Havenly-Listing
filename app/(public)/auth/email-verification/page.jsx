"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, setActive, isLoaded } = useSignUp();

  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoaded) return;

    console.log("SignUp status:", signUp?.status);

    // Only redirect if there is truly NO signup in progress
    if (signUp.status === "idle") {
      router.push("/auth/signup");
    }
  }, [isLoaded, signUp?.status, router]);

  //
  const verifyCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Carry redirect_url forward to auth/redirect
        const redirectUrl = searchParams.get("redirect_url");
        const destination = redirectUrl
          ? `/auth/redirect?redirect_url=${redirectUrl}`
          : "/auth/redirect";

        window.location.replace(destination);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setMessage("A new code has been sent to your email.");
    } catch (err) {
      setError("Failed to resend code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-2xl font-bold">
            ✉️
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify your email
        </h1>
        <p className="text-center text-gray-500 mt-2 text-sm">
          We’ve sent a 6-digit verification code to your email. Enter it below
          to confirm your account.
        </p>

        <form onSubmit={verifyCode}>
          {/* Input */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center tracking-widest text-lg"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm mt-2 text-center">{message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={resendCode}
            disabled={resending}
            className="w-full mt-3 text-sm text-primary-accent font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
