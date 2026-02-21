import { z } from "zod";

export const signupSchema = z.object({
  role: z.enum(["client", "owner"]),
  businessName: z.string().min(2, "Business name is required").optional(),
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Invalid phone number")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
