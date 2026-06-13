"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/shared/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { AssessmentRunner } from "./AssessmentRunner";
import { AssessmentResult } from "./AssessmentResult";
import { ASSESSMENTS, type AssessmentDef } from "@/data/assessments";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, BarChart3, Lock } from "lucide-react";

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
  red: "bg-red-100 dark:bg-red-900/20 text-red-600",
  cyan: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600",
  yellow: "bg-amber-100 dark:bg-amber-900/20 text-amber-600",
  green: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600",
  pink: "bg-pink-100 dark:bg-pink-900/20 text-pink-600",
  orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
};

interface AssessmentsClientProps {
  assessments: Record<string, unknown>[];
  userId: string;
}

export function AssessmentsClient({ assessments, userId }: AssessmentsClientProps) {
  const [activeAssessment, setActiveAssessment] = useState<AssessmentDef | null>(null);
  const [resultData, setResultData] = useState<{ score: number; insights: string; recommendations: string[]; category: string } | null>(null);

  const getLastScore = (categoryId: string) => {
    const last = assessments.find((a) => a.category === categoryId);
    return last ? (last.score as number) : null;
  };

  if (resultData) {
    return <AssessmentResult result={resultData} onDone={() => { setResultData(null); setActiveAssessment(null); }} />;
  }

  if (activeAssessment) {
    return (
      <AssessmentRunner
        assessment={activeAssessment}
        userId={userId}
        onComplete={(result) => setResultData(result)}
        onBack={() => setActiveAssessment(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Assessments" subtitle="Measure and track your growth across 7 dimensions" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Overall progress */}
          {assessments.length > 0 && (
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Your Assessment Progress</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {ASSESSMENTS.map((a) => {
                  const score = getLastScore(a.id);
                  return (
                    <div key={a.id} className="flex flex-col items-center gap-2">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none" stroke="#c4622d" strokeWidth="3"
                            strokeDasharray={`${(score || 0) * 0.88} 88`} strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                          {score ?? "—"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 text-center leading-tight">{a.title.split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Assessment cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ASSESSMENTS.map((assessment, i) => {
              const lastScore = getLastScore(assessment.id);
              const isLocked = i >= 2 && false; // all unlocked in demo

              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="h-full flex flex-col card-hover" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", colorMap[assessment.color])}>
                        {assessment.emoji}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">{assessment.duration}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">{assessment.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">
                      {assessment.description}
                    </p>

                    {lastScore !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500">Last score</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{lastScore}/100</span>
                        </div>
                        <Progress value={lastScore} size="sm" gradient />
                      </div>
                    )}

                    <Button
                      variant={lastScore !== null ? "outline" : "gradient"}
                      size="sm"
                      className="w-full justify-center"
                      iconRight={<ChevronRight className="w-4 h-4" />}
                      onClick={() => setActiveAssessment(assessment)}
                    >
                      {lastScore !== null ? "Retake Assessment" : "Start Assessment"}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
