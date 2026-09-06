import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Role, SessionUser } from "@/lib/types";

export const SESSION_COOKIE = "rn_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: string, loginIp?: string | null) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.$transaction([
    prisma.session.create({ data: { userId, token, expiresAt } }),
    prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date(), lastLoginIp: loginIp ?? null },
    }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const session = await prisma.session.findUnique({ where: { token } });
    if (session) {
      await prisma.$transaction([
        prisma.session.delete({ where: { id: session.id } }),
        prisma.user.update({
          where: { id: session.userId },
          data: { lastLogoutAt: new Date() },
        }),
      ]);
    }
  }
  cookieStore.delete(SESSION_COOKIE);
}

// Validates the session cookie against the database. Deliberately not JWT-based:
// deleting the DB row (logout, admin block/delete) revokes access immediately.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  if (session.user.deletedAt || session.user.accountStatus === "blocked") return null;

  return {
    id: session.user.id,
    role: session.user.role as Role,
    email: session.user.email,
  };
}

export async function requireUser(role?: Role): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (role && user.role !== role) return null;
  return user;
}
