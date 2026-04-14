const testimonials = [
  {
    quote: "PodWave completely transformed my podcast workflow. The AI tools alone save me 3 hours per episode, and the analytics help me understand exactly what my audience wants.",
    name: "Sarah Mitchell",
    role: "Host, The Mindful Business Show",
    avatar: "SM",
    color: "#8B5CF6",
    downloads: "250K monthly downloads",
  },
  {
    quote: "I switched from another platform and the difference is night and day. Distribution took 10 minutes, monetization was live within a week, and my listener count grew 40%.",
    name: "Marcus Chen",
    role: "Creator, Tech Without Borders",
    avatar: "MC",
    color: "#EC4899",
    downloads: "180K monthly downloads",
  },
  {
    quote: "As an enterprise client, reliability is everything. PodWave's uptime, support, and advanced analytics have made it the only platform we trust for our 60+ internal channels.",
    name: "Jennifer Walsh",
    role: "Head of Media, DataCorp Inc.",
    avatar: "JW",
    color: "#F59E0B",
    downloads: "500K+ total plays",
  },
  {
    quote: "The fan club feature is incredible — I went from $0 to $3,000/month in listener revenue in under 3 months. My audience loves the exclusive content format.",
    name: "Dr. Ahmed Karimi",
    role: "Host, Science Unplugged",
    avatar: "AK",
    color: "#10B981",
    downloads: "90K monthly downloads",
  },
];

const enterprises = ["JP Morgan", "IBM", "University of Michigan", "Aflac", "Paychex", "Hoover"];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#6EE7B7" }}>
            Trusted by creators worldwide
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by <span className="gradient-text">134,000+</span> podcasters
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From solo creators to enterprise media teams — here&apos;s what they&apos;re saying.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 transition-all hover:-translate-y-1">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
                <div className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: t.color + "15", color: t.color }}>
                  {t.downloads}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise logos */}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-wider font-medium">Trusted by enterprise teams at</p>
          <div className="flex flex-wrap justify-center gap-6">
            {enterprises.map((name, i) => (
              <div key={i} className="px-6 py-3 rounded-xl text-slate-400 font-semibold text-sm transition-colors hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
