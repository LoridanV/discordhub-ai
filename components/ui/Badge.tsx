import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "burgundy" | "neutral";
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = "neutral", children, className, dot }: BadgeProps) {
  return (
    <span className={cn("badge", `badge-${variant}`, className)}>
      {dot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-emerald-500",
            variant === "warning" && "bg-amber-500",
            variant === "danger" && "bg-red-500",
            variant === "info" && "bg-blue-500",
            variant === "burgundy" && "bg-burgundy-500",
            variant === "neutral" && "bg-[#9B8EA0]",
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: "online" | "idle" | "dnd" | "offline" }) {
  const colors = {
    online: "bg-emerald-500",
    idle: "bg-amber-400",
    dnd: "bg-red-500",
    offline: "bg-[#9B8EA0]",
  };
  return (
    <span className={cn("inline-block w-2.5 h-2.5 rounded-full border-2 border-white", colors[status])} />
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    LOW: { variant: "neutral", label: "Low" },
    MEDIUM: { variant: "info", label: "Medium" },
    HIGH: { variant: "warning", label: "High" },
    URGENT: { variant: "danger", label: "Urgent" },
  };
  const c = config[priority] ?? config.MEDIUM;
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    OPEN: { variant: "info", label: "Open" },
    IN_PROGRESS: { variant: "warning", label: "In Progress" },
    CLOSED: { variant: "neutral", label: "Closed" },
    RESOLVED: { variant: "success", label: "Resolved" },
  };
  const c = config[status] ?? config.OPEN;
  return <Badge variant={c.variant} dot>{c.label}</Badge>;
}

export function ActionBadge({ action }: { action: string }) {
  const config: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    WARN: { variant: "warning", label: "Warn" },
    TIMEOUT: { variant: "danger", label: "Timeout" },
    KICK: { variant: "danger", label: "Kick" },
    BAN: { variant: "danger", label: "Ban" },
    MESSAGE_DELETE: { variant: "neutral", label: "Deleted" },
    MUTE: { variant: "warning", label: "Mute" },
  };
  const c = config[action] ?? { variant: "neutral", label: action };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
