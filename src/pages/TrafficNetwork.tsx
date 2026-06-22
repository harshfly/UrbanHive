import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../layouts/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Select } from '../components/ui/Select';
import { fetchJunctions } from '../api/junctions.api';
import { Junction } from '../types';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Compass, ShieldAlert } from 'lucide-react';

const TrafficNetwork: React.FC = () => {
  const [junctions, setJunctions] = useState<Junction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [sortCol, setSortCol] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJunctions().then((data) => {
      setJunctions(data);
      setLoading(false);
    });
  }, []);

  const zones = ['All', ...Array.from(new Set(junctions.map((j) => j.zone)))];
  const statusMap: Record<string, string> = { green: 'Flowing', amber: 'Predicted', red: 'Critical' };

  let filtered = junctions;
  if (statusFilter !== 'All') {
    const statusKey = Object.entries(statusMap).find(([, v]) => v === statusFilter)?.[0];
    filtered = filtered.filter((j) => j.status === statusKey);
  }
  if (zoneFilter !== 'All') {
    filtered = filtered.filter((j) => j.zone === zoneFilter);
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortCol === 'zone') cmp = a.zone.localeCompare(b.zone);
    else if (sortCol === 'wait') cmp = a.avgWaitSeconds - b.avgWaitSeconds;
    else if (sortCol === 'overrides') cmp = a.aiOverridesToday - b.aiOverridesToday;
    else if (sortCol === 'status') cmp = a.status.localeCompare(b.status);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const statusBadge = (status: string) => {
    const variant = status === 'green' ? 'green' : status === 'amber' ? 'amber' : 'red';
    return <Badge variant={variant} dot>{statusMap[status] || status}</Badge>;
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Traffic Network" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-bg-surface-alt rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader title="Traffic Network" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select
          value={zoneFilter}
          options={zones.map((z) => ({ label: z, value: z }))}
          onChange={setZoneFilter}
        />
        <Tabs
          tabs={['All', 'Flowing', 'Predicted', 'Critical']}
          activeTab={statusFilter}
          onChange={setStatusFilter}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-canvas/50">
              {[
                { key: 'name', label: 'Junction' },
                { key: 'zone', label: 'Zone' },
                { key: 'status', label: 'Status' },
                { key: 'wait', label: 'Avg Wait' },
                { key: 'overrides', label: 'AI Overrides' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key && (
                      <span className="text-[9px] text-accent-primary">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr
                key={j.id}
                onClick={() => navigate(`/traffic/${j.id}`)}
                className="border-b border-border-subtle last:border-0 hover:bg-bg-canvas/40 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-xs font-bold text-text-primary group-hover:text-accent-primary transition-colors">{j.name}</td>
                <td className="px-6 py-4 text-xs text-text-secondary font-medium">{j.zone}</td>
                <td className="px-6 py-4">{statusBadge(j.status)}</td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-text-primary">{j.avgWaitSeconds}s</td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-text-primary">{j.aiOverridesToday}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-tertiary text-sm">No junctions match the selected filters.</div>
        )}
      </div>

      {/* Circular Network Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Card 1: Network Status Split Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Network Status Split</h3>
              <Badge variant="green">Auto-Optimizing</Badge>
            </div>
            <p className="text-xs text-text-secondary">Proportion of city junctions categorized by current signal efficiency level.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Flowing Status', value: 60, fill: '#34C759' },
                      { name: 'Predicted Queue', value: 25, fill: '#FF9500' },
                      { name: 'Critical Delay', value: 15, fill: '#FF3B30' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { fill: '#34C759' },
                      { fill: '#FF9500' },
                      { fill: '#FF3B30' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Total Hubs</span>
                <span className="text-sm font-mono font-bold text-text-primary leading-none mt-0.5">12</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { name: 'Flowing (Green)', value: 60, fill: '#34C759' },
                { name: 'Predicted (Amber)', value: 25, fill: '#FF9500' },
                { name: 'Critical (Red)', value: 15, fill: '#FF3B30' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                    <span className="text-xs font-bold text-text-primary truncate">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-text-secondary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Adaptive Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <Compass size={14} className="text-accent-primary shrink-0 mt-0.5" />
              <p>
                Dynamic cycle re-timings mitigated <strong className="font-bold text-accent-primary">3 queue spikes</strong> in the East Zone. Cumulative wait index is down 12%.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Zone Average Wait Times Bar Chart */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Zone Average Wait Times</h3>
              <Badge variant="blue">Real-Time Delay</Badge>
            </div>
            <p className="text-xs text-text-secondary">Average intersection wait times in seconds segmented by active city zones.</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Central Zone', value: 54, fill: '#FF3B30' },
                  { name: 'East Sector', value: 42, fill: '#FF9500' },
                  { name: 'North Sector', value: 32, fill: '#0071E3' },
                  { name: 'West Sector', value: 22, fill: '#34C759' },
                ]}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 60]} tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={26}>
                  {[
                    { fill: '#FF3B30' },
                    { fill: '#FF9500' },
                    { fill: '#0071E3' },
                    { fill: '#34C759' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Pre-emption Safeguard</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <ShieldAlert size={14} className="text-accent-red shrink-0 mt-0.5" />
              <p>
                Central Zone wait times exceed the 45s threshold. System triggers minor bypass cycle adjustments to flush queues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrafficNetwork;
