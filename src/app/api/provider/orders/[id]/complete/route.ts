import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { saveUploadedVideo, UploadValidationError } from "@/lib/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser("provider");
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.provider.findUnique({ where: { userId: user.id } });
  if (!provider) {
    return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.assignedProviderId !== provider.id) {
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
