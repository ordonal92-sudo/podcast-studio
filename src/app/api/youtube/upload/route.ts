import { NextRequest, NextResponse } from "next/server";
import { getEpisode, updateEpisode } from "@/lib/db";
import { getAudioFilePath, getCoverPath } from "@/lib/storage";
import { uploadToYouTube, isYouTubeConfigured } from "@/lib/youtube";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for large uploads

export async function POST(req: NextRequest) {
  const { episodeId, privacyStatus = "public" } = await req.json();

  if (!episodeId) {
    return NextResponse.json({ error: "episodeId is required" }, { status: 400 });
  }

  if (!isYouTubeConfigured()) {
    return NextResponse.json({
      error: "YouTube not configured",
      setup: "Go to /api/youtube/auth to connect your YouTube account",
    }, { status: 400 });
  }

  const episode = getEpisode(episodeId);
  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  if (episode.youtubeId) {
    return NextResponse.json({
      ok: true,
      videoId: episode.youtubeId,
      url: episode.youtubeUrl,
      message: "Already uploaded to YouTube",
    });
  }

  const audioPath = getAudioFilePath(episode.audioFile);
  if (!fs.existsSync(audioPath)) {
    return NextResponse.json({ error: "Audio file not found on server" }, { status: 404 });
  }

  // Mark as pending
  updateEpisode(episodeId, { distributions: { rss: episode.distributions.rss, youtube: "pending" } });

  try {
    const coverPath = episode.coverImage
      ? getCoverPath(episode.coverImage)
      : undefined;

    const baseUrl = process.env.PODCAST_BASE_URL || "http://localhost:3000";
    const feedUrl = `${baseUrl}/api/feed`;

    const fullDescription = [
      episode.description,
      "",
      episode.showNotes ? episode.showNotes : "",
      "",
      "---",
      `🎙️ Subscribe to the podcast RSS feed: ${feedUrl}`,
      `🎵 Listen on all platforms: ${baseUrl}`,
    ].filter(Boolean).join("\n");

    const { videoId, url } = await uploadToYouTube({
      title: episode.title,
      description: fullDescription,
      audioPath,
      coverImagePath: coverPath,
      tags: ["podcast"],
      privacyStatus: privacyStatus as "public" | "unlisted" | "private",
    });

    updateEpisode(episodeId, {
      youtubeId: videoId,
      youtubeUrl: url,
      distributions: { rss: episode.distributions.rss, youtube: true },
    });

    return NextResponse.json({ ok: true, videoId, url });
  } catch (err) {
    updateEpisode(episodeId, {
      distributions: { rss: episode.distributions.rss, youtube: "error" },
    });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
