"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic2, BarChart3, Settings,
  Plus, Bell, ChevronRight, Headphones, Radio, Rss,
  ExternalLink, Trash2, Globe, LogOut, Upload, Play, TrendingUp,
} from "lucide-react";

function YTIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/>
    </svg>
  );
}
import type { Episode } from "@/lib/db";

const navItems = [
  { icon: <BarChart3 size={18} />, label: "Dashboard", href: "/dashboard" },
  { icon: <Mic2 size={18} />, label: "Episodes", href: "/dashboard" },
  { icon: <Radio size={18} />, label: "Distribution", href: "/dashboard/distribution" },
  { icon: <Settings size={18} />, label: "Settings", href: "/dashboard" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "published") return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: "rgba(16,185,129,0.12)", color: "#6EE7B7" }}>Live</span>
  );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: "rgba(245,158,11,0.12)", color: "#FCD34D" }}>Draft</span>
  );
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [ytConfigured, setYtConfigured] = useState(false);

  useEffect(() => {
    fetch("/api/episodes")
      .then((r) => r.json())
      .then((data) => { setEpisodes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
    // Rough check: if youtube_refresh env is set the upload button will show
    // We just show the connect button always; actual check is server-side
    setYtConfigured(false);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this episode?")) return;
    await fetch(`/api/episodes/${id}`, { method: "DELETE" });
    setEpisodes((prev) => prev.filter((e) => e.id !== id));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const published = episodes.filter((e) => e.status === "published");
  const totalDownloads = 0; // Would come from analytics in a full implementation

  const rssUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/feed`
    : "/api/feed";

  return (
    <div className="flex h-screen pt-16 overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col py-6 px-3 overflow-y-auto"
        style={{ background: "var(--surface)", borderRight: "1px solid rgba(139,92,246,0.1)" }}>
        {/* Podcast selector */}
        <div className="mx-2 mb-6 p-3 rounded-xl" style={{ border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
              <Mic2 size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">My Podcast</div>
              <div className="text-xs text-slate-400">{episodes.length} episodes</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => (
            <button key={i} onClick={() => setActiveNav(item.label)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={activeNav === item.label ? {
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))",
                color: "#A78BFA", border: "1px solid rgba(139,92,246,0.2)",
              } : { color: "#64748B" }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout}
          className="mx-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
          style={{ background: "rgba(7,7,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400">Manage your podcast episodes</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <Bell size={18} />
            </button>
            <Link href="/dashboard/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
              <Plus size={15} />
              New Episode
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Episodes", value: String(episodes.length), icon: <Mic2 size={18} />, color: "#8B5CF6" },
              { label: "Published", value: String(published.length), icon: <Play size={18} />, color: "#EC4899" },
              { label: "On YouTube", value: String(episodes.filter(e => e.youtubeId).length), icon: <TrendingUp size={18} />, color: "#F59E0B" },
              { label: "RSS Active", value: published.length > 0 ? "Yes" : "No", icon: <Headphones size={18} />, color: "#10B981" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: stat.color + "20", color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Episodes list */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">All Episodes</h2>
                <Link href="/dashboard/upload"
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  <Plus size={13} /> Upload new
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
              ) : episodes.length === 0 ? (
                <div className="py-12 text-center">
                  <Upload size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm mb-4">No episodes yet</p>
                  <Link href="/dashboard/upload"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                    <Plus size={15} /> Upload First Episode
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {episodes.map((ep) => (
                    <div key={ep.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5 group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>
                        {ep.episodeNumber ? (
                          <span className="text-xs font-bold">#{ep.episodeNumber}</span>
                        ) : (
                          <Mic2 size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{ep.title}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{new Date(ep.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          {ep.duration && <span>· {ep.duration}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={ep.status} />
                        {ep.youtubeUrl && (
                          <a href={ep.youtubeUrl} target="_blank" rel="noreferrer"
                            className="text-red-400 hover:text-red-300 transition-colors" title="View on YouTube">
                            <YTIcon size={14} />
                          </a>
                        )}
                        <button onClick={() => handleDelete(ep.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* RSS Feed */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Rss size={15} className="text-purple-400" />
                  <h3 className="font-semibold text-white text-sm">RSS Feed</h3>
                  {published.length > 0 && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-400" />
                  )}
                </div>
                <code className="block text-xs text-purple-300 bg-black/30 px-3 py-2 rounded-lg font-mono truncate mb-3">
                  {rssUrl}
                </code>
                <div className="space-y-1.5">
                  {["Spotify", "Apple Podcasts", "Amazon Music", "iHeart Radio"].map((p) => (
                    <div key={p} className="flex items-center gap-2 text-xs text-slate-400">
                      <Globe size={11} className="text-slate-600" />
                      {p}
                      <span className="ml-auto text-slate-600">submit RSS once →</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(rssUrl)}
                  className="w-full mt-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  Copy RSS URL
                </button>
              </div>

              {/* YouTube */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <YTIcon size={15} className="text-red-400" />
                  <h3 className="font-semibold text-white text-sm">YouTube</h3>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Connect your YouTube channel to auto-upload each episode as a video.
                </p>
                <a href="/api/youtube/auth"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                  Connect YouTube <ExternalLink size={11} />
                </a>
                <p className="text-xs text-slate-600 text-center mt-2">
                  Requires YouTube API credentials in .env.local
                </p>
              </div>

              {/* Quick links */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/dashboard/upload"
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white py-1.5 transition-colors">
                    <Plus size={14} className="text-purple-400" /> Upload episode
                  </Link>
                  <a href={rssUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white py-1.5 transition-colors">
                    <ExternalLink size={14} className="text-purple-400" /> View RSS feed
                  </a>
                  <a href="/api/youtube/auth"
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white py-1.5 transition-colors">
                    <YTIcon size={14} className="text-red-400" /> Setup YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
