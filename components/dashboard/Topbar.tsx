"use client";
import { Bell, Search, Sparkles, Command } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardTopbar({ title, subtitle, actions }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.8)] backdrop-blur-sm px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-[#1A0D12] truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[#9B8EA0] truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-cream-200/60 border border-[rgba(109,33,60,0.1)] text-[#9B8EA0] text-xs hover:border-[rgba(109,33,60,0.2)] transition-all w-52"
        >
          <Search size={13} />
          <span className="flex-1 text-left">Search anything…</span>
          <kbd className="flex items-center gap-0.5 text-[10px] bg-cream-300/60 px-1.5 py-0.5 rounded">
            <Command size={9} />K
          </kbd>
        </button>

        {/* AI assistant button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-burgundy-600/8 border border-burgundy-600/15 text-burgundy-600 text-xs font-medium hover:bg-burgundy-600/12 transition-all">
          <Sparkles size={13} />
          <span className="hidden sm:inline">AI Insights</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[#5C4A52] hover:bg-cream-200 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-burgundy-600 rounded-full" />
        </button>

        {actions}
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xl glass-card shadow-glass-lg overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(109,33,60,0.08)]">
                <Search size={16} className="text-[#9B8EA0] shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members, tickets, logs…"
                  className="flex-1 bg-transparent text-sm text-[#1A0D12] placeholder-[#9B8EA0] outline-none"
                />
                <kbd className="text-[10px] bg-cream-200 text-[#9B8EA0] px-2 py-1 rounded" onClick={() => setSearchOpen(false)}>ESC</kbd>
              </div>
              <div className="p-3 space-y-0.5">
                {["Overview Dashboard", "Analytics Report", "Moderation Logs", "Open Tickets", "Server Settings"].map((item) => (
                  <button
                    key={item}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#5C4A52] hover:bg-cream-200 hover:text-[#1A0D12] transition-all text-left"
                    onClick={() => setSearchOpen(false)}
                  >
                    <Search size={13} className="text-[#9B8EA0]" />
                    {item}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-[rgba(109,33,60,0.06)] flex items-center gap-4 text-[10px] text-[#9B8EA0]">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>ESC close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
