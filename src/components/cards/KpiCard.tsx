import React from 'react';
import { cn } from '../ui/Badge';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, deltaType = 'neutral', icon, iconColor = 'text-accent-primary', className }) => {
  const deltaColors = {
    positive: 'text-accent-primary',
    negative: 'text-accent-red',
    neutral: 'text-text-secondary',
  };

  return (
    <div className={cn("bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", iconColor === 'text-accent-primary' ? 'bg-accent-primary-soft' : iconColor === 'text-accent-amber' ? 'bg-accent-amber-soft' : iconColor === 'text-accent-red' ? 'bg-accent-red-soft' : 'bg-accent-blue-soft')}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] sm:text-xs font-bold text-text-tertiary uppercase tracking-wider truncate" title={label}>{label}</div>
        <div className="text-lg sm:text-xl font-mono font-bold text-text-primary mt-0.5 truncate">{value}</div>
        {delta && (
          <div className={cn("text-[10px] sm:text-xs font-mono font-semibold mt-0.5 truncate", deltaColors[deltaType])} title={delta}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
};
