"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Shield, Ticket, BarChart3, Settings,
  ChevronDown, Plus, LogOut, User, Sparkles, Crown,
  HelpCircle, Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SidebarProps {
  guildId?: string;
}

const navItems = (guildId: string) => [
  { href: `/dashboard/${guildId}`, icon: LayoutDashboard, label: "Overview" },
  { href: `/dashboard/${guildId}/analytics`, icon: BarChart3, label: "Analytics" },
  { href: `/dashboard/${guildId}/moderation`, icon: Shield, label: "Moderation" },
  { href: `/dashboard/${guildId}/tickets`, icon: Ticket, label: "Tickets" },
  { href: `/dashboard/${guildId}/settings`, icon: Settings, label: "Settings" },
];

export function DashboardSidebar({ guildId }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [serverOpen, setServerOpen] = useState(false);
  const [servers, setServers] = useState<any[]>([]);
  const [activeServer, setActiveServer] = useState<any>(null);

  useEffect(() => {
    fetch("/api/servers")
      .then(r => r.json())
      .then(data => {
        if (data.servers?.length) {
          setServers(data.servers);
          if (guildId) {
            const found = data.servers.find((s: any) => s.id === guildId);
            setActiveServer(found ?? data.servers[0]);
          }
        }
      })
      .catch(() => {});
  }, [guildId]);

  return (
    <aside className="w-60 h-screen flex flex-col bg-[#FCFAF8] border-r border-[rgba(109,33,60,0.08)] shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[rgba(109,33,60,0.06)]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
               style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-semibold text-[#1A0D12] text-sm tracking-tight">DiscordHub AI</span>
        </Link>
      </div>

      {/* Server Switcher */}
      {guildId && activeServer && (
        <div className="px-3 py-3 border-b border-[rgba(109,33,60,0.06)]">
          <button
            onClick={() => setServerOpen(!serverOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[rgba(109,33,60,0.05)] transition-all duration-150"
          >
            {activeServer.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${activeServer.discordId}/${activeServer.icon}.png`}
                alt=""
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                   style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                {activeServer.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-[#1A0D12] truncate">{activeServer.name}</p>
              <p className="text-[10px] text-[#9B8EA0]">{(activeServer.memberCount || 0).toLocaleString()} members</p>
            </div>
            <ChevronDown size={14} className={cn("text-[#9B8EA0] transition-transform duration-200", serverOpen && "rotate-180")} />
          </button>

          {serverOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 space-y-0.5"
            >
              {servers.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/${s.id}`}
                  onClick={() => setServerOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all",
                    s.id === guildId
                      ? "bg-[rgba(109,33,60,0.08)] text-[#6D213C] font-medium"
                      : "text-[#5C4A52] hover:bg-[rgba(109,33,60,0.05)]"
                  )}
                >
                  {s.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${s.discordId}/${s.icon}.png`}
                      alt=""
                      className="w-6 h-6 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                         style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                      {s.name[0]}
                    </div>
                  )}
                  <span className="truncate">{s.name}</span>
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#9B8EA0] hover:text-[#5C4A52] hover:bg-[rgba(109,33,60,0.05)] transition-all"
              >
                <div className="w-6 h-6 rounded-md border-2 border-dashed border-[rgba(109,33,60,0.2)] flex items-center justify-center shrink-0">
                  <Plus size={10} className="text-[#9B8EA0]" />
                </div>
                Add server
              </Link>
            </motion.div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {!guildId ? (
          <>
            <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider px-3 py-1.5 mb-1">General</p>
            <Link href="/dashboard" className={cn("sidebar-item", pathname === "/dashboard" && "active")}>
              <Server size={16} />
              <span>My Servers</span>
            </Link>
            <Link href="/dashboard/profile" className={cn("sidebar-item", pathname === "/dashboard/profile" && "active")}>
              <User size={16} />
              <span>Profile</span>
            </Link>
          </>
        ) : (
          <>
            <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider px-3 py-1.5 mb-1">Management</p>
            {navItems(guildId).map((item) => {
              const active = pathname === item.href || (item.href !== `/dashboard/${guildId}` && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={cn("sidebar-item", active && "active")}>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}

        <div className="pt-2 mt-2 border-t border-[rgba(109,33,60,0.06)] space-y-0.5">
          <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider px-3 py-1.5">Account</p>
          <Link href="/dashboard/profile" className={cn("sidebar-item", pathname === "/dashboard/profile" && "active")}>
            <User size={16} />
            <span>Profile</span>
          </Link>
          <Link href="/pricing" className="sidebar-item">
            <Crown size={16} />
            <span>Upgrade Plan</span>
          </Link>
          <Link href="/docs" className="sidebar-item">
            <HelpCircle size={16} />
            <span>Documentation</span>
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-[rgba(109,33,60,0.06)]">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="relative shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                   style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                {session?.user?.name?.[0] ?? "U"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1A0D12] truncate">{session?.user?.name ?? "User"}</p>
            <p className="text-[10px] text-[#9B8EA0] truncate">#{session?.user?.discriminator ?? "0"}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 text-[#9B8EA0] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}