import React from 'react';
import { CitySelector } from './CitySelector';
import { AIModeToggle } from './AIModeToggle';
import { AlertBell } from './AlertBell';
import { User, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TopNav: React.FC = () => {
  const { city } = useAppStore();

  return (
    <header className="h-16 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6 z-20 shrink-0 shadow-[0_1px_2px_rgba(16,20,36,0.02)]">
      {/* Dynamic Title / Environment Context */}
      <div className="flex items-center gap-3">
        <Activity size={18} className="text-accent-primary animate-pulse" />
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-text-primary leading-none">Indore Mobility Operations</h1>
          <span className="text-[11px] text-text-tertiary mt-1 font-medium">Zone: {city}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <CitySelector />
        <AIModeToggle />
        <AlertBell />
        <button className="w-8 h-8 rounded-full bg-accent-primary-soft flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};
