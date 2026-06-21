import React from 'react';
import { cn } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: 'amber' | 'red' | 'primary' | 'blue';
  to?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, tint, to, className }) => {
  const navigate = useNavigate();
  const tints = {
    amber: { bg: 'bg-accent-amber-soft', text: 'text-accent-amber' },
    red: { bg: 'bg-accent-red-soft', text: 'text-accent-red' },
    primary: { bg: 'bg-accent-primary-soft', text: 'text-accent-primary' },
    blue: { bg: 'bg-accent-blue-soft', text: 'text-accent-blue' },
  };

  return (
    <div
      onClick={() => to && navigate(to)}
      className={cn(
        "bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-all",
        to && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", tints[tint].bg)}>
          <span className={tints[tint].text}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xl sm:text-2xl font-mono font-bold text-text-primary truncate">{value}</div>
          <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5 truncate" title={label}>{label}</div>
        </div>
      </div>
    </div>
  );
};
