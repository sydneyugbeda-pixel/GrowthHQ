"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, BarChart3, Trophy, Crown, TrendingUp, Settings,
  Search, Filter, Mail, Ban, ChevronDown, Zap
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Users", "Assessments", "Content", "Settings"];
const COLORS = ["#7c3aed", "#4f46e5", "#06b6d4", "#10b981"];

interface AdminDashboardProps {
  users: Record<string, unknown>[];
  stats: {
    totalUsers: number; proUsers: number; eliteUsers: number;
    freeUsers: number; totalAssessments: number; avgScore: number;
  };
  assessments: Record<string, unknown>[];
}

export function AdminDashboard({ users, stats, assessments }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    (u.full_name as string || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email as string || "").toLowerCase().includes(search.toLowerCase())
  );

  const tierData = [
    { name: "Free", value: stats.freeUsers },
    { name: "Pro", value: stats.proUsers },
    { name: "Elite", value: stats.eliteUsers },
  ];

  const assessmentByCategory = assessments.reduce((acc: Record<string, number>, a) => {
    const cat = a.category as string;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(assessmentByCategory).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin nav */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">GrowthHQ</span>
            <Badge variant="red">Admin</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Back to App</Button>
            </Link>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-violet-600 text-violet-700 dark:text-violet-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} change={12} icon={<Users className="w-4 h-4" />} />
              <StatCard title="Pro Subscribers" value={stats.proUsers} change={8} icon={<Crown className="w-4 h-4" />} />
              <StatCard title="Total Assessments" value={stats.totalAssessments} change={24} icon={<BarChart3 className="w-4 h-4" />} />
              <StatCard title="Avg Assessment Score" value={`${stats.avgScore}/100`} change={3} icon={<TrendingUp className="w-4 h-4" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription breakdown */}
              <Card>
                <CardHeader><CardTitle>Subscription Breakdown</CardTitle></CardHeader>
                <div className="flex items-center gap-6">
                  <PieChart width={160} height={160}>
                    <Pie data={tierData} cx={75} cy={75} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {tierData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div className="space-y-3">
                    {tierData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-sm text-slate-700 dark:text-slate-300 w-12">{d.name}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{d.value}</span>
                        <span className="text-xs text-slate-400">
                          ({stats.totalUsers > 0 ? Math.round((d.value / stats.totalUsers) * 100) : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Assessments by category */}
              <Card>
                <CardHeader><CardTitle>Assessments by Category</CardTitle></CardHeader>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData.length > 0 ? categoryData : [
                    { name: "Communication", count: 124 }, { name: "Leadership", count: 98 },
                    { name: "Sales", count: 87 }, { name: "Confidence", count: 76 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </motion.div>
        )}

        {/* USERS */}
        {activeTab === "Users" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="max-w-md"
              />
              <Button variant="outline" size="md" icon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>

            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {["User", "Email", "Plan", "XP", "Streak", "Joined", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredUsers.length > 0 ? filteredUsers : [
                      { id: "1", full_name: "Marcus Thompson", email: "marcus@example.com", subscription_tier: "pro", xp_points: 8420, streak_days: 45, created_at: "2024-01-15" },
                      { id: "2", full_name: "Sarah Chen", email: "sarah@example.com", subscription_tier: "elite", xp_points: 12340, streak_days: 30, created_at: "2024-01-10" },
                      { id: "3", full_name: "David Okafor", email: "david@example.com", subscription_tier: "free", xp_points: 1200, streak_days: 5, created_at: "2024-02-01" },
                    ]).map((user: Record<string, unknown>) => (
                      <tr key={user.id as string} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.full_name as string} size="sm" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {(user.full_name as string) || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.email as string}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              user.subscription_tier === "elite" ? "yellow" :
                              user.subscription_tier === "pro" ? "violet" : "default"
                            }
                          >
                            {(user.subscription_tier as string) || "free"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {((user.xp_points as number) || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-orange-500 font-medium">
                          🔥 {(user.streak_days as number) || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                          {user.created_at ? new Date(user.created_at as string).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* CONTENT */}
        {activeTab === "Content" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <Button variant="gradient" size="sm" icon={<Settings className="w-4 h-4" />}>
                  Upload Content
                </Button>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Courses", value: "24", icon: "📚" },
                  { label: "Total Assessments", value: "7", icon: "🎯" },
                  { label: "Templates", value: "12", icon: "📋" },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* SETTINGS */}
        {activeTab === "Settings" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader><CardTitle>Platform Settings</CardTitle></CardHeader>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <p>Configure platform-wide settings, announcements, feature flags, and integrations.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "AI Model Configuration", "Email Templates", "Feature Flags",
                    "Announcement Banner", "Maintenance Mode", "Analytics Integration",
                  ].map((setting) => (
                    <button
                      key={setting}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">{setting}</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg] text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
