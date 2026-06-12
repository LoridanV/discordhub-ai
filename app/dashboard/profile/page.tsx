"use client";
export const dynamic = "force-dynamic";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/components/ui/Toaster";
import { getMockServers } from "@/lib/mock-data";
import { User, Crown, Shield, LogOut, ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const PLAN_STYLES = {
  FREE: { label: "Free Plan", color: "#9B8EA0", bg: "rgba(155,142,160,0.08)", border: "rgba(155,142,160,0.2)" },
  PRO: { label: "Pro Plan", color: "#6D213C", bg: "rgba(109,33,60,0.08)", border: "rgba(109,33,60,0.2)" },
  ENTERPRISE: { label: "Enterprise", color: "#4B1026", bg: "rgba(75,16,38,0.08)", border: "rgba(75,16,38,0.2)" },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const servers = getMockServers();
  const currentPlan = "PRO" as keyof typeof PLAN_STYLES;
  const planStyle = PLAN_STYLES[currentPlan];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const copyDiscordId = () => {
    if (session?.user?.discordId) {
      navigator.clipboard.writeText(session.user.discordId);
      setCopied(true);
      success("Copied!", "Discord ID copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === "loading") {
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
      <DashboardTopbar title="Profile" subtitle="Your account details and subscription" />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-2xl p-8 border border-[rgba(255,255,255,0.5)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}
                >
                  {session?.user?.name?.[0] ?? "U"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-white rounded-full shadow-sm flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-[#1A0D12]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {session?.user?.name ?? "Unknown User"}
                  </h1>
                  <p className="text-[#9B8EA0] text-sm mt-1">
                    #{session?.user?.discriminator ?? "0"} · {session?.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                      style={{ color: planStyle.color, background: planStyle.bg, borderColor: planStyle.border }}
                    >
                      <Crown size={11} />
                      {planStyle.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://discord.com/users/${session?.user?.discordId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs py-2 px-4"
                  >
                    <ExternalLink size={12} /> Discord Profile
                  </a>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-red-600 border border-red-200/50 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account details */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={16} style={{ color: "#6D213C" }} />
              <h2 className="font-semibold text-[#1A0D12] text-sm">Account Details</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Username", value: session?.user?.name ?? "—" },
                { label: "Discriminator", value: `#${session?.user?.discriminator ?? "0"}` },
                { label: "Email", value: session?.user?.email ?? "Not provided" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-cream-100/60">
                  <span className="text-xs text-[#9B8EA0]">{item.label}</span>
                  <span className="text-xs font-medium text-[#1A0D12]">{item.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100/60">
                <span className="text-xs text-[#9B8EA0]">Discord ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-[#1A0D12]">
                    {session?.user?.discordId ? `${session.user.discordId.slice(0, 8)}…` : "—"}
                  </span>
                  <button onClick={copyDiscordId} className="p-1 rounded text-[#9B8EA0] hover:text-[#6D213C] transition-colors">
                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Crown size={16} style={{ color: "#6D213C" }} />
              <h2 className="font-semibold text-[#1A0D12] text-sm">Subscription</h2>
            </div>

            <div className="p-4 rounded-xl border mb-4" style={{ background: planStyle.bg, borderColor: planStyle.border }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm" style={{ color: planStyle.color }}>{planStyle.label}</span>
                <Crown size={16} style={{ color: planStyle.color }} />
              </div>
              <p className="text-xs text-[#5C4A52]">
                {currentPlan === "FREE"
                  ? "Upgrade to Pro for advanced features."
                  : currentPlan === "PRO"
                  ? "Renews on July 10, 2026 · €15/month"
                  : "Enterprise plan · Priority support included"}
              </p>
            </div>

            <div className="space-y-2 mb-5">
              {(currentPlan === "FREE"
                ? ["1 server", "Basic AI moderation", "Core analytics", "Standard tickets"]
                : currentPlan === "PRO"
                ? ["Unlimited servers", "Advanced AI moderation", "Full analytics suite", "Priority ticket routing", "AI Insights reports"]
                : ["Everything in Pro", "Custom integrations", "SLA guarantee", "Dedicated support", "Custom AI models"]
              ).map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-xs text-[#5C4A52]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {currentPlan !== "ENTERPRISE" && (
              <Link href="/pricing" className="btn-burgundy w-full text-xs py-2.5 justify-center">
                {currentPlan === "FREE" ? "Upgrade to Pro" : "Upgrade to Enterprise"}
              </Link>
            )}
          </motion.div>
        </div>

        {/* Connected servers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} style={{ color: "#6D213C" }} />
            <h2 className="font-semibold text-[#1A0D12] text-sm">Connected Servers</h2>
            <span className="ml-auto text-xs text-[#9B8EA0]">{servers.length} server{servers.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2">
            {servers.map((server) => (
              <Link
                key={server.id}
                href={`/dashboard/${server.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-200/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                     style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                  {server.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A0D12] truncate">{server.name}</p>
                  <p className="text-xs text-[#9B8EA0]">{server.memberCount.toLocaleString()} members · {server.plan} plan</p>
                </div>
                <ExternalLink size={14} className="text-[#9B8EA0] group-hover:text-[#6D213C] transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
