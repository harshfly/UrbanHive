import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Eye, Flame, Gauge, Box, Activity } from 'lucide-react';
import { cn } from '../../theme/cn';

export type OverlayMode = 'detection' | 'heatmap' | 'velocity';

interface CameraHUDOverlayProps {
  mode: OverlayMode;
  isActive: boolean;
  vehicleCount?: number;
  pedestrianCount?: number;
  avgSpeed?: number;
}

// Heatmap visualization
const HeatmapLayer: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Hot zones */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '120px',
        height: '120px',
        left: '20%',
        top: '25%',
        background: 'radial-gradient(circle, rgba(255,59,48,0.5) 0%, rgba(255,149,0,0.3) 40%, rgba(255,149,0,0) 70%)',
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '90px',
        height: '90px',
        left: '55%',
        top: '40%',
        background: 'radial-gradient(circle, rgba(255,149,0,0.5) 0%, rgba(255,204,0,0.2) 50%, rgba(255,204,0,0) 70%)',
      }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: '70px',
        height: '70px',
        left: '40%',
        top: '60%',
        background: 'radial-gradient(circle, rgba(52,199,89,0.4) 0%, rgba(52,199,89,0.1) 50%, transparent 70%)',
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />

    {/* Legend overlay */}
    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[8px] text-zinc-300 font-mono">High</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[8px] text-zinc-300 font-mono">Med</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[8px] text-zinc-300 font-mono">Low</span>
        </div>
      </div>
    </div>
  </div>
);

// Velocity vectors
const VelocityLayer: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 300 160">
      {/* Horizontal velocity vectors */}
      {[
        { x: 40, y: 74, speed: 42, angle: 0 },
        { x: 180, y: 86, speed: 35, angle: 180 },
        { x: 100, y: 78, speed: 55, angle: 0 },
      ].map((v, i) => (
        <g key={`h-${i}`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from={`${v.angle === 0 ? -30 : 310} ${v.y}`}
            to={`${v.angle === 0 ? 310 : -30} ${v.y}`}
            dur={`${3.5 + i * 0.8}s`}
            repeatCount="indefinite"
          />
          {/* Arrow */}
          <line x1="0" y1="0" x2={v.angle === 0 ? 18 : -18} y2="0" stroke="#0071E3" strokeWidth="1.5" />
          <polygon points={v.angle === 0 ? "18,-3 24,0 18,3" : "-18,-3 -24,0 -18,3"} fill="#0071E3" />
          {/* Speed label */}
          <text x={v.angle === 0 ? 26 : -28} y="-3" fill="#0071E3" fontSize="6" fontFamily="monospace" fontWeight="bold">
            {v.speed}km/h
          </text>
        </g>
      ))}
      
      {/* Vertical velocity vectors */}
      {[
        { x: 144, y: 30, speed: 28, angle: 90 },
        { x: 156, y: 120, speed: 38, angle: 270 },
      ].map((v, i) => (
        <g key={`v-${i}`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from={`${v.x} ${v.angle === 90 ? -20 : 170}`}
            to={`${v.x} ${v.angle === 90 ? 170 : -20}`}
            dur={`${4 + i * 1.2}s`}
            repeatCount="indefinite"
          />
          {/* Arrow */}
          <line x1="0" y1="0" x2="0" y2={v.angle === 90 ? 16 : -16} stroke="#34C759" strokeWidth="1.5" />
          <polygon points={v.angle === 90 ? "-3,16 0,22 3,16" : "-3,-16 0,-22 3,-16"} fill="#34C759" />
          <text x="5" y="-4" fill="#34C759" fontSize="6" fontFamily="monospace" fontWeight="bold">
            {v.speed}km/h
          </text>
        </g>
      ))}
    </svg>

    {/* Average speed HUD */}
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
      <Gauge size={10} className="text-cyan-400" />
      <span className="text-[9px] font-mono font-bold text-cyan-300">AVG: 38 km/h</span>
    </div>
  </div>
);

export const CameraHUDOverlay: React.FC<CameraHUDOverlayProps> = ({
  mode,
  isActive,
  vehicleCount = 0,
  pedestrianCount = 0,
  avgSpeed = 0,
}) => {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
      >
        {mode === 'heatmap' && <HeatmapLayer />}
        {mode === 'velocity' && <VelocityLayer />}
        
        {/* Common HUD elements */}
        {mode !== 'detection' && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Activity size={9} className="text-zinc-400" />
              <span className="text-[9px] font-mono text-zinc-300">{vehicleCount} veh</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-zinc-300">{pedestrianCount} ped</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Overlay mode selector
export const OverlayModeSelector: React.FC<{
  mode: OverlayMode;
  onChange: (mode: OverlayMode) => void;
  className?: string;
}> = ({ mode, onChange, className }) => {
  const modes: { value: OverlayMode; label: string; icon: React.ReactNode }[] = [
    { value: 'detection', label: 'Detection', icon: <Box size={12} /> },
    { value: 'heatmap', label: 'Heatmap', icon: <Flame size={12} /> },
    { value: 'velocity', label: 'Velocity', icon: <Gauge size={12} /> },
  ];

  return (
    <div className={cn('flex items-center gap-1 bg-bg-canvas p-0.5 rounded-xl border border-border-subtle', className)}>
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200',
            mode === m.value
              ? 'bg-bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {m.icon}
          {m.label}
        </button>
      ))}
    </div>
  );
};
