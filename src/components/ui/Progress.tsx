"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  gradient?: boolean;
  label?: string;
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  size = "md",
  animated,
  gradient,
  label,
  showValue,
}: ProgressProps) {
  const percent = Math.min((value / max) * 100, 100);
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
          {showValue && (
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            gradient
              ? "bg-gradient-to-r from-brand-500 to-cyan-500"
              : "bg-brand-500",
            animated && "animate-pulse",
            barClassName
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
