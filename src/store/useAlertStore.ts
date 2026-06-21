import { create } from 'zustand';
import { Alert } from '../types';
import mockAlerts from '../mock/alerts.json';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
  activateAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: mockAlerts as Alert[],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, type: 'resolved', severity: 'low' } : a)
  })),
  activateAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, type: 'active', severity: 'high' } : a)
  }))
}));
