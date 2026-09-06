import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import ProvidersTable from "./ProvidersTable";

export default async function AdminProvidersPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-1 text-2xl font-semibold text-stone-900">Drone Providers</h1>
        <p className="mb-6 text-sm text-stone-500">
          Fleet capacity, coverage, pricing, and login activity — refreshes every few seconds.
        </p>
        <ProvidersTable />
      </div>
    </main>
  );
}
