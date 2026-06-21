import React, { useState, useRef, useEffect } from 'react';
import { Bell, Siren, Clock, CheckCircle2 } from 'lucide-react';
import { useAlertStore } from '../../store/useAlertStore';
import { cn } from '../ui/Badge';

export const AlertBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const alerts = useAlertStore((s) => s.alerts);
  const activeCount = alerts.filter((a) => a.type !== 'resolved').length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getIcon = (type: string) => {
    if (type === 'active') return <Siren size={14} className="text-accent-red" />;
    if (type === 'predicted') return <Clock size={14} className="text-accent-amber" />;
    return <CheckCircle2 size={14} className="text-accent-primary" />;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        <Bell size={20} className="text-text-secondary" />
        {activeCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-accent-red text-white text-[10px] font-mono font-bold flex items-center justify-center rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-bg-surface rounded-xl shadow-lg border border-border-subtle overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
            <span className="text-sm font-display font-semibold text-text-primary">Alerts</span>
            <span className="text-xs font-mono text-text-tertiary">{activeCount} active</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className={cn(
                  "px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-alt transition-colors cursor-pointer",
                  a.type === 'resolved' && "opacity-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getIcon(a.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{a.title}</div>
                    <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">{a.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-text-tertiary font-mono">{a.location}</span>
                      <span className="text-[11px] text-text-tertiary font-mono">·</span>
                      <span className="text-[11px] text-text-tertiary font-mono">{a.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
