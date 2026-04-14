import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "episodes.json");
const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

export interface Episode {
  id: string;
  title: string;
  description: string;
  showNotes: string;
  audioFile: string;       // filename stored in /uploads/
  audioUrl: string;        // full URL to audio
  coverImage?: string;     // filename in /uploads/covers/
  duration?: string;       // e.g. "42:30"
  fileSize?: number;       // bytes
  season?: number;
  episodeNumber?: number;
  episodeType: "full" | "trailer" | "bonus";
  status: "draft" | "published";
  publishDate: string;     // ISO string
  createdAt: string;
  youtubeId?: string;      // YouTube video ID after upload
  youtubeUrl?: string;
  distributions: {
    rss: boolean;
    youtube: boolean | "pending" | "error";
  };
}

export interface PodcastConfig {
  title: string;
  description: string;
  author: string;
  email: string;
  language: string;
  category: string;
  subcategory?: string;
  coverImage?: string;
  websiteUrl: string;
  explicit: boolean;
}

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getEpisodes(): Episode[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Episode[];
  } catch {
    return [];
  }
}

export function getEpisode(id: string): Episode | null {
  return getEpisodes().find((e) => e.id === id) ?? null;
}

export function saveEpisode(episode: Episode): Episode {
  const episodes = getEpisodes();
  const idx = episodes.findIndex((e) => e.id === episode.id);
  if (idx >= 0) {
    episodes[idx] = episode;
  } else {
    episodes.unshift(episode); // newest first
  }
  ensureDir(DB_PATH);
  fs.writeFileSync(DB_PATH, JSON.stringify(episodes, null, 2), "utf-8");
  return episode;
}

export function deleteEpisode(id: string): boolean {
  const episodes = getEpisodes();
  const filtered = episodes.filter((e) => e.id !== id);
  if (filtered.length === episodes.length) return false;
  fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export function updateEpisode(id: string, patch: Partial<Episode>): Episode | null {
  const episode = getEpisode(id);
  if (!episode) return null;
  const updated = { ...episode, ...patch };
  saveEpisode(updated);
  return updated;
}

export function getPodcastConfig(): PodcastConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return {
        title: process.env.PODCAST_TITLE || "My Podcast",
        description: process.env.PODCAST_DESCRIPTION || "A great podcast",
        author: process.env.PODCAST_AUTHOR || "Podcast Author",
        email: process.env.PODCAST_EMAIL || "podcast@example.com",
        language: "he",
        category: "Education",
        websiteUrl: process.env.PODCAST_BASE_URL || "http://localhost:3000",
        explicit: false,
      };
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {
      title: "My Podcast",
      description: "A great podcast",
      author: "Author",
      email: "author@example.com",
      language: "he",
      category: "Education",
      websiteUrl: "http://localhost:3000",
      explicit: false,
    };
  }
}

export function savePodcastConfig(config: PodcastConfig) {
  ensureDir(CONFIG_PATH);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}
