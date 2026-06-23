import React from 'react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip
} from 'recharts';
import { Activity, ArrowUpRight } from 'lucide-react';

interface TrafficBarChartProps {
  className?: string;
}

const data = [
  { name: 'Vijay Nagar (Flow)', value: 88, fill: '#34C759' },
  { name: 'AB Road BRTS (Flow)', value: 75, fill: '#0071E3' },
  { name: 'Palasia Link (Flow)', value: 65, fill: '#FF9500' },
  { name: 'Geeta Bhawan (Flow)', value: 42, fill: '#FF3B30' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 shadow-md flex flex-col gap-1">
        <p className="text-xs font-bold text-text-primary">{data.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-mono font-bold text-text-primary">{data.value}% efficiency</span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            data.value > 80 ? 'bg-emerald-500' : data.value > 50 ? 'bg-amber-500' : 'bg-red-500'
          }`} />
        </div>
      </div>
    );
  }
  return null;
};

export const TrafficBarChart: React.FC<TrafficBarChartProps> = ({ className }) => {
  return (
    <div className={`flex flex-col justify-between h-full ${className || ''}`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Corridor Congestion Rings</h3>
          <span className="text-[10px] text-text-secondary font-semibold flex items-center gap-1">
            <Activity size={10} className="text-accent-primary animate-pulse" />
            Live Flow
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-snug">
          Flow efficiency index calculated per corridor based on transit vehicle delay reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-center my-2 md:my-4">
        {/* Radial Rings */}
        <div className="h-32 md:h-44 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="100%"
              barSize={8}
              data={data}
            >
              <RadialBar
                background={{ fill: '#F5F5F7' }}
                dataKey="value"
                cornerRadius={12}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Center visual dot */}
          <div className="absolute w-4 h-4 bg-bg-canvas border border-border-subtle rounded-full" />
        </div>

        {/* Custom Legend & Stats */}
        <div className="flex flex-col gap-1.5 md:gap-2.5">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-xs font-bold text-text-primary truncate">{item.name.split(' ')[0]}</span>
              </div>
              <span className="text-xs font-mono font-bold text-text-secondary">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
