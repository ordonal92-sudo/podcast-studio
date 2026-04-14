import Link from "next/link";
import { Check, X, Zap } from "lucide-react";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    desc: "Start your podcasting journey",
    color: "#64748B",
    features: {
      storage: "5 hours",
      podcasts: "1",
      distribution: true,
      analytics: "Basic",
      monetization: false,
      aiTools: false,
      website: true,
      teamMembers: "1",
      support: "Community",
      liveStreaming: false,
      dynamicAds: false,
      customDomain: false,
      whiteLabel: false,
    },
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Creator",
    price: 9,
    yearlyPrice: 7,
    desc: "For growing podcasters",
    color: "#8B5CF6",
    features: {
      storage: "Unlimited",
      podcasts: "3",
      distribution: true,
      analytics: "Advanced",
      monetization: true,
      aiTools: true,
      website: true,
      teamMembers: "2",
      support: "Email",
      liveStreaming: true,
      dynamicAds: false,
      customDomain: true,
      whiteLabel: false,
    },
    cta: "Start Creator",
    popular: true,
  },
  {
    name: "Pro",
    price: 29,
    yearlyPrice: 23,
    desc: "For professional teams",
    color: "#EC4899",
    features: {
      storage: "Unlimited",
      podcasts: "10",
      distribution: true,
      analytics: "Premium",
      monetization: true,
      aiTools: true,
      website: true,
      teamMembers: "5",
      support: "Priority",
      liveStreaming: true,
      dynamicAds: true,
      customDomain: true,
      whiteLabel: false,
    },
    cta: "Start Pro",
    popular: false,
  },
  {
    name: "Business",
    price: 99,
    yearlyPrice: 79,
    desc: "For media companies",
    color: "#F59E0B",
    features: {
      storage: "Unlimited",
      podcasts: "Unlimited",
      distribution: true,
      analytics: "Enterprise",
      monetization: true,
      aiTools: true,
      website: true,
      teamMembers: "Unlimited",
      support: "Dedicated",
      liveStreaming: true,
      dynamicAds: true,
      customDomain: true,
      whiteLabel: true,
    },
    cta: "Start Business",
    popular: false,
  },
];

const comparisonRows = [
  { label: "Storage", key: "storage" },
  { label: "Podcasts", key: "podcasts" },
  { label: "Distribution (all platforms)", key: "distribution" },
  { label: "Analytics", key: "analytics" },
  { label: "Monetization", key: "monetization" },
  { label: "AI Tools", key: "aiTools" },
  { label: "Podcast Website", key: "website" },
  { label: "Team Members", key: "teamMembers" },
  { label: "Live Streaming", key: "liveStreaming" },
  { label: "Dynamic Ad Insertion", key: "dynamicAds" },
  { label: "Custom Domain", key: "customDomain" },
  { label: "White-label Player", key: "whiteLabel" },
  { label: "Support", key: "support" },
];

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={16} className="text-green-400 mx-auto" />;
  if (value === false) return <X size={16} className="text-slate-600 mx-auto" />;
  return <span className="text-sm text-slate-300">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <div className="pt-24" style={{ background: "var(--background)" }}>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA" }}>
            <Zap size={12} />
            Simple pricing, no surprises
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5">
            Start free, scale as<br /><span className="gradient-text">you grow</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Every plan includes distribution to all major platforms. No contracts, cancel anytime.
          </p>

          {/* Toggle placeholder */}
          <div className="inline-flex items-center gap-2 px-1 py-1 rounded-full text-sm mb-16"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="px-5 py-2 rounded-full font-medium text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>Monthly</span>
            <span className="px-5 py-2 text-slate-400">Yearly <span className="text-green-400 font-semibold">-20%</span></span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <div key={i} className="rounded-2xl p-6 relative flex flex-col transition-all hover:-translate-y-1"
                style={plan.popular ? {
                  background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(236,72,153,0.18))",
                  border: "1px solid rgba(139,92,246,0.5)",
                  boxShadow: "0 20px 60px rgba(139,92,246,0.2)",
                } : {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold px-4 py-1.5 rounded-full text-white whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <div className="w-8 h-1 rounded-full mb-4" style={{ background: plan.color }} />
                  <div className="text-xl font-bold text-white">{plan.name}</div>
                  <div className="text-sm text-slate-400">{plan.desc}</div>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-slate-400 text-sm">/mo</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <div className="text-xs text-green-400 mt-1">${plan.yearlyPrice}/mo billed yearly</div>
                  )}
                </div>
                <ul className="space-y-2 flex-1 mb-8">
                  {Object.entries(plan.features).slice(0, 6).map(([key, val]) => {
                    const row = comparisonRows.find(r => r.key === key);
                    if (!row) return null;
                    return (
                      <li key={key} className="flex items-center gap-2 text-sm">
                        {val === true ? <Check size={13} className="text-green-400 shrink-0" /> :
                          val === false ? <X size={13} className="text-slate-600 shrink-0" /> :
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: plan.color }} />}
                        <span className={val === false ? "text-slate-500" : "text-slate-300"}>
                          {val === true || val === false ? row.label : `${row.label}: ${val}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/dashboard"
                  className="block text-center py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
                  style={plan.popular ? {
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
                  } : {
                    background: "rgba(255,255,255,0.07)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="max-w-7xl mx-auto px-6 mb-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-3xl font-bold text-white text-center py-12">Full feature comparison</h2>
          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Feature</th>
                  {plans.map((p, i) => (
                    <th key={i} className="px-6 py-4 text-center">
                      <span className="text-sm font-bold" style={{ color: p.popular ? "#A78BFA" : "white" }}>{p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td className="px-6 py-3.5 text-sm text-slate-300">{row.label}</td>
                    {plans.map((plan, j) => (
                      <td key={j} className="px-6 py-3.5 text-center">
                        <FeatureValue value={plan.features[row.key as keyof typeof plan.features]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="rounded-3xl p-10 text-center"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.12))", border: "1px solid rgba(139,92,246,0.25)" }}>
            <h3 className="text-3xl font-bold text-white mb-3">Need an enterprise plan?</h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Custom pricing for large media organizations, broadcaster networks, and corporate podcast programs.
              Includes SSO, advanced permissions, SLA, and dedicated onboarding.
            </p>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", boxShadow: "0 8px 30px rgba(139,92,246,0.3)" }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
