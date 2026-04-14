import { Brain, FileText, Volume2, Sparkles, MessageSquare, List } from "lucide-react";

const aiFeatures = [
  {
    icon: <Volume2 size={18} />,
    title: "Audio Optimization",
    desc: "AI removes background noise, levels volume, cuts silences, and enhances voice clarity — automatically.",
    tags: ["Noise removal", "Volume leveling", "Silence cut"],
  },
  {
    icon: <FileText size={18} />,
    title: "Content Assistant",
    desc: "Generate episode titles, show notes, chapter markers, and SEO-friendly descriptions from your audio.",
    tags: ["Auto-transcripts", "Chapter markers", "Show notes"],
  },
  {
    icon: <Sparkles size={18} />,
    title: "AI Podcast Creator",
    desc: "Turn a blog post, article, or text into a full podcast episode with AI-generated voices in minutes.",
    tags: ["Text to speech", "Multi-voice", "Instant episodes"],
  },
];

export default function AISection() {
  return (
    <section className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Right side — feature cards (shown first on mobile) */}
          <div className="order-2 lg:order-1 space-y-4">
            {aiFeatures.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #8B5CF620, #EC489920)", color: "#A78BFA" }}>
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{f.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {f.tags.map((tag, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(139,92,246,0.12)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.2)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mini transcript preview */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-purple-400" />
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Live Transcript</span>
              </div>
              {[
                { time: "00:02", text: "Welcome back to another episode of The Creator..." },
                { time: "00:08", text: "Today we're diving deep into audience growth strategies..." },
                { time: "00:15", text: "My guest today built their podcast from zero to..." },
              ].map((line, i) => (
                <div key={i} className="flex gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-500 font-mono shrink-0 pt-0.5">{line.time}</span>
                  <span className="text-xs text-slate-300">{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Left side — text */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA" }}>
              <Brain size={14} />
              Powered by AI
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI does the<br />
              <span className="gradient-text">heavy lifting</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              PodWave AI works in the background to enhance your audio, generate content,
              and save you hours every single episode. Podcast smarter, not harder.
            </p>
            <div className="space-y-4 text-slate-300">
              {[
                { label: "Time saved per episode", value: "2-4 hours" },
                { label: "Transcript accuracy", value: "99.2%" },
                { label: "Languages supported", value: "50+" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <span className="font-bold gradient-text">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
