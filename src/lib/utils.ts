import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(level: number) {
  return Math.pow(level, 2) * 100;
}

export function xpProgress(xp: number) {
  const level = calculateLevel(xp);
  const currentLevelXp = xpForNextLevel(level - 1);
  const nextLevelXp = xpForNextLevel(level);
  return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
}

export const GROWTH_CATEGORIES = [
  { id: "communication", label: "Communication", emoji: "💬", color: "#6366f1" },
  { id: "leadership", label: "Leadership", emoji: "🎯", color: "#8b5cf6" },
  { id: "sales", label: "Sales", emoji: "📈", color: "#06b6d4" },
  { id: "confidence", label: "Confidence", emoji: "⚡", color: "#f59e0b" },
  { id: "productivity", label: "Productivity", emoji: "🚀", color: "#10b981" },
  { id: "emotional_intelligence", label: "Emotional Intelligence", emoji: "🧠", color: "#ec4899" },
  { id: "business", label: "Business Growth", emoji: "💼", color: "#f97316" },
];
