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
    positive: '#34C759', // green
    negative: '#FF3B30', // red
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
      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden bg-bg-surface/85 backdrop-blur-md border border-border-subtle rounded-xl md:rounded-2xl p-2.5 md:p-3.5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-border-strong/40 transition-all select-none group min-h-[86px] md:min-h-[130px]",
        className
      )}
    >
      {/* Background glow hover effect */}
      <div 
        className="absolute -right-12 -top-12 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="flex items-start justify-between gap-2.5">
        {/* Left: Metadata */}
        <div className="min-w-0 flex-1 z-10">
          <span className="text-[8px] md:text-[9px] font-extrabold text-text-tertiary uppercase tracking-widest block truncate">
            {label}
          </span>
          <span className="text-base md:text-[20px] font-mono font-bold text-text-primary mt-0.5 block tracking-tight truncate leading-none">
            {value}
          </span>
        </div>

        {/* Right: Icon Box */}
        <div className={cn(
          "w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-inner z-10 transition-transform group-hover:scale-105", 
          iconColor === 'text-accent-primary' ? 'bg-accent-primary-soft' : 
          iconColor === 'text-accent-amber' ? 'bg-accent-amber-soft' : 
          iconColor === 'text-accent-red' ? 'bg-accent-red-soft' : 
          iconColor === 'text-accent-green' ? 'bg-accent-green-soft' : 'bg-accent-blue-soft'
        )}>
          <span className={cn(iconColor, "flex items-center justify-center [&>svg]:w-[16px] [&>svg]:h-[16px]")}>{icon}</span>
        </div>
      </div>

      {/* Interactive Micro AreaChart */}
      {data && data.length > 0 && (
        <div className="h-6 md:h-8 mt-1.5 md:mt-2 w-full shrink-0 overflow-visible relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <defs>
                <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeColor} stopOpacity={0.2} />
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
                strokeWidth={1.5}
                fill={`url(#grad-${chartId})`}
                dot={{ r: 0 }}
                activeDot={{ r: 3.5, stroke: '#FFFFFF', strokeWidth: 1 }}
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom details & change status */}
      <div className="flex items-center justify-between gap-3 mt-1.5 md:mt-2 z-10">
        <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-wider">
          Live Telemetry
        </span>

        {delta && (
          <div className={cn(
            "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md border leading-none shrink-0", 
            deltaColors[deltaType]
          )}>
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
};
