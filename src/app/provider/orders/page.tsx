import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import OrdersList from "@/components/OrdersList";

export default async function ProviderOrdersPage() {
  const user = await requireUser("provider");
  if (!user) {
    redirect("/auth/provider/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-emerald-950">Orders</h1>
          <Link href="/provider/dashboard" className="text-sm text-emerald-700 hover:underline">
            ← Dashboard
          </Link>
        </div>
        <OrdersList apiBase="/api/provider/orders" />
      </div>
    </main>
  );
}
