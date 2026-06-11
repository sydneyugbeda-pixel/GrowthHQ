"use client";

import { motion } from "framer-motion";
import {
  Flame, Zap, Target, BookOpen, TrendingUp, Trophy,
  MessageSquare, Calendar, ChevronRight, Sparkles, Plus,
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { TopBar } from "@/components/shared/TopBar";
import { calculateLevel, xpProgress, xpForNextLevel, formatRelativeTime, GROWTH_CATEGORIES } from "@/lib/utils";

const MOCK_GROWTH_DATA = [
  { week: "W1", score: 62 }, { week: "W2", score: 68 }, { week: "W3", score: 71 },
  { week: "W4", score: 75 }, { week: "W5", score: 72 }, { week: "W6", score: 80 },
  { week: "W7", score: 85 }, { week: "W8", score: 88 },
];

const MOCK_RADAR_DATA = [
  { subject: "Communication", A: 82 }, { subject: "Leadership", A: 71 },
  { subject: "Sales", A: 65 }, { subject: "Confidence", A: 88 },
  { subject: "Productivity", A: 74 }, { subject: "EQ", A: 79 },
];

const MOCK_AI_INSIGHTS = [
  "Your communication score jumped 12% this week — keep practicing active listening!",
  "You've been consistent for 3 weeks. That puts you in the top 15% of users.",
  "Leadership assessment due. Based on your activity, you're ready for the next level.",
];

interface DashboardClientProps {
  user: Record<string, unknown> | null;
  assessments: Record<string, unknown>[];
  journalEntries: Record<string, unknown>[];
  habits: Record<string, unknown>[];
  achievements: Record<string, unknown>[];
}

export function DashboardClient({ user, assessments, journalEntries, habits, achievements }: DashboardClientProps) {
  const name = (user?.full_name as string) || "Growth Seeker";
  const xp = (user?.xp_points as number) || 0;
  const streak = (user?.streak_days as number) || 0;
  const level = calculateLevel(xp);
  const xpPct = xpProgress(xp);
  const nextLvlXp = xpForNextLevel(level);
  const currentLvlXp = xpForNextLevel(level - 1);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={`${greeting}, ${name.split(" ")[0]} 👋`}
        subtitle="Here's your growth command center"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">

          {/* Stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Growth Score"
              value={`${Math.min(850, xp > 0 ? Math.floor(xp / 5) : 742)}`}
              change={12}
              description="vs last week"
              icon={<Zap className="w-4 h-4" />}
              gradient="linear-gradient(135deg, #7c3aed, #4f46e5)"
            />
            <Card className="flex flex-col">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Day Streak</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white flame-animate">{streak || 7}</span>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Keep it up!</p>
            </Card>
            <StatCard
              title="XP Points"
              value={xp > 0 ? xp.toLocaleString() : "4,230"}
              change={8}
              description="gained this week"
              icon={<Trophy className="w-4 h-4" />}
            />
            <Card className="flex flex-col">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Level {level}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{Math.floor(xpPct)}%</span>
                <span className="text-xs text-slate-500">to next</span>
              </div>
              <Progress value={xpPct} size="sm" gradient />
              <p className="text-xs text-slate-400 mt-1.5">{(xp || 4230) - currentLvlXp} / {nextLvlXp - currentLvlXp} XP</p>
            </Card>
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Growth chart */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Growth Trajectory</CardTitle>
                    <CardDescription>Your overall score over the past 8 weeks</CardDescription>
                  </div>
                  <Badge variant="green" dot>Trending up</Badge>
                </CardHeader>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MOCK_GROWTH_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }}
                      itemStyle={{ color: "#7c3aed" }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} fill="url(#growthGrad)" dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Skill radar */}
            <motion.div variants={fadeUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                </CardHeader>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={MOCK_RADAR_DATA}>
                    <PolarGrid stroke="rgba(148,163,184,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* AI Insights */}
            <motion.div variants={fadeUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <CardTitle>AI Insights</CardTitle>
                  </div>
                  <Badge variant="violet">New</Badge>
                </CardHeader>
                <div className="space-y-3">
                  {MOCK_AI_INSIGHTS.map((insight, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/15 border border-violet-100 dark:border-violet-800/30">
                      <span className="text-lg shrink-0">{["💡", "🎯", "📊"][i]}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
                <Link href="/coach" className="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline">
                  Talk to AI Coach <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </motion.div>

            {/* Habits */}
            <motion.div variants={fadeUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Daily Habits</CardTitle>
                  <Button variant="ghost" size="icon" icon={<Plus className="w-4 h-4" />} />
                </CardHeader>
                <div className="space-y-2.5">
                  {(habits.length > 0 ? habits : [
                    { name: "Morning reflection", streak: 5, completed: true },
                    { name: "Read 20 min", streak: 12, completed: false },
                    { name: "Practice active listening", streak: 3, completed: true },
                    { name: "Leadership exercise", streak: 7, completed: false },
                  ]).map((habit: Record<string, unknown>, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        habit.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600"
                      }`}>
                        {!!habit.completed && <span className="text-white text-[10px]">✓</span>}
                      </button>
                      <span className={`flex-1 text-sm ${habit.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {habit.name as string}
                      </span>
                      <span className="text-xs text-orange-500 font-medium shrink-0">
                        🔥{(habit.streak as number) || 0}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>2/4 completed today</span>
                  <Link href="/tracking" className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={fadeUp}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { emoji: "🔥", name: "7-Day Streak", earned: true },
                    { emoji: "🎯", name: "First Assessment", earned: true },
                    { emoji: "🧠", name: "AI Veteran", earned: true },
                    { emoji: "📚", name: "Bookworm", earned: false },
                    { emoji: "👑", name: "Top 10%", earned: false },
                    { emoji: "💬", name: "Communicator", earned: false },
                  ].map((ach, i) => (
                    <div key={i} className={`flex flex-col items-center p-3 rounded-xl text-center ${
                      ach.earned
                        ? "bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-700/30"
                        : "bg-slate-50 dark:bg-slate-800/50 opacity-50"
                    }`}>
                      <span className="text-2xl mb-1">{ach.emoji}</span>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-tight">{ach.name}</span>
                    </div>
                  ))}
                </div>
                <Link href="/tracking#achievements" className="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline">
                  All achievements <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </motion.div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Journal */}
            <motion.div variants={fadeUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Journal</CardTitle>
                  <Link href="/tracking#journal">
                    <Button variant="ghost" size="sm" iconRight={<ChevronRight className="w-3.5 h-3.5" />}>
                      View all
                    </Button>
                  </Link>
                </CardHeader>
                <div className="space-y-3">
                  {(journalEntries.length > 0 ? journalEntries : [
                    { content: "Today I practiced active listening in my 1:1 with my manager. I noticed I was able to ask better follow-up questions.", created_at: new Date().toISOString(), mood: 8, confidence: 7 },
                    { content: "Worked on my presentation skills. Still nervous but getting better. The AI coach gave me great tips on body language.", created_at: new Date(Date.now() - 86400000).toISOString(), mood: 7, confidence: 6 },
                  ]).slice(0, 2).map((entry: Record<string, unknown>, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2 mb-2">
                        {entry.content as string}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{formatRelativeTime(entry.created_at as string)}</span>
                        <span>Mood: {entry.mood as number}/10</span>
                        <span>Confidence: {entry.confidence as number}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/tracking">
                  <Button variant="outline" size="sm" className="w-full mt-4 justify-center" icon={<Plus className="w-4 h-4" />}>
                    New journal entry
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Learning progress */}
            <motion.div variants={fadeUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Active Learning</CardTitle>
                  <Link href="/learning">
                    <Button variant="ghost" size="sm" iconRight={<ChevronRight className="w-3.5 h-3.5" />}>
                      View all
                    </Button>
                  </Link>
                </CardHeader>
                <div className="space-y-4">
                  {[
                    { title: "Executive Communication Mastery", progress: 67, category: "Communication", emoji: "💬" },
                    { title: "High-Performance Leadership", progress: 34, category: "Leadership", emoji: "🎯" },
                    { title: "Sales Psychology & Closing", progress: 20, category: "Sales", emoji: "📈" },
                  ].map((course, i) => (
                    <Link key={i} href="/learning" className="block group">
                      <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center text-xl shrink-0">
                          {course.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Progress value={course.progress} size="sm" className="flex-1" gradient />
                            <span className="text-xs text-slate-400 shrink-0">{course.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
