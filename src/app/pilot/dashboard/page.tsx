import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

const statusCopy: Record<string, { label: string; tone: string; message: string }> = {
  pending: {
    label: "Pending Verification",
    tone: "bg-amber-100 text-amber-800",
    message:
      "Your profile is awaiting admin review. We're checking your drone licence against records — you'll be notified the moment you're verified.",
  },
  verified: {
    label: "Verified / Active",
    tone: "bg-emerald-100 text-emerald-800",
    message: "You're verified and active. Orders will start appearing here.",
  },
  rejected: {
    label: "Rejected",
    tone: "bg-red-100 text-red-800",
    message: "Your licence could not be verified.",
  },
};

export default async function PilotDashboardPage() {
  const user = await requireUser("pilot");
  if (!user) {
    redirect("/auth/pilot/login");
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    redirect("/auth/pilot/login");
  }

  if (!pilot.profileComplete) {
    redirect("/pilot/profile-completion");
  }

  const status = statusCopy[pilot.verificationStatus] ?? statusCopy.pending;

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-950">{pilot.name}</h1>
            <p className="text-sm text-emerald-700">{user.email}</p>
          </div>
          <LogoutButton redirectTo="/" />
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.tone}`}>
              {status.label}
            </span>
            {pilot.rating != null && (
              <span className="text-xs font-medium text-amber-600">★ {pilot.rating} rating</span>
            )}
          </div>
          <p className="mt-3 text-sm text-stone-600">{status.message}</p>
          {pilot.verificationStatus === "rejected" && pilot.rejectionReason && (
            <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Reason: {pilot.rejectionReason}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/pilot/profile-completion"
            className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">Edit Profile</h2>
            <p className="mt-1 text-sm text-stone-500">Update your details</p>
          </Link>
          {pilot.verificationStatus === "verified" ? (
            <Link
              href="/pilot/orders"
              className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <h2 className="font-medium text-stone-900">Orders</h2>
              <p className="mt-1 text-sm text-stone-500">View and complete assigned orders</p>
            </Link>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-stone-100 p-6 opacity-60">
              <h2 className="font-medium text-stone-500">Orders</h2>
              <p className="mt-1 text-sm text-stone-400">Available once your account is verified</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
