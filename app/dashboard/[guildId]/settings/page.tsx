"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/components/ui/Toaster";
import {
  Shield, Ticket, BarChart3, Bell, Bot, Save, ChevronRight,
  Settings, Hash, Users, AlertTriangle, Zap, Eye
} from "lucide-react";

const SECTIONS = [
  { id: "moderation", icon: Shield, label: "AI Moderation" },
  { id: "tickets", icon: Ticket, label: "Ticket System" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "notifications", icon: Bell, label: "Notifications" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#6D213C] ${checked ? "bg-[#6D213C]" : "bg-cream-300"}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function SliderInput({ value, onChange, min = 0, max = 1, step = 0.05, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "#6D213C" }}
      />
      <span className="text-xs font-semibold text-[#1A0D12] w-10 text-right tabular-nums">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const { success } = useToast();
  const [activeSection, setActiveSection] = useState("moderation");
  const [saving, setSaving] = useState(false);

  // Moderation settings
  const [aiEnabled, setAiEnabled] = useState(true);
  const [toxicityThreshold, setToxicityThreshold] = useState(0.7);
  const [spamThreshold, setSpamThreshold] = useState(0.8);
  const [scamThreshold, setScamThreshold] = useState(0.9);
  const [phishingThreshold, setPhishingThreshold] = useState(0.6);
  const [hateSpeechThreshold, setHateSpeechThreshold] = useState(0.5);
  const [autoWarn, setAutoWarn] = useState(true);
  const [autoTimeout, setAutoTimeout] = useState(false);
  const [autoDelete, setAutoDelete] = useState(true);
  const [autoKick, setAutoKick] = useState(false);
  const [autoBan, setAutoBan] = useState(false);
  const [logChannelId, setLogChannelId] = useState("");

  // Ticket settings
  const [ticketsEnabled, setTicketsEnabled] = useState(true);
  const [autoClose, setAutoClose] = useState(true);
  const [autoCloseDays, setAutoCloseDays] = useState(7);
  const [ticketChannelId, setTicketChannelId] = useState("");
  const [categories, setCategories] = useState(["Support", "Bug Report", "Feature Request", "Appeal", "Other"]);
  const [newCategory, setNewCategory] = useState("");

  // Analytics settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [trackMessages, setTrackMessages] = useState(true);
  const [trackVoice, setTrackVoice] = useState(true);
  const [trackMembers, setTrackMembers] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);

  // Notification settings
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifNewTicket, setNotifNewTicket] = useState(true);
  const [notifHighSeverity, setNotifHighSeverity] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(true);
  const [notifMemberMilestone, setNotifMemberMilestone] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    success("Settings saved", "Your configuration has been updated successfully.");
  };

  return (
    <DashboardLayout guildId={guildId}>
      <DashboardTopbar title="Settings" subtitle="Configure your server's DiscordHub AI settings" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
          {/* Sidebar nav */}
          <div className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`sidebar-item w-full ${activeSection === s.id ? "active" : ""}`}
              >
                <s.icon size={16} />
                <span>{s.label}</span>
                <ChevronRight size={14} className="ml-auto opacity-40" />
              </button>
            ))}
          </div>

          {/* Settings panels */}
          <div className="space-y-4">
            {/* AI Moderation */}
            {activeSection === "moderation" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(109,33,60,0.08)" }}>
                        <Bot size={17} style={{ color: "#6D213C" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A0D12] text-sm">AI Moderation Engine</h3>
                        <p className="text-xs text-[#9B8EA0]">Automatic content filtering and threat detection</p>
                      </div>
                    </div>
                    <Toggle checked={aiEnabled} onChange={setAiEnabled} />
                  </div>

                  <div className={`space-y-5 transition-opacity duration-200 ${!aiEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-5">
                      <p className="text-xs font-semibold text-[#5C4A52] uppercase tracking-wider mb-4">Detection Thresholds</p>
                      <div className="space-y-4">
                        {[
                          { label: "Toxicity", value: toxicityThreshold, onChange: setToxicityThreshold, color: "#dc2626" },
                          { label: "Spam", value: spamThreshold, onChange: setSpamThreshold, color: "#b45309" },
                          { label: "Scam", value: scamThreshold, onChange: setScamThreshold, color: "#7c3aed" },
                          { label: "Phishing", value: phishingThreshold, onChange: setPhishingThreshold, color: "#0369a1" },
                          { label: "Hate Speech", value: hateSpeechThreshold, onChange: setHateSpeechThreshold, color: "#be185d" },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-medium text-[#5C4A52]">{item.label}</label>
                              <span className="text-[10px] text-[#9B8EA0]">
                                {item.value < 0.5 ? "Very Sensitive" : item.value < 0.7 ? "Sensitive" : item.value < 0.85 ? "Balanced" : "Strict"}
                              </span>
                            </div>
                            <SliderInput value={item.value} onChange={item.onChange} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-5">
                      <p className="text-xs font-semibold text-[#5C4A52] uppercase tracking-wider mb-4">Automatic Actions</p>
                      <div className="space-y-3">
                        {[
                          { label: "Auto-warn members", desc: "Issue an automatic warning for violations", checked: autoWarn, onChange: setAutoWarn },
                          { label: "Auto-delete messages", desc: "Delete flagged messages immediately", checked: autoDelete, onChange: setAutoDelete },
                          { label: "Auto-timeout", desc: "Apply timeout for repeated violations", checked: autoTimeout, onChange: setAutoTimeout },
                          { label: "Auto-kick", desc: "Kick members with high-severity violations", checked: autoKick, onChange: setAutoKick },
                          { label: "Auto-ban", desc: "Ban for the most severe offenses", checked: autoBan, onChange: setAutoBan },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-cream-100/60 hover:bg-cream-200/60 transition-colors">
                            <div>
                              <p className="text-xs font-medium text-[#1A0D12]">{item.label}</p>
                              <p className="text-[10px] text-[#9B8EA0] mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle checked={item.checked} onChange={item.onChange} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-5">
                      <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Log Channel ID</label>
                      <input
                        value={logChannelId}
                        onChange={(e) => setLogChannelId(e.target.value)}
                        placeholder="e.g. 1234567890123456789"
                        className="input-field text-sm"
                      />
                      <p className="text-[10px] text-[#9B8EA0] mt-1">Moderation actions will be logged to this channel.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ticket settings */}
            {activeSection === "tickets" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(3,105,161,0.08)" }}>
                        <Ticket size={17} style={{ color: "#0369a1" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A0D12] text-sm">Ticket System</h3>
                        <p className="text-xs text-[#9B8EA0]">Support request management and routing</p>
                      </div>
                    </div>
                    <Toggle checked={ticketsEnabled} onChange={setTicketsEnabled} />
                  </div>

                  <div className={`space-y-5 ${!ticketsEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                    <div>
                      <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Ticket Channel ID</label>
                      <input value={ticketChannelId} onChange={(e) => setTicketChannelId(e.target.value)} placeholder="Channel where tickets are created" className="input-field text-sm" />
                    </div>

                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs font-medium text-[#1A0D12]">Auto-close inactive tickets</p>
                          <p className="text-[10px] text-[#9B8EA0]">Automatically close tickets with no activity</p>
                        </div>
                        <Toggle checked={autoClose} onChange={setAutoClose} />
                      </div>
                      {autoClose && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Close after (days)</label>
                          <input
                            type="number"
                            min={1} max={30}
                            value={autoCloseDays}
                            onChange={(e) => setAutoCloseDays(parseInt(e.target.value))}
                            className="input-field text-sm w-24"
                          />
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-5">
                      <p className="text-xs font-semibold text-[#5C4A52] uppercase tracking-wider mb-3">Ticket Categories</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {categories.map((cat) => (
                          <span key={cat} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-200 text-xs text-[#5C4A52] font-medium">
                            {cat}
                            <button onClick={() => setCategories(categories.filter((c) => c !== cat))} className="text-[#9B8EA0] hover:text-red-500 transition-colors">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newCategory.trim()) {
                              setCategories([...categories, newCategory.trim()]);
                              setNewCategory("");
                            }
                          }}
                          placeholder="Add category and press Enter"
                          className="input-field text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics settings */}
            {activeSection === "analytics" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(21,128,61,0.08)" }}>
                        <BarChart3 size={17} style={{ color: "#15803d" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A0D12] text-sm">Analytics</h3>
                        <p className="text-xs text-[#9B8EA0]">Data collection and reporting preferences</p>
                      </div>
                    </div>
                    <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} />
                  </div>

                  <div className={`space-y-4 ${!analyticsEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                    {[
                      { label: "Track message activity", desc: "Count messages per channel per day", checked: trackMessages, onChange: setTrackMessages },
                      { label: "Track voice activity", desc: "Record voice channel usage in minutes", checked: trackVoice, onChange: setTrackVoice },
                      { label: "Track member changes", desc: "Log joins, leaves, and bans", checked: trackMembers, onChange: setTrackMembers },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-cream-100/60">
                        <div>
                          <p className="text-xs font-medium text-[#1A0D12]">{item.label}</p>
                          <p className="text-[10px] text-[#9B8EA0] mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle checked={item.checked} onChange={item.onChange} />
                      </div>
                    ))}

                    <div className="border-t border-[rgba(109,33,60,0.06)] pt-4">
                      <label className="block text-xs font-medium text-[#5C4A52] mb-1.5">Data retention (days)</label>
                      <select value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))} className="input-field text-sm w-40">
                        {[30, 60, 90, 180, 365].map((d) => <option key={d} value={d}>{d} days</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(180,83,9,0.08)" }}>
                        <Bell size={17} style={{ color: "#b45309" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A0D12] text-sm">Notifications</h3>
                        <p className="text-xs text-[#9B8EA0]">Alert and report preferences</p>
                      </div>
                    </div>
                    <Toggle checked={notifEnabled} onChange={setNotifEnabled} />
                  </div>

                  <div className={`space-y-3 ${!notifEnabled ? "opacity-40 pointer-events-none" : ""}`}>
                    {[
                      { label: "New ticket submitted", desc: "Alert when a new ticket is opened", checked: notifNewTicket, onChange: setNotifNewTicket },
                      { label: "High-severity moderation", desc: "Alert for critical AI detections", checked: notifHighSeverity, onChange: setNotifHighSeverity },
                      { label: "Weekly analytics report", desc: "Receive a weekly server summary", checked: notifWeeklyReport, onChange: setNotifWeeklyReport },
                      { label: "Member milestones", desc: "Notify at 1K, 5K, 10K+ members", checked: notifMemberMilestone, onChange: setNotifMemberMilestone },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-cream-100/60">
                        <div>
                          <p className="text-xs font-medium text-[#1A0D12]">{item.label}</p>
                          <p className="text-[10px] text-[#9B8EA0] mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle checked={item.checked} onChange={item.onChange} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save button */}
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving} className="btn-burgundy px-8 py-3 text-sm">
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
