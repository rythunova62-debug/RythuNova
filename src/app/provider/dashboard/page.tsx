import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import FleetForm from "./FleetForm";
import PilotRoster from "./PilotRoster";

export default async function ProviderDashboardPage() {
  const user = await requireUser("provider");
  if (!user) {
    redirect("/auth/provider/login");
  }

  const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
  if (!provider) {
    redirect("/auth/provider/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-emerald-50 px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-950">{provider.name}</h1>
            <p className="text-sm text-emerald-700">{user.email}</p>
          </div>
          <LogoutButton redirectTo="/" />
        </div>

        <Link
          href="/provider/orders"
          className="mb-6 block rounded-lg border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
        >
          <h2 className="font-medium text-stone-900">Orders</h2>
          <p className="mt-1 text-sm text-stone-500">View and complete assigned orders</p>
        </Link>

        <div className="mb-6 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-medium text-stone-900">Fleet & Pricing</h2>
          <FleetForm provider={provider} />
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-medium text-stone-900">Pilot Roster</h2>
          <PilotRoster />
        </div>
      </div>
    </main>
  );
}
