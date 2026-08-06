"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Plus, Flame, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Habit = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  streak: number;
  completed_today: boolean;
};

type JournalEntry = {
  id: string;
  content: string;
  mood: number | null;
  confidence: number | null;
  ai_reflection: string | null;
  created_at: string;
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned: boolean;
};

type MoodPoint = { day: string; mood: number | null; confidence: number | null };

interface Props {
  userId: string;
  initialHabits: Habit[];
  initialJournalEntries: JournalEntry[];
  achievements: Achievement[];
  userStats: { streak_days: number; xp_points: number };
  journalCount: number;
  moodData: MoodPoint[];
}

const TABS = ["Overview", "Habits", "Journal", "Achievements"];

export function TrackingClient({ userId, initialHabits, initialJournalEntries, achievements, userStats, journalCount, moodData }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [journalText, setJournalText] = useState("");
  const [mood, setMood] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [savingJournal, setSavingJournal] = useState(false);
  const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("⭐");
  const [newHabitCategory, setNewHabitCategory] = useState("mindset");
  const [addingHabit, setAddingHabit] = useState(false);

  const completedToday = habits.filter((h) => h.completed_today).length;
  const supabase = createClient();

  const toggleHabit = async (habit: Habit) => {
    setTogglingHabit(habit.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (habit.completed_today) {
      await supabase.from("habit_logs").delete()
        .eq("habit_id", habit.id)
        .eq("user_id", userId)
        .gte("completed_at", today.toISOString())
        .lt("completed_at", tomorrow.toISOString());
      setHabits((prev) => prev.map((h) => h.id === habit.id ? { ...h, completed_today: false } : h));
      toast("Habit unchecked");
    } else {
      await supabase.from("habit_logs").insert({ habit_id: habit.id, user_id: userId });
      setHabits((prev) => prev.map((h) => h.id === habit.id ? { ...h, completed_today: true, streak: h.streak + 1 } : h));
      toast.success("Habit logged! +10 XP 🎉");
    }
    setTogglingHabit(null);
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    setAddingHabit(true);
    const { data, error } = await supabase.from("habits").insert({
      user_id: userId,
      name: newHabitName.trim(),
      emoji: newHabitEmoji,
      category: newHabitCategory,
    }).select().single();

    if (error) { toast.error("Failed to add habit"); }
    else {
      setHabits((prev) => [...prev, { ...data, completed_today: false }]);
      setNewHabitName("");
      setNewHabitEmoji("⭐");
      setNewHabitCategory("mindset");
      setShowAddHabit(false);
      toast.success("Habit added!");
    }
    setAddingHabit(false);
  };

  const saveJournal = async () => {
    if (!journalText.trim()) return;
    setSavingJournal(true);
    try {
      const res = await fetch("/api/ai/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: journalText, mood, confidence }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const newEntry: JournalEntry = {
        id: data.entryId,
        content: journalText,
        mood,
        confidence,
        ai_reflection: data.reflection,
        created_at: new Date().toISOString(),
      };
      setJournalEntries((prev) => [newEntry, ...prev]);
      setJournalText("");
      setMood(0);
      setConfidence(0);
      toast.success("Journal saved! +15 XP 🧠");
    } catch {
      toast.error("Failed to save journal entry");
    }
    setSavingJournal(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { emoji: "🔥", label: "Current Streak", value: `${userStats.streak_days} days` },
                  { emoji: "✅", label: "Habits Today", value: `${completedToday}/${habits.length}` },
                  { emoji: "📓", label: "Journal Entries", value: String(journalCount) },
                  { emoji: "🏆", label: "Achievements", value: `${achievements.filter(a => a.earned).length}/${achievements.length}` },
                ].map((s) => (
                  <Card key={s.label} className="text-center">
                    <span className="text-3xl mb-2 block">{s.emoji}</span>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mood & Confidence This Week</CardTitle>
                  <Badge variant="green" dot>From your journal</Badge>
                </CardHeader>
                {moodData.some(d => d.mood !== null) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                      <Line type="monotone" dataKey="mood" stroke="#c4622d" strokeWidth={2.5} dot={{ fill: "#c4622d", r: 4 }} name="Mood" connectNulls />
                      <Line type="monotone" dataKey="confidence" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} name="Confidence" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    Start journaling to see your mood trends here
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader><CardTitle>Today&apos;s Habits</CardTitle></CardHeader>
                {habits.length === 0 ? (
                  <p className="text-sm text-slate-500">No habits yet — add one in the Habits tab.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {habits.slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", h.completed_today ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600")}>
                          {h.completed_today && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="text-sm">{h.emoji}</span>
                        <span className={cn("text-sm flex-1", h.completed_today ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300")}>{h.name}</span>
                        <span className="text-xs text-orange-500 font-medium">🔥{h.streak}d</span>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button variant="gradient" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddHabit(true)}>
                  Add Habit
                </Button>
              </div>

              {habits.length > 0 && (
                <div className="flex items-center gap-2">
                  <Progress value={habits.length ? (completedToday / habits.length) * 100 : 0} size="md" gradient className="flex-1" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {habits.length ? Math.round((completedToday / habits.length) * 100) : 0}%
                  </span>
                </div>
              )}

              {/* Add Habit Form */}
              {showAddHabit && (
                <Card className="border-brand-200 dark:border-brand-800/40 bg-brand-50/30 dark:bg-brand-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">New Habit</h3>
                    <button onClick={() => setShowAddHabit(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Habit name"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      className="col-span-2 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <input
                      type="text"
                      placeholder="Emoji"
                      value={newHabitEmoji}
                      onChange={(e) => setNewHabitEmoji(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {["mindset", "communication", "leadership", "learning", "health", "productivity"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewHabitCategory(cat)}
                        className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-all", newHabitCategory === cat ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400")}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" onClick={addHabit} loading={addingHabit} disabled={!newHabitName.trim()}>Save Habit</Button>
                </Card>
              )}

              {habits.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="text-2xl mb-3">🌱</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No habits yet</p>
                  <p className="text-sm text-slate-500">Add your first habit to start building streaks</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      layout
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                        habit.completed_today
                          ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700"
                      )}
                      onClick={() => !togglingHabit && toggleHabit(habit)}
                    >
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", habit.completed_today ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600")}>
                        {togglingHabit === habit.id ? <Loader2 className="w-3 h-3 animate-spin text-slate-400" /> : habit.completed_today && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xl">{habit.emoji}</span>
                      <div className="flex-1">
                        <p className={cn("font-medium text-sm", habit.completed_today ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200")}>{habit.name}</p>
                        <p className="text-xs text-slate-400">{habit.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 font-medium text-sm shrink-0">
                        <Flame className="w-4 h-4" />{habit.streak}d
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* JOURNAL TAB */}
          {activeTab === "Journal" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
              <Card>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">New Entry</h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-20 shrink-0">Mood</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <button key={n} onClick={() => setMood(n)} className={cn("w-7 h-7 rounded-full text-xs font-bold transition-all", mood === n ? "bg-brand-600 text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100")}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-20 shrink-0">Confidence</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                      <button key={n} onClick={() => setConfidence(n)} className={cn("w-7 h-7 rounded-full text-xs font-bold transition-all", confidence === n ? "bg-cyan-600 text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-100")}>
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
                  <p className="text-xs text-slate-400">Atlas will generate a reflection after saving</p>
                  <Button variant="gradient" size="md" onClick={saveJournal} loading={savingJournal} disabled={!journalText.trim()}>
                    Save Entry
                  </Button>
                </div>
              </Card>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Past Entries</h3>
                {journalEntries.length === 0 ? (
                  <Card className="text-center py-8">
                    <p className="text-2xl mb-2">📓</p>
                    <p className="text-sm text-slate-500">No journal entries yet. Write your first one above!</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {journalEntries.map((entry) => (
                      <Card key={entry.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">{formatDate(entry.created_at)}</span>
                          <div className="flex gap-2">
                            {entry.mood && <Badge variant="brand">Mood: {entry.mood}/10</Badge>}
                            {entry.confidence && <Badge variant="default">Conf: {entry.confidence}/10</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{entry.content}</p>
                        {entry.ai_reflection && (
                          <div className="bg-brand-50 dark:bg-brand-900/15 rounded-xl p-3 border border-brand-100 dark:border-brand-800/30">
                            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">🧠 Atlas Reflection</p>
                            <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">{entry.ai_reflection}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "Achievements" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Achievements</h2>
                  <p className="text-sm text-slate-500">{achievements.filter(a => a.earned).length} of {achievements.length} earned</p>
                </div>
                <Progress value={achievements.length ? (achievements.filter(a => a.earned).length / achievements.length) * 100 : 0} size="md" gradient className="w-32" />
              </div>

              {achievements.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="text-2xl mb-2">🏆</p>
                  <p className="text-sm text-slate-500">Achievements will appear here as you grow</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach, i) => (
                    <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                      <Card className={cn("text-center transition-all", ach.earned ? "border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/10" : "opacity-60")}>
                        <div className={cn("text-4xl mb-3 block", !ach.earned && "grayscale")}>{ach.icon}</div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{ach.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{ach.description}</p>
                        <Badge variant={ach.earned ? "yellow" : "default"}>+{ach.xp_reward} XP</Badge>
                        {ach.earned && (
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" /> Earned
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
