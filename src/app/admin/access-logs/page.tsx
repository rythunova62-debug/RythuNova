import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import AccessLogsTable from "./AccessLogsTable";

export default async function AccessLogsPage() {
  const admin = await requireUser("admin");
  if (!admin) {
    redirect("/auth/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col bg-stone-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-1 text-2xl font-semibold text-stone-900">Login & Access</h1>
        <p className="mb-6 text-sm text-stone-500">
          Every account&apos;s last login/logout time and IP. We don&apos;t do
          IP-to-location lookups yet — that would need a third-party
          geolocation service, which I haven&apos;t wired in without checking
          with you first.
        </p>
        <AccessLogsTable />
      </div>
    </main>
  );
}
