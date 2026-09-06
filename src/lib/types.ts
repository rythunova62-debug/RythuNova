export const ROLES = ["admin", "pilot", "provider"] as const;
export type Role = (typeof ROLES)[number];

export const VERIFICATION_STATUSES = ["pending", "verified", "rejected"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export type SessionUser = {
  id: string;
  role: Role;
  email: string;
};
