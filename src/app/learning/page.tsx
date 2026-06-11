"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { Search, BookOpen, Play, Clock, Star, Filter, Bookmark, ChevronRight, Lock, Headphones, FileText, Zap } from "lucide-react";

const CATEGORIES = ["All", "Communication", "Leadership", "Sales", "Productivity", "Confidence", "EQ", "Business"];

const CONTENT_TYPES = [
  { id: "course", label: "Courses", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "video", label: "Videos", icon: <Play className="w-3.5 h-3.5" /> },
  { id: "audio", label: "Audio", icon: <Headphones className="w-3.5 h-3.5" /> },
  { id: "template", label: "Templates", icon: <FileText className="w-3.5 h-3.5" /> },
];

const COURSES = [
  {
    id: 1, title: "Executive Communication Mastery", category: "Communication",
    emoji: "💬", instructor: "Atlas AI", duration: "4.5 hrs", lessons: 24,
    rating: 4.9, enrolled: 3200, level: "Intermediate", progress: 67, isPremium: false,
    description: "Master the art of clear, compelling communication that commands attention and builds trust.",
  },
  {
    id: 2, title: "High-Performance Leadership", category: "Leadership",
    emoji: "🎯", instructor: "Atlas AI", duration: "6 hrs", lessons: 32,
    rating: 4.8, enrolled: 2800, level: "Advanced", progress: 34, isPremium: false,
    description: "Develop the mindset and skills of elite leaders who inspire, align, and drive results.",
  },
  {
    id: 3, title: "Sales Psychology & Closing", category: "Sales",
    emoji: "📈", instructor: "Atlas AI", duration: "5 hrs", lessons: 28,
    rating: 4.9, enrolled: 4100, level: "Intermediate", progress: 20, isPremium: false,
    description: "Understand buyer psychology and master the consultative selling framework that closes deals.",
  },
  {
    id: 4, title: "Unshakeable Confidence", category: "Confidence",
    emoji: "⚡", instructor: "Atlas AI", duration: "3 hrs", lessons: 18,
    rating: 4.7, enrolled: 5600, level: "Beginner", progress: 0, isPremium: false,
    description: "Build rock-solid self-belief and overcome the mental blocks holding you back from greatness.",
  },
  {
    id: 5, title: "Deep Work & Peak Productivity", category: "Productivity",
    emoji: "🚀", instructor: "Atlas AI", duration: "3.5 hrs", lessons: 20,
    rating: 4.8, enrolled: 3900, level: "Intermediate", progress: 0, isPremium: true,
    description: "Master the art of deep focus and high-output work in a world of endless distractions.",
  },
  {
    id: 6, title: "Emotional Intelligence for Leaders", category: "EQ",
    emoji: "🧠", instructor: "Atlas AI", duration: "4 hrs", lessons: 22,
    rating: 4.9, enrolled: 2400, level: "Advanced", progress: 0, isPremium: true,
    description: "Develop the emotional awareness and empathy that distinguishes great leaders from good ones.",
  },
  {
    id: 7, title: "Strategic Business Thinking", category: "Business",
    emoji: "💼", instructor: "Atlas AI", duration: "5.5 hrs", lessons: 30,
    rating: 4.7, enrolled: 1800, level: "Advanced", progress: 0, isPremium: true,
    description: "Build the strategic mindset and business acumen to navigate complex organizations and markets.",
  },
  {
    id: 8, title: "Public Speaking Mastery", category: "Communication",
    emoji: "🎤", instructor: "Atlas AI", duration: "4 hrs", lessons: 22,
    rating: 4.8, enrolled: 6200, level: "Beginner", progress: 0, isPremium: false,
    description: "Go from nervous presenter to captivating speaker with proven techniques and AI practice.",
  },
];

const TEMPLATES = [
  { title: "90-Day Leadership Plan", category: "Leadership", emoji: "📋", type: "template" },
  { title: "Weekly Review Framework", category: "Productivity", emoji: "📊", type: "template" },
  { title: "Sales Call Script", category: "Sales", emoji: "📞", type: "template" },
  { title: "Communication Style Guide", category: "Communication", emoji: "💬", type: "template" },
];

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("course");

  const filtered = COURSES.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const levelColor: Record<string, string> = {
    Beginner: "green",
    Intermediate: "yellow",
    Advanced: "violet",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Learning Hub" subtitle="Courses, micro-lessons, templates, and playbooks" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search courses, templates, resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <div className="flex gap-2">
              {CONTENT_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={activeType === type.id ? "primary" : "outline"}
                  size="sm"
                  icon={type.icon}
                  onClick={() => setActiveType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* In progress */}
          {search === "" && activeCategory === "All" && (
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>Continue Learning</span>
                <Badge variant="violet">{COURSES.filter((c) => c.progress > 0).length} active</Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {COURSES.filter((c) => c.progress > 0).map((course, i) => (
                  <CourseCard key={course.id} course={course} levelColor={levelColor} compact />
                ))}
              </div>
            </div>
          )}

          {/* All courses */}
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              {activeCategory === "All" ? "All Courses" : activeCategory} ({filtered.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} levelColor={levelColor} />
              ))}
            </div>
          </div>

          {/* Templates section */}
          {(activeCategory === "All" || activeType === "template") && (
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Templates & Playbooks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TEMPLATES.map((t, i) => (
                  <Card key={i} hover className="card-hover cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{t.emoji}</span>
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400">{t.category}</p>
                    <Button variant="ghost" size="sm" className="mt-3 w-full justify-center text-violet-600 hover:bg-violet-50">
                      Download Free
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, levelColor, compact }: { course: typeof COURSES[0]; levelColor: Record<string, string>; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="group cursor-pointer hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-slate-900/50 h-full flex flex-col">
        {/* Thumbnail area */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10 flex items-center justify-center mb-4 aspect-video">
          <span className="text-5xl">{course.emoji}</span>
          {course.isPremium && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-amber-500/90 backdrop-blur rounded-lg text-white text-[10px] font-semibold">
              <Lock className="w-2.5 h-2.5" /> PRO
            </div>
          )}
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
              <div className="h-full bg-violet-500" style={{ width: `${course.progress}%` }} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <Badge variant={levelColor[course.level] as "green" | "yellow" | "violet"}>{course.level}</Badge>
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {course.title}
        </h3>

        {!compact && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 flex-1 leading-relaxed">
            {course.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
          <span>{course.lessons} lessons</span>
        </div>

        {course.progress > 0 ? (
          <div>
            <Progress value={course.progress} size="sm" gradient className="mb-2" />
            <span className="text-xs text-slate-500">{course.progress}% complete</span>
          </div>
        ) : (
          <Button
            variant={course.isPremium ? "outline" : "gradient"}
            size="sm"
            className="w-full justify-center mt-auto"
            iconRight={<ChevronRight className="w-3.5 h-3.5" />}
            icon={course.isPremium ? <Lock className="w-3.5 h-3.5" /> : undefined}
          >
            {course.isPremium ? "Upgrade to Unlock" : "Start Course"}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
