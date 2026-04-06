"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  FaHome,
  FaMoneyBillWave,
  FaListUl,
  FaBed,
  FaCheck,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { supabase } from "../../../../lib/supabase";
import { getStepSchema } from "../../../../schemas/propertyForm";

// ─── Step Indicator ───────────────────────────────────────────────────────────
const steps = [
  { label: "Basic Info", icon: <FaHome /> },
  { label: "Details", icon: <FaBed /> },
  { label: "Pricing & Fees", icon: <FaMoneyBillWave /> },
  { label: "Features", icon: <FaListUl /> },
  { label: "Shortlet", icon: <TbBuildingSkyscraper /> },
];

const StepIndicator = ({ currentStep, isShortlet }) => {
  const visibleSteps = isShortlet ? steps : steps.filter((_, i) => i !== 4);
  return (
    <div className="flex items-center justify-between mb-10">
      {visibleSteps.map((step, idx) => {
        const stepNum = isShortlet ? idx : idx >= 4 ? idx + 1 : idx;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;
        return (
          <div key={idx} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <FaCheck /> : step.icon}
              </div>
              <p
                className={`text-xs mt-1 font-medium ${isActive ? "text-primary" : "text-gray-400"}`}
              >
                {step.label}
              </p>
            </div>
            {idx < visibleSteps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${currentStep > stepNum ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Reusable Input Components ─────────────────────────────────────────────────
const InputField = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TagInput = ({ label, value, onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (item) => onChange(value.filter((v) => v !== item));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-accent transition-colors"
        >
          <FaPlus />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {item}
            <button type="button" onClick={() => remove(item)}>
              <FaTimes className="text-xs hover:text-red-500" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AddProperty = () => {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 0 - Basic Info
    title: "",
    description: "",
    listing_type: "rent",
    status: "For Rent",
    property_category: "Residential",
    property_type: "",
    location: "",
    state: "",
    is_available: true,

    // Step 1 - Details
    beds: "",
    baths: "",
    parking_spaces: "",
    square_meters: "",
    year_built: "",
    condition: "Newly Built",
    date_listed: new Date().toISOString().split("T")[0],
    images: [""],

    // Step 2 - Pricing & Fees
    pricing: {
      rentPerYear: "",
      salePrice: "",
      nightlyRate: "",
      weeklyRate: "",
      monthlyRate: "",
      minimumStay: "",
    },
    fees_breakdown: {
      agencyFee: "",
      legalFee: "",
      cautionFee: "",
      serviceCharge: "",
      surveyFee: "",
      developmentLevy: "",
      cleaningFee: "",
      securityDeposit: "",
    },

    // Step 3 - Features
    features: {
      property: [],
      estate: [],
      special: [],
      amenities: [],
    },

    // Step 4 - Shortlet
    max_guests: "",
    check_in_time: "",
    check_out_time: "",
    house_rules: [],
    cancellation_policy: "",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateNested = (parent, field, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  // Sync listing_type with status
  const handleListingTypeChange = (type) => {
    const statusMap = {
      rent: "For Rent",
      buy: "For Sale",
      shortlet: "For Shortlet",
    };
    setForm((prev) => ({
      ...prev,
      listing_type: type,
      status: statusMap[type],
    }));
  };

  const isShortlet = form.listing_type === "shortlet";
  const totalSteps = isShortlet ? 5 : 4;

  // ─── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const schema = getStepSchema(currentStep, form.listing_type);
    if (!schema) return true;

    const result = schema.safeParse(form);

    if (!result.success) {
      const newErrors = {};
      const issues = result.error?.issues || result.error?.errors || [];
      issues.forEach((err) => {
        const key = err.path.join(".");
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validate()) setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    // Clean up empty strings to null in pricing and fees
    const cleanObj = (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          v === "" ? null : Number(v) || v,
        ]),
      );

    // Generate a unique ID
    const generateId = () =>
      `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      id: generateId(),
      owner_id: user.id,
      title: form.title,
      description: form.description,
      listing_type: form.listing_type,
      status: form.status,
      property_category: form.property_category,
      property_type: form.property_type,
      location: form.location,
      state: form.state,
      is_available: form.is_available,
      beds: form.beds ? Number(form.beds) : null,
      baths: form.baths ? Number(form.baths) : null,
      parking_spaces: form.parking_spaces ? Number(form.parking_spaces) : null,
      square_meters: form.square_meters ? Number(form.square_meters) : null,
      year_built: form.year_built ? Number(form.year_built) : null,
      condition: form.condition,
      date_listed: form.date_listed,
      images: form.images.filter((img) => img.trim() !== ""),
      pricing: cleanObj(form.pricing),
      fees_breakdown: cleanObj(form.fees_breakdown),
      features: form.features,
      ...(isShortlet && {
        max_guests: form.max_guests ? Number(form.max_guests) : null,
        check_in_time: form.check_in_time,
        check_out_time: form.check_out_time,
        house_rules: form.house_rules,
        cancellation_policy: form.cancellation_policy,
      }),
    };

    const { error } = await supabase.from("properties").insert(payload);

    setLoading(false);

    if (error) {
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      alert(`Error: ${error.message}`);
    } else {
      router.push("/propertyowner/dashboard");
    }
  };

  // ─── Step 0: Basic Info ───────────────────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>

      <InputField label="Property Title" required error={errors.title}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Modern 4 Bedroom Duplex in Lekki"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </InputField>

      <InputField label="Description" required error={errors.description}>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the property in detail..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </InputField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Listing Type" required>
          <select
            value={form.listing_type}
            onChange={(e) => handleListingTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="rent">For Rent</option>
            <option value="buy">For Sale</option>
            <option value="shortlet">Shortlet</option>
          </select>
        </InputField>

        <InputField label="Property Category" required>
          <select
            value={form.property_category}
            onChange={(e) => update("property_category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Luxury">Luxury</option>
            <option value="Land">Land</option>
          </select>
        </InputField>

        <InputField label="Property Type" required error={errors.property_type}>
          <input
            type="text"
            value={form.property_type}
            onChange={(e) => update("property_type", e.target.value)}
            placeholder="e.g. Detached Duplex, Apartment"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Location / Area" required error={errors.location}>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Lekki Phase 1"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>

        <InputField label="State" required error={errors.state}>
          <input
            type="text"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="e.g. Lagos"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
      </div>
    </div>
  );

  // ─── Step 1: Property Details ─────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InputField label="Bedrooms">
          <input
            type="number"
            min="0"
            value={form.beds}
            onChange={(e) => update("beds", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>

        <InputField label="Bathrooms" required error={errors.baths}>
          <input
            type="number"
            min="0"
            value={form.baths}
            onChange={(e) => update("baths", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>

        <InputField label="Parking Spaces">
          <input
            type="number"
            min="0"
            value={form.parking_spaces}
            onChange={(e) => update("parking_spaces", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>

        <InputField label="Area (m²)">
          <input
            type="number"
            min="0"
            value={form.square_meters}
            onChange={(e) => update("square_meters", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Year Built">
          <input
            type="number"
            value={form.year_built}
            onChange={(e) => update("year_built", e.target.value)}
            placeholder="e.g. 2022"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>

        <InputField label="Condition">
          <select
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="Newly Built">Newly Built</option>
            <option value="Fully Furnished">Fully Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Old">Old</option>
            <option value="Renovated">Renovated</option>
          </select>
        </InputField>

        <InputField label="Date Listed">
          <input
            type="date"
            value={form.date_listed}
            onChange={(e) => update("date_listed", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
      </div>

      {/* Image URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images (URLs)
        </label>
        <div className="space-y-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => {
                  const updated = [...form.images];
                  updated[idx] = e.target.value;
                  update("images", updated);
                }}
                placeholder={`Image URL ${idx + 1}`}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "images",
                      form.images.filter((_, i) => i !== idx),
                    )
                  }
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("images", [...form.images, ""])}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-accent font-medium"
          >
            <FaPlus /> Add another image
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Image upload coming soon. Use URLs for now.
        </p>
      </div>
    </div>
  );

  // ─── Step 2: Pricing & Fees ───────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Pricing & Fees</h2>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.listing_type === "rent" && (
            <InputField
              label="Rent Per Year (₦)"
              required
              error={errors["pricing.rentPerYear"]} // ✅ fixed
            >
              <input
                type="number"
                value={form.pricing.rentPerYear}
                onChange={(e) =>
                  updateNested("pricing", "rentPerYear", e.target.value)
                }
                placeholder="e.g. 2500000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </InputField>
          )}

          {form.listing_type === "buy" && (
            <InputField
              label="Sale Price (₦)"
              required
              error={errors["pricing.salePrice"]} // ✅ fixed
            >
              <input
                type="number"
                value={form.pricing.salePrice}
                onChange={(e) =>
                  updateNested("pricing", "salePrice", e.target.value)
                }
                placeholder="e.g. 85000000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </InputField>
          )}

          {form.listing_type === "shortlet" && (
            <>
              <InputField
                label="Nightly Rate (₦)"
                required
                error={errors["pricing.nightlyRate"]} // ✅ fixed
              >
                <input
                  type="number"
                  value={form.pricing.nightlyRate}
                  onChange={(e) =>
                    updateNested("pricing", "nightlyRate", e.target.value)
                  }
                  placeholder="e.g. 75000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Weekly Rate (₦)">
                <input
                  type="number"
                  value={form.pricing.weeklyRate}
                  onChange={(e) =>
                    updateNested("pricing", "weeklyRate", e.target.value)
                  }
                  placeholder="e.g. 450000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Monthly Rate (₦)">
                <input
                  type="number"
                  value={form.pricing.monthlyRate}
                  onChange={(e) =>
                    updateNested("pricing", "monthlyRate", e.target.value)
                  }
                  placeholder="e.g. 1500000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Minimum Stay (nights)">
                <input
                  type="number"
                  value={form.pricing.minimumStay}
                  onChange={(e) =>
                    updateNested("pricing", "minimumStay", e.target.value)
                  }
                  placeholder="e.g. 2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
            </>
          )}
        </div>
      </div>

      {/* Fees */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Fees Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.listing_type !== "shortlet" && (
            <>
              <InputField label="Agency Fee (%)">
                <input
                  type="number"
                  value={form.fees_breakdown.agencyFee}
                  onChange={(e) =>
                    updateNested("fees_breakdown", "agencyFee", e.target.value)
                  }
                  placeholder="e.g. 5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Legal Fee (%)">
                <input
                  type="number"
                  value={form.fees_breakdown.legalFee}
                  onChange={(e) =>
                    updateNested("fees_breakdown", "legalFee", e.target.value)
                  }
                  placeholder="e.g. 2.5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Caution Fee (%)">
                <input
                  type="number"
                  value={form.fees_breakdown.cautionFee}
                  onChange={(e) =>
                    updateNested("fees_breakdown", "cautionFee", e.target.value)
                  }
                  placeholder="e.g. 12"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Service Charge (₦/yr)">
                <input
                  type="number"
                  value={form.fees_breakdown.serviceCharge}
                  onChange={(e) =>
                    updateNested(
                      "fees_breakdown",
                      "serviceCharge",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 1200000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
            </>
          )}

          {form.listing_type === "buy" && (
            <>
              <InputField label="Survey Fee (%)">
                <input
                  type="number"
                  value={form.fees_breakdown.surveyFee}
                  onChange={(e) =>
                    updateNested("fees_breakdown", "surveyFee", e.target.value)
                  }
                  placeholder="e.g. 1.5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Development Levy (%)">
                <input
                  type="number"
                  value={form.fees_breakdown.developmentLevy}
                  onChange={(e) =>
                    updateNested(
                      "fees_breakdown",
                      "developmentLevy",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
            </>
          )}

          {form.listing_type === "shortlet" && (
            <>
              <InputField label="Cleaning Fee (₦)">
                <input
                  type="number"
                  value={form.fees_breakdown.cleaningFee}
                  onChange={(e) =>
                    updateNested(
                      "fees_breakdown",
                      "cleaningFee",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 15000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
              <InputField label="Security Deposit (₦)">
                <input
                  type="number"
                  value={form.fees_breakdown.securityDeposit}
                  onChange={(e) =>
                    updateNested(
                      "fees_breakdown",
                      "securityDeposit",
                      e.target.value,
                    )
                  }
                  placeholder="e.g. 50000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </InputField>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Step 3: Features ─────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Features</h2>
      <p className="text-gray-500 text-sm">
        Type a feature and press Enter or click + to add it.
      </p>

      <TagInput
        label="Property Features"
        value={form.features.property}
        onChange={(val) => updateNested("features", "property", val)}
        placeholder="e.g. Swimming Pool, Smart Home System"
      />
      <TagInput
        label="Estate Features"
        value={form.features.estate}
        onChange={(val) => updateNested("features", "estate", val)}
        placeholder="e.g. 24/7 Security, Gated Community"
      />
      <TagInput
        label="Special Features"
        value={form.features.special}
        onChange={(val) => updateNested("features", "special", val)}
        placeholder="e.g. Solar Power Backup, Elevator"
      />
      {isShortlet && (
        <TagInput
          label="Amenities"
          value={form.features.amenities}
          onChange={(val) => updateNested("features", "amenities", val)}
          placeholder="e.g. WiFi, Netflix, Washing Machine"
        />
      )}
    </div>
  );

  // ─── Step 4: Shortlet Info ────────────────────────────────────────────────────
  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Shortlet Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="Max Guests">
          <input
            type="number"
            value={form.max_guests}
            onChange={(e) => update("max_guests", e.target.value)}
            placeholder="e.g. 6"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
        <InputField label="Check-in Time">
          <input
            type="text"
            value={form.check_in_time}
            onChange={(e) => update("check_in_time", e.target.value)}
            placeholder="e.g. 2:00 PM"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
        <InputField label="Check-out Time">
          <input
            type="text"
            value={form.check_out_time}
            onChange={(e) => update("check_out_time", e.target.value)}
            placeholder="e.g. 12:00 PM"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </InputField>
      </div>

      <TagInput
        label="House Rules"
        value={form.house_rules}
        onChange={(val) => update("house_rules", val)}
        placeholder="e.g. No smoking, No pets"
      />

      <InputField label="Cancellation Policy">
        <textarea
          value={form.cancellation_policy}
          onChange={(e) => update("cancellation_policy", e.target.value)}
          placeholder="e.g. Free cancellation up to 48 hours before check-in..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </InputField>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-500 mt-1">
            Fill in the details to list your property
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} isShortlet={isShortlet} />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdNavigateBefore /> Previous
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-accent text-white rounded-full font-medium disabled:opacity-60 transition-colors"
            >
              {loading ? "Submitting..." : "Submit Property"}
              <FaCheck />
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-accent text-white rounded-full font-medium transition-colors"
            >
              Next <MdNavigateNext />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
