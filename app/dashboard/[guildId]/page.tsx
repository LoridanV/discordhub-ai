"use client";
export const dynamic = "force-dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { getMockAnalytics, getMockModerationLogs, getMockTickets } from "@/lib/mock-data";
import {
  Users, Activity, MessageSquare, Ticket, Shield, TrendingUp,
  Sparkles, AlertTriangle, CheckCircle, Bot, ArrowRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { ActionBadge, StatusBadge } from "@/components/ui/Badge";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-[#9B8EA0] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">{formatNumber(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ServerDashboardPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const analytics = getMockAnalytics(30);
  const recentLogs = getMockModerationLogs(5);
  const recentTickets = getMockTickets(5);

  useEffect(() => {
    fetch(`/api/servers/${guildId}`)
      .then(r => r.json())
      .then(data => {
        if (data.server) setServer(data.server);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[rgba(109,33,60,0.2)] border-t-[#6D213C] rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout guildId={guildId}>
      <DashboardTopbar
        title={server?.name ?? "Server Overview"}
        subtitle={server?.memberCount ? `${server.memberCount.toLocaleString()} members` : "Server Overview"}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Members" value={server?.memberCount ?? analytics.overview.totalMembers} change={analytics.overview.totalMembersChange} icon={Users} iconColor="#6D213C" iconBg="rgba(109,33,60,0.08)" index={0} />
          <StatCard title="Active Today" value={analytics.overview.activeMembers} change={analytics.overview.activeMembersChange} icon={Activity} iconColor="#0369a1" iconBg="rgba(3,105,161,0.08)" index={1} />
          <StatCard title="Messages Today" value={analytics.overview.messageCount} change={analytics.overview.messageCountChange} icon={MessageSquare} iconColor="#15803d" iconBg="rgba(21,128,61,0.08)" index={2} />
          <StatCard title="Open Tickets" value={analytics.overview.ticketsThisWeek} change={analytics.overview.ticketsChange} icon={Ticket} iconColor="#b45309" iconBg="rgba(180,83,9,0.08)" index={3} />
        </div>

        {/* Main chart + AI insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-[#1A0D12] text-sm">Member Growth</h3>
                <p className="text-xs text-[#9B8EA0] mt-0.5">Last 30 days</p>
              </div>
              <Link href={`/dashboard/${guildId}/analytics`} className="text-xs text-[#6D213C] hover:underline flex items-center gap-1">
                Full report <ArrowRight size={11} />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.memberGrowth.slice(-14)}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D213C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6D213C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#6D213C" strokeWidth={2} fill="url(#memberGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                <Sparkles size={14} style={{ color: "#7c3aed" }} />
              </div>
              <h3 className="font-semibold text-[#1A0D12] text-sm">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, color: "#15803d", bg: "rgba(21,128,61,0.08)", text: "Member growth up 8.4% — peak activity on weekends" },
                { icon: AlertTriangle, color: "#b45309", bg: "rgba(180,83,9,0.08)", text: "3 high-severity moderation events detected this week" },
                { icon: CheckCircle, color: "#6D213C", bg: "rgba(109,33,60,0.08)", text: "Ticket resolution time improved by 18% since last month" },
                { icon: Bot, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", text: "AI blocked 128 harmful messages this week automatically" },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[rgba(247,243,238,0.6)]">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: insight.bg }}>
                    <insight.icon size={11} style={{ color: insight.color }} />
                  </div>
                  <p className="text-xs text-[#5C4A52] leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Message activity + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#1A0D12] text-sm">Message Activity</h3>
              <span className="text-xs text-[#9B8EA0]">Last 14 days</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={analytics.messageActivity.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="rgba(109,33,60,0.7)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-4">
            {[
              { label: "Moderation Actions", value: analytics.overview.moderationActions, change: analytics.overview.moderationActionsChange, icon: Shield, color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
              { label: "Retention Rate", value: analytics.overview.retentionRate, change: analytics.overview.retentionChange, suffix: "%", icon: TrendingUp, color: "#15803d", bg: "rgba(21,128,61,0.08)" },
              { label: "Voice Minutes", value: Math.round(analytics.voiceActivity.reduce((a, b) => a + b.value, 0) / 30), icon: Activity, color: "#0369a1", bg: "rgba(3,105,161,0.08)" },
              { label: "Tickets Closed", value: recentTickets.filter(t => t.status === "CLOSED" || t.status === "RESOLVED").length, icon: CheckCircle, color: "#b45309", bg: "rgba(180,83,9,0.08)" },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider leading-tight">{s.label}</p>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                    <s.icon size={13} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-xl font-bold text-[#1A0D12]">{s.value}{s.suffix ?? ""}</p>
                {s.change !== undefined && (
                  <p className={`text-xs mt-1 font-medium ${(s.change ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {s.change >= 0 ? "+" : ""}{s.change.toFixed(1)}%
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A0D12] text-sm">Recent Moderation</h3>
              <Link href={`/dashboard/${guildId}/moderation`} className="text-xs text-[#6D213C] hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(247,243,238,0.8)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#F0E9E0] flex items-center justify-center text-[10px] font-bold text-[#5C4A52] shrink-0">
                    {log.targetName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A0D12] truncate">{log.targetName}</p>
                    <p className="text-[10px] text-[#9B8EA0]">{formatRelativeTime(log.createdAt)}</p>
                  </div>
                  <ActionBadge action={log.action} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A0D12] text-sm">Recent Tickets</h3>
              <Link href={`/dashboard/${guildId}/tickets`} className="text-xs text-[#6D213C] hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgba(247,243,238,0.8)] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#F0E9E0] flex items-center justify-center shrink-0">
                    <Ticket size={13} className="text-[#9B8EA0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A0D12] truncate">{ticket.title}</p>
                    <p className="text-[10px] text-[#9B8EA0]">{ticket.ticketId} · {formatRelativeTime(ticket.createdAt)}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}