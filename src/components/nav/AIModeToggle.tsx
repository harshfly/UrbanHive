import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AIMode } from '../../types';
import { cn } from '../ui/Badge';

const modes: { value: AIMode; label: string; icon: React.ReactNode }[] = [
  { value: 'autonomous', label: 'Auto', icon: <ShieldCheck size={16} /> },
  { value: 'supervised', label: 'Supervised', icon: <ShieldAlert size={16} /> },
  { value: 'manual', label: 'Manual', icon: <ShieldOff size={16} /> },
];

export const AIModeToggle: React.FC = () => {
  const { aiMode, setAiMode } = useAppStore();

  return (
    <div className="flex items-center bg-bg-surface-alt p-0.5 rounded-lg border border-border-subtle">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setAiMode(m.value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
            aiMode === m.value
              ? "bg-accent-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
          title={m.label}
        >
          {m.icon}
          <span className="hidden xl:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
};
