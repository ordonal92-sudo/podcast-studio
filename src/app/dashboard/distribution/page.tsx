"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Copy, ExternalLink, Rss, Info, ChevronDown } from "lucide-react";

interface Platform {
  name: string;
  logo: string;          // emoji or letter
  color: string;
  submitUrl: string;
  steps: string[];
  note?: string;
  autoDiscover?: boolean; // discovers automatically from other dirs, no manual submit
  listeners: string;
}

const PLATFORMS: Platform[] = [
  {
    name: "Spotify",
    logo: "S",
    color: "#1DB954",
    submitUrl: "https://podcasters.spotify.com/",
    listeners: "600M+ users",
    steps: [
      "כנסי לכתובת למעלה (Spotify for Podcasters)",
      "לחצי על 'Get started' ← 'I have a podcast'",
      "הדביקי את ה-RSS URL שלך",
      "מלאי פרטים + אמתי בעלות על הפודקאסט",
      "ה-פרק הראשון יופיע תוך 24–48 שעות",
    ],
  },
  {
    name: "Apple Podcasts",
    logo: "A",
    color: "#FA243C",
    submitUrl: "https://podcastsconnect.apple.com/",
    listeners: "1B+ Apple devices",
    steps: [
      "כנסי לכתובת למעלה (Apple Podcasts Connect)",
      "התחברי עם Apple ID",
      "לחצי על '+' ← הדביקי את ה-RSS URL",
      "המתיני לאישור Apple (בד\"כ 24–72 שעות)",
    ],
    note: "Apple Podcasts הוא הספרייה הגדולה ביותר — חובה להגיש!",
  },
  {
    name: "Amazon Music / Audible",
    logo: "Am",
    color: "#FF9900",
    submitUrl: "https://www.amazon.com/podcasters",
    listeners: "150M+ Amazon users",
    steps: [
      "כנסי לכתובת למעלה",
      "לחצי 'Submit your podcast'",
      "הדביקי את ה-RSS URL",
      "התחברי עם חשבון Amazon",
      "אישור תוך 24–48 שעות",
    ],
  },
  {
    name: "YouTube Podcasts",
    logo: "YT",
    color: "#FF0000",
    submitUrl: "https://studio.youtube.com/",
    listeners: "2.7B+ YouTube users",
    steps: [
      "כנסי ל-YouTube Studio",
      "לכי ל: Content ← Podcasts",
      "לחצי 'Create Podcast' ← 'Import from RSS'",
      "הדביקי את ה-RSS URL שלך",
      "YouTube תמיר כל פרק לוידאו אוטומטית",
    ],
    note: "YouTube Podcasts יוצר וידאו אוטומטית מה-RSS — ללא ffmpeg!",
  },
  {
    name: "iHeart Radio",
    logo: "iH",
    color: "#C6002B",
    submitUrl: "https://www.iheart.com/content/submit-your-podcast/",
    listeners: "120M+ users",
    steps: [
      "כנסי לכתובת למעלה",
      "לחצי 'Submit Your Podcast'",
      "הדביקי את ה-RSS URL",
      "מלאי פרטי קשר ואמתי",
    ],
  },
  {
    name: "Pocket Casts",
    logo: "PC",
    color: "#F43F3F",
    submitUrl: "https://pocketcasts.com/submit/",
    listeners: "Popular among power users",
    steps: [
      "כנסי לכתובת למעלה",
      "הדביקי את ה-RSS URL",
      "ה-פודקאסט יתווסף לאינדקס תוך מספר ימים",
    ],
  },
  {
    name: "Overcast",
    logo: "O",
    color: "#FC7E0F",
    submitUrl: "https://overcast.fm/",
    listeners: "Popular iOS app",
    autoDiscover: true,
    steps: [
      "Overcast מושך אוטומטית מ-Apple Podcasts",
      "אין צורך בהגשה ידנית — ברגע שאת ב-Apple, את ב-Overcast",
    ],
    note: "אוטומטי לאחר אישור Apple",
  },
  {
    name: "Castbox",
    logo: "CB",
    color: "#F0A500",
    submitUrl: "https://castbox.fm/podcaster",
    listeners: "15M+ users",
    steps: [
      "כנסי לכתובת למעלה",
      "צרי חשבון Podcaster",
      "הדביקי את ה-RSS URL",
      "אישור תוך 48 שעות",
    ],
  },
  {
    name: "Deezer",
    logo: "D",
    color: "#A238FF",
    submitUrl: "https://www.deezer.com/en/creators/",
    listeners: "16M+ users",
    steps: [
      "כנסי לכתובת למעלה (Deezer for Creators)",
      "לחצי 'Distribute your Podcast'",
      "הדביקי את ה-RSS URL",
    ],
  },
  {
    name: "Podchaser",
    logo: "Pch",
    color: "#4285F4",
    submitUrl: "https://www.podchaser.com/login",
    listeners: "Podcast directory & reviews",
    steps: [
      "כנסי לכתובת למעלה",
      "חפשי את הפודקאסט שלך — אם לא קיים, לחצי 'Add podcast'",
      "הדביקי את ה-RSS URL",
    ],
  },
  {
    name: "TuneIn",
    logo: "TI",
    color: "#00A0C6",
    submitUrl: "https://tunein.com/podcasts/submit/",
    listeners: "75M+ users",
    steps: [
      "כנסי לכתובת למעלה",
      "מלאי את טופס ההגשה עם ה-RSS URL",
      "אישור תוך מספר ימים",
    ],
  },
  {
    name: "Listen Notes",
    logo: "LN",
    color: "#8B5CF6",
    submitUrl: "https://www.listennotes.com/submit/",
    listeners: "Podcast search engine",
    steps: [
      "כנסי לכתובת למעלה",
      "הדביקי את ה-RSS URL",
      "ה-פודקאסט יאונדקס תוך 24 שעות",
    ],
    note: "Listen Notes הוא מנוע חיפוש לפודקאסטים — נמצאות ב-Google",
  },
];

