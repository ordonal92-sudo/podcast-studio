"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, Mic2, CheckCircle, XCircle, Loader2, AlertCircle,
  ChevronLeft, Rss, Globe, Headphones, ExternalLink,
} from "lucide-react";

function YTIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/>
    </svg>
  );
}

interface DistributionStatus {
  name: string;
  icon: React.ReactNode;
  type: "rss" | "youtube" | "rss-platform";
  status: "idle" | "pending" | "success" | "error";
  url?: string;
  detail?: string;
}

const RSS_PLATFORMS = [
  "Spotify", "Apple Podcasts", "Amazon Music",
  "iHeart Radio", "Podcast Addict", "Pocket Casts",
  "Overcast", "Castbox", "Deezer", "Stitcher",
];

export default function UploadPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showNotes, setShowNotes] = useState("");
  const [episodeType, setEpisodeType] = useState("full");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [youtubePrivacy, setYoutubePrivacy] = useState("public");
  const [uploadToYT, setUploadToYT] = useState(true);
  const [publishNow, setPublishNow] = useState(true);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "distributing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [_episodeId, setEpisodeId] = useState<string | null>(null);

  const [platforms, setPlatforms] = useState<DistributionStatus[]>([
    { name: "RSS Feed", icon: <Rss size={15} />, type: "rss", status: "idle" },
    { name: "YouTube", icon: <YTIcon size={15} />, type: "youtube", status: "idle" },
    ...RSS_PLATFORMS.map((p) => ({
      name: p,
      icon: <Globe size={14} />,
      type: "rss-platform" as const,
      status: "idle" as const,
    })),
  ]);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function updatePlatform(name: string, patch: Partial<DistributionStatus>) {
    setPlatforms((prev) => prev.map((p) => p.name === name ? { ...p, ...patch } : p));
  }

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!audioFile || !title.trim()) return;

    setStage("uploading");
    setUploadProgress(0);
    setErrorMsg("");

    // Build form data
    const fd = new FormData();
    fd.append("audio", audioFile);
    if (coverFile) fd.append("cover", coverFile);
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("showNotes", showNotes.trim());
    fd.append("episodeType", episodeType);
    if (episodeNumber) fd.append("episodeNumber", episodeNumber);
    fd.append("publishNow", String(publishNow));
    fd.append("status", publishNow ? "published" : "draft");

    try {
      // Upload audio + save episode
      setUploadProgress(10);
      const xhr = new XMLHttpRequest();
      const uploadResult = await new Promise<{ ok: boolean; episode?: { id: string }; error?: string }>((resolve, reject) => {
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round(10 + (ev.loaded / ev.total) * 70));
          }
        };
        xhr.onload = () => {
          try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Invalid server response")); }
        };
        xhr.onerror = () => reject(new Error("שגיאת רשת — ודאי שיש חיבור לאינטרנט"));
        xhr.ontimeout = () => reject(new Error("ההעלאה ארכה יותר מדי זמן"));
        xhr.open("POST", "/api/upload");
        xhr.send(fd);
      });

      if (!uploadResult.ok || !uploadResult.episode) {
        throw new Error(uploadResult.error || "שגיאה לא ידועה בשרת");
      }

      setUploadProgress(85);
      const newEpisodeId = uploadResult.episode.id;
      setEpisodeId(newEpisodeId);

      // Mark RSS done
      setStage("distributing");
      if (publishNow) {
        updatePlatform("RSS Feed", { status: "success", detail: "Feed updated" });
        setPlatforms((prev) =>
          prev.map((p) =>
            p.type === "rss-platform"
              ? { ...p, status: "success", detail: "Will auto-sync within 24h" }
              : p
          )
        );
      }

      setUploadProgress(90);

      // YouTube upload
      if (uploadToYT && publishNow) {
        updatePlatform("YouTube", { status: "pending", detail: "Converting audio to video..." });
        try {
          const ytRes = await fetch("/api/youtube/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ episodeId: newEpisodeId, privacyStatus: youtubePrivacy }),
          });
          const ytData = await ytRes.json();
          if (!ytRes.ok || ytData.error) {
            updatePlatform("YouTube", { status: "error", detail: ytData.error || "Upload failed" });
          } else {
            updatePlatform("YouTube", { status: "success", url: ytData.url, detail: "Published" });
          }
        } catch (err) {
          updatePlatform("YouTube", { status: "error", detail: String(err) });
        }
      }

      setUploadProgress(100);
      setStage("done");
    } catch (err) {
      setErrorMsg(String(err));
      setStage("error");
    }
  }

  const rssUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/feed`
    : "/api/feed";

  if (stage === "done") {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-6"
        style={{ background: "var(--background)" }}>
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ background: "rgba(16,185,129,0.15)", border: "2px solid #10B981" }}>
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Episode Published!</h1>
            <p className="text-slate-400 mt-2">Your episode is live and being distributed</p>
          </div>

          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Distribution Status</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {platforms.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    p.status === "success" ? "text-green-400" :
                    p.status === "error" ? "text-red-400" :
                    p.status === "pending" ? "text-yellow-400" : "text-slate-500"
                  }`} style={{ background: p.status === "success" ? "rgba(16,185,129,0.1)" : p.status === "error" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)" }}>
                    {p.status === "pending" ? <Loader2 size={13} className="animate-spin" /> : p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    {p.detail && <div className="text-xs text-slate-400 truncate">{p.detail}</div>}
                  </div>
                  {p.status === "success" && !p.url && <CheckCircle size={14} className="text-green-400 shrink-0" />}
                  {p.status === "error" && <XCircle size={14} className="text-red-400 shrink-0" />}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RSS Feed URL */}
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Rss size={15} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">Your RSS Feed URL</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-purple-300 bg-black/30 px-3 py-2 rounded-lg font-mono truncate">
                {rssUrl}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(rssUrl)}
                className="text-xs px-3 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.07)" }}>
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Submit this URL to Spotify, Apple Podcasts, Amazon Music etc. once — they'll auto-sync all future episodes.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard"
              className="flex-1 text-center py-3 rounded-xl font-medium text-slate-300 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Back to Dashboard
            </Link>
            <button onClick={() => {
              setStage("idle"); setAudioFile(null); setCoverFile(null); setCoverPreview(null);
              setTitle(""); setDescription(""); setShowNotes(""); setEpisodeNumber("");
              setUploadProgress(0); setEpisodeId(null);
              setPlatforms(prev => prev.map(p => ({ ...p, status: "idle", url: undefined, detail: undefined })));
            }}
              className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
              Upload Another Episode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "var(--background)" }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">העלאת פרק חדש</h1>
            <p className="text-sm text-slate-400">פרסמי פעם אחת — הפצה אוטומטית לכל מקום</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Audio upload */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-semibold text-white mb-4">
              <Mic2 size={15} className="inline mr-2 text-purple-400" />
              קובץ אודיו *
            </label>
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
            {audioFile ? (
              <div className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                  <Headphones size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{audioFile.name}</div>
                  <div className="text-xs text-slate-400">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
                <button type="button" onClick={() => { setAudioFile(null); if (audioInputRef.current) audioInputRef.current.value = ""; }}
                  className="text-slate-400 hover:text-red-400 transition-colors">
                  <XCircle size={18} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => audioInputRef.current?.click()}
                className="w-full py-10 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all hover:border-purple-500 hover:bg-purple-500/5"
                style={{ borderColor: "rgba(139,92,246,0.3)" }}>
                <Upload size={28} className="text-purple-400" />
                <span className="text-white font-medium">לחצי לבחירת קובץ אודיו</span>
                <span className="text-xs text-slate-400">MP3, WAV, M4A, OGG — עד 500MB</span>
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Episode Details</h2>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Episode title"
                required
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short episode description (shown in podcast apps)"
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Show Notes <span className="text-slate-600">(optional, supports HTML)</span>
              </label>
              <textarea
                value={showNotes}
                onChange={(e) => setShowNotes(e.target.value)}
                placeholder="Full episode notes, links, chapters..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none font-mono"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Episode Type</label>
                <select
                  value={episodeType}
                  onChange={(e) => setEpisodeType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <option value="full">Full Episode</option>
                  <option value="trailer">Trailer</option>
                  <option value="bonus">Bonus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Episode Number</label>
                <input
                  type="number"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  placeholder="e.g. 42"
                  min="1"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-sm font-semibold text-white mb-4">
              Cover Image <span className="text-slate-500 font-normal text-xs">(optional — uses podcast default if not set)</span>
            </label>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            <div className="flex items-center gap-4">
              {coverPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="Cover" className="w-20 h-20 rounded-xl object-cover" />
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white"
                    style={{ background: "#EF4444" }}>
                    <XCircle size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                  style={{ border: "2px dashed rgba(139,92,246,0.3)" }}
                  onClick={() => coverInputRef.current?.click()}>
                  <Upload size={20} className="text-slate-500" />
                </div>
              )}
              <div>
                <button type="button" onClick={() => coverInputRef.current?.click()}
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  {coverPreview ? "Change image" : "Upload cover image"}
                </button>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, 1400×1400px minimum</p>
              </div>
            </div>
          </div>

          {/* Distribution options */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Distribution</h2>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}>
                  <Rss size={15} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Publish to RSS Feed</div>
                  <div className="text-xs text-slate-400">Spotify, Apple, Amazon & 10+ auto-sync from RSS</div>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="sr-only" />
                <div className="w-11 h-6 rounded-full transition-all cursor-pointer"
                  style={{ background: publishNow ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.1)" }}
                  onClick={() => setPublishNow(!publishNow)}>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow"
                    style={{ transform: publishNow ? "translateX(20px)" : "translateX(0)" }} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#F87171" }}>
                  <YTIcon size={15} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Upload to YouTube</div>
                  <div className="text-xs text-slate-400">Converts audio to video and uploads automatically</div>
                </div>
              </div>
              <div className="relative">
                <div className="w-11 h-6 rounded-full transition-all cursor-pointer"
                  style={{ background: uploadToYT ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "rgba(255,255,255,0.1)" }}
                  onClick={() => setUploadToYT(!uploadToYT)}>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow"
                    style={{ transform: uploadToYT ? "translateX(20px)" : "translateX(0)" }} />
                </div>
              </div>
            </label>

            {uploadToYT && (
              <div className="pl-11">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">YouTube Privacy</label>
                <select
                  value={youtubePrivacy}
                  onChange={(e) => setYoutubePrivacy(e.target.value)}
                  className="px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>
            )}
          </div>

          {/* Error */}
          {stage === "error" && (
            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-400">ההעלאה נכשלה</div>
                <div className="text-xs text-slate-400 mt-1">{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Progress */}
          {(stage === "uploading" || stage === "distributing") && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Loader2 size={16} className="text-purple-400 animate-spin" />
                <span className="text-sm font-medium text-white">
                  {stage === "uploading" ? "Uploading audio..." : "Distributing to platforms..."}
                </span>
                <span className="ml-auto text-sm font-bold gradient-text">{uploadProgress}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%`, background: "linear-gradient(90deg, #8B5CF6, #EC4899)" }} />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!audioFile || !title.trim() || stage === "uploading" || stage === "distributing"}
            className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 30px rgba(139,92,246,0.3)" }}>
            {stage === "uploading" || stage === "distributing" ? (
              <><Loader2 size={18} className="animate-spin" /> Publishing...</>
            ) : (
              <><Upload size={18} /> Publish Episode</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
