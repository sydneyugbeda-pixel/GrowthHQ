"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  gradient?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  gradient,
  description,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {gradient && (
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: gradient }}
        />
      )}
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          {icon && (
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              {icon}
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
        >
          {value}
        </motion.div>
        <div className="mt-2 flex items-center gap-2">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
                isPositive && "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
                isNegative && "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
                !isPositive && !isNegative && "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800"
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(change)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
