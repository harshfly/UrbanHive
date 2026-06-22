import React from 'react';
import { Compass, ShieldCheck, Activity } from 'lucide-react';

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-bg-surface/90 backdrop-blur-md border border-border-subtle rounded-2xl p-4 shadow-lg flex flex-col gap-3 min-w-[160px]">
      <div>
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-1.5 mb-1">
          <Activity size={10} className="text-accent-primary" /> Traffic Density
        </h4>
        <span className="text-[9px] text-text-secondary">Status of live corridors</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
            <span className="text-[10px] font-medium text-text-secondary">Optimal</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-500 font-bold">18-35 km/h</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shadow-sm" />
            <span className="text-[10px] font-medium text-text-secondary">Moderate</span>
          </div>
          <span className="text-[9px] font-mono text-amber-500 font-bold">10-18 km/h</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-sm" />
            <span className="text-[10px] font-medium text-text-secondary">Heavy</span>
          </div>
          <span className="text-[9px] font-mono text-red-500 font-bold">&lt; 10 km/h</span>
        </div>
      </div>

      <div className="border-t border-border-subtle pt-2.5 flex items-center gap-2">
        <ShieldCheck size={12} className="text-accent-primary shrink-0" />
        <span className="text-[9px] font-bold text-text-secondary">AI Optimization ON</span>
      </div>
    </div>
  );
};
