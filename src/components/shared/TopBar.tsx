"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Sun, Moon, X, LayoutDashboard, Brain, Target, BookOpen, LineChart, Users, Settings, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "AI Coach", href: "/coach", icon: <Brain className="w-4 h-4" /> },
  { label: "Assessments", href: "/assessments", icon: <Target className="w-4 h-4" /> },
  { label: "Learning Hub", href: "/learning", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Growth Tracking", href: "/tracking", icon: <LineChart className="w-4 h-4" /> },
  { label: "Community", href: "/community", icon: <Users className="w-4 h-4" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="w-4 h-4" /> },
];

interface Notification {
  id: string;
  title: string;
  message?: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const router = useRouter();

  // ── Theme ──────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // ── Notifications ───────────────────────────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15);
      setNotifications(data || []);
    } finally {
      setNotifLoading(false);
    }
  };

  const markAllRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openNotifs = () => {
    setNotifOpen(true);
    fetchNotifications();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Search / Command Palette ────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : NAV_ITEMS;

  const openSearch = () => {
    setSearchOpen(true);
    setQuery("");
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const navigate = (href: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeIcon: Record<string, string> = {
    achievement: "🏆",
    streak: "🔥",
    coach: "🧠",
    info: "ℹ️",
    system: "⚙️",
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm shrink-0 z-20 relative">
        <div>
          {title && <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:block text-slate-400 dark:text-slate-500">Search</span>
            <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-mono">⌘K</kbd>
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={notifOpen ? () => setNotifOpen(false) : openNotifs}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 border-2 border-white dark:border-slate-950" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "flex gap-3 px-4 py-3 transition-colors",
                          !n.read ? "bg-brand-50/60 dark:bg-brand-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{typeIcon[n.type] || "ℹ️"}</span>
                        <div className="min-w-0">
                          <p className={cn("text-sm font-medium truncate", !n.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>{n.title}</p>
                          {n.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {new Date(n.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-2" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search / Command Palette */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div ref={searchRef} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered.length > 0) navigate(filtered[0].href);
                }}
                placeholder="Search pages..."
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-slate-400 dark:text-slate-500">{item.icon}</span>
                    {item.label}
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-[10px] text-slate-400">
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
