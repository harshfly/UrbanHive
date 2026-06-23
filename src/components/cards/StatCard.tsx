import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../theme/cn';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tint: 'amber' | 'red' | 'primary' | 'blue' | 'green';
  to?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, tint, to, className }) => {
  const navigate = useNavigate();
  const tints = {
    amber: { bg: 'bg-accent-amber-soft', text: 'text-accent-amber', glow: 'rgba(255, 149, 0, 0.15)' },
    red: { bg: 'bg-accent-red-soft', text: 'text-accent-red', glow: 'rgba(255, 59, 48, 0.15)' },
    primary: { bg: 'bg-accent-primary-soft', text: 'text-accent-primary', glow: 'rgba(0, 113, 227, 0.15)' },
    blue: { bg: 'bg-accent-blue-soft', text: 'text-accent-blue', glow: 'rgba(0, 113, 227, 0.15)' },
    green: { bg: 'bg-accent-green-soft', text: 'text-accent-green', glow: 'rgba(52, 199, 89, 0.15)' },
  };

  const selectedTint = tints[tint];

  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        scale: 1.02, 
        boxShadow: `0 12px 20px -8px ${selectedTint.glow}`,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => to && navigate(to)}
      className={cn(
        "bg-bg-surface/80 backdrop-blur-md border border-border-subtle rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm hover:border-border-strong/50 transition-all select-none",
        to && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-300 shrink-0", selectedTint.bg)}>
          <span className={cn(selectedTint.text, "scale-90 md:scale-100")}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xl md:text-2xl font-mono font-bold text-text-primary leading-tight truncate">{value}</div>
          <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-text-tertiary mt-1 truncate" title={label}>{label}</div>
        </div>
      </div>
    </motion.div>
  );
};
