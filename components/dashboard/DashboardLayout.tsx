"use client";
import { useState } from "react";
import { DashboardSidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  guildId?: string;
}

export function DashboardLayout({ children, guildId }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F3EE]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <DashboardSidebar guildId={guildId} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full md:hidden"
            >
              <DashboardSidebar guildId={guildId} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.9)] backdrop-blur-sm sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-[#5C4A52] hover:bg-cream-200 transition-colors">
            <Menu size={18} />
          </button>
          <span className="font-semibold text-sm text-[#1A0D12]">DiscordHub AI</span>
        </div>

        {children}
      </main>
    </div>
  );
}
