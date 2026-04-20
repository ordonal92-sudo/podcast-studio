import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import Busboy from "busboy";
import ffmpeg from "fluent-ffmpeg";
import { ensureUploadDirs, getAudioDuration } from "@/lib/storage";
import { saveEpisode } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

interface ParsedUpload {
  fields: Record<string, string>;
  audioFile?: { filename: string; path: string; size: number; mimetype: string; isVideo?: boolean };
  coverFile?: { filename: string; path: string; size: number };
}

const ALLOWED_AUDIO = [
  "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a",
  "audio/ogg", "audio/wav", "audio/aac", "audio/flac", "audio/x-flac",
];
const ALLOWED_VIDEO = [
  "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm",
  "video/mpeg", "video/x-matroska",
];
const ALLOWED_IMAGE = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT[${label}] after ${ms / 1000}s`)), ms)
    ),
  ]);
}

function extractAudioFromVideo(videoPath: string, audioPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate("192k")
      .output(audioPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(new Error(`שגיאה בחילוץ שמע: ${err.message}`)))
      .run();
  });
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

    const pendingWrites: Promise<void>[] = [];
    let busboyDone = false;
    let settled = false;

    const done = (err?: unknown) => {
      if (settled) return;
      settled = true;
      if (err) reject(err instanceof Error ? err : new Error(String(err)));
      else resolve({ fields, audioFile, coverFile });
    };

    const maybeResolve = () => {
      if (!busboyDone) return;
      Promise.all(pendingWrites).then(() => done()).catch(done);
    };

    const bb = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: 600 * 1024 * 1024 },
    });

    bb.on("field", (name, value) => { fields[name] = value; });

    bb.on("file", (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;

      if (fieldname === "audio") {
        const isAudio = ALLOWED_AUDIO.includes(mimeType);
        const isVideo = ALLOWED_VIDEO.includes(mimeType);

        if (!isAudio && !isVideo) {
          fileStream.resume();
          return done(new Error(`סוג קובץ לא נתמך: ${mimeType}. ניתן להעלות קבצי MP3, MP4, WAV, M4A או וידאו.`));
        }

        const origExt = path.extname(filename) || (isVideo ? ".mp4" : ".mp3");
        const destFilename = `${id}${origExt}`;
        const destPath = path.join(process.cwd(), "uploads", destFilename);
        const writeStream = fs.createWriteStream(destPath);
        let size = 0;

        fileStream.on("data", (chunk: Buffer) => { size += chunk.length; });
        fileStream.pipe(writeStream);

        const writePromise = new Promise<void>((res, rej) => {
          writeStream.on("finish", () => {
            audioFile = { filename: destFilename, path: destPath, size, mimetype: mimeType, isVideo };
            res();
          });
          writeStream.on("error", rej);
        });
        pendingWrites.push(writePromise);

      } else if (fieldname === "cover") {
        if (!ALLOWED_IMAGE.includes(mimeType)) {
          fileStream.resume();
          return;
        }
        const coverExt = path.extname(filename) || ".jpg";
        const coverFilename = `${id}-cover${coverExt}`;
        const coverPath = path.join(process.cwd(), "uploads", "covers", coverFilename);
        const writeStream = fs.createWriteStream(coverPath);
        let size = 0;

        fileStream.on("data", (chunk: Buffer) => { size += chunk.length; });
        fileStream.pipe(writeStream);

        const writePromise = new Promise<void>((res, rej) => {
          writeStream.on("finish", () => {
            coverFile = { filename: coverFilename, path: coverPath, size };
            res();
          });
          writeStream.on("error", rej);
        });
        pendingWrites.push(writePromise);

      } else {
        fileStream.resume();
      }
    });

    bb.on("finish", () => { busboyDone = true; maybeResolve(); });
    bb.on("error", done);

    // FIX: explicitly read the Web ReadableStream and call bb.end() when done.
    // Readable.fromWeb() does not reliably signal EOF in Railway's proxy environment —
    // the underlying IncomingMessage 'end' event doesn't always propagate through the
    // Web ReadableStream wrapper, so Busboy never fires 'finish'.
    // Explicit reading guarantees bb.end() is called.
    const body = req.body;
    if (!body) return done(new Error("No request body"));

    (async () => {
      const reader = (body as ReadableStream<Uint8Array>).getReader();
      try {
        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          if (value) bb.write(Buffer.from(value));
        }
        bb.end();
      } catch (e) {
        done(e);
      } finally {
        reader.releaseLock();
      }
    })();
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { fields, audioFile, coverFile } = await withTimeout(
      parseMultipart(req),
      240_000,
      "parseMultipart"
    );

    const title = fields.title?.trim();
    const description = fields.description?.trim() || "";
    const showNotes = fields.showNotes?.trim() || "";
    const episodeType = fields.episodeType || "full";
    const episodeNumber = fields.episodeNumber ? Number(fields.episodeNumber) : undefined;
    const season = fields.season ? Number(fields.season) : undefined;
    const publishNow = fields.publishNow === "true";

    if (!audioFile) {
      return NextResponse.json({
        error: "לא התקבל קובץ אודיו. ודאי שבחרת קובץ MP3, MP4, WAV או M4A.",
        debug: { fields: Object.keys(fields) }
      }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "נדרש שם פרק" }, { status: 400 });
    }

    let finalAudioFilename = audioFile.filename;
    let finalAudioPath = audioFile.path;

    if (audioFile.isVideo) {
      const mp3Filename = `${path.basename(audioFile.filename, path.extname(audioFile.filename))}.mp3`;
      const mp3Path = path.join(process.cwd(), "uploads", mp3Filename);
      await extractAudioFromVideo(audioFile.path, mp3Path);
      try { fs.unlinkSync(audioFile.path); } catch { /* ignore */ }
      finalAudioFilename = mp3Filename;
      finalAudioPath = mp3Path;
    }

    const episodeId = finalAudioFilename.replace(/\.[^.]+$/, "");
    const duration = await withTimeout(getAudioDuration(finalAudioPath), 30_000, "ffprobe");

    const baseUrl = process.env.PODCAST_BASE_URL || "http://localhost:3000";
    const audioUrl = `${baseUrl}/api/audio/${finalAudioFilename}`;

    const episode = {
      id: episodeId,
      title,
      description,
      showNotes,
      audioFile: finalAudioFilename,
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
    const message = err instanceof Error ? err.message : String(err);
    console.error("Upload error:", message);
    return NextResponse.json({
      error: message,
      hint: "בדוק שהקובץ תקין ושם הפרק מולא"
    }, { status: 500 });
  }
}
