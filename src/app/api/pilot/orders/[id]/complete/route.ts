import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { saveUploadedVideo, UploadValidationError } from "@/lib/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser("pilot");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) {
    return NextResponse.json({ error: "Pilot profile not found" }, { status: 404 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.assignedPilotId !== pilot.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "completed") {
    return NextResponse.json({ error: "This order is already completed" }, { status: 400 });
  }

  const formData = await request.formData();
  const video = formData.get("video");
  if (!(video instanceof File)) {
    return NextResponse.json(
      { error: "A short video proof of the spraying is required to complete this order" },
      { status: 400 }
    );
  }

  let proofVideoKey: string;
  try {
    proofVideoKey = await saveUploadedVideo(video);
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "completed", proofVideoKey, completedAt: new Date() },
  });

  return NextResponse.json({ order: updated });
}
