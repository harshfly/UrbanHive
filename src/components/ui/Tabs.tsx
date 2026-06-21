import React from 'react';
import { cn } from './Badge';
import { motion } from 'framer-motion';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex bg-bg-surface-alt p-1 rounded-xl relative select-none", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none flex-1 relative",
              isActive
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-bg-surface rounded-lg shadow-sm -z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
};
