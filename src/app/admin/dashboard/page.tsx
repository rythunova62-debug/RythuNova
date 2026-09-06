import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Admin Dashboard</h1>
            <p className="text-sm text-stone-500">{admin.email}</p>
          </div>
          <LogoutButton redirectTo="/" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/pilots"
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">Pilots</h2>
            <p className="mt-1 text-sm text-stone-500">Review and verify pilots</p>
          </Link>
          <Link
            href="/admin/providers"
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">Drone Providers</h2>
            <p className="mt-1 text-sm text-stone-500">Fleets, pricing, live activity</p>
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">Orders</h2>
            <p className="mt-1 text-sm text-stone-500">Farmer bookings, routing, proof videos</p>
          </Link>
          <Link
            href="/admin/access-logs"
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="font-medium text-stone-900">Login & Access</h2>
            <p className="mt-1 text-sm text-stone-500">Who&apos;s online, login history</p>
          </Link>
          <div className="rounded-lg border border-stone-200 bg-stone-100 p-6 opacity-60">
            <h2 className="font-medium text-stone-500">Sheets</h2>
            <p className="mt-1 text-sm text-stone-400">Not connected yet</p>
          </div>
        </div>
      </div>
    </main>
  );
}
