import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import BackToDashboard from "@/components/BackToDashboard";
import TeamManager from "./TeamManager";

export default async function AdminTeamPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <BackToDashboard href="/admin/dashboard" />
        <h1 className="mb-1 text-2xl font-semibold text-stone-900">Admin Team</h1>
        <p className="mb-6 text-sm text-stone-500">
          Add teammates who need full admin access.
        </p>
        <TeamManager currentAdminId={admin.id} />
      </div>
    </main>
  );
}
