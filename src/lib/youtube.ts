import { google } from "googleapis";
import fs from "fs";
import path from "path";
import os from "os";

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || `${process.env.PODCAST_BASE_URL}/api/youtube/callback`
  );
}

export function getAuthUrl(): string {
  const oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // force refresh_token every time
  });
}

export function isYouTubeConfigured(): boolean {
  return !!(
    process.env.YOUTUBE_CLIENT_ID &&
    process.env.YOUTUBE_CLIENT_SECRET &&
    process.env.YOUTUBE_REFRESH_TOKEN
  );
}

async function getAuthedClient() {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

/**
 * Creates an MP4 video from audio + cover image using ffmpeg.
 * Falls back to audio-only upload if ffmpeg is not available.
 */
async function createVideoFromAudio(
  audioPath: string,
  coverImagePath: string | null
): Promise<{ videoPath: string; cleanup: () => void }> {
  const tmpFile = path.join(os.tmpdir(), `podwave_${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ffmpeg = require("fluent-ffmpeg");
      let cmd = ffmpeg();

      if (coverImagePath && fs.existsSync(coverImagePath)) {
        cmd = cmd
          .input(coverImagePath)
          .inputOptions(["-loop 1"])
          .input(audioPath)
          .outputOptions([
            "-c:v libx264",
            "-tune stillimage",
            "-c:a aac",
            "-b:a 192k",
            "-pix_fmt yuv420p",
            "-shortest",
          ]);
      } else {
        // Black background if no cover image
        cmd = cmd
          .input("color=c=black:s=1280x720:r=1")
          .inputFormat("lavfi")
          .input(audioPath)
          .outputOptions([
            "-c:v libx264",
            "-tune stillimage",
            "-c:a aac",
            "-b:a 192k",
            "-pix_fmt yuv420p",
            "-shortest",
          ]);
      }

      cmd
        .output(tmpFile)
        .on("end", () => resolve({ videoPath: tmpFile, cleanup: () => { try { fs.unlinkSync(tmpFile); } catch {} } }))
        .on("error", (err: Error) => reject(new Error(`ffmpeg error: ${err.message}`)))
        .run();
    } catch (err) {
      reject(new Error("ffmpeg is not installed. Install it with: winget install ffmpeg"));
    }
  });
}

export interface YouTubeUploadOptions {
  title: string;
  description: string;
  audioPath: string;
  coverImagePath?: string;
  tags?: string[];
  categoryId?: string; // "22" = People & Blogs, "27" = Education
  privacyStatus?: "public" | "unlisted" | "private";
  onProgress?: (percent: number) => void;
}

export async function uploadToYouTube(options: YouTubeUploadOptions): Promise<{
  videoId: string;
  url: string;
}> {
  const {
    title,
    description,
    audioPath,
    coverImagePath,
    tags = [],
    categoryId = "27",
    privacyStatus = "public",
    onProgress,
  } = options;

  if (!isYouTubeConfigured()) {
    throw new Error("YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN in .env.local");
  }

  // Step 1: Create video file
  onProgress?.(5);
  const { videoPath, cleanup } = await createVideoFromAudio(audioPath, coverImagePath || null);

  try {
    // Step 2: Authenticate
    onProgress?.(15);
    const auth = await getAuthedClient();
    const youtube = google.youtube({ version: "v3", auth });

    // Step 3: Upload
    onProgress?.(20);
    const fileSize = fs.statSync(videoPath).size;
    let lastProgress = 20;

    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: "iw", // Hebrew
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    }, {
      onUploadProgress: (evt: { bytesRead: number }) => {
        const percent = Math.round(20 + (evt.bytesRead / fileSize) * 75);
        if (percent > lastProgress) {
          lastProgress = percent;
          onProgress?.(percent);
        }
      },
    });

    onProgress?.(100);
    const videoId = res.data.id!;
    return {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } finally {
    cleanup();
  }
}
