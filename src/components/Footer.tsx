import Link from "next/link";
import { Mic2 } from "lucide-react";

const footerLinks = {
  "Podcast Services": ["Podcast Hosting", "Live Streaming", "Mobile App", "Website Builder", "RSS Feed", "Distribution"],
  "Monetization": ["Ads Marketplace", "Dynamic Ad Insertion", "Fan Club", "Apple Subscriptions", "Sponsorships"],
  "Analytics": ["Downloads Tracking", "Listener Demographics", "Episode Performance", "IAB Certification", "API Access"],
  "Resources": ["Help Center", "Academy", "Blog", "Community", "Webinars", "Developer Docs"],
  "Company": ["About Us", "Careers", "Press", "Partners", "Contact", "Status Page"],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid rgba(139,92,246,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                <Mic2 size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">PodWave</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The easiest way to host, distribute, and monetize your podcast.
            </p>
            <div className="flex gap-3">
              {["X", "YT", "IG", "in"].map((label, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{section}</div>
              <ul className="space-y-2.5">
                {links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-slate-500 text-sm">© 2024 PodWave. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((item, i) => (
              <a key={i} href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
