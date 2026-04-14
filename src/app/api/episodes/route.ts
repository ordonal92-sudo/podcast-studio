import { NextRequest, NextResponse } from "next/server";
import { getEpisodes, saveEpisode } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const episodes = getEpisodes();
  return NextResponse.json(episodes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const episode = {
    id: uuidv4(),
    ...body,
    createdAt: new Date().toISOString(),
    distributions: { rss: true, youtube: false },
  };
  saveEpisode(episode);
  return NextResponse.json(episode, { status: 201 });
}
