import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, GrowthScore, CoachMessage } from "@/types";

interface AppState {
  user: User | null;
  growthScore: GrowthScore | null;
  sidebarOpen: boolean;
  coachMessages: CoachMessage[];
  setUser: (user: User | null) => void;
  setGrowthScore: (score: GrowthScore) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addCoachMessage: (message: CoachMessage) => void;
  clearCoachMessages: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      growthScore: null,
      sidebarOpen: true,
      coachMessages: [],
      setUser: (user) => set({ user }),
      setGrowthScore: (score) => set({ growthScore: score }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      addCoachMessage: (message) =>
        set((state) => ({ coachMessages: [...state.coachMessages, message] })),
      clearCoachMessages: () => set({ coachMessages: [] }),
    }),
    {
      name: "growthhq-store",
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);
