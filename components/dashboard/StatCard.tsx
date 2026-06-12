"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  formatter?: (n: number) => string;
  suffix?: string;
  index?: number;
}

export function StatCard({
  title, value, change, changeLabel = "vs last month",
  icon: Icon, iconColor = "#6D213C", iconBg = "rgba(109,33,60,0.08)",
  formatter, suffix, index = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="glass-card p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-[#9B8EA0] uppercase tracking-wider">{title}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200"
          style={{ background: iconBg }}
        >
          <Icon size={17} style={{ color: iconColor }} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-[#1A0D12] font-display leading-none">
            <AnimatedCounter
              value={value}
              formatter={formatter ?? ((n) => formatNumber(n) + (suffix ?? ""))}
            />
          </p>

          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              isPositive && "text-emerald-600",
              isNegative && "text-red-500",
              isNeutral && "text-[#9B8EA0]",
            )}>
              {isPositive && <TrendingUp size={12} />}
              {isNegative && <TrendingDown size={12} />}
              {isNeutral && <Minus size={12} />}
              <span>
                {change > 0 ? "+" : ""}{change?.toFixed(1)}% <span className="text-[#9B8EA0] font-normal">{changeLabel}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
