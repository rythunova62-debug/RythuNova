import { prisma } from "@/lib/prisma";

// No GPS coordinates are collected anywhere in this system (farmers, pilots,
// or providers) — matching is necessarily approximate, using place names and
// the first 3 digits of the pincode as a stand-in for "same postal region".
// This will under- and over-match at the margins; admin always makes the
// final assignment call rather than the system auto-assigning.
function sameRegion(pincodeA: string | null | undefined, pincodeB: string): boolean {
  if (!pincodeA) return false;
  return pincodeA.slice(0, 3) === pincodeB.slice(0, 3);
}

export async function findMatchingPilots(order: { village: string; pincode: string }) {
  const pilots = await prisma.pilot.findMany({
    where: { verificationStatus: "verified", user: { deletedAt: null, accountStatus: "active" } },
    select: { id: true, name: true, village: true, mandal: true, district: true, pincode: true },
  });

  return pilots
    .filter(
      (p) => p.village.toLowerCase() === order.village.toLowerCase() || sameRegion(p.pincode, order.pincode)
    )
    .map((p) => ({
      ...p,
      matchReason: p.village.toLowerCase() === order.village.toLowerCase() ? "same village" : "same postal region",
    }));
}

export async function findMatchingProviders(order: { pincode: string }) {
  const providers = await prisma.provider.findMany({
    where: { user: { deletedAt: null, accountStatus: "active" } },
    select: { id: true, name: true, pincode: true, coverageRadiusKm: true },
  });

  return providers
    .filter((p) => sameRegion(p.pincode, order.pincode))
    .map((p) => ({ ...p, matchReason: "same postal region" }));
}