function PlatformCard({ platform, rssUrl }: { platform: Platform; rssUrl: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function copyRss() {
    navigator.clipboard.writeText(rssUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all"
      style={{ border: submitted ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: platform.color }}>
          {platform.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">{platform.name}</span>
            {platform.autoDiscover && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.12)", color: "#6EE7B7" }}>
                אוטומטי
              </span>
            )}
            {submitted && <CheckCircle size={14} className="text-green-400" />}
          </div>
          <div className="text-xs text-slate-400">{platform.listeners}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!submitted ? (
            <>
              <button onClick={copyRss}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{ background: "rgba(139,92,246,0.15)", color: copied ? "#6EE7B7" : "#A78BFA" }}>
                <Copy size={11} />
                {copied ? "הועתק!" : "העתק RSS"}
              </button>
              <a href={platform.submitUrl} target="_blank" rel="noreferrer"
                onClick={() => setTimeout(() => setOpen(true), 300)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${platform.color}99, ${platform.color})` }}>
                הגישי <ExternalLink size={10} />
              </a>
            </>
          ) : (
            <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "rgba(16,185,129,0.12)", color: "#6EE7B7" }}>
              ✓ הוגש
            </span>
          )}
          <button onClick={() => setOpen(!open)}
            className="p-1 text-slate-400 hover:text-white transition-colors">
            <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
        </div>
      </div>

      {/* Steps */}
      {open && (
        <div className="px-5 pb-5 space-y-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {platform.note && (
            <div className="flex items-start gap-2 mt-3 p-3 rounded-xl text-xs"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <Info size={13} className="text-purple-400 shrink-0 mt-0.5" />
              <span className="text-purple-300">{platform.note}</span>
            </div>
          )}
          <div className="mt-3 space-y-2">
            {platform.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: "rgba(139,92,246,0.2)", color: "#A78BFA" }}>
                  {i + 1}
                </span>
                <span className="text-slate-300 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>

          {/* RSS copy row */}
          <div className="flex items-center gap-2 mt-3 p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Rss size={13} className="text-purple-400 shrink-0" />
            <code className="flex-1 text-xs text-purple-300 font-mono truncate">{rssUrl}</code>
            <button onClick={copyRss}
              className="text-xs px-2.5 py-1 rounded-lg shrink-0 transition-colors"
              style={{ background: copied ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)", color: copied ? "#6EE7B7" : "#A78BFA" }}>
              {copied ? "✓" : "העתק"}
            </button>
          </div>

          {!submitted && !platform.autoDiscover && (
            <button onClick={() => setSubmitted(true)}
              className="w-full py-2 text-xs font-semibold rounded-xl text-white transition-all hover:scale-105 mt-2"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.15))", border: "1px solid rgba(16,185,129,0.3)", color: "#6EE7B7" }}>
              ✓ סימנתי — הגשתי לפלטפורמה הזו
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DistributionPage() {
  const [copied, setCopied] = useState(false);
  const rssUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/feed`
    : "http://localhost:3000/api/feed";

  function copyRss() {
    navigator.clipboard.writeText(rssUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            <h1 className="text-2xl font-bold text-white">הפצה לפלטפורמות</h1>
            <p className="text-sm text-slate-400">הגישי פעם אחת — כל פרק חדש יופיע בכולן אוטומטית</p>
          </div>
        </div>

        {/* How it works */}
        <div className="glass rounded-2xl p-5 mb-6"
          style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.06)" }}>
          <div className="flex items-start gap-3">
            <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">איך זה עובד:</strong> כשאת מעלה פרק חדש, הוא מופיע ב-RSS Feed שלך אוטומטית.
              כל פלטפורמה שנרשמה ל-RSS שלך מושכת את הפרק ב<strong className="text-white"> 1–24 שעות</strong> ללא שום פעולה מצידך.
              את צריכה לעשות את ההגשה הבאה <strong className="text-white">פעם אחת בלבד</strong> לכל פלטפורמה.
            </div>
          </div>
        </div>

        {/* RSS URL Box */}
        <div className="glass rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Rss size={16} className="text-purple-400" />
            <span className="font-semibold text-white text-sm">ה-RSS URL שלך</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "rgba(16,185,129,0.12)", color: "#6EE7B7" }}>
              🟢 פעיל
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm text-purple-300 bg-black/30 px-4 py-2.5 rounded-xl font-mono truncate">
              {rssUrl}
            </code>
            <button onClick={copyRss}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shrink-0"
              style={copied ? {
                background: "rgba(16,185,129,0.2)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)"
              } : {
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white"
              }}>
              <Copy size={14} />
              {copied ? "הועתק!" : "העתק"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            זוהי הכתובת שתדביקי בכל פלטפורמה. שמרי אותה.
          </p>
        </div>

        {/* Platforms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">{PLATFORMS.length} פלטפורמות להגיש אליהן</h2>
            <span className="text-xs text-slate-500">לחצי על פלטפורמה לראות הוראות</span>
          </div>
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} rssUrl={rssUrl} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 p-5 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <p className="text-sm text-slate-400">
            אחרי שהגשת לכל הפלטפורמות? <strong className="text-white">גמרת.</strong><br />
            כל פרק חדש שתעלי יופיע אוטומטית בכולן תוך שעות.
          </p>
          <Link href="/dashboard/upload"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
            העלי פרק ראשון →
          </Link>
        </div>
      </div>
    </div>
  );
}
