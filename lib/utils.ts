import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateTicketId(): string {
  return `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function severityLabel(score: number): "low" | "medium" | "high" | "critical" {
  if (score < 0.3) return "low";
  if (score < 0.6) return "medium";
  if (score < 0.85) return "high";
  return "critical";
}

export function severityColor(score: number): string {
  if (score < 0.3) return "#15803d";
  if (score < 0.6) return "#b45309";
  if (score < 0.85) return "#dc2626";
  return "#7c3aed";
}

export function planLabel(plan: string): string {
  const map: Record<string, string> = {
    FREE: "Free", PRO: "Pro", ENTERPRISE: "Enterprise",
  };
  return map[plan] ?? plan;
}

export function planColor(plan: string): string {
  const map: Record<string, string> = {
    FREE: "#9B8EA0", PRO: "#6D213C", ENTERPRISE: "#4B1026",
  };
  return map[plan] ?? "#9B8EA0";
}

export function generateChartData(days: number, base: number, variance: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(0, Math.round(base + (Math.random() - 0.5) * variance)),
    };
  });
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const TICKET_CATEGORY_LABELS: Record<string, string> = {
  SUPPORT: "Support",
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  APPEAL: "Appeal",
  BILLING: "Billing",
  OTHER: "Other",
};

export const MODERATION_ACTION_LABELS: Record<string, string> = {
  WARN: "Warning",
  TIMEOUT: "Timeout",
  KICK: "Kick",
  BAN: "Ban",
  MESSAGE_DELETE: "Message Deleted",
  MUTE: "Mute",
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent",
};

export const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open", IN_PROGRESS: "In Progress", CLOSED: "Closed", RESOLVED: "Resolved",
};
