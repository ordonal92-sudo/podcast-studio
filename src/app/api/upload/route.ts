import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { saveUploadedFile, getAudioFilePath, getAudioDuration } from "@/lib/storage";
import { saveEpisode } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const showNotes = formData.get("showNotes") as string || "";
    const episodeType = (formData.get("episodeType") as string) || "full";
    const season = formData.get("season") ? Number(formData.get("season")) : undefined;
    const episodeNumber = formData.get("episodeNumber") ? Number(formData.get("episodeNumber")) : undefined;
    const status = (formData.get("status") as string) || "published";
    const publishNow = formData.get("publishNow") === "true";

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate audio file type
    const allowedAudio = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-m4a", "audio/ogg", "audio/aac"];
    if (!allowedAudio.some(t => audioFile.type.includes(t.split("/")[1]))) {
      return NextResponse.json({ error: "Invalid audio file type. Use MP3, WAV, M4A, or OGG." }, { status: 400 });
    }

    const id = uuidv4();
    const audioExt = path.extname(audioFile.name) || ".mp3";
    const audioFilename = `${id}${audioExt}`;

    // Save audio file
    const { size: fileSize } = await saveUploadedFile(audioFile, audioFilename, "audio");

    // Get duration via ffprobe
    const duration = await getAudioDuration(getAudioFilePath(audioFilename));

    // Save cover image if provided
    let coverFilename: string | undefined;
    if (coverFile && coverFile.size > 0) {
      const coverExt = path.extname(coverFile.name) || ".jpg";
      coverFilename = `${id}-cover${coverExt}`;
      await saveUploadedFile(coverFile, coverFilename, "cover");
    }

    const baseUrl = process.env.PODCAST_BASE_URL || "http://localhost:3000";
    const audioUrl = `${baseUrl}/api/audio/${audioFilename}`;

    const episode = {
      id,
      title,
      description,
      showNotes,
      audioFile: audioFilename,
      audioUrl,
      coverImage: coverFilename,
      duration,
      fileSize,
      season,
      episodeNumber,
      episodeType: episodeType as "full" | "trailer" | "bonus",
      status: (publishNow ? "published" : status) as "published" | "draft",
      publishDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      distributions: { rss: publishNow, youtube: false as const },
    };

    saveEpisode(episode);

    return NextResponse.json({ ok: true, episode }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
