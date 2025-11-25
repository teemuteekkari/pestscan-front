import { create } from 'zustand';
import {
  ScoutingSessionDetailDto,
  ScoutingObservationDto,
} from '../types/api.types';
import { scoutingService } from '../services/scouting.service';

interface ScoutingState {
  sessions: ScoutingSessionDetailDto[];
  currentSession: ScoutingSessionDetailDto | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: (farmId: string) => Promise<void>;
  fetchSession: (sessionId: string) => Promise<void>;
  setCurrentSession: (session: ScoutingSessionDetailDto | null) => void;
  addObservation: (observation: ScoutingObservationDto) => void;
  updateObservation: (observation: ScoutingObservationDto) => void;
  removeObservation: (observationId: string) => void;
  clearError: () => void;
}

export const useScoutingStore = create<ScoutingState>((set, get) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async (farmId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const sessions = await scoutingService.getSessions(farmId);
      set({ sessions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch sessions',
        isLoading: false,
      });
    }
  },

  fetchSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const session = await scoutingService.getSession(sessionId);
      set({ currentSession: session, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch session',
        isLoading: false,
      });
    }
  },

  setCurrentSession: (session) => {
    set({ currentSession: session });
  },

  addObservation: (observation) => {
    const { currentSession } = get();
    
    if (!currentSession) return;

    const updatedSections = currentSession.sections.map((section) => {
      if (section.targetId === observation.sessionTargetId) {
        return {
          ...section,
          observations: [...section.observations, observation],
        };
      }
      return section;
    });

    set({
      currentSession: {
        ...currentSession,
        sections: updatedSections,
      },
    });
  },

  updateObservation: (observation) => {
    const { currentSession } = get();
    
    if (!currentSession) return;

    const updatedSections = currentSession.sections.map((section) => {
      if (section.targetId === observation.sessionTargetId) {
        return {
          ...section,
          observations: section.observations.map((obs) =>
            obs.id === observation.id ? observation : obs
          ),
        };
      }
      return section;
    });

    set({
      currentSession: {
        ...currentSession,
        sections: updatedSections,
      },
    });
  },

  removeObservation: (observationId) => {
    const { currentSession } = get();
    
    if (!currentSession) return;

    const updatedSections = currentSession.sections.map((section) => ({
      ...section,
      observations: section.observations.filter((obs) => obs.id !== observationId),
    }));

    set({
      currentSession: {
        ...currentSession,
        sections: updatedSections,
      },
    });
  },

  clearError: () => set({ error: null }),
}));