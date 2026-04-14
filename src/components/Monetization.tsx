import { DollarSign, Users, Zap, ShoppingBag } from "lucide-react";

const streams = [
  {
    icon: <Zap size={20} />,
    title: "Ads Marketplace",
    desc: "Connect with premium advertisers. Let PodWave match your content with relevant brands automatically.",
    badge: "Most popular",
    badgeColor: "#8B5CF6",
    stat: "$25 CPM avg",
  },
  {
    icon: <Zap size={20} />,
    title: "Dynamic Ad Insertion",
    desc: "Inject ads into any episode at any time — even old episodes. Maximize revenue from your entire back catalog.",
    stat: "3x more revenue",
  },
  {
    icon: <Users size={20} />,
    title: "Fan Club Subscriptions",
    desc: "Create a paid membership community. Offer bonus episodes, early access, and exclusive content to loyal fans.",
    badge: "New",
    badgeColor: "#10B981",
    stat: "$5-25/mo per fan",
  },
  {
    icon: <ShoppingBag size={20} />,
    title: "Apple Podcasts Subscriptions",
    desc: "Sell premium content directly through Apple Podcasts. Reach Apple's massive subscriber base effortlessly.",
    stat: "1B+ Apple users",
  },
];

export default function Monetization() {
  return (
    <section className="py-24 relative" style={{ background: "var(--surface)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FCD34D" }}>
            <DollarSign size={12} className="inline mr-1" />
            Earn from your passion
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Turn listeners into<br />
            <span style={{ background: "linear-gradient(135deg, #F59E0B, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              revenue
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Multiple monetization paths so you can build sustainable income from your podcast — no matter your audience size.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {streams.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                  {s.icon}
                </div>
                {s.badge && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: s.badgeColor + "20", color: s.badgeColor, border: `1px solid ${s.badgeColor}40` }}>
                    {s.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="inline-block px-3 py-1 rounded-lg text-sm font-semibold"
                style={{ background: "rgba(245,158,11,0.1)", color: "#FCD34D" }}>
                {s.stat}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Start earning from day one — no minimum audience required</p>
          <button className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #F59E0B, #EC4899)", boxShadow: "0 8px 30px rgba(245,158,11,0.3)" }}>
            Start Monetizing →
          </button>
        </div>
      </div>
    </section>
  );
}
