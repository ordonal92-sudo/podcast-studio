import { NextResponse } from "next/server";
import { getEpisodes, getPodcastConfig } from "@/lib/db";
import { generateRssFeed } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getPodcastConfig();
  const episodes = getEpisodes();
  const xml = generateRssFeed(config, episodes);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300", // 5 min cache
    },
  });
}
