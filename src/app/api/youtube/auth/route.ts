import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/youtube";

export async function GET() {
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env.local first" },
      { status: 400 }
    );
  }
  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
