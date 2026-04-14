import { Mic2, Globe, DollarSign, BarChart3, Brain, Smartphone, Radio, Shield } from "lucide-react";

const features = [
  {
    icon: <Mic2 size={24} />,
    title: "פרסום בלחיצה אחת",
    desc: "הקליטי, ערכי ופרסמי פרקים תוך דקות. הפלטפורמה שלנו מטפלת בצד הטכני כדי שתוכלי להתרכז בתוכן.",
    color: "#8B5CF6",
  },
  {
    icon: <Globe size={24} />,
    title: "הפצה גלובלית",
    desc: "פרסמי אוטומטית ל-Spotify, Apple Podcasts, YouTube, Amazon Music ועוד 15+ פלטפורמות בו-זמנית.",
    color: "#EC4899",
  },
  {
    icon: <DollarSign size={24} />,
    title: "זרמי הכנסה מרובים",
    desc: "מנפי דרך שוק הפרסומות, מנויי מאזינים, קהילות מעריצים והכנסת פרסומות דינמית.",
    color: "#F59E0B",
  },
  {
    icon: <Brain size={24} />,
    title: "כלי AI מתקדמים",
    desc: "יצירה אוטומטית של תמלולים, סימוני פרקים, הערות תוכנית וכותרות פרקים. תני ל-AI לטפל בעבודה.",
    color: "#10B981",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "אנליטיקה מאושרת IAB",
    desc: "תובנות מעמיקות על התנהגות מאזינים, דמוגרפיה, שימוש במכשירים והפצה גיאוגרפית.",
    color: "#3B82F6",
  },
  {
    icon: <Radio size={24} />,
    title: "שידור חי",
    desc: "שדרי חי עם אינטראקציה בזמן אמת, תכונות שיחה, מתנות וירטואליות והקלטה חיה.",
    color: "#EF4444",
  },
  {
    icon: <Smartphone size={24} />,
    title: "אפליקציה לנייד",
    desc: "הקליטי ונהלי את הפודקאסט שלך ישירות מהטלפון — iOS ו-Android נתמכים.",
    color: "#8B5CF6",
  },
  {
    icon: <Shield size={24} />,
    title: "רמת ארגון",
    desc: "99.9% זמינות מובטחת, CDN, הרשאות מתקדמות ותמיכה ייעודית לארגונים גדולים.",
    color: "#EC4899",
  },
];

export default function Features() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA" }}>
            כל מה שצריך
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            ערכת הכלים המלאה<br />
            <span className="gradient-text">לפודקאסט שלך</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            מהפרק הראשון ועד אימפריית מדיה מלאה — PodWave גדלה איתך בכל שלב של הדרך.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i}
              className="group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-white/5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.color + "20", color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
