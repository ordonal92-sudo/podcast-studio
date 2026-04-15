import { NextRequest, NextResponse } from "next/server";
import { signToken, getSessionCookieOptions } from "@/lib/auth";

// Simple in-memory rate limiter: max 10 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Clean up expired entries
  const entry = attempts.get(ip);
  if (entry && now > entry.resetAt) {
    attempts.delete(ip);
  }

  // Check rate limit
  const current = attempts.get(ip);
  if (current && current.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "יותר מדי ניסיונות. נסי שוב בעוד 15 דקות." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set in .env.local" }, { status: 500 });
  }

  if (password !== adminPassword) {
    // Record failed attempt
    const rec = attempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
    rec.count += 1;
    attempts.set(ip, rec);

    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  // Success — clear failed attempts
  attempts.delete(ip);

  const token = await signToken({ role: "admin" });
  const cookieOpts = getSessionCookieOptions();

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    ...cookieOpts,
    value: token,
  });
  return res;
}
