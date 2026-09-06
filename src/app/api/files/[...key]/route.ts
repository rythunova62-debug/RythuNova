import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { readStoredFile } from "@/lib/storage";

// Licence/photo/proof-video files are sensitive — never served statically.
// Every request re-checks that the caller is either an admin, the pilot who
// owns this exact file, or the provider assigned to the order it belongs to.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const fileKey = key.join("/");

  if (user.role !== "admin") {
    const authorized = await isAuthorizedForFile(user.id, user.role, fileKey);
    if (!authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const file = await readStoredFile(fileKey);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, no-store",
    },
  });
}

async function isAuthorizedForFile(userId: string, role: string, fileKey: string): Promise<boolean> {
  if (role === "pilot") {
    const pilot = await prisma.pilot.findUnique({ where: { userId } });
    if (!pilot) return false;
    if (pilot.licenceFileKey === fileKey || pilot.photoFileKey === fileKey) return true;
    if (fileKey.startsWith("proofs/")) {
      const order = await prisma.order.findFirst({ where: { proofVideoKey: fileKey, assignedPilotId: pilot.id } });
      return !!order;
    }
    return false;
  }

  if (role === "provider") {
    if (!fileKey.startsWith("proofs/")) return false;
    const provider = await prisma.provider.findUnique({ where: { userId } });
    if (!provider) return false;
    const order = await prisma.order.findFirst({ where: { proofVideoKey: fileKey, assignedProviderId: provider.id } });
    return !!order;
  }

  return false;
}
