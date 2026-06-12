"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { getMockModerationLogs } from "@/lib/mock-data";
import { ActionBadge } from "@/components/ui/Badge";
import { formatRelativeTime, severityLabel } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/moderation";
import { getCategoryColor } from "@/lib/moderation";
import { Shield, AlertTriangle, Bot, Filter, Search, Trash2, Clock, Ban } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const ACTION_COLORS: Record<string, string> = {
  WARN: "#b45309", TIMEOUT: "#dc2626", KICK: "#be185d",
  BAN: "#7c3aed", MESSAGE_DELETE: "#9B8EA0", MUTE: "#0369a1",
};

const SEVERITY_COLORS = {
  low: "#15803d", medium: "#b45309", high: "#dc2626", critical: "#7c3aed",
};

export default function ModerationPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const allLogs = getMockModerationLogs(40);

  const filtered = allLogs.filter((l) => {
    const matchSearch = !search || l.targetName.toLowerCase().includes(search.toLowerCase()) || l.reason?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "ALL" || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  // Summary stats
  const totalActions = allLogs.length;
  const aiActions = allLogs.filter((l) => l.aiDetected).length;
  const highSeverity = allLogs.filter((l) => l.severity >= 0.7).length;
  const bans = allLogs.filter((l) => l.action === "BAN").length;

  // Action distribution
  const actionDist = ["WARN", "TIMEOUT", "KICK", "BAN", "MESSAGE_DELETE", "MUTE"].map((action) => ({
    action: action.replace("_", " "),
    count: allLogs.filter((l) => l.action === action).length,
    color: ACTION_COLORS[action],
  }));

  // Category distribution
  const categories = ["toxicity", "spam", "scam", "phishing", "hateSpeech"];
  const catDist = categories.map((cat) => ({
    cat: getCategoryLabel(cat),
    count: allLogs.filter((l) => l.aiCategory === cat).length,
    color: getCategoryColor(cat),
  }));

  return (
    <DashboardLayout guildId={guildId}>
      <DashboardTopbar title="AI Moderation" subtitle="Automated threat detection and action log" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Actions", value: totalActions, icon: Shield, color: "#6D213C", bg: "rgba(109,33,60,0.08)" },
            { label: "AI Detected", value: aiActions, icon: Bot, color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
            { label: "High Severity", value: highSeverity, icon: AlertTriangle, color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
            { label: "Total Bans", value: bans, icon: Ban, color: "#be185d", bg: "rgba(190,24,93,0.08)" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider">{s.label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A0D12]">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="glass-card p-6">
            <h3 className="font-semibold text-[#1A0D12] text-sm mb-5">Actions by Type</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={actionDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="action" type="category" tick={{ fontSize: 10, fill: "#5C4A52" }} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{ fill: "rgba(109,33,60,0.04)" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {actionDist.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }} className="glass-card p-6">
            <h3 className="font-semibold text-[#1A0D12] text-sm mb-5">AI Detections by Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={catDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(109,33,60,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9B8EA0" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="cat" type="category" tick={{ fontSize: 10, fill: "#5C4A52" }} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{ fill: "rgba(109,33,60,0.04)" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {catDist.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Log table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="glass-card overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-[rgba(109,33,60,0.06)]">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8EA0]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or reason…"
                className="input-field pl-9 py-2 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#9B8EA0]" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="input-field py-2 text-xs w-36"
              >
                <option value="ALL">All Actions</option>
                {["WARN", "TIMEOUT", "KICK", "BAN", "MESSAGE_DELETE", "MUTE"].map((a) => (
                  <option key={a} value={a}>{a.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-[#9B8EA0] shrink-0">{filtered.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(109,33,60,0.06)]">
                  {["User", "Action", "Reason", "Category", "Severity", "Source", "Time"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const sev = severityLabel(log.severity);
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[rgba(109,33,60,0.04)] hover:bg-cream-100/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-[#5C4A52]">
                            {log.targetName[0]}
                          </div>
                          <span className="text-xs font-medium text-[#1A0D12]">{log.targetName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><ActionBadge action={log.action} /></td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <span className="text-xs text-[#5C4A52] truncate block">{log.reason ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        {log.aiCategory ? (
                          <span className="text-xs font-medium" style={{ color: getCategoryColor(log.aiCategory) }}>
                            {getCategoryLabel(log.aiCategory)}
                          </span>
                        ) : <span className="text-xs text-[#9B8EA0]">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${log.severity * 100}%`, background: SEVERITY_COLORS[sev] }} />
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: SEVERITY_COLORS[sev] }}>{Math.round(log.severity * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${log.aiDetected ? "text-[#7c3aed]" : "text-[#9B8EA0]"}`}>
                          {log.aiDetected ? "AI" : "Manual"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#9B8EA0] whitespace-nowrap">{formatRelativeTime(log.createdAt)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Shield size={32} className="mx-auto text-[#DDD0BE] mb-3" />
              <p className="text-sm text-[#9B8EA0]">No moderation logs found</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
