"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Book, Code, Shield, BarChart3, Ticket, Settings, Search, ChevronRight, Terminal, Copy, Check } from "lucide-react";

const SECTIONS = [
  {
    id: "getting-started",
    icon: Book,
    label: "Getting Started",
    articles: [
      { id: "introduction", title: "Introduction to DiscordHub AI" },
      { id: "quickstart", title: "Quick Start Guide" },
      { id: "adding-bot", title: "Adding the Bot to Your Server" },
      { id: "first-setup", title: "First-Time Setup" },
    ],
  },
  {
    id: "moderation",
    icon: Shield,
    label: "AI Moderation",
    articles: [
      { id: "how-it-works", title: "How AI Moderation Works" },
      { id: "thresholds", title: "Configuring Thresholds" },
      { id: "auto-actions", title: "Automatic Actions" },
      { id: "modlog", title: "Reading the Moderation Log" },
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    articles: [
      { id: "overview", title: "Analytics Overview" },
      { id: "member-growth", title: "Member Growth Metrics" },
      { id: "retention", title: "Retention Analysis" },
      { id: "exports", title: "Exporting Reports" },
    ],
  },
  {
    id: "tickets",
    icon: Ticket,
    label: "Ticket System",
    articles: [
      { id: "setup", title: "Setting Up Tickets" },
      { id: "categories", title: "Managing Categories" },
      { id: "staff-roles", title: "Assigning Staff Roles" },
      { id: "auto-close", title: "Auto-close Configuration" },
    ],
  },
  {
    id: "api",
    icon: Code,
    label: "API Reference",
    articles: [
      { id: "authentication", title: "Authentication" },
      { id: "servers", title: "Servers API" },
      { id: "tickets-api", title: "Tickets API" },
      { id: "analytics-api", title: "Analytics API" },
    ],
  },
];

const CODE_SAMPLE = `// Fetch your servers
const response = await fetch('/api/servers', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  }
});

const { servers } = await response.json();
console.log(servers);
// [{ id, name, memberCount, plan }, ...]`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-xl overflow-hidden border border-[rgba(109,33,60,0.12)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A0D12]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#F87171]" />
          <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
          <div className="w-3 h-3 rounded-full bg-[#34D399]" />
        </div>
        <button onClick={copy} className="text-[#9B8EA0] hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 bg-[#0F0609] text-[#E8DDD0] text-xs font-mono overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeArticle, setActiveArticle] = useState("introduction");
  const [search, setSearch] = useState("");

  const currentSection = SECTIONS.find((s) => s.id === activeSection);

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
            <Link href="/features" className="hover:text-[#6D213C] transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-[#6D213C] transition-colors">Pricing</Link>
            <Link href="/docs" className="text-[#6D213C] font-medium">Docs</Link>
          </div>
          <Link href="/auth/login" className="btn-burgundy text-sm py-2 px-4">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
          {/* Docs sidebar */}
          <aside className="space-y-1">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8EA0]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search docs…" className="input-field pl-9 py-2 text-xs" />
            </div>

            {SECTIONS.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => { setActiveSection(section.id); setActiveArticle(section.articles[0].id); }}
                  className={`sidebar-item w-full ${activeSection === section.id ? "active" : ""}`}
                >
                  <section.icon size={15} />
                  <span>{section.label}</span>
                  <ChevronRight size={12} className={`ml-auto transition-transform ${activeSection === section.id ? "rotate-90" : ""}`} />
                </button>
                {activeSection === section.id && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[rgba(109,33,60,0.1)] pl-3">
                    {section.articles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => setActiveArticle(article.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          activeArticle === article.id
                            ? "text-[#6D213C] font-semibold bg-burgundy-50"
                            : "text-[#5C4A52] hover:text-[#1A0D12] hover:bg-cream-200/60"
                        }`}
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </aside>

          {/* Doc content */}
          <main className="min-w-0">
            <motion.div key={`${activeSection}-${activeArticle}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-[#9B8EA0] mb-6">
                <span>{currentSection?.label}</span>
                <ChevronRight size={12} />
                <span className="text-[#5C4A52]">{currentSection?.articles.find(a => a.id === activeArticle)?.title}</span>
              </div>

              {/* Introduction article */}
              {activeSection === "getting-started" && activeArticle === "introduction" && (
                <div className="prose-custom space-y-6">
                  <div>
                    <div className="section-eyebrow mb-3 w-fit"><Book size={11} /> Documentation</div>
                    <h1 className="text-3xl font-bold text-[#1A0D12] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Introduction to DiscordHub AI</h1>
                    <p className="text-[#5C4A52] text-base leading-relaxed">DiscordHub AI is an all-in-one platform for managing Discord servers. It provides AI-powered moderation, detailed analytics, a full ticket management system, and smart insights — all from a beautiful web dashboard.</p>
                  </div>

                  <div className="glass-card p-6">
                    <h2 className="font-semibold text-[#1A0D12] mb-4">Core capabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { icon: Shield, label: "AI Moderation", desc: "Real-time content filtering with configurable thresholds" },
                        { icon: BarChart3, label: "Analytics", desc: "Deep insights into member behavior and server health" },
                        { icon: Ticket, label: "Ticket System", desc: "Full support workflow from submission to resolution" },
                        { icon: Settings, label: "Smart Settings", desc: "Fine-grained control over every feature" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-cream-100/60">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(109,33,60,0.08)] flex items-center justify-center shrink-0">
                            <item.icon size={14} style={{ color: "#6D213C" }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1A0D12]">{item.label}</p>
                            <p className="text-xs text-[#9B8EA0]">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h2 className="font-semibold text-[#1A0D12] mb-4">Quick start</h2>
                    <ol className="space-y-3">
                      {[
                        "Sign in with Discord OAuth — click 'Get Started' above.",
                        "Add DiscordHub AI bot to your server via the OAuth link.",
                        "Visit your Dashboard and select your server.",
                        "Configure AI moderation thresholds in Settings.",
                        "Monitor your server's health from the Overview page.",
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#5C4A52]">
                          <span className="w-6 h-6 rounded-full bg-[#6D213C] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* API Reference */}
              {activeSection === "api" && activeArticle === "authentication" && (
                <div className="space-y-6">
                  <div>
                    <div className="section-eyebrow mb-3 w-fit"><Code size={11} /> API Reference</div>
                    <h1 className="text-3xl font-bold text-[#1A0D12] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Authentication</h1>
                    <p className="text-[#5C4A52] leading-relaxed">DiscordHub AI uses Discord OAuth2 for authentication. All API routes are protected and require a valid session cookie or Bearer token.</p>
                  </div>

                  <div className="glass-card p-6">
                    <h2 className="font-semibold text-[#1A0D12] mb-3">Example request</h2>
                    <CodeBlock code={CODE_SAMPLE} />
                  </div>

                  <div className="glass-card p-6">
                    <h2 className="font-semibold text-[#1A0D12] mb-4">API Endpoints</h2>
                    <div className="space-y-2">
                      {[
                        { method: "GET", path: "/api/servers", desc: "List all managed servers" },
                        { method: "GET", path: "/api/analytics", desc: "Fetch analytics data" },
                        { method: "GET", path: "/api/tickets", desc: "List tickets with filtering" },
                        { method: "POST", path: "/api/tickets", desc: "Create a new ticket" },
                        { method: "GET", path: "/api/moderation", desc: "Fetch moderation logs" },
                      ].map((ep) => (
                        <div key={ep.path} className="flex items-center gap-3 p-3 rounded-xl bg-cream-100/60">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {ep.method}
                          </span>
                          <code className="text-xs font-mono text-[#6D213C] flex-1">{ep.path}</code>
                          <span className="text-xs text-[#9B8EA0]">{ep.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Generic content for other articles */}
              {!(activeSection === "getting-started" && activeArticle === "introduction") &&
               !(activeSection === "api" && activeArticle === "authentication") && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1A0D12] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {currentSection?.articles.find(a => a.id === activeArticle)?.title}
                    </h1>
                    <p className="text-[#5C4A52] leading-relaxed">
                      This article covers everything you need to know about {currentSection?.articles.find(a => a.id === activeArticle)?.title?.toLowerCase()}. Full documentation is available once you connect your server.
                    </p>
                  </div>
                  <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(109,33,60,0.08)] flex items-center justify-center">
                      <Book size={20} style={{ color: "#6D213C" }} />
                    </div>
                    <div>
                      <p className="font-medium text-[#1A0D12] text-sm">Full documentation coming soon</p>
                      <p className="text-xs text-[#9B8EA0] mt-0.5">Connect your server to see live examples and guided configuration.</p>
                    </div>
                    <Link href="/auth/login" className="btn-burgundy text-xs py-2 px-4 ml-auto shrink-0">Get Started</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
