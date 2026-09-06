import { z } from "zod";

// Indian mobile numbers: 10 digits, starting 6-9. Optional +91 prefix stripped by caller.
const indianPhone = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number");

const pincode = z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode");

// Step 1 of pilot signup: registration details (file uploads are validated
// separately in the route, since zod doesn't parse multipart file fields).
export const pilotRegisterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(2, "Name is required"),
  phone: indianPhone,
  village: z.string().min(1, "Village is required"),
  mandal: z.string().min(1, "Mandal is required"),
  district: z.string().min(1, "District is required"),
});

// Step 3 of pilot signup: only reachable after OTP verification. Pilots log
// in with email (already collected in step 1), so no separate username here.
export const pilotCredentialsSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Phase 1 scope only: confirms/edits the location fields captured at signup and
// marks the pilot's profile complete. The fuller profile (age, DOB, education,
// experience — see full spec section 4) lands in a later phase once the schema
// grows to support it.
export const profileCompletionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: indianPhone,
  village: z.string().min(1, "Village is required"),
  mandal: z.string().min(1, "Mandal is required"),
  district: z.string().min(1, "District is required"),
  pincode, // not in the original schema — added for order-routing (see Order model)
});

export const rejectPilotSchema = z.object({
  reason: z.string().min(3, "A reason is required"),
});

export const ratePilotSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
});

// --- Provider portal ---

const username = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(30)
  .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, dots and underscores allowed");

export const providerRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(3, "Address is required"),
  pincode,
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit OTP"),
});

export const otpResendSchema = z.object({
  email: z.string().email(),
});

export const providerCredentialsSchema = z
  .object({
    email: z.string().email(),
    username,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const usernameLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const providerFleetSchema = z.object({
  coverageRadiusKm: z.coerce.number().int().min(0),
  totalDrones: z.coerce.number().int().min(0),
  acresPerDayCapacity: z.coerce.number().int().min(0),
  pricePerAcre: z.coerce.number().min(0),
  bulkDiscountThreshold: z.coerce.number().int().min(0).optional().nullable(),
  bulkDiscountPercent: z.coerce.number().min(0).max(100).optional().nullable(),
});

export const providerPilotSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().int().min(16).max(90).optional().nullable(),
  experienceYears: z.coerce.number().min(0).max(60),
  acresSprayed: z.coerce.number().min(0),
  active: z.boolean(),
});

// --- Orders ---

export const createOrderSchema = z.object({
  farmerName: z.string().min(2, "Farmer name is required"),
  farmerPhone: indianPhone,
  village: z.string().min(1, "Village is required"),
  address: z.string().min(3, "Address is required"),
  pincode,
  acres: z.coerce.number().positive("Acres must be greater than 0"),
  cropType: z.string().min(1, "Crop type is required"),
  sprayDetails: z.string().min(1, "Spray/fertilizer details are required"),
  scheduledAt: z.string().min(1, "Scheduled date/time is required"),
});

export const assignOrderSchema = z.object({
  type: z.enum(["pilot", "provider"]),
  id: z.string().min(1),
});
