import { create } from 'zustand';
import { AIMode } from '../types';

interface AppState {
  /** The currently selected metropolitan area (e.g., Indore, Bhopal, Pune) */
  city: string;
  setCity: (city: string) => void;
  /** Current AI operational mode ('manual' | 'supervised' | 'autonomous') */
  aiMode: AIMode;
  setAiMode: (mode: AIMode) => void;
  /** Active emergency vehicle corridor tracking ID, if any */
  activeCorridorId: string | null;
  setActiveCorridorId: (id: string | null) => void;
  /** Sidebar display state for premium compact screens */
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
