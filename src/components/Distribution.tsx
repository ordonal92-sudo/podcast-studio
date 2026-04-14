export default function Distribution() {
  const platforms = [
    { name: "Spotify", color: "#1DB954", letter: "S" },
    { name: "Apple Podcasts", color: "#FA243C", letter: "A" },
    { name: "YouTube", color: "#FF0000", letter: "Y" },
    { name: "Amazon Music", color: "#00A8E1", letter: "Am" },
    { name: "Google Podcasts", color: "#4285F4", letter: "G" },
    { name: "iHeart Radio", color: "#FF2626", letter: "iH" },
    { name: "Podcast Addict", color: "#FF6B35", letter: "PA" },
    { name: "Pocket Casts", color: "#F43F3F", letter: "PC" },
    { name: "Overcast", color: "#FC7E0F", letter: "O" },
    { name: "Castbox", color: "#F0A500", letter: "C" },
    { name: "Stitcher", color: "#2193F0", letter: "St" },
    { name: "Deezer", color: "#A238FF", letter: "D" },
  ];

  return (
    <section className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#F472B6" }}>
              One submission, everywhere
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Distribute to every<br />
              <span className="gradient-text">major platform</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Submit your podcast once and we handle distribution to Spotify, Apple Podcasts, YouTube,
              Amazon Music, and 15+ more platforms. Your new episodes automatically sync everywhere.
            </p>
            <ul className="space-y-3 text-slate-300">
              {[
                "Automatic submission to all platforms",
                "New episodes sync instantly",
                "Cross-platform analytics in one dashboard",
                "Custom RSS feed with full control",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs"
                    style={{ background: "rgba(139,92,246,0.2)", color: "#A78BFA" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — platform grid */}
          <div className="grid grid-cols-4 gap-3">
            {platforms.map((p, i) => (
              <div key={i}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: p.color }}>
                  {p.letter}
                </div>
                <span className="text-xs text-slate-400 text-center leading-tight px-1">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
