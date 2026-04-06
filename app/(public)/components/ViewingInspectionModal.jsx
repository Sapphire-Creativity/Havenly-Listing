"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/supabase";
import {
  IoClose,
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoHomeOutline,
  IoCheckmarkCircle,
  IoLocationOutline,
  IoBedOutline,
  IoWaterOutline,
  IoResizeOutline,
} from "react-icons/io5";

const ViewingInspectionModal = ({ isOpen, onClose, propertyDetails }) => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    attendees: "1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const inquiry = {
      // id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      property_id: propertyDetails.id,
      owner_id: propertyDetails.owner_id,
      // if user is logged in use their id, otherwise null
      client_id: user?.id || null,
      client_name: formData.name,
      client_email: formData.email,
      client_phone: formData.phone,
      viewing_date: formData.date,
      viewing_time: formData.time,
      attendees: Number(formData.attendees),
      message: formData.message || null,
      status: "pending",
    };

    const { error: supabaseError } = await supabase
      .from("inquiries")
      .insert(inquiry);

    setIsSubmitting(false);

    if (supabaseError) {
      console.error("Inquiry error:", supabaseError.message);
      setError("Something went wrong. Please try again.");
      return;
    }

    setIsSuccess(true);

    // Reset after success
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
      setFormData({
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        attendees: "1",
      });
      onClose();
    }, 2500);
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const today = new Date().toISOString().split("T")[0];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM",
  ];

  const stepLabels = ["Select Date", "Your Info", "Confirm"];

  const modalVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Schedule Viewing</h2>
                <p className="text-xs text-gray-400 mt-0.5">Step {step} of 3</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Success Screen */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <IoCheckmarkCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Your viewing request has been sent to the property owner. They will contact you shortly to confirm.
                  </p>
                  <div className="mt-6 px-5 py-3 bg-green-50 rounded-xl text-sm text-green-700 font-medium">
                    📅 {formData.date} at {formData.time}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Indicator */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step > i
                            ? "bg-green-500 text-white"
                            : step === i
                            ? "bg-primary text-white ring-4 ring-primary/20"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step > i ? <IoCheckmarkCircle className="w-4 h-4" /> : i}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${step >= i ? "text-primary" : "text-gray-400"}`}>
                        {stepLabels[i - 1]}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-colors ${step > i ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Property Summary */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={propertyDetails.images?.[0] || "/placeholder.jpg"} // ✅ fixed
                    alt={propertyDetails.title} // ✅ fixed
                    fill
                    className="object-cover"
                    sizes="64px"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                      {propertyDetails.title} {/* ✅ fixed */}
                    </h3>
                    <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                      {propertyDetails.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <IoLocationOutline className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{propertyDetails.location}, {propertyDetails.state}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {propertyDetails.beds > 0 && (
                      <span className="flex items-center gap-1">
                        <IoBedOutline className="w-3 h-3" /> {propertyDetails.beds}
                      </span>
                    )}
                    {propertyDetails.baths > 0 && (
                      <span className="flex items-center gap-1">
                        <IoWaterOutline className="w-3 h-3" /> {propertyDetails.baths}
                      </span>
                    )}
                    {propertyDetails.square_meters && ( // ✅ fixed
                      <span className="flex items-center gap-1">
                        <IoResizeOutline className="w-3 h-3" /> {propertyDetails.square_meters}m²
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 p-6">
                {/* Step 1 - Date & Time */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoCalendarOutline className="w-4 h-4 inline mr-1.5" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        min={today}
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoTimeOutline className="w-4 h-4 inline mr-1.5" />
                        Preferred Time
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, time }))}
                            className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                              formData.time === time
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoPeopleOutline className="w-4 h-4 inline mr-1.5" />
                        Number of Attendees
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, attendees: String(num) }))}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                              formData.attendees === String(num)
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 - Personal Info */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoPersonOutline className="w-4 h-4 inline mr-1.5" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoMailOutline className="w-4 h-4 inline mr-1.5" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <IoCallOutline className="w-4 h-4 inline mr-1.5" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 08012345678"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Message
                        <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any specific questions or requirements?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Confirm */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-gray-800">Review Your Details</h3>

                    {/* Date & Time Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Viewing Schedule</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoCalendarOutline className="w-4 h-4" /> Date
                        </span>
                        <span className="font-semibold text-gray-800">{formData.date || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoTimeOutline className="w-4 h-4" /> Time
                        </span>
                        <span className="font-semibold text-gray-800">{formData.time || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoPeopleOutline className="w-4 h-4" /> Attendees
                        </span>
                        <span className="font-semibold text-gray-800">{formData.attendees}</span>
                      </div>
                    </div>

                    {/* Personal Info Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Details</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoPersonOutline className="w-4 h-4" /> Name
                        </span>
                        <span className="font-semibold text-gray-800">{formData.name || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoMailOutline className="w-4 h-4" /> Email
                        </span>
                        <span className="font-semibold text-gray-800 text-right max-w-[180px] truncate">{formData.email || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <IoCallOutline className="w-4 h-4" /> Phone
                        </span>
                        <span className="font-semibold text-gray-800">{formData.phone || "Not provided"}</span>
                      </div>
                    </div>

                    {/* Message */}
                    {formData.message && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</p>
                        <p className="text-sm text-gray-700">{formData.message}</p>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-xs text-yellow-800 leading-relaxed">
                        By submitting this request, you agree to our terms and conditions. The property owner will confirm the viewing availability within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-3 text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={step === 1 && (!formData.date || !formData.time)}
                    className={`ml-auto px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                      step === 1 && (!formData.date || !formData.time)
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-accent shadow-sm"
                    }`}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Submit Request ✓"
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <IoHomeOutline className="w-3.5 h-3.5" />
                Your request will be sent directly to the property owner
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewingInspectionModal;