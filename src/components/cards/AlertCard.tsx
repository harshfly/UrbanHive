import React from 'react';
import { Siren, Clock, CheckCircle2 } from 'lucide-react';
import { Alert } from '../../types';
import { cn } from '../ui/Badge';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick }) => {
  const iconMap = {
    active: <Siren size={16} className="text-accent-red" />,
    predicted: <Clock size={16} className="text-accent-amber" />,
    resolved: <CheckCircle2 size={16} className="text-accent-primary" />,
  };

  const bgMap = {
    active: 'bg-accent-red-soft',
    predicted: 'bg-accent-amber-soft',
    resolved: 'bg-accent-primary-soft',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl border border-border-subtle bg-bg-surface hover:shadow-md transition-all cursor-pointer",
        alert.type === 'resolved' && "opacity-50"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", bgMap[alert.type])}>
          {iconMap[alert.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-primary">{alert.title}</div>
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{alert.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-mono text-text-tertiary">{alert.location}</span>
            <span className="text-[11px] text-text-tertiary">·</span>
            <span className="text-[11px] font-mono text-text-tertiary">{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
