"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Mic2, ChevronDown, Menu, X, Radio, DollarSign, BarChart3, Brain, Globe, Headphones, BookOpen, HelpCircle, Newspaper, Users } from "lucide-react";

const podcastingItems = [
  { icon: <Mic2 size={16} />, label: "אירוח פודקאסט", desc: "אירוח מהיר ואמין לכל גודל" },
  { icon: <Radio size={16} />, label: "שידור חי", desc: "שדרי חי לקהל שלך" },
  { icon: <Globe size={16} />, label: "הפצה", desc: "הגיעי ל-Spotify, Apple ועוד" },
  { icon: <BarChart3 size={16} />, label: "אנליטיקה", desc: "נתונים וסטטיסטיקות מאושרות IAB" },
  { icon: <Brain size={16} />, label: "כלי AI", desc: "תמלולים, פרקים, אופטימיזציה" },
  { icon: <DollarSign size={16} />, label: "מונטיזציה", desc: "פרסומות, מנויים, קהילות מעריצים" },
];

const discoverCategories = [
  "אמנות ותרבות", "עסקים", "קומדיה", "חינוך", "בריאות ורווחה",
  "חדשות", "מדע", "חברה", "ספורט", "טכנולוגיה", "פשע אמיתי",
];

const resourceItems = [
  { icon: <BookOpen size={16} />, label: "אקדמיה", desc: "למדי פודקאסטינג מהאפס" },
  { icon: <Newspaper size={16} />, label: "בלוג", desc: "טיפים, חדשות ועדכונים" },
  { icon: <HelpCircle size={16} />, label: "מרכז עזרה", desc: "מדריכים ומאמרי תמיכה" },
  { icon: <Users size={16} />, label: "קהילה", desc: "הצטרפי לקבוצות יוצרים" },
];

function DropdownMenu({ items }: { items: typeof podcastingItems }) {
  return (
    <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl overflow-hidden z-50"
      style={{ background: "rgba(15,15,46,0.98)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div className="p-2">
        {items.map((item, i) => (
          <Link key={i} href="#" className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group">
            <span className="mt-0.5 text-purple-400 group-hover:text-purple-300">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-slate-400">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DiscoverDropdown() {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
      style={{ background: "rgba(15,15,46,0.98)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div className="p-4">
        <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">עיון לפי קטגוריה</div>
        <div className="grid grid-cols-2 gap-1">
          {discoverCategories.map((cat, i) => (
            <Link key={i} href="/discover"
              className="text-sm text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
              {cat}
            </Link>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <Link href="/discover" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Headphones size={14} /> כל הפודקאסטים ←
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(name);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(null), 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(7,7,26,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(139,92,246,0.15)" : "none" }}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
            <Mic2 size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">PodWave</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { name: "podcasting", label: "פודקאסטינג" },
            { name: "discover", label: "גלייה" },
            { name: "resources", label: "משאבים" },
          ].map(({ name, label }) => (
            <div key={name} className="relative"
              onMouseEnter={() => handleEnter(name)}
              onMouseLeave={handleLeave}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                {label}
                <ChevronDown size={14} className={`transition-transform ${open === name ? "rotate-180" : ""}`} />
              </button>
              {open === name && name === "podcasting" && <DropdownMenu items={podcastingItems} />}
              {open === name && name === "discover" && <DiscoverDropdown />}
              {open === name && name === "resources" && <DropdownMenu items={resourceItems} />}
            </div>
          ))}
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            תמחור
          </Link>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            ארגונים
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
            כניסה
          </Link>
          <Link href="/dashboard"
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 text-white"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
            התחילי בחינם
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-slate-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t"
          style={{ background: "rgba(7,7,26,0.98)", borderColor: "rgba(139,92,246,0.15)" }}>
          <div className="px-6 py-4 flex flex-col gap-2">
            {["פודקאסטינג", "גלייה", "משאבים", "תמחור", "ארגונים"].map((item, idx) => {
              const hrefs = ["/", "/discover", "/", "/pricing", "/dashboard"];
              return (
                <Link key={item} href={hrefs[idx]}
                  className="py-2 text-slate-300 hover:text-white font-medium border-b border-white/5"
                  onClick={() => setMobileOpen(false)}>
                  {item}
                </Link>
              );
            })}
            <div className="flex gap-3 pt-3">
              <Link href="/dashboard" className="flex-1 text-center py-2 text-sm font-medium text-slate-300 border border-white/20 rounded-full">כניסה</Link>
              <Link href="/dashboard" className="flex-1 text-center py-2 text-sm font-semibold text-white rounded-full"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>התחילי בחינם</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
