"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic2, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "כניסה נכשלה");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("שגיאת חיבור");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.2) 0%, transparent 70%), var(--background)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 30px rgba(139,92,246,0.4)" }}>
            <Mic2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PodWave Studio</h1>
          <p className="text-slate-400 text-sm mt-1">כניסה לניהול הפודקאסט שלך</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Lock size={13} className="inline mr-1.5 text-purple-400" />
                סיסמה
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הכניסי את סיסמת המנהל"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    caretColor: "#8B5CF6",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 px-3 py-2 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || (mounted && !password)}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
              {loading ? "נכנסת..." : "כניסה"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          PodWave Studio · גרסת הפקה
        </p>
      </div>
    </div>
  );
}
