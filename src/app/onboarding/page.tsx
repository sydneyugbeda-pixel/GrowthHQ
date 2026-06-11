"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight, ChevronLeft, Check, Zap, Sparkles, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { GROWTH_CATEGORIES } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 6;

const CAREER_STAGES = [
  { id: "student", label: "Student / Recent Grad", emoji: "🎓" },
  { id: "early", label: "Early Career (0-3 yrs)", emoji: "🌱" },
  { id: "mid", label: "Mid-Level (3-8 yrs)", emoji: "📈" },
  { id: "senior", label: "Senior / Lead (8+ yrs)", emoji: "⭐" },
  { id: "executive", label: "Executive / C-Suite", emoji: "🏆" },
  { id: "entrepreneur", label: "Entrepreneur / Founder", emoji: "🚀" },
];

const SKILL_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just getting started with intentional growth", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "Some experience with self-development", emoji: "📗" },
  { id: "advanced", label: "Advanced", desc: "Actively working on growth skills", emoji: "⚡" },
  { id: "expert", label: "Expert", desc: "Experienced, want to sharpen edges", emoji: "🎯" },
];

const CHALLENGES = [
  "Communicating ideas clearly",
  "Building confidence in presentations",
  "Managing difficult conversations",
  "Leading and motivating teams",
  "Closing deals in sales",
  "Managing time and productivity",
  "Building executive presence",
  "Navigating career transitions",
  "Building emotional resilience",
  "Scaling a business",
];

