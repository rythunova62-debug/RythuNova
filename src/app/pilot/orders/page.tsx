import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import PilotOrdersContent from "./PilotOrdersContent";

export default async function PilotOrdersPage() {
  const user = await requireUser("pilot");
  if (!user) {
    redirect("/auth/pilot/login");
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    redirect("/auth/pilot/login");
  }

  return <PilotOrdersContent verified={pilot.verificationStatus === "verified"} />;
}
