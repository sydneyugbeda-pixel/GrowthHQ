"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Brain, Target, BookOpen, LineChart, Users,
  Settings, Zap, ChevronLeft, ChevronRight, Trophy, Crown,
  LogOut, Bell,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard", exact: true },
  { href: "/coach", icon: <Brain className="w-4.5 h-4.5" />, label: "AI Coach", badge: "AI" },
  { href: "/assessments", icon: <Target className="w-4.5 h-4.5" />, label: "Assessments" },
  { href: "/learning", icon: <BookOpen className="w-4.5 h-4.5" />, label: "Learning Hub" },
  { href: "/tracking", icon: <LineChart className="w-4.5 h-4.5" />, label: "Growth Tracking" },
  { href: "/community", icon: <Users className="w-4.5 h-4.5" />, label: "Community" },
];

interface SidebarProps {
  user?: { full_name?: string; email?: string; avatar_url?: string; subscription_tier?: string; xp_points?: number; streak_days?: number } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-base text-slate-900 dark:text-white whitespace-nowrap overflow-hidden"
              >
                Growth<span className="text-brand-600">HQ</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0",
            collapsed && "ml-0 mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                active
                  ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <span className={cn(
                "shrink-0 transition-colors",
                active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && (
                <Badge variant="brand" size="sm" className="ml-auto text-[10px] px-1.5">
                  {item.badge}
                </Badge>
              )}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600 rounded-r-full"
                />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-slate-100 dark:border-slate-800" />

        {/* Upgrade prompt if free */}
        {!collapsed && user?.subscription_tier === "free" && (
          <Link
            href="/pricing"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/20 border border-brand-200/60 dark:border-brand-800/40 hover:from-brand-100 hover:to-brand-200 dark:hover:from-brand-900/30 dark:hover:to-brand-900/30 transition-all"
          >
            <Crown className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Upgrade to Pro</p>
              <p className="text-[10px] text-brand-500 dark:text-brand-400 truncate">Unlock full AI coaching</p>
            </div>
          </Link>
        )}
      </nav>

      {/* Bottom: user profile */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3 shrink-0">
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <Avatar name={user?.full_name || user?.email} src={user?.avatar_url} size="sm" ring />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.full_name || "Growth Seeker"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <Link href="/settings">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
