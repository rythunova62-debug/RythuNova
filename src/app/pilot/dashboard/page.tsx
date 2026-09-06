import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import PilotDashboardContent from "./PilotDashboardContent";

export default async function PilotDashboardPage() {
  const user = await requireUser("pilot");
  if (!user) {
    redirect("/auth/pilot/login");
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    redirect("/auth/pilot/login");
  }

  if (!pilot.profileComplete) {
    redirect("/pilot/profile-completion");
  }

  return <PilotDashboardContent pilot={pilot} email={user.email} />;
}
