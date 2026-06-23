import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Leaf } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface VehicleAreaChartProps {
  className?: string;
}

const data = [
  { name: 'Electric (EV)', value: 26638, percent: 35, fill: '#34C759' },
  { name: 'Petrol / ICE', value: 22833, percent: 30, fill: '#0071E3' },
  { name: 'Diesel / Heavy', value: 15222, percent: 20, fill: '#FF9500' },
  { name: 'CNG & Hybrid', value: 11418, percent: 15, fill: '#AEAEB2' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 shadow-md flex flex-col gap-1">
        <p className="text-xs font-bold text-text-primary">{data.name}</p>
        <p className="text-xs font-mono text-text-secondary">
          <strong className="font-bold text-text-primary">{data.value.toLocaleString()}</strong> vehicles ({data.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

export const VehicleAreaChart: React.FC<VehicleAreaChartProps> = ({ className }) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className={`flex flex-col justify-between h-full ${className || ''}`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Vehicle Fuel Distribution</h3>
          <Badge variant="green">+18.5% EV</Badge>
        </div>
        <p className="text-xs text-text-secondary leading-snug">
          Real-time split of active fleet engines crossing smart sensor checkposts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-center my-2 md:my-4">
        {/* Donut Chart with absolute center text */}
        <div className="h-32 md:h-44 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered Donut Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider text-text-tertiary font-bold">Total Fleet</span>
            <span className="text-lg font-mono font-bold text-text-primary leading-none mt-0.5">{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-xs font-bold text-text-primary truncate">{item.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-text-secondary">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
