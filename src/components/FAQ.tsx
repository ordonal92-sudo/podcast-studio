"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I get started with PodWave?",
    a: "Sign up for free — no credit card required. Create your podcast, upload your first episode, and we'll handle distribution to all major platforms within 24 hours.",
  },
  {
    q: "Can I migrate my existing podcast from another platform?",
    a: "Yes! PodWave makes migration simple. Import your existing RSS feed and all your episodes transfer automatically — including your subscriber base and listening history.",
  },
  {
    q: "How does distribution to Spotify and Apple Podcasts work?",
    a: "Submit once through PodWave and we automatically distribute to all platforms. New episodes sync instantly across every platform — no manual submissions ever again.",
  },
  {
    q: "When can I start monetizing my podcast?",
    a: "You can enable monetization from day one — even with a small audience. Fan clubs, subscriptions, and the ads marketplace are all available on paid plans.",
  },
  {
    q: "What AI features are available?",
    a: "PodWave AI offers audio cleanup (noise reduction, silence removal, volume leveling), automatic transcripts, chapter markers, show notes generation, episode title suggestions, and even text-to-podcast conversion.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — our free plan includes 5 hours of storage, one podcast, basic analytics, and RSS feed support. You can upgrade anytime as your podcast grows.",
  },
  {
    q: "Do you offer enterprise solutions?",
    a: "Absolutely. We work with organizations like JP Morgan, IBM, and major universities. Enterprise plans include custom branding, advanced permissions, SSO, dedicated support, and SLA guarantees.",
  },
  {
    q: "What analytics are available?",
    a: "PodWave provides IAB-certified analytics including download counts, listener demographics, geographic data, device/app breakdown, episode performance trends, and retention curves.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24" style={{ background: "var(--surface)" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-slate-400">Can&apos;t find an answer? <a href="#" className="text-purple-400 hover:text-purple-300">Contact our support team</a></p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all cursor-pointer"
              style={{
                background: open === i ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
                border: open === i ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={() => setOpen(open === i ? null : i)}>
              <button className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                <ChevronDown size={16} className="shrink-0 text-slate-400 transition-transform"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
