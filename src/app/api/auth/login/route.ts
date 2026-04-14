import { NextRequest, NextResponse } from "next/server";
import { signToken, getSessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set in .env.local" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = await signToken({ role: "admin" });
  const cookieOpts = getSessionCookieOptions();

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    ...cookieOpts,
    value: token,
  });
  return res;
}
