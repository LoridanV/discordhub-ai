"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Shield, BarChart3, Ticket, ArrowRight,
  Zap, Star, Bot, Activity, Lock, Users
} from "lucide-react";

const features = [
  { icon: Shield, title: "AI Moderation", desc: "Detect toxicity, spam, scams & hate speech automatically with 99.2% accuracy.", color: "#6D213C", bg: "rgba(109,33,60,0.06)" },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time insights on member growth, engagement, retention & activity.", color: "#0369a1", bg: "rgba(3,105,161,0.06)" },
  { icon: Ticket, title: "Smart Ticketing", desc: "Full support ticket lifecycle with categories, priorities & transcripts.", color: "#15803d", bg: "rgba(21,128,61,0.06)" },
  { icon: Bot, title: "AI Insights", desc: "Weekly AI-generated summaries and recommendations for your server.", color: "#7c3aed", bg: "rgba(124,58,237,0.06)" },
  { icon: Activity, title: "Real-time Dashboard", desc: "Monitor your server live with animated counters and up-to-the-minute stats.", color: "#b45309", bg: "rgba(180,83,9,0.06)" },
  { icon: Lock, title: "Role-based Access", desc: "Fine-grained permissions — only admins manage the servers they own.", color: "#be185d", bg: "rgba(190,24,93,0.06)" },
];

const stats = [
  { value: "50K+", label: "Discord Servers" },
  { value: "12M+", label: "Members Protected" },
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "< 200ms", label: "Response Time" },
];

const testimonials = [
  { name: "Alex Chen", role: "Community Manager", server: "Gaming Legends — 48K members", avatar: "AC", text: "DiscordHub AI cut our moderation workload by 80%. The AI catches things we'd never notice manually.", rating: 5 },
  { name: "Sarah Mitchell", role: "Server Owner", server: "Dev Community — 22K members", avatar: "SM", text: "The analytics are incredible. I finally understand how my community actually grows.", rating: 5 },
  { name: "Marcus Rivera", role: "Head Moderator", server: "Art Hub — 31K members", avatar: "MR", text: "The ticket system replaced three separate bots. Everything in one place, beautifully designed.", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <nav className="sticky top-0 z-40 bg-[rgba(247,243,238,0.88)] backdrop-blur-xl border-b border-[rgba(109,33,60,0.08)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-[#1A0D12] tracking-tight">DiscordHub AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#5C4A52]">
            <Link href="/features" className="hover:text-[#6D213C] transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-[#6D213C] transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-[#6D213C] transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
            <Link href="/auth/login" className="btn-burgundy text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="section-eyebrow mb-6 mx-auto w-fit"><Sparkles size={12} /> AI-Powered Discord Management</div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1A0D12] leading-[1.08] tracking-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your Discord server,<br /><span style={{ color: "#6D213C" }}>intelligently managed.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#5C4A52] max-w-2xl mx-auto leading-relaxed mb-10">
            DiscordHub AI brings enterprise-grade moderation, analytics, and support tooling to every server — powered by AI that actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/login" className="btn-burgundy text-base px-8 py-4">Add to Discord <ArrowRight size={16} /></Link>
            <Link href="/features" className="btn-ghost text-base px-8 py-4">See all features</Link>
          </div>
          <p className="text-xs text-[#9B8EA0] mt-4">Free forever · No credit card required · Setup in 2 minutes</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-16">
          <div className="liquid-glass rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.5)] shadow-[0_32px_80px_rgba(109,33,60,0.15)]">
            <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(252,250,248,0.9)] border-b border-[rgba(109,33,60,0.06)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F87171]" />
                <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
                <div className="w-3 h-3 rounded-full bg-[#34D399]" />
              </div>
              <div className="flex-1 bg-cream-200 rounded-md px-3 py-1 text-xs text-[#9B8EA0] max-w-xs mx-auto text-center">app.discordhub.ai/dashboard</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 bg-[rgba(247,243,238,0.6)]">
              {[
                { label: "Total Members", value: "12,847", change: "+8.4%", up: true },
                { label: "Active Today", value: "3,291", change: "+12.1%", up: true },
                { label: "AI Actions", value: "128", change: "-15.6%", up: false },
                { label: "Open Tickets", value: "47", change: "+22.3%", up: true },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4">
                  <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-xl font-bold text-[#1A0D12]">{s.value}</p>
                  <p className={`text-xs mt-1 font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>{s.change}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 bg-[rgba(247,243,238,0.6)]">
              <div className="glass-card p-4">
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 13 ? "#6D213C" : "rgba(109,33,60,0.2)" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.6)]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <p className="text-3xl font-bold text-[#1A0D12]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</p>
              <p className="text-sm text-[#9B8EA0] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="section-eyebrow mb-4 mx-auto w-fit"><Zap size={12} /> Everything you need</div>
          <h2 className="text-4xl font-bold text-[#1A0D12] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Built for serious communities</h2>
          <p className="text-[#5C4A52] mt-3 max-w-xl mx-auto">One platform. Every tool your Discord server needs to thrive at scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card p-6 group hover:shadow-[0_8px_32px_rgba(109,33,60,0.1)] transition-all duration-200">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200" style={{ background: f.bg }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-[#1A0D12] mb-2">{f.title}</h3>
              <p className="text-sm text-[#5C4A52] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[rgba(252,250,248,0.6)] border-y border-[rgba(109,33,60,0.08)] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-eyebrow mb-4 mx-auto w-fit"><Star size={12} /> Loved by communities</div>
            <h2 className="text-4xl font-bold text-[#1A0D12] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Trusted by top servers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-[#5C4A52] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A0D12]">{t.name}</p>
                    <p className="text-xs text-[#9B8EA0]">{t.role} · {t.server}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="liquid-glass rounded-3xl p-16 border border-[rgba(255,255,255,0.5)]">
          <div className="section-eyebrow mb-6 mx-auto w-fit"><Sparkles size={12} /> Start for free</div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A0D12] mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ready to transform<br />your server?
          </h2>
          <p className="text-[#5C4A52] mb-10 max-w-md mx-auto">Join 50,000+ servers already using DiscordHub AI. Free plan available forever.</p>
          <Link href="/auth/login" className="btn-burgundy text-base px-10 py-4">Get Started Free <ArrowRight size={16} /></Link>
        </motion.div>
      </section>

      <footer className="border-t border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.6)]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9B8EA0]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#6D213C" }} />
            <span className="font-semibold text-[#1A0D12]">DiscordHub AI</span>
          </div>
          <div className="flex gap-6">
            <Link href="/features" className="hover:text-[#6D213C] transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-[#6D213C] transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-[#6D213C] transition-colors">Docs</Link>
          </div>
          <p>Made with ❤️ by <a href="https://github.com/LoridanV" target="_blank" rel="noreferrer" className="text-[#6D213C] hover:underline">Loridan Varta</a></p>
        </div>
      </footer>
    </div>
  );
}
