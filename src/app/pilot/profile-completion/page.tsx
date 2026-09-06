import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";
import ProfileCompletionHeader from "./ProfileCompletionHeader";

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
        <ProfileCompletionHeader />
        <ProfileForm pilot={pilot} />
      </div>
    </main>
  );
}
