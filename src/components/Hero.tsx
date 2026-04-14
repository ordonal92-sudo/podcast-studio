"use client";

import Link from "next/link";
import { Play, Mic2 } from "lucide-react";

const floatingCards = [
  { icon: "🎙️", label: "הקלטה", value: "בתהליך", color: "#8B5CF6" },
  { icon: "📊", label: "האזנות", value: "2.4M+", color: "#EC4899" },
  { icon: "🌍", label: "פלטפורמות", value: "20+", color: "#F59E0B" },
];

export default function Hero() {
  return (
    <section className="hero-bg relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #EC4899, transparent)", filter: "blur(60px)" }} />
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-5" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C180,20 360,100 540,60 C720,20 900,100 1080,60 C1260,20 1440,80 1440,60 L1440,120 L0,120 Z"
            fill="url(#grad1)" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left content */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            עכשיו עם כלי AI מתקדמים
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-white">הפודקאסט שלך</span>
            <br />
            <span className="gradient-text">אירוח &</span>
            <br />
            <span className="text-white">פלטפורמת צמיחה</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
            PodWave היא הדרך הקלה ביותר ליצור, לאארח, להפיץ ולמנף את הפודקאסט שלך.
            הגיעי למיליוני מאזינים בכל פלטפורמה מרכזית — הכל ממקום אחד.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)", boxShadow: "0 8px 30px rgba(139,92,246,0.4)" }}>
              <Mic2 size={18} />
              התחילי בחינם
            </Link>
            <Link href="/discover"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <Play size={18} />
              עייני בפודקאסטים
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span>✓ ללא כרטיס אשראי</span>
            <span>✓ פלאן חינמי זמין</span>
            <span>✓ ביטול בכל עת</span>
          </div>
        </div>

        {/* Right content — visual */}
        <div className="relative hidden lg:block">
          {/* Main card - mock player */}
          <div className="relative glass rounded-3xl p-6 glow-purple">
            {/* Waveform visual */}
            <div className="flex items-end gap-1 h-24 mb-6">
              {Array.from({ length: 48 }).map((_, i) => {
                const heights = [20, 35, 55, 70, 85, 65, 45, 30, 60, 80, 90, 70, 50, 40, 65, 85, 75, 55, 45, 30, 70, 90, 85, 60, 40, 30, 55, 75, 65, 45, 35, 60, 80, 70, 50, 40, 30, 55, 75, 85, 65, 45, 35, 25, 45, 65, 55, 40];
                const h = heights[i] || 30;
                const isActive = i < 28;
                return (
                  <div key={i} className="flex-1 rounded-full transition-all"
                    style={{
                      height: `${h}%`,
                      background: isActive
                        ? `linear-gradient(180deg, #8B5CF6, #EC4899)`
                        : "rgba(255,255,255,0.1)",
                      minWidth: "3px",
                    }} />
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-white text-sm">פרק 42: בניית קהל מאזינים</div>
                <div className="text-xs text-slate-400 mt-0.5">פודקאסט מסע היוצר</div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                style={{ background: "rgba(139,92,246,0.2)", color: "#A78BFA" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                שידור חי
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full w-[58%]"
                style={{ background: "linear-gradient(90deg, #8B5CF6, #EC4899)" }} />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>24:16</span>
              <span>41:30</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-5">
              <button className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 4px 20px rgba(139,92,246,0.5)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6l5-3.5v7L8.5 12zM16 6h2v12h-2z"/></svg>
              </button>
            </div>
          </div>

          {/* Floating stat cards */}
          {floatingCards.map((card, i) => (
            <div key={i}
              className="absolute glass rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                top: i === 0 ? "-5%" : i === 1 ? "45%" : undefined,
                bottom: i === 2 ? "-8%" : undefined,
                right: i === 0 ? "-5%" : undefined,
                left: i === 1 ? "-12%" : i === 2 ? "5%" : undefined,
                boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
              }}>
              <span className="text-xl">{card.icon}</span>
              <div>
                <div className="text-xs text-slate-400">{card.label}</div>
                <div className="text-sm font-bold" style={{ color: card.color }}>{card.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0"
        style={{ borderTop: "1px solid rgba(139,92,246,0.1)", background: "rgba(15,15,46,0.5)" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "134K+", label: "פודקאסטים פעילים" },
            { value: "15.9M+", label: "פרקים שפורסמו" },
            { value: "15.4B+", label: "סך כל ההאזנות" },
            { value: "20+", label: "פלטפורמות מחוברות" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