const GOALS = [
  "Get promoted to leadership",
  "Build a successful business",
  "Become a top sales performer",
  "Improve public speaking",
  "Develop executive presence",
  "Build high-performing teams",
  "Increase confidence and mindset",
  "Become a better communicator",
  "Grow my professional network",
  "Achieve work-life balance",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<{ roadmap: string; weeklyFocus: string } | null>(null);

  const [data, setData] = useState({
    careerStage: "",
    skillLevel: "",
    focusAreas: [] as string[],
    goals: [] as string[],
    challenges: [] as string[],
    bio: "",
  });

  const toggleItem = (field: "focusAreas" | "goals" | "challenges", value: string) => {
    setData((d) => {
      const arr = d[field];
      return {
        ...d,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const canProceed = () => {
    if (step === 0) return !!data.careerStage;
    if (step === 1) return !!data.skillLevel;
    if (step === 2) return data.focusAreas.length > 0;
    if (step === 3) return data.goals.length > 0;
    if (step === 4) return data.challenges.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setRoadmap(result);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("growth_profiles").upsert({
          user_id: user.id,
          goals: data.goals,
          challenges: data.challenges,
          skill_level: data.skillLevel,
          career_background: data.careerStage,
          focus_areas: data.focusAreas,
          growth_roadmap: result.roadmap,
          weekly_focus: result.weeklyFocus,
        });
        await supabase.from("users").update({ onboarding_complete: true }).eq("id", user.id);
      }
      setStep(5);
    } catch {
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const steps = [
    { title: "Your background", subtitle: "Help us understand where you are in your journey" },
    { title: "Your skill level", subtitle: "How experienced are you with intentional growth?" },
    { title: "Focus areas", subtitle: "Which dimensions do you most want to develop?" },
    { title: "Your goals", subtitle: "What do you want to achieve?" },
    { title: "Your challenges", subtitle: "What's currently holding you back?" },
    { title: "Your roadmap is ready!", subtitle: "AI has built your personalized growth plan" },
  ];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (step === 4) { handleGenerate(); return; }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 dark:from-slate-950 dark:to-violet-950/20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">GrowthHQ</span>
        </div>
        {step < 5 && (
          <div className="flex items-center gap-3">
            <Progress value={(step / (TOTAL_STEPS - 1)) * 100} size="sm" className="w-24 sm:w-40" gradient />
            <span className="text-sm text-slate-500">{step + 1} / {TOTAL_STEPS}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Step header */}
          <div className="text-center mb-8">
            <motion.h1
              key={step}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2"
            >
              {steps[step].title}
            </motion.h1>
            <motion.p
              key={`sub-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400"
            >
              {steps[step].subtitle}
            </motion.p>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Step 0: Career stage */}
              {step === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {CAREER_STAGES.map((stage) => (
                    <SelectCard
                      key={stage.id}
                      emoji={stage.emoji}
                      label={stage.label}
                      selected={data.careerStage === stage.id}
                      onClick={() => setData((d) => ({ ...d, careerStage: stage.id }))}
                    />
                  ))}
                </div>
              )}

              {/* Step 1: Skill level */}
              {step === 1 && (
                <div className="space-y-3">
                  {SKILL_LEVELS.map((level) => (
                    <SelectCard
                      key={level.id}
                      emoji={level.emoji}
                      label={level.label}
                      description={level.desc}
                      selected={data.skillLevel === level.id}
                      onClick={() => setData((d) => ({ ...d, skillLevel: level.id }))}
                      horizontal
                    />
                  ))}
                </div>
              )}

              {/* Step 2: Focus areas */}
              {step === 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GROWTH_CATEGORIES.map((cat) => (
                    <SelectCard
                      key={cat.id}
                      emoji={cat.emoji}
                      label={cat.label}
                      selected={data.focusAreas.includes(cat.id)}
                      onClick={() => toggleItem("focusAreas", cat.id)}
                      multi
                    />
                  ))}
                </div>
              )}

              {/* Step 3: Goals */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOALS.map((goal) => (
                    <ChipButton
                      key={goal}
                      label={goal}
                      selected={data.goals.includes(goal)}
                      onClick={() => toggleItem("goals", goal)}
                    />
                  ))}
                </div>
              )}

              {/* Step 4: Challenges */}
              {step === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHALLENGES.map((ch) => (
                    <ChipButton
                      key={ch}
                      label={ch}
                      selected={data.challenges.includes(ch)}
                      onClick={() => toggleItem("challenges", ch)}
                    />
                  ))}
                </div>
              )}

              {/* Step 5: Roadmap */}
              {step === 5 && (
                <div className="space-y-4">
                  {generating ? (
                    <div className="flex flex-col items-center py-12 gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                        <Loader2 className="w-7 h-7 text-white animate-spin" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Building your personalized growth roadmap...</p>
                      <p className="text-sm text-slate-400">This takes about 10 seconds</p>
                    </div>
                  ) : roadmap ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-violet-500 fill-violet-500" />
                          <h3 className="font-semibold text-slate-900 dark:text-white">Your Growth Roadmap</h3>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {roadmap.roadmap}
                        </p>
                      </div>
                      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200 dark:border-violet-800/50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-violet-600 fill-violet-500" />
                          <h3 className="font-semibold text-violet-800 dark:text-violet-300">This Week&apos;s Focus</h3>
                        </div>
                        <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                          {roadmap.weeklyFocus}
                        </p>
                      </div>
                      <Button
                        variant="gradient"
                        size="lg"
                        className="w-full justify-center"
                        onClick={() => router.push("/dashboard")}
                        iconRight={<ChevronRight className="w-5 h-5" />}
                      >
                        Go to my Dashboard
                      </Button>
                    </>
                  ) : null}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && !generating && (
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                size="md"
                onClick={goBack}
                disabled={step === 0}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant={step === 4 ? "gradient" : "primary"}
                size="md"
                onClick={goNext}
                disabled={!canProceed()}
                iconRight={step === 4 ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              >
                {step === 4 ? "Generate My Roadmap" : "Continue"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectCard({
  emoji, label, description, selected, onClick, multi, horizontal,
}: {
  emoji: string; label: string; description?: string; selected: boolean;
  onClick: () => void; multi?: boolean; horizontal?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
        horizontal ? "flex-row items-center" : "flex-col items-center text-center",
        selected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700"
      )}
    >
      {multi && selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      <span className={horizontal ? "text-2xl shrink-0" : "text-3xl mb-1"}>{emoji}</span>
      <div>
        <span className={cn(
          "block font-medium text-sm",
          selected ? "text-violet-700 dark:text-violet-300" : "text-slate-800 dark:text-slate-200"
        )}>
          {label}
        </span>
        {description && (
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</span>
        )}
      </div>
    </button>
  );
}

function ChipButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all duration-150",
        selected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700"
      )}
    >
      {selected && <Check className="w-4 h-4 shrink-0 text-violet-600" />}
      <span>{label}</span>
    </button>
  );
}
