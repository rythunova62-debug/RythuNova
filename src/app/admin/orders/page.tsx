import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import BackToDashboard from "@/components/BackToDashboard";
import OrdersManager from "./OrdersManager";

export default async function AdminOrdersPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <BackToDashboard href="/admin/dashboard" />
        <h1 className="mb-1 text-2xl font-semibold text-stone-900">Orders</h1>
        <p className="mb-6 text-sm text-stone-500">
          Farmer bookings. Location matching is approximate (place name + postal
          region, no GPS) — always confirm before assigning.
        </p>
        <OrdersManager />
      </div>
    </main>
  );
}
