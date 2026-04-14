import { Search, Play, Headphones, TrendingUp, Star } from "lucide-react";
import Footer from "@/components/Footer";

const categories = [
  { name: "All", count: 134920 },
  { name: "Technology", count: 18420 },
  { name: "Business", count: 14300 },
  { name: "Education", count: 12800 },
  { name: "Health", count: 11200 },
  { name: "Comedy", count: 9800 },
  { name: "News", count: 8700 },
  { name: "Science", count: 7600 },
  { name: "Arts", count: 6900 },
  { name: "Sports", count: 6200 },
  { name: "True Crime", count: 5400 },
  { name: "Society", count: 4800 },
];

const featured = [
  { title: "The Creator Economy", host: "Alex Rivera", category: "Business", listeners: "450K", episodes: 187, color: "#8B5CF6", desc: "Weekly insights on building an audience and monetizing your creative work." },
  { title: "Deep Science Unplugged", host: "Dr. Sarah Kim", category: "Science", listeners: "280K", episodes: 95, color: "#EC4899", desc: "Making complex science accessible and fascinating for everyone." },
  { title: "Tech Without Borders", host: "Marcus Chen", category: "Technology", listeners: "180K", episodes: 212, color: "#F59E0B", desc: "Exploring how technology shapes societies around the world." },
  { title: "The Mindful Leader", host: "Priya Sharma", category: "Health", listeners: "320K", episodes: 143, color: "#10B981", desc: "Leadership, emotional intelligence, and building a life with purpose." },
  { title: "True Crimes Untold", host: "Jamie Walsh", category: "True Crime", listeners: "520K", episodes: 78, color: "#EF4444", desc: "Investigative journalism meets storytelling — cases that changed everything." },
  { title: "Money Moves", host: "David Park", category: "Business", listeners: "390K", episodes: 165, color: "#3B82F6", desc: "Personal finance, investing, and building wealth in the modern economy." },
];

const trending = [
  { title: "AI & The Future of Work", ep: "EP 48", listeners: "52K this week", host: "Future Cast", color: "#8B5CF6" },
  { title: "Why Sleep Changes Everything", ep: "EP 112", listeners: "48K this week", host: "Health Optimized", color: "#EC4899" },
  { title: "The Longevity Code", ep: "EP 23", listeners: "41K this week", host: "Bio Hackers", color: "#F59E0B" },
  { title: "Building in Public: Year 2", ep: "EP 7", listeners: "38K this week", host: "Startup Diaries", color: "#10B981" },
  { title: "Climate Solutions Now", ep: "EP 89", listeners: "35K this week", host: "Green Future", color: "#3B82F6" },
];

export default function DiscoverPage() {
  return (
    <>
      <div className="pt-16" style={{ background: "var(--background)" }}>
        {/* Hero */}
        <div className="py-16 text-center" style={{ background: "var(--surface)" }}>
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Discover your next <span className="gradient-text">favorite podcast</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">Browse 134,000+ podcasts across every genre and topic</p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto mb-10">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search podcasts, topics, or hosts..."
                className="w-full pl-14 pr-6 py-4 rounded-2xl text-base text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  caretColor: "#8B5CF6",
                }}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat, i) => (
                <button key={i}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={i === 0 ? {
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    color: "white",
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    color: "#94A3B8",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-60">{(cat.count / 1000).toFixed(0)}K</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">Trending this week</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {trending.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-slate-600">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: item.color }}>
                    {item.host.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-slate-400 mb-1">{item.host} · {item.ep}</div>
                <div className="text-xs font-medium" style={{ color: item.color }}>{item.listeners}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Podcasts */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Featured podcasts</h2>
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">View all →</button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((pod, i) => (
              <div key={i}
                className="glass rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 group"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Podcast artwork */}
                <div className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${pod.color}40, ${pod.color}15)`, border: `1px solid ${pod.color}30` }}>
                  <span style={{ color: pod.color }}>{pod.title.slice(0, 2).toUpperCase()}</span>
                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.6)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ background: pod.color }}>
                      <Play size={20} fill="white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                      {pod.title}
                    </h3>
                    <div className="text-xs text-slate-400">{pod.host}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: pod.color + "20", color: pod.color, border: `1px solid ${pod.color}30` }}>
                    {pod.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">{pod.desc}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Headphones size={12} />
                    {pod.listeners} monthly
                  </div>
                  <span>{pod.episodes} episodes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="rounded-3xl p-10 text-center"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.12))", border: "1px solid rgba(139,92,246,0.2)" }}>
            <h3 className="text-3xl font-bold text-white mb-3">Start your own podcast today</h3>
            <p className="text-slate-400 mb-6">Join 134,000+ podcasters on PodWave — free to start, no credit card required.</p>
            <a href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 30px rgba(139,92,246,0.3)" }}>
              Create Your Podcast Free →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
