import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Network, Cpu, Siren, Zap, MapPin, BarChart3, Camera, LogOut, Fuel
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
  { label: 'Petrol Pumps', to: '/petrol-pumps', icon: Fuel },
  { label: 'System Reports', to: '/reports', icon: BarChart3 },
];

import { AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const activeCorridorId = useAppStore((s) => s.activeCorridorId);
  const isCorridorActive = activeCorridorId !== null;
  const location = useLocation();
  const mobileMenuOpen = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "bg-bg-surface flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 shadow-[6px_0_30px_rgba(16,20,36,0.03)]",
        // Desktop Layout
        "md:flex md:w-64 md:border-r md:border-border-subtle md:h-full md:relative md:translate-y-0",
        // Mobile Layout (Bottom Sheet)
        "fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-3xl border-t border-border-subtle overflow-hidden",
        mobileMenuOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Mobile Drag Handle */}
        <div 
          className="md:hidden flex justify-center pt-3 pb-2 shrink-0 bg-bg-surface cursor-pointer" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-12 h-1.5 rounded-full bg-border-strong" />
        </div>

        {/* Header / Brand */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-16 flex items-center px-6 gap-3 border-b border-border-subtle bg-gradient-to-r from-bg-surface to-bg-canvas/10 shrink-0">
            {logoSvg}
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-text-primary text-base leading-none tracking-tight">UrbanHive</span>
              <span className="text-[9px] font-mono font-bold text-accent-primary uppercase tracking-widest mt-1">Mobility OS</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 p-4 relative overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCorridor = item.highlightOnActiveCorridor && isCorridorActive;
              const isTabActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
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

        {/* Footer / User Profile & Logout */}
        <div className="p-4 border-t border-border-subtle bg-bg-canvas/30 flex flex-col gap-2 shrink-0 pb-safe">
          <div className="flex items-center justify-between p-2.5 bg-bg-surface border border-border-subtle rounded-2xl shadow-[0_4px_16px_rgba(16,20,36,0.03)] hover:border-border-strong transition-all duration-300 group">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar with dynamic status indicator */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-blue flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
                HM
                {/* Active green indicator dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
                </span>
              </div>
              {/* User Details */}
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-text-primary leading-none truncate">Harsh Malviya</span>
                <span className="text-[9px] font-semibold text-text-tertiary mt-1 truncate">Control Officer</span>
              </div>
            </div>
            {/* Action icon */}
            <button 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-red hover:bg-accent-red-soft transition-colors cursor-pointer shrink-0"
              title="Log Out"
            >
              <LogOut size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
