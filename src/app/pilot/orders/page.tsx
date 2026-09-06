import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import OrdersList from "@/components/OrdersList";

export default async function PilotOrdersPage() {
  const user = await requireUser("pilot");
  if (!user) {
    redirect("/auth/pilot/login");
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    redirect("/auth/pilot/login");
  }

  if (pilot.verificationStatus !== "verified") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16 text-center">
        <div className="w-full max-w-md rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-xl font-semibold text-emerald-900">Not yet available</h1>
          <p className="text-sm text-stone-600">
            Orders appear here once an admin verifies your account. Check your dashboard for
            your current status.
          </p>
          <Link href="/pilot/dashboard" className="mt-4 inline-block text-sm text-emerald-700 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-emerald-950">My Orders</h1>
          <Link href="/pilot/dashboard" className="text-sm text-emerald-700 hover:underline">
            ← Dashboard
          </Link>
        </div>
        <OrdersList apiBase="/api/pilot/orders" />
      </div>
    </main>
  );
}
