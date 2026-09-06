import { prisma } from "@/lib/prisma";

export async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId?: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      adminId,
      action,
      targetUserId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
