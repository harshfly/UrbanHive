import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'neutral' | 'primary';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', dot, className, ...props }) => {
  const variantStyles = {
    green: 'bg-accent-primary-soft text-accent-primary',
    amber: 'bg-accent-amber-soft text-accent-amber',
    red: 'bg-accent-red-soft text-accent-red',
    blue: 'bg-accent-blue-soft text-accent-blue',
    neutral: 'bg-bg-surface-alt text-text-secondary',
    primary: 'bg-accent-primary text-white',
  };

  const dotStyles = {
    green: 'bg-accent-primary',
    amber: 'bg-accent-amber',
    red: 'bg-accent-red',
    blue: 'bg-accent-blue',
    neutral: 'bg-text-secondary',
    primary: 'bg-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotStyles[variant])} />
      )}
      {children}
    </div>
  );
};
