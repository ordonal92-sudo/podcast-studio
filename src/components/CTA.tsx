import Link from "next/link";
import { Mic2 } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-8 mx-auto"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 40px rgba(139,92,246,0.5)" }}>
          <Mic2 size={28} className="text-white" />
        </div>
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
          הקול שלך ראוי<br />
          <span className="gradient-text">להישמע</span>
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          הצטרפי ל-134,000+ פודקאסטרים שבחרו ב-PodWave להשיק, לצמוח ולמנף את התוכנית שלהם.
          התחילי בחינם היום — ללא כרטיס אשראי.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-bold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 40px rgba(139,92,246,0.4)" }}>
            התחילי בחינם
          </Link>
          <Link href="/pricing"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-lg font-medium text-white transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            לתמחור
          </Link>
        </div>
        <p className="text-slate-500 text-sm mt-6">פלאן חינמי לצמיתות · שדרוגי בכל עת · ביטול מתי שתרצי</p>
      </div>
    </section>
  );
}
