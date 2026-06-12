"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { getMockAnalytics } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { Users, MessageSquare, Activity, Ticket, TrendingUp, BarChart3, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs shadow-lg">
        <p className="text-[#9B8EA0] mb-1 font-medium">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">{formatNumber(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

const DAYS_OPTIONS = [7, 14, 30, 90];
const CHANNEL_COLORS = ["#6D213C", "#4B1026", "#8B2D4A", "#C04D73", "#D97496", "#E9A8BC"];

export default function AnalyticsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [days, setDays] = useState(30);
  const analytics = getMockAnalytics(days);

  return (
    <DashboardLayout guildId={guildId}>
      <DashboardTopbar title="Analytics" subtitle="Detailed server statistics and insights" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Date range selector */}
        <div className="flex items-center gap-2">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                days === d
                  ? "bg-[#6D213C] text-white shadow-sm"
                  : "bg-[rgba(252,250,248,0.8)] border border-[rgba(109,33,60,0.12)] text-[#5C4A52] hover:border-[rgba(109,33,60,0.25)]"
              }`}
            >
              {d === 7 ? "1 week" : d === 14 ? "2 weeks" : d === 30 ? "30 days" : "90 days"}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Members" value={analytics.overview.totalMembers} change={analytics.overview.totalMembersChange} icon={Users} iconColor="#6D213C" iconBg="rgba(109,33,60,0.08)" index={0} />
          <StatCard title="Active Members" value={analytics.overview.activeMembers} change={analytics.overview.activeMembersChange} icon={Activity} iconColor="#0369a1" iconBg="rgba(3,105,161,0.08)" index={1} />
          <StatCard title="Messages" value={analytics.overview.messageCount} change={analytics.overview.messageCountChange} icon={MessageSquare} iconColor="#15803d" iconBg="rgba(21,128,61,0.08)" index={2} />
          <StatCard title="Retention Rate" value={analytics.overview.retentionRate} change={analytics.overview.retentionChange} icon={TrendingUp} iconColor="#b45309" iconBg="rgba(180,83,9,0.08)" suffix="%" formatter={(n) => `${n.toFixed(1)}%`} index={3} />
        </div>

        {/* Member Growth */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} style={{ color: "#6D213C" }} />
            <h3 className="font-semibold text-[#1A0D12] text-sm">Member Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analytics.memberGrowth}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6D213C" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6D213C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={Math.floor(days / 7)} />
              <YAxis tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#6D213C" strokeWidth={2.5} fill="url(#grad1)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Message + Voice activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={16} style={{ color: "#15803d" }} />
              <h3 className="font-semibold text-[#1A0D12] text-sm">Message Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.messageActivity.slice(-Math.min(days, 21))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={Math.floor(days / 7)} />
                <YAxis tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#15803d" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={16} style={{ color: "#0369a1" }} />
              <h3 className="font-semibold text-[#1A0D12] text-sm">Voice Activity (minutes)</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.voiceActivity.slice(-Math.min(days, 21))}>
                <defs>
                  <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0369a1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0369a1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={Math.floor(days / 7)} />
                <YAxis tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#0369a1" strokeWidth={2} fill="url(#grad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Channel breakdown + Hourly activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={16} style={{ color: "#6D213C" }} />
              <h3 className="font-semibold text-[#1A0D12] text-sm">Channel Breakdown</h3>
            </div>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={analytics.channelBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="messages">
                    {analytics.channelBreakdown.map((_, i) => (
                      <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatNumber(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {analytics.channelBreakdown.map((ch, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }} />
                    <span className="text-xs text-[#5C4A52] flex-1 truncate">{ch.name}</span>
                    <span className="text-xs font-semibold text-[#1A0D12]">{ch.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={16} style={{ color: "#b45309" }} />
              <h3 className="font-semibold text-[#1A0D12] text-sm">Hourly Activity Pattern</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
                <XAxis dataKey="label" tick={{ fontSize: 8, fill: "#9B8EA0" }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 9, fill: "#9B8EA0" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="messages" fill="rgba(109,33,60,0.6)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Retention cohort */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} style={{ color: "#6D213C" }} />
            <h3 className="font-semibold text-[#1A0D12] text-sm">Member Retention Cohort</h3>
            <span className="ml-auto text-xs text-[#9B8EA0]">% still active</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.retentionCohort}>
              <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6D213C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6D213C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Area type="monotone" dataKey="retained" stroke="#6D213C" strokeWidth={2.5} fill="url(#retGrad)" dot={{ fill: "#6D213C", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
