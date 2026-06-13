"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Avatar } from "@/components/ui/Avatar";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { Plus, Flame, Trophy, BookOpen, Smile, Frown, Meh, Star, Calendar, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOOD_DATA = [
  { day: "Mon", mood: 7, confidence: 6 }, { day: "Tue", mood: 8, confidence: 7 },
  { day: "Wed", mood: 6, confidence: 6 }, { day: "Thu", mood: 9, confidence: 8 },
  { day: "Fri", mood: 8, confidence: 9 }, { day: "Sat", mood: 7, confidence: 7 },
  { day: "Sun", mood: 9, confidence: 8 },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", name: "7-Day Streak", desc: "Complete 7 days in a row", earned: true, xp: 100 },
  { emoji: "🎯", name: "First Assessment", desc: "Complete your first skill assessment", earned: true, xp: 50 },
  { emoji: "🧠", name: "AI Veteran", desc: "Chat with AI coach 10+ times", earned: true, xp: 75 },
  { emoji: "📚", name: "Bookworm", desc: "Complete a full learning course", earned: false, xp: 150 },
  { emoji: "👑", name: "Top 10%", desc: "Reach the top 10% growth score", earned: false, xp: 200 },
  { emoji: "💬", name: "Communicator", desc: "Score 80+ on communication assessment", earned: false, xp: 100 },
  { emoji: "🚀", name: "Streak Master", desc: "Maintain a 30-day streak", earned: false, xp: 250 },
  { emoji: "⭐", name: "Elite Performer", desc: "Reach level 10", earned: false, xp: 500 },
  { emoji: "🤝", name: "Community Pillar", desc: "Help 10 community members", earned: false, xp: 150 },
];

const HABITS_DEFAULT = [
  { id: 1, name: "Morning Reflection", category: "mindset", streak: 12, completed: true, emoji: "🌅" },
  { id: 2, name: "Read 20 Minutes", category: "learning", streak: 7, completed: false, emoji: "📖" },
  { id: 3, name: "Practice Active Listening", category: "communication", streak: 5, completed: true, emoji: "👂" },
  { id: 4, name: "Leadership Exercise", category: "leadership", streak: 3, completed: false, emoji: "🎯" },
  { id: 5, name: "Gratitude Journal", category: "mindset", streak: 21, completed: true, emoji: "✏️" },
];

const TABS = ["Overview", "Habits", "Journal", "Achievements"];

