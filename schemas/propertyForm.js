import { z } from "zod";

// ─── Step 0: Basic Info ───────────────────────────────────────────────────────
export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  listing_type: z.enum(["rent", "buy", "shortlet"]),
  status: z.enum(["For Rent", "For Sale", "For Shortlet"]),
  property_category: z.enum(["Residential", "Commercial", "Luxury", "Land"]),
  property_type: z.string().min(1, "Property type is required"),
  location: z.string().min(1, "Location is required"),
  state: z.string().min(1, "State is required"),
});

// ─── Step 1: Property Details ─────────────────────────────────────────────────
export const propertyDetailsSchema = z.object({
  beds: z.coerce.number().min(0).nullable().optional(),
  baths: z.coerce.number().min(1, "Bathrooms is required"),
  parking_spaces: z.coerce.number().min(0).nullable().optional(),
  square_meters: z.coerce.number().min(0).nullable().optional(),
  year_built: z.coerce.number().min(1900).max(new Date().getFullYear()).nullable().optional(),
  condition: z.enum(["Newly Built", "Fully Furnished", "Semi Furnished", "Unfurnished", "Old", "Renovated"]),
  date_listed: z.string().min(1, "Date listed is required"),
  images: z.array(z.string()).optional(),
});

// ─── Step 2: Pricing ─────────────────────────────────────────────────────────
export const pricingSchemaRent = z.object({
  pricing: z.object({
    rentPerYear: z.coerce.number().min(1, "Rent per year is required"),
    salePrice: z.coerce.number().nullable().optional(),
    nightlyRate: z.coerce.number().nullable().optional(),
    weeklyRate: z.coerce.number().nullable().optional(),
    monthlyRate: z.coerce.number().nullable().optional(),
    minimumStay: z.coerce.number().nullable().optional(),
  }),
});

export const pricingSchemaBuy = z.object({
  pricing: z.object({
    rentPerYear: z.coerce.number().nullable().optional(),
    salePrice: z.coerce.number().min(1, "Sale price is required"),
    nightlyRate: z.coerce.number().nullable().optional(),
    weeklyRate: z.coerce.number().nullable().optional(),
    monthlyRate: z.coerce.number().nullable().optional(),
    minimumStay: z.coerce.number().nullable().optional(),
  }),
});

export const pricingSchemaShortlet = z.object({
  pricing: z.object({
    rentPerYear: z.coerce.number().nullable().optional(),
    salePrice: z.coerce.number().nullable().optional(),
    nightlyRate: z.coerce.number().min(1, "Nightly rate is required"),
    weeklyRate: z.coerce.number().nullable().optional(),
    monthlyRate: z.coerce.number().nullable().optional(),
    minimumStay: z.coerce.number().nullable().optional(),
  }),
});

// ─── Step 3: Features ─────────────────────────────────────────────────────────
export const featuresSchema = z.object({
  features: z.object({
    property: z.array(z.string()).optional(),
    estate: z.array(z.string()).optional(),
    special: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
});

// ─── Step 4: Shortlet ─────────────────────────────────────────────────────────
export const shortletSchema = z.object({
  max_guests: z.coerce.number().min(1, "Max guests is required"),
  check_in_time: z.string().min(1, "Check-in time is required"),
  check_out_time: z.string().min(1, "Check-out time is required"),
  house_rules: z.array(z.string()).optional(),
  cancellation_policy: z.string().optional(),
});

// ─── Helper: get schema for current step ─────────────────────────────────────
export const getStepSchema = (step, listingType) => {
  switch (step) {
    case 0: return basicInfoSchema;
    case 1: return propertyDetailsSchema;
    case 2:
      if (listingType === "rent") return pricingSchemaRent;
      if (listingType === "buy") return pricingSchemaBuy;
      if (listingType === "shortlet") return pricingSchemaShortlet;
      break;
    case 3: return featuresSchema;
    case 4: return shortletSchema;
    default: return null;
  }
};