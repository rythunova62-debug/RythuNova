import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProfileCompletionPage() {
  const user = await requireUser("pilot");
  if (!user) {
    redirect("/auth/pilot/login");
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    redirect("/auth/pilot/login");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-emerald-50 px-6 py-16">
      <div className="w-full max-w-lg rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-emerald-900">Complete Your Profile</h1>
        <p className="mb-6 text-sm text-emerald-700">
          Confirm your details so admins can review and verify your account.
        </p>
        <ProfileForm pilot={pilot} />
      </div>
    </main>
  );
}
