import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Lightweight cookie-presence check only — this cannot query the database
// (proxy runs on the edge path), so it just redirects logged-out visitors
// away from protected sections. Every API route and server page still calls
// requireUser()/getCurrentUser() itself to do the real role + validity check,
// per Next.js guidance not to rely on proxy alone for authorization.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/admin/login", request.url));
    }
    if (pathname.startsWith("/pilot")) {
      return NextResponse.redirect(new URL("/auth/pilot/login", request.url));
    }
    if (pathname.startsWith("/provider")) {
      return NextResponse.redirect(new URL("/auth/provider/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pilot/:path*", "/provider/:path*"],
};
