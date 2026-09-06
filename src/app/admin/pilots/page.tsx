import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import BackToDashboard from "@/components/BackToDashboard";
import PilotsTable from "./PilotsTable";

export default async function AdminPilotsPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <BackToDashboard href="/admin/dashboard" />
        <h1 className="mb-1 text-2xl font-semibold text-stone-900">Pilots</h1>
        <p className="mb-6 text-sm text-stone-500">
          Review submitted details and manage verification status.
        </p>
        <PilotsTable />
      </div>
    </main>
  );
}
