// src/store/analyticsStore.ts (Updated to match your service)

import { create } from 'zustand';
import { analyticsService } from '../services/analytics.service';
import {
  FarmWeeklyAnalyticsDto,
  HeatmapResponse,
} from '../types/api.types';

interface AnalyticsState {
  // State
  weeklyAnalytics: FarmWeeklyAnalyticsDto | null;
  heatmapData: HeatmapResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchWeeklyAnalytics: (farmId: string, week: number, year: number) => Promise<void>;
  fetchHeatmap: (farmId: string, week: number, year: number) => Promise<void>;

  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  weeklyAnalytics: null,
  heatmapData: null,
  loading: false,
  error: null,

  // Actions
  fetchWeeklyAnalytics: async (farmId: string, week: number, year: number) => {
    set({ loading: true, error: null });
    try {
      const analytics = await analyticsService.getWeeklyAnalytics(farmId, week, year);
      set({ weeklyAnalytics: analytics, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchHeatmap: async (farmId: string, week: number, year: number) => {
    set({ loading: true, error: null });
    try {
      const heatmap = await analyticsService.getHeatmap(farmId, week, year);
      set({ heatmapData: heatmap, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Utility
  clearError: () => set({ error: null }),

  reset: () =>
    set({
      weeklyAnalytics: null,
      heatmapData: null,
      loading: false,
      error: null,
    }),
}));