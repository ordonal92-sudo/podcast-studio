import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Perfect for getting started",
    features: ["5 hours storage", "1 podcast", "Basic analytics", "RSS feed", "Community support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Creator",
    price: 9,
    desc: "For serious podcasters",
    features: ["Unlimited storage", "3 podcasts", "Advanced analytics", "AI tools", "Monetization", "Priority support", "Custom website"],
    cta: "Get Creator",
    popular: true,
  },
  {
    name: "Pro",
    price: 29,
    desc: "For professional teams",
    features: ["Unlimited everything", "10 podcasts", "Team members", "White-label player", "Dynamic ads", "API access", "Dedicated support"],
    cta: "Get Pro",
    popular: false,
  },
];

export default function PricingPreview() {
  return (
    <section className="py-24" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            No hidden fees. Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i}
              className="rounded-2xl p-6 relative transition-all hover:-translate-y-1"
              style={plan.popular ? {
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))",
                border: "1px solid rgba(139,92,246,0.5)",
                boxShadow: "0 20px 60px rgba(139,92,246,0.2)",
              } : {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-lg font-bold text-white">{plan.name}</div>
                <div className="text-slate-400 text-sm">{plan.desc}</div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check size={14} className="shrink-0 text-purple-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/pricing"
                className="block text-center py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
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

        <div className="text-center mt-8">
          <Link href="/pricing" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            See full pricing details & enterprise plans →
          </Link>
        </div>
      </div>
    </section>
  );
}