export default function TrackingPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [habits, setHabits] = useState(HABITS_DEFAULT);
  const [journalText, setJournalText] = useState("");
  const [mood, setMood] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [savingJournal, setSavingJournal] = useState(false);

  const toggleHabit = (id: number) => {
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, completed: !h.completed } : h));
    toast.success("Habit logged! +10 XP 🎉");
  };

  const saveJournal = async () => {
    if (!journalText.trim()) return;
    setSavingJournal(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Journal saved! AI is reflecting on your entry... 🧠");
    setJournalText("");
    setMood(0);
    setConfidence(0);
    setSavingJournal(false);
  };

  const completedToday = habits.filter((h) => h.completed).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Growth Tracking" subtitle="Track habits, mood, milestones, and achievements" />
      <div className="flex-1 overflow-y-auto">

        {/* Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-brand-600 text-brand-700 dark:text-brand-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">

          {/* OVERVIEW TAB */}
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { emoji: "🔥", label: "Current Streak", value: "12 days" },
                  { emoji: "✅", label: "Habits Today", value: `${completedToday}/${habits.length}` },
                  { emoji: "📓", label: "Journal Entries", value: "23" },
                  { emoji: "🏆", label: "Achievements", value: "3/9" },
                ].map((s) => (
                  <Card key={s.label} className="text-center">
                    <span className="text-3xl mb-2 block">{s.emoji}</span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </Card>
                ))}
              </div>

              {/* Mood chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Mood & Confidence This Week</CardTitle>
                  <Badge variant="green" dot>Updated daily</Badge>
                </CardHeader>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={MOOD_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="mood" stroke="#c4622d" strokeWidth={2.5} dot={{ fill: "#c4622d", r: 4 }} name="Mood" />
                    <Line type="monotone" dataKey="confidence" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} name="Confidence" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Weekly review */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Review</CardTitle>
                  <Badge variant="brand">Week 12</Badge>
                </CardHeader>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Wins This Week", items: ["Completed communication assessment", "7-day streak maintained", "Finished 2 learning modules"], color: "emerald" },
                    { label: "Challenges", items: ["Struggled with deep focus sessions", "Missed 2 habit days"], color: "amber" },
                    { label: "Focus Next Week", items: ["Start leadership course", "Daily AI coaching session", "Retake sales assessment"], color: "brand" },
                  ].map((section) => (
                    <div key={section.label}>
                      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">{section.label}</h4>
                      <ul className="space-y-1.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <span className={`w-1.5 h-1.5 rounded-full bg-${section.color}-500 shrink-0 mt-1.5`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* HABITS TAB */}
          {activeTab === "Habits" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Today&apos;s Habits</h2>
                  <p className="text-sm text-slate-500">{completedToday} of {habits.length} completed</p>
                </div>
                <Button variant="gradient" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Add Habit
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Progress value={(completedToday / habits.length) * 100} size="md" gradient className="flex-1" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {Math.round((completedToday / habits.length) * 100)}%
                </span>
              </div>

              <div className="space-y-3">
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    layout
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                      habit.completed
                        ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700"
                    )}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      habit.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600"
                    )}>
                      {habit.completed && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xl">{habit.emoji}</span>
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium text-sm",
                        habit.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"
                      )}>
                        {habit.name}
                      </p>
                      <p className="text-xs text-slate-400">{habit.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-medium text-sm shrink-0">
                      <Flame className="w-4 h-4" />
                      {habit.streak}d
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* JOURNAL TAB */}
          {activeTab === "Journal" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">New Entry</h3>

                {/* Mood selector */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mood</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMood(n)}
                        className={cn(
                          "w-8 h-8 rounded-full text-xs font-bold transition-all",
                          mood === n ? "bg-brand-600 text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Confidence</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setConfidence(n)}
                        className={cn(
                          "w-8 h-8 rounded-full text-xs font-bold transition-all",
                          confidence === n ? "bg-cyan-600 text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-100"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="What did you learn today? What challenged you? What are you proud of?"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  rows={6}
                  className="mb-4"
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">AI will generate a personalized reflection after saving</p>
                  <Button
                    variant="gradient"
                    size="md"
                    onClick={saveJournal}
                    loading={savingJournal}
                    disabled={!journalText.trim()}
                  >
                    Save Entry
                  </Button>
                </div>
              </Card>

              {/* Past entries */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Past Entries</h3>
                <div className="space-y-3">
                  {[
                    { date: "Yesterday", mood: 8, content: "Practiced active listening in my 1:1 with my manager. Really focused on not interrupting.", ai_reflection: "Great intentionality! Active listening is the foundation of strong leadership..." },
                    { date: "2 days ago", mood: 7, content: "Worked on presentation skills. Still nervous but AI coach gave great tips.", ai_reflection: "Nervous energy is normal and can be harnessed. Your self-awareness is growing..." },
                  ].map((entry, i) => (
                    <Card key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">{entry.date}</span>
                        <Badge variant="brand">Mood: {entry.mood}/10</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{entry.content}</p>
                      <div className="bg-brand-50 dark:bg-brand-900/15 rounded-xl p-3 border border-brand-100 dark:border-brand-800/30">
                        <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">🧠 AI Reflection</p>
                        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">{entry.ai_reflection}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "Achievements" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Achievements</h2>
                  <p className="text-sm text-slate-500">3 of 9 earned</p>
                </div>
                <Progress value={33} size="md" gradient className="w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div
                    key={ach.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={cn(
                      "text-center transition-all",
                      ach.earned
                        ? "border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10"
                        : "opacity-60"
                    )}>
                      <div className={cn(
                        "text-4xl mb-3 block",
                        !ach.earned && "grayscale"
                      )}>
                        {ach.emoji}
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{ach.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{ach.desc}</p>
                      <Badge variant={ach.earned ? "yellow" : "default"}>
                        +{ach.xp} XP
                      </Badge>
                      {ach.earned && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" /> Earned
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
