import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const COVERS_DIR = path.join(UPLOADS_DIR, "covers");

export function ensureUploadDirs() {
  [UPLOADS_DIR, COVERS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

export function getUploadPath(filename: string) {
  return path.join(UPLOADS_DIR, filename);
}

export function getCoverPath(filename: string) {
  return path.join(COVERS_DIR, filename);
}

export async function saveUploadedFile(
  file: File,
  filename: string,
  type: "audio" | "cover" = "audio"
): Promise<{ filename: string; size: number }> {
  ensureUploadDirs();
  const destPath = type === "cover" ? getCoverPath(filename) : getUploadPath(filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return { filename, size: buffer.length };
}

export function deleteUploadedFile(filename: string, type: "audio" | "cover" = "audio") {
  const filePath = type === "cover" ? getCoverPath(filename) : getUploadPath(filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function getAudioFilePath(filename: string) {
  return getUploadPath(filename);
}

export function getAudioDuration(filePath: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpeg = require("fluent-ffmpeg");
      ffmpeg.ffprobe(filePath, (err: Error | null, meta: { format?: { duration?: number } }) => {
        if (err || !meta?.format?.duration) {
          resolve("00:00");
          return;
        }
        const secs = Math.round(meta.format.duration);
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) {
          resolve(`${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
        } else {
          resolve(`${m}:${String(s).padStart(2, "0")}`);
        }
      });
    } catch {
      resolve("00:00");
    }
  });
}
