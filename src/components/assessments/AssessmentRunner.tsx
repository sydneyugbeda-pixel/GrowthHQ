"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { type AssessmentDef } from "@/data/assessments";
import { toast } from "sonner";

interface AssessmentRunnerProps {
  assessment: AssessmentDef;
  userId: string;
  onComplete: (result: { score: number; insights: string; recommendations: string[]; category: string }) => void;
  onBack: () => void;
}

export function AssessmentRunner({ assessment, userId, onComplete, onBack }: AssessmentRunnerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = assessment.questions[currentQ];
  const total = assessment.questions.length;
  const progress = ((currentQ) / total) * 100;
  const currentAnswer = answers[question.id];

  const goNext = async () => {
    if (currentQ < total - 1) {
      setDirection(1);
      setCurrentQ((q) => q + 1);
    } else {
      await submit();
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: assessment.id, answers, userId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onComplete({ ...data, category: assessment.id });
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ChevronLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {assessment.emoji} {assessment.title}
            </span>
            <span className="text-xs text-slate-500">{currentQ + 1} / {total}</span>
          </div>
          <Progress value={progress} size="sm" gradient />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQ}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-3">
                  Question {currentQ + 1}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {question.text}
                </h2>
              </div>

              <div className="space-y-2.5">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [question.id]: option.value }));
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150 hover:-translate-y-0.5",
                      currentAnswer === option.value
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0",
                      currentAnswer === option.value
                        ? "border-violet-500 bg-violet-500 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-500"
                    )}>
                      {option.value}
                    </div>
                    <span className={cn(
                      "font-medium text-sm",
                      currentAnswer === option.value
                        ? "text-violet-700 dark:text-violet-300"
                        : "text-slate-700 dark:text-slate-300"
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={goPrev}
          disabled={currentQ === 0}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <Button
          variant="gradient"
          size="md"
          onClick={goNext}
          disabled={!currentAnswer || submitting}
          iconRight={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
        >
          {currentQ === total - 1 ? "Submit & Get Results" : "Next"}
        </Button>
      </div>
    </div>
  );
}
