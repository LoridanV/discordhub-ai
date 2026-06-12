"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Shield, BarChart3, Ticket, Bot, Lock, Activity,
  ArrowRight, Check, Zap, Globe, Users, MessageSquare
} from "lucide-react";

const FEATURE_SECTIONS = [
  {
    tag: "AI Moderation",
    icon: Shield,
    color: "#6D213C",
    bg: "rgba(109,33,60,0.06)",
    title: "Stop bad actors before they strike",
    desc: "Our AI moderation engine processes every message in real-time, detecting threats that human moderators would miss. With adjustable sensitivity thresholds, you stay in control.",
    features: [
      "Toxicity detection with 99.2% accuracy",
      "Spam & flood pattern recognition",
      "Scam and phishing URL detection",
      "Hate speech filtering across 40+ languages",
      "NSFW content flagging",
      "Automatic warn, timeout, kick, or ban",
      "Full moderation audit log",
      "AI detection confidence scores",
    ],
    screenshot: "moderation",
    reverse: false,
  },
  {
    tag: "Analytics",
    icon: BarChart3,
    color: "#0369a1",
    bg: "rgba(3,105,161,0.06)",
    title: "Understand your community deeply",
    desc: "Turn raw Discord data into actionable insights. Track member growth, engagement patterns, retention cohorts, and channel activity with beautiful interactive charts.",
    features: [
      "Daily, weekly, and monthly growth tracking",
      "Member retention cohort analysis",
      "Channel activity breakdown",
      "Voice channel usage statistics",
      "Custom date range filtering",
      "Real-time active member counter",
      "Hourly activity heatmaps",
      "CSV & PDF report exports",
    ],
    screenshot: "analytics",
    reverse: true,
  },
  {
    tag: "Ticket System",
    icon: Ticket,
    color: "#15803d",
    bg: "rgba(21,128,61,0.06)",
    title: "Support your members, beautifully",
    desc: "A complete ticket management system built for Discord communities. Categorize, prioritize, assign, and resolve support requests — all from one clean dashboard.",
    features: [
      "Customizable ticket categories",
      "Priority levels (Low → Urgent)",
      "Staff assignment and handoffs",
      "Full message thread history",
      "Auto-close inactive tickets",
      "Ticket analytics and SLA tracking",
      "Transcript export per ticket",
      "Ticket search and filtering",
    ],
    screenshot: "tickets",
    reverse: false,
  },
];

const INTEGRATIONS = [
  "Discord OAuth2", "Discord Bot API", "PostgreSQL", "Prisma ORM",
  "Next.js 15", "Vercel Edge", "Stripe Payments", "Webhook Support",
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <nav className="sticky top-0 z-40 bg-[rgba(247,243,238,0.88)] backdrop-blur-xl border-b border-[rgba(109,33,60,0.08)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-[#1A0D12]">DiscordHub AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#5C4A52]">
            <Link href="/features" className="text-[#6D213C] font-medium">Features</Link>
            <Link href="/pricing" className="hover:text-[#6D213C] transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-[#6D213C] transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
            <Link href="/auth/login" className="btn-burgundy text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-eyebrow mb-5 mx-auto w-fit"><Zap size={12} /> Full feature breakdown</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A0D12] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Everything your server<br />could ever need
          </h1>
          <p className="text-lg text-[#5C4A52] max-w-2xl mx-auto">
            DiscordHub AI packs enterprise-grade tools into a single elegant platform. Here's what's inside.
          </p>
        </motion.div>
      </section>

      {/* Feature sections */}
      {FEATURE_SECTIONS.map((section, i) => (
        <section key={section.tag} className={`py-20 ${i % 2 === 1 ? "bg-[rgba(252,250,248,0.5)]" : ""}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${section.reverse ? "lg:flex-row-reverse" : ""}`}>
              <motion.div
                initial={{ opacity: 0, x: section.reverse ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={section.reverse ? "lg:order-2" : ""}
              >
                <div className="section-eyebrow mb-4 w-fit">
                  <section.icon size={12} style={{ color: section.color }} />
                  <span style={{ color: section.color }}>{section.tag}</span>
                </div>
                <h2 className="text-3xl font-bold text-[#1A0D12] mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {section.title}
                </h2>
                <p className="text-[#5C4A52] leading-relaxed mb-8">{section.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {section.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#5C4A52]">
                      <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn-burgundy mt-8 w-fit">
                  Try it free <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: section.reverse ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`${section.reverse ? "lg:order-1" : ""}`}
              >
                {/* Feature illustration placeholder */}
                <div className="liquid-glass rounded-2xl p-8 border border-[rgba(255,255,255,0.5)] min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                         style={{ background: `linear-gradient(135deg, ${section.color}22, ${section.color}44)` }}>
                      <section.icon size={36} style={{ color: section.color }} />
                    </div>
                    <p className="text-sm font-medium text-[#5C4A52]">{section.tag} Dashboard</p>
                    <p className="text-xs text-[#9B8EA0] mt-1">Live preview in your dashboard</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Tech stack */}
      <section className="py-20 border-y border-[rgba(109,33,60,0.08)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="section-eyebrow mb-5 mx-auto w-fit"><Globe size={12} /> Built on modern infrastructure</div>
          <h2 className="text-3xl font-bold text-[#1A0D12] mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Enterprise-grade technology stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((tech) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="px-4 py-2 glass-card text-sm font-medium text-[#5C4A52] hover:text-[#6D213C] transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="liquid-glass rounded-3xl p-16">
          <h2 className="text-4xl font-bold text-[#1A0D12] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ready to level up your server?
          </h2>
          <p className="text-[#5C4A52] mb-8 max-w-md mx-auto">Start free. No credit card required. Setup takes under 2 minutes.</p>
          <Link href="/auth/login" className="btn-burgundy text-base px-10 py-4">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.6)]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9B8EA0]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#6D213C" }} />
            <span className="font-semibold text-[#1A0D12]">DiscordHub AI</span>
          </div>
          <p>Made with ❤️ by <a href="https://github.com/LoridanV" target="_blank" rel="noreferrer" className="text-[#6D213C] hover:underline">Loridan Varta</a></p>
        </div>
      </footer>
    </div>
  );
}
