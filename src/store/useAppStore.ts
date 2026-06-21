import { create } from 'zustand';
import { AIMode } from '../types';

interface AppState {
  city: string;
  setCity: (city: string) => void;
  aiMode: AIMode;
  setAiMode: (mode: AIMode) => void;
  activeCorridorId: string | null;
  setActiveCorridorId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  city: 'Indore (Vijay Nagar)',
  setCity: (city) => set({ city }),
  aiMode: 'supervised',
  setAiMode: (aiMode) => set({ aiMode }),
  activeCorridorId: null,
  setActiveCorridorId: (activeCorridorId) => set({ activeCorridorId }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
}));
