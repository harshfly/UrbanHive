import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../../theme/cn';
import { useNavigate } from 'react-router-dom';

interface SparklineCardProps {
  title: string;
  data: { value: number; label: string }[];
  color?: string;
  linkTo?: string;
  className?: string;
  valueType?: 'percent' | 'seconds' | 'index' | 'vehicles';
  subtitle?: string;
  peakValue?: string;
  avgValue?: string;
}

const formatValue = (val: number, type?: string) => {
  if (type === 'percent') return `${val}%`;
  if (type === 'seconds') return `${val}s`;
  if (type === 'vehicles') return `${val.toLocaleString()} veh`;
  return `${val}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      label: string;
    };
  }[];
  valueType?: string;
}

const CustomTooltip = ({ active, payload, valueType }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-xl px-3 py-2 shadow-lg flex flex-col gap-0.5">
        <p className="text-xs font-mono font-bold text-text-primary">
          {formatValue(payload[0].value, valueType)}
        </p>
        <p className="text-[9px] font-medium text-text-tertiary">
          {payload[0].payload.label}
        </p>
      </div>
    );
  }
  return null;
};

export const SparklineCard: React.FC<SparklineCardProps> = ({
  title,
  data,
  color = '#0F8B6C',
  linkTo,
  className,
  valueType = 'percent',
  subtitle = 'Last 24 hours',
  peakValue,
  avgValue,
}) => {
  const navigate = useNavigate();

  // Calculate statistics from the dataset
  const values = data ? data.map((d) => d.value) : [];
  const calculatedPeak = values.length > 0 ? Math.max(...values) : 0;
  const calculatedAvg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  const hasData = data && data.length > 0;
  const finalPeak = hasData ? (peakValue || formatValue(calculatedPeak, valueType)) : '--';
  const finalAvg = hasData ? (avgValue || formatValue(calculatedAvg, valueType)) : '--';

  return (
    <div className={cn("bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider truncate" title={title}>
            {title}
          </h3>
          <span className="text-[10px] text-text-tertiary font-semibold font-mono whitespace-nowrap">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Mini stats display */}
      <div className="grid grid-cols-2 gap-4 bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
        <div>
          <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Average</span>
          <span className="text-sm font-mono font-bold text-text-primary leading-tight">{finalAvg}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Peak</span>
          <span className="text-sm font-mono font-bold text-accent-red leading-tight">{finalPeak}</span>
        </div>
      </div>

      {/* Interactive area chart */}
      <div className="h-28 mt-1 flex items-center justify-center w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 8, fill: '#8E8E93', fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
                dy={5}
              />
              <YAxis
                tick={{ fontSize: 8, fill: '#8E8E93', fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip valueType={valueType} />} cursor={{ stroke: '#AEAEB2', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${title.replace(/[^a-zA-Z0-9]/g, '')})`}
                animationDuration={400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">No Telemetry Received</span>
            <span className="text-[9px] text-text-tertiary mt-1 max-w-[200px] leading-relaxed">
              This corridor is currently offline or undergoing scheduling calibration.
            </span>
          </div>
        )}
      </div>

      {linkTo && (
        <div className="border-t border-border-subtle pt-3 flex justify-end">
          <button
            onClick={() => navigate(linkTo)}
            className="text-xs font-bold text-accent-primary hover:text-accent-primary/80 transition-colors"
          >
            Details →
          </button>
        </div>
      )}
    </div>
  );
};
