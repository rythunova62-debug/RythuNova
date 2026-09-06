import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProviderDashboardHeader, { FleetSection, RosterSection } from "./ProviderDashboardHeader";
import FleetForm from "./FleetForm";
import PilotRoster from "./PilotRoster";
import SceneBackground from "@/components/SceneBackground";

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
    <main className="relative isolate flex flex-1 flex-col overflow-hidden px-6 py-10">
      <SceneBackground scene="provider-dashboard" />
      <div className="mx-auto w-full max-w-3xl">
        <ProviderDashboardHeader name={provider.name} email={user.email} />

        <FleetSection>
          <FleetForm provider={provider} />
        </FleetSection>

        <RosterSection>
          <PilotRoster />
        </RosterSection>
      </div>
    </main>
  );
}
