import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../../theme/cn';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
  data?: { time: string; val: number }[];
  valSuffix?: string;
}

const CustomMicroTooltip = ({ active, payload, suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-surface/95 backdrop-blur-md border border-border-subtle rounded-xl px-2.5 py-1.5 shadow-xl flex flex-col gap-0.5 pointer-events-none z-[2000]">
        <p className="text-[10px] font-mono font-bold text-text-primary">
          {payload[0].value.toLocaleString()}{suffix}
        </p>
        <p className="text-[8px] font-semibold text-text-tertiary">
          {payload[0].payload.time}
        </p>
      </div>
    );
  }
  return null;
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  iconColor = 'text-accent-primary',
  className,
  data = [],
  valSuffix = '',
}) => {
  const deltaColors = {
    positive: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25',
    negative: 'text-rose-500 bg-rose-500/10 border-rose-500/25',
    neutral: 'text-text-secondary bg-bg-surface-alt border-border-subtle',
  };

  const colors = {
    positive: '#10B981', // emerald
    negative: '#EF4444', // rose
    neutral: '#0071E3',  // primary blue
  };

  const themeColor = deltaType === 'positive' 
    ? colors.positive 
    : deltaType === 'negative' 
      ? colors.negative 
      : colors.neutral;

  const chartId = label.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden bg-bg-surface/85 backdrop-blur-md border border-border-subtle rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-border-strong/50 transition-all select-none group min-h-[178px]",
        className
      )}
    >
      {/* Background glow hover effect */}
      <div 
        className="absolute -right-12 -top-12 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="flex items-start justify-between gap-3">
        {/* Left: Metadata */}
        <div className="min-w-0 flex-1 z-10">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest block truncate">
            {label}
          </span>
          <span className="text-2xl font-mono font-bold text-text-primary mt-1 block tracking-tight truncate">
            {value}
          </span>
        </div>

        {/* Right: Icon Box */}
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner z-10 transition-transform group-hover:scale-105", 
          iconColor === 'text-accent-primary' ? 'bg-accent-primary-soft' : 
          iconColor === 'text-accent-amber' ? 'bg-accent-amber-soft' : 
          iconColor === 'text-accent-red' ? 'bg-accent-red-soft' : 'bg-accent-blue-soft'
        )}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>

      {/* Interactive Micro AreaChart */}
      {data && data.length > 0 && (
        <div className="h-10 mt-3 w-full shrink-0 overflow-visible relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <defs>
                <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={themeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Tooltip 
                content={<CustomMicroTooltip suffix={valSuffix} />} 
                cursor={{ stroke: themeColor, strokeWidth: 1, strokeDasharray: '2 2' }} 
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke={themeColor}
                strokeWidth={2}
                fill={`url(#grad-${chartId})`}
                dot={{ r: 0 }}
                activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom details & change status */}
      <div className="flex items-center justify-between gap-4 mt-3 z-10">
        <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider">
          Live Telemetry
        </span>

        {delta && (
          <div className={cn(
            "text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border leading-none shrink-0", 
            deltaColors[deltaType]
          )}>
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
};
