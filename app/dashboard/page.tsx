"use client";
export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { Plus, Crown, Users, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const PLAN_STYLES = {
  FREE: { label: "Free", bg: "rgba(155,142,160,0.1)", color: "#9B8EA0" },
  PRO: { label: "Pro", bg: "rgba(109,33,60,0.08)", color: "#6D213C" },
  ENTERPRISE: { label: "Enterprise", bg: "rgba(75,16,38,0.1)", color: "#4B1026" },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/servers")
        .then(r => r.json())
        .then(data => {
          setServers(data.servers || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const syncServers = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/servers/sync", { method: "POST" });
      const data = await res.json();
      setServers(data.servers || []);
    } catch (e) {
      console.error(e);
    }
    setSyncing(false);
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[rgba(109,33,60,0.2)] border-t-[#6D213C] rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardTopbar title="My Servers" subtitle={`Welcome back, ${session?.user?.name ?? "User"}`} />

      <div className="p-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-2xl p-8 mb-8 border border-[rgba(255,255,255,0.5)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                     style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                  {session?.user?.name?.[0] ?? "U"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A0D12]">{session?.user?.name ?? "User"}</h2>
              <p className="text-sm text-[#9B8EA0]">Managing {servers.length} server{servers.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={syncServers}
              disabled={syncing}
              className="btn-ghost text-sm py-2.5 px-5"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync Servers"}
            </button>
            <Link href="/pricing" className="btn-burgundy text-sm py-2.5 px-5">
              <Crown size={14} /> Upgrade Plan
            </Link>
          </div>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-[#1A0D12]">Your Servers</h3>
          <span className="text-xs text-[#9B8EA0]">{servers.length} server{servers.length !== 1 ? "s" : ""}</span>
        </div>

        {servers.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Sparkles size={32} className="mx-auto mb-4" style={{ color: "#6D213C" }} />
            <h3 className="font-semibold text-[#1A0D12] mb-2">No servers yet</h3>
            <p className="text-sm text-[#9B8EA0] mb-6">Click "Sync Servers" to import your Discord servers</p>
            <button onClick={syncServers} disabled={syncing} className="btn-burgundy text-sm py-2.5 px-6">
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync My Servers"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server: any, i: number) => {
              const planStyle = PLAN_STYLES[server.plan as keyof typeof PLAN_STYLES] ?? PLAN_STYLES.FREE;
              return (
                <motion.div key={server.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href={`/dashboard/${server.id}`} className="glass-card p-5 block group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {server.icon ? (
                          <img src={`https://cdn.discordapp.com/icons/${server.discordId}/${server.icon}.png`} alt="" className="w-11 h-11 rounded-xl object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                               style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                            {server.name[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-[#1A0D12] text-sm">{server.name}</h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                                style={{ background: planStyle.bg, color: planStyle.color }}>
                            {planStyle.label}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#9B8EA0] group-hover:text-[#6D213C] transition-colors mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-cream-200/50 rounded-lg p-2.5 text-center">
                        <p className="text-sm font-bold text-[#1A0D12]">{formatNumber(server.memberCount || 0)}</p>
                        <p className="text-[10px] text-[#9B8EA0] mt-0.5">Members</p>
                      </div>
                      <div className="bg-cream-200/50 rounded-lg p-2.5 text-center">
                        <p className="text-sm font-bold text-emerald-600">Active</p>
                        <p className="text-[10px] text-[#9B8EA0] mt-0.5">Status</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}