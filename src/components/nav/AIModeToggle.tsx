import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AIMode } from '../../types';
import { cn } from '../../theme/cn';
import { motion } from 'framer-motion';

const modes: { value: AIMode; label: string; icon: React.ReactNode }[] = [
  { value: 'autonomous', label: 'Auto', icon: <ShieldCheck size={14} /> },
  { value: 'supervised', label: 'Supervised', icon: <ShieldAlert size={14} /> },
  { value: 'manual', label: 'Manual', icon: <ShieldOff size={14} /> },
];

export const AIModeToggle: React.FC = () => {
  const { aiMode, setAiMode } = useAppStore();

  return (
    <div className="flex items-center bg-bg-surface-alt p-0.5 rounded-lg border border-border-subtle shrink-0">
      {modes.map((m) => {
        const isActive = aiMode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setAiMode(m.value)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer",
              isActive
                ? "bg-accent-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
            title={m.label}
          >
            <span className="shrink-0">{m.icon}</span>
            {isActive && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {m.label}
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
};
