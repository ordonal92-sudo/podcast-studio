import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/discover",
  "/pricing",
  "/login",
  "/api/auth/login",
  "/api/feed",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect /dashboard and /api routes (except public ones above)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
    const authed = await isAuthenticated(req);
    if (!authed) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
