import React from 'react';
import { cn } from './Badge';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ value, options, onChange, icon, className, placeholder }) => {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {icon && <span className="absolute left-3 text-text-secondary pointer-events-none">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none bg-bg-surface border border-border-subtle rounded-lg py-2 pr-9 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors cursor-pointer",
          icon ? "pl-9" : "pl-3"
        )}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 text-text-tertiary pointer-events-none" />
    </div>
  );
};
