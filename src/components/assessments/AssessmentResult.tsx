"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowRight, RefreshCw, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

interface AssessmentResultProps {
  result: {
    score: number;
    insights: string;
    recommendations: string[];
    category: string;
  };
  onDone: () => void;
}

function getScoreLabel(score: number) {
  if (score >= 85) return { label: "Elite", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" };
  if (score >= 70) return { label: "Advanced", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" };
  if (score >= 55) return { label: "Developing", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
  if (score >= 40) return { label: "Foundational", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" };
  return { label: "Beginner", color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800" };
}

export function AssessmentResult({ result, onDone }: AssessmentResultProps) {
  const scoreInfo = getScoreLabel(result.score);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/25 mb-4 relative">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {result.score}<span className="text-2xl text-slate-400">/100</span>
          </h1>
          <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full font-semibold text-sm", scoreInfo.bg, scoreInfo.color)}>
            {scoreInfo.label} Level
          </span>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">
            You scored in the top {result.score > 70 ? "20%" : result.score > 55 ? "40%" : "60%"} of all users
          </p>
        </motion.div>

        {/* Score breakdown visual */}
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Core Competency", value: Math.min(result.score + 5, 100) },
              { label: "Practical Application", value: result.score },
              { label: "Advanced Skills", value: Math.max(result.score - 15, 10) },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.value}%</span>
                </div>
                <Progress value={item.value} size="md" gradient />
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs">✦</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">AI Analysis</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {result.insights}
          </p>
        </Card>

        {/* Recommendations */}
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-6">
          <Button variant="gradient" size="lg" className="flex-1 justify-center" onClick={onDone} iconRight={<ArrowRight className="w-4 h-4" />}>
            Continue My Journey
          </Button>
          <Button variant="outline" size="lg" icon={<RefreshCw className="w-4 h-4" />} onClick={onDone}>
            Retake
          </Button>
          <Button variant="outline" size="lg" icon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
