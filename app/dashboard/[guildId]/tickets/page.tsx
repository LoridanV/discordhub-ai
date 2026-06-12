"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { getMockTickets } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatRelativeTime, TICKET_CATEGORY_LABELS } from "@/lib/utils";
import { Ticket, Plus, Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

const STATUSES = ["ALL", "OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"];
const PRIORITIES = ["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"];
const CATEGORIES = Object.entries(TICKET_CATEGORY_LABELS);

export default function TicketsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "SUPPORT", priority: "MEDIUM" });

  const allTickets = getMockTickets(25);

  const filtered = allTickets.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ticketId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    open: allTickets.filter((t) => t.status === "OPEN").length,
    inProgress: allTickets.filter((t) => t.status === "IN_PROGRESS").length,
    closed: allTickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length,
    urgent: allTickets.filter((t) => t.priority === "URGENT").length,
  };

  const handleCreate = () => {
    success("Ticket created", `${form.title} has been submitted.`);
    setCreateOpen(false);
    setForm({ title: "", description: "", category: "SUPPORT", priority: "MEDIUM" });
  };

  return (
    <DashboardLayout guildId={guildId}>
      <DashboardTopbar
        title="Tickets"
        subtitle="Support ticket management"
        actions={
          <button onClick={() => setCreateOpen(true)} className="btn-burgundy text-xs py-2 px-4">
            <Plus size={13} /> New Ticket
          </button>
        }
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Open", value: stats.open, icon: Ticket, color: "#0369a1", bg: "rgba(3,105,161,0.08)" },
            { label: "In Progress", value: stats.inProgress, icon: Clock, color: "#b45309", bg: "rgba(180,83,9,0.08)" },
            { label: "Resolved", value: stats.closed, icon: CheckCircle, color: "#15803d", bg: "rgba(21,128,61,0.08)" },
            { label: "Urgent", value: stats.urgent, icon: AlertCircle, color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
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

        {/* Filters */}
        <div className="glass-card p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8EA0]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets…" className="input-field pl-9 py-2 text-xs" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-2 text-xs w-36">
            {STATUSES.map((s) => <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="input-field py-2 text-xs w-36">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p === "ALL" ? "All Priority" : p}</option>)}
          </select>
          <span className="text-xs text-[#9B8EA0] ml-auto">{filtered.length} tickets</span>
        </div>

        {/* Tickets table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(109,33,60,0.06)]">
                  {["ID", "Title", "Category", "Priority", "Status", "Created by", "Messages", "Created"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#9B8EA0] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, i) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className="border-b border-[rgba(109,33,60,0.04)] hover:bg-cream-100/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-[#6D213C]">{ticket.ticketId}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-xs font-medium text-[#1A0D12] truncate block">{ticket.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#5C4A52]">{TICKET_CATEGORY_LABELS[ticket.category] ?? ticket.category}</span>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-[#5C4A52]">
                          {ticket.creatorName[0]}
                        </div>
                        <span className="text-xs text-[#5C4A52]">{ticket.creatorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-[#9B8EA0]">
                        <MessageSquare size={11} /> {ticket.messageCount}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9B8EA0] whitespace-nowrap">{formatRelativeTime(ticket.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Ticket size={32} className="mx-auto text-[#DDD0BE] mb-3" />
              <p className="text-sm text-[#9B8EA0]">No tickets found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create ticket modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Ticket" description="Submit a support request to the server staff." size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief description of the issue…" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Provide more details…" rows={4} className="input-field text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                {CATEGORIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field text-sm">
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setCreateOpen(false)} className="btn-ghost flex-1 text-sm py-2.5">Cancel</button>
            <button onClick={handleCreate} className="btn-burgundy flex-1 text-sm py-2.5" disabled={!form.title}>Create Ticket</button>
          </div>
        </div>
      </Modal>

      {/* Ticket detail modal */}
      {selectedTicket && (
        <Modal open={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={selectedTicket.title} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono font-semibold text-[#6D213C] bg-burgundy-50 px-2 py-1 rounded">{selectedTicket.ticketId}</span>
              <StatusBadge status={selectedTicket.status} />
              <PriorityBadge priority={selectedTicket.priority} />
              <span className="text-xs text-[#9B8EA0] ml-auto">{formatRelativeTime(selectedTicket.createdAt)}</span>
            </div>

            <div className="bg-cream-100/60 rounded-xl p-4">
              <p className="text-xs font-medium text-[#9B8EA0] mb-1">Category</p>
              <p className="text-sm text-[#5C4A52]">{TICKET_CATEGORY_LABELS[selectedTicket.category]}</p>
            </div>

            <div className="bg-cream-100/60 rounded-xl p-4">
              <p className="text-xs font-medium text-[#9B8EA0] mb-2">Created by</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-[#5C4A52]">{selectedTicket.creatorName[0]}</div>
                <span className="text-sm text-[#1A0D12]">{selectedTicket.creatorName}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                <button key={status} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedTicket.status === status ? "bg-[#6D213C] text-white border-[#6D213C]" : "border-[rgba(109,33,60,0.15)] text-[#5C4A52] hover:bg-cream-200"}`}>
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>

            <button className="btn-burgundy w-full text-sm py-3">
              <MessageSquare size={14} /> Open Full Thread
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
