import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import Busboy from "busboy";
import { Readable } from "stream";
import { ensureUploadDirs, getAudioDuration } from "@/lib/storage";
import { saveEpisode } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 300;

// Disable Next.js body parsing — we handle it ourselves via busboy (streaming)
export const dynamic = "force-dynamic";

interface ParsedUpload {
  fields: Record<string, string>;
  audioFile?: { filename: string; path: string; size: number; mimetype: string };
  coverFile?: { filename: string; path: string; size: number };
}

function parseMultipart(req: NextRequest): Promise<ParsedUpload> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return reject(new Error("Expected multipart/form-data"));
    }

    ensureUploadDirs();

    const fields: Record<string, string> = {};
    let audioFile: ParsedUpload["audioFile"];
    let coverFile: ParsedUpload["coverFile"];
    const id = uuidv4();

    const bb = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: 600 * 1024 * 1024 }, // 600MB max
    });

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/ogg", "audio/wav", "audio/aac", "audio/flac", "audio/x-flac"];
    const ALLOWED_IMAGE = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    bb.on("file", (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;
      const ext = path.extname(filename) || (mimeType.includes("mpeg") ? ".mp3" : ".mp3");

      if (fieldname === "audio") {
        if (!ALLOWED_AUDIO.some(t => mimeType.startsWith(t.split("/")[0]) && mimeType.includes("audio")) && !ALLOWED_AUDIO.includes(mimeType)) {
          fileStream.resume();
          return reject(new Error(`סוג קובץ לא מותר: ${mimeType}. רק קבצי אודיו מותרים.`));
        }
        const destFilename = `${id}${ext}`;
        const destPath = path.join(process.cwd(), "uploads", destFilename);
        const writeStream = fs.createWriteStream(destPath);
        let size = 0;

        fileStream.on("data", (chunk: Buffer) => { size += chunk.length; });
        fileStream.pipe(writeStream);
        writeStream.on("finish", () => {
          audioFile = { filename: destFilename, path: destPath, size, mimetype: mimeType };
        });
        writeStream.on("error", reject);
      } else if (fieldname === "cover") {
        if (!ALLOWED_IMAGE.includes(mimeType)) {
          fileStream.resume();
          return reject(new Error(`סוג קובץ לא מותר: ${mimeType}. רק תמונות JPG/PNG/WEBP מותרות.`));
        }
        const coverExt = path.extname(filename) || ".jpg";
        const coverFilename = `${id}-cover${coverExt}`;
        const coverPath = path.join(process.cwd(), "uploads", "covers", coverFilename);
        const writeStream = fs.createWriteStream(coverPath);
        let size = 0;

        fileStream.on("data", (chunk: Buffer) => { size += chunk.length; });
        fileStream.pipe(writeStream);
        writeStream.on("finish", () => {
          coverFile = { filename: coverFilename, path: coverPath, size };
        });
        writeStream.on("error", reject);
      } else {
        fileStream.resume(); // discard unknown files
      }
    });

    bb.on("finish", () => resolve({ fields, audioFile, coverFile }));
    bb.on("error", reject);

    // Pipe request body into busboy
    const body = req.body;
    if (!body) return reject(new Error("No request body"));
    Readable.fromWeb(body as import("stream/web").ReadableStream).pipe(bb);
  });
}

export async function POST(req: NextRequest) {
  try {
    const { fields, audioFile, coverFile } = await parseMultipart(req);

    const title = fields.title?.trim();
    const description = fields.description?.trim() || "";
    const showNotes = fields.showNotes?.trim() || "";
    const episodeType = fields.episodeType || "full";
    const episodeNumber = fields.episodeNumber ? Number(fields.episodeNumber) : undefined;
    const season = fields.season ? Number(fields.season) : undefined;
    const publishNow = fields.publishNow === "true";

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const episodeId = audioFile.filename.replace(/\.[^.]+$/, "");
    const duration = await getAudioDuration(audioFile.path);

    const baseUrl = process.env.PODCAST_BASE_URL || "http://localhost:3000";
    const audioUrl = `${baseUrl}/api/audio/${audioFile.filename}`;

    const episode = {
      id: episodeId,
      title,
      description,
      showNotes,
      audioFile: audioFile.filename,
      audioUrl,
      coverImage: coverFile?.filename,
      duration,
      fileSize: audioFile.size,
      season,
      episodeNumber,
      episodeType: episodeType as "full" | "trailer" | "bonus",
      status: (publishNow ? "published" : "draft") as "published" | "draft",
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
