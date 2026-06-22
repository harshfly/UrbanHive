import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Network, Cpu, Siren, Zap, MapPin, BarChart3, Camera,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../theme/cn';
import { motion } from 'framer-motion';

const logoSvg = (
  <svg className="w-9 h-9 filter drop-shadow-[0_4px_10px_rgba(15,139,108,0.25)] transition-transform duration-500 hover:rotate-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L29.86 10V22L16 30L2.14 22V10L16 2Z" fill="url(#logoGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" className="animate-pulse" />
    <line x1="16" y1="16" x2="16" y2="7" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="16" x2="23.79" y2="20.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="16" x2="8.21" y2="20.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="logoGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F8B6C" />
        <stop offset="0.5" stopColor="#1C65C4" />
        <stop offset="1" stopColor="#2F5FD6" />
      </linearGradient>
    </defs>
  </svg>
);

const navItems = [
  { label: 'Overview', to: '/', icon: Home },
  { label: 'Traffic Network', to: '/traffic', icon: Network },
  { label: 'Camera Feeds', to: '/cameras', icon: Camera },
  { label: 'Digital Twin', to: '/digital-twin', icon: Cpu },
  { label: 'Emergency Corridor', to: '/emergency-corridor', icon: Siren, highlightOnActiveCorridor: true },
  { label: 'EV & Charging', to: '/ev-charging', icon: Zap },
  { label: 'Parking Map', to: '/parking', icon: MapPin },
  { label: 'System Reports', to: '/reports', icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const activeCorridorId = useAppStore((s) => s.activeCorridorId);
  const isCorridorActive = activeCorridorId !== null;
  const location = useLocation();

  return (
    <aside className="w-64 bg-bg-surface border-r border-border-subtle flex flex-col justify-between h-full shrink-0 z-30 shadow-[6px_0_30px_rgba(16,20,36,0.03)]">
      {/* Header / Brand */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-border-subtle bg-gradient-to-r from-bg-surface to-bg-canvas/10">
          {logoSvg}
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-text-primary text-base leading-none tracking-tight">UrbanHive</span>
            <span className="text-[9px] font-mono font-bold text-accent-primary uppercase tracking-widest mt-1">Mobility OS</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 p-4 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCorridor = item.highlightOnActiveCorridor && isCorridorActive;
            const isTabActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden border-l-2",
                  isCorridor
                    ? "bg-accent-red-soft text-accent-red border-accent-red animate-pulse"
                    : isTabActive
                      ? "text-accent-primary border-accent-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-alt/70 border-transparent"
                )}
              >
                {/* Active Indicator Sliding Backdrop */}
                {isTabActive && !isCorridor && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-accent-primary-soft -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-center">
                  <Icon
                    size={18}
                    strokeWidth={2.2}
                    className={cn(
                      "shrink-0 transition-all duration-300 group-hover:scale-110",
                      isTabActive && !isCorridor ? "text-accent-primary" : "text-text-tertiary group-hover:text-text-primary"
                    )}
                  />
                </span>

                <span className="relative z-10 truncate font-semibold tracking-wide">
                  {item.label}
                </span>

                {/* Secondary Indicators */}
                {isCorridor && (
                  <span className="absolute right-3 w-2 h-2 bg-accent-red rounded-full animate-ping z-10" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-border-subtle bg-bg-canvas/30">
        <div className="flex items-center gap-3 p-3 bg-bg-surface border border-border-subtle rounded-2xl shadow-[0_4px_16px_rgba(16,20,36,0.03)] hover:border-border-strong transition-all duration-300">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-accent-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text-primary leading-none">System Core</span>
            <span className="text-[10px] font-mono text-text-tertiary mt-1 truncate">v1.2.4 (Indore Cloud)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
