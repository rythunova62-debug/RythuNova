import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import OrdersList from "@/components/OrdersList";
import ProviderOrdersHeader from "./ProviderOrdersHeader";

export default async function ProviderOrdersPage() {
  const user = await requireUser("provider");
  if (!user) {
    redirect("/auth/provider/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <ProviderOrdersHeader />
        <OrdersList apiBase="/api/provider/orders" />
      </div>
    </main>
  );
}
