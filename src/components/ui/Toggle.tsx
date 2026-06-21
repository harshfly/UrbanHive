import React from 'react';
import { cn } from './Badge';

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label, className }) => {
  return (
    <label className={cn("inline-flex items-center cursor-pointer gap-3", className)}>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2",
          enabled ? "bg-accent-primary" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && <span className="text-sm text-text-primary font-medium">{label}</span>}
    </label>
  );
};
