import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../layouts/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { fetchJunctionById } from '../api/junctions.api';
import { Junction } from '../types';
import { useAppStore } from '../store/useAppStore';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { Lightbulb, ShieldAlert } from 'lucide-react';

const statusMap: Record<string, 'green' | 'amber' | 'red'> = {
  green: 'green',
  amber: 'amber',
  red: 'red',
};

const JunctionDetail: React.FC = () => {
  const { junctionId } = useParams<{ junctionId: string }>();
  const [junction, setJunction] = useState<Junction | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiControl, setAiControl] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [lights, setLights] = useState<Record<string, boolean>>({ N: true, S: false, E: false, W: true });
  const aiMode = useAppStore((s) => s.aiMode);

  useEffect(() => {
    if (junctionId) {
      fetchJunctionById(junctionId).then((j) => {
        if (j) setJunction(j);
        setLoading(false);
      });
    }
  }, [junctionId]);

  // Simulate signal cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prev) => ({
        N: !prev.N,
        S: !prev.S,
        E: !prev.E,
        W: !prev.W,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAiControl = useCallback((val: boolean) => {
    if (!val) {
      setConfirmModal(true);
    } else {
      setAiControl(true);
    }
  }, []);

  const confirmDisableAi = () => {
    setAiControl(false);
    setConfirmModal(false);
  };

  if (loading || !junction) {
    return (
      <div>
        <div className="h-8 w-64 bg-bg-surface-alt rounded-lg animate-pulse mb-4" />
        <div className="h-96 bg-bg-surface-alt rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader
        title={junction.name}
        breadcrumbs={[
          { label: 'Traffic Network', to: '/traffic' },
          { label: junction.name },
        ]}
        actions={<Badge variant={statusMap[junction.status]} dot>{junction.status}</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal Schematic */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Signal Schematic</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Intersection */}
              <div className="absolute inset-8 bg-bg-surface-alt rounded-lg border border-border-subtle" />
              {/* Roads */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-8 bg-border-subtle rounded-t-lg" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 bg-border-subtle rounded-b-lg" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-10 bg-border-subtle rounded-l-lg" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-10 bg-border-subtle rounded-r-lg" />
              {/* Signal lights */}
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-colors duration-300 ${lights.N ? 'bg-accent-primary shadow-[0_0_8px_rgba(15,139,108,0.5)]' : 'bg-accent-red shadow-[0_0_8px_rgba(214,54,79,0.5)]'}`} />
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-colors duration-300 ${lights.S ? 'bg-accent-primary shadow-[0_0_8px_rgba(15,139,108,0.5)]' : 'bg-accent-red shadow-[0_0_8px_rgba(214,54,79,0.5)]'}`} />
              <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-colors duration-300 ${lights.E ? 'bg-accent-primary shadow-[0_0_8px_rgba(15,139,108,0.5)]' : 'bg-accent-red shadow-[0_0_8px_rgba(214,54,79,0.5)]'}`} />
              <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-colors duration-300 ${lights.W ? 'bg-accent-primary shadow-[0_0_8px_rgba(15,139,108,0.5)]' : 'bg-accent-red shadow-[0_0_8px_rgba(214,54,79,0.5)]'}`} />
              {/* Labels */}
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-tertiary">N</span>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-tertiary">S</span>
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">W</span>
              <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-tertiary">E</span>
            </div>
          </div>
        </div>

        {/* AI Control */}
        <div className="space-y-4">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">AI Control</h3>
            <Toggle enabled={aiControl} onChange={handleToggleAiControl} label={`AI Control: ${aiControl ? 'ON' : 'OFF'}`} />
            {aiMode !== 'autonomous' && (
              <p className="text-xs text-text-tertiary mt-2">Mode: {aiMode} — AI actions require approval</p>
            )}
          </div>

          {/* Recommended Timing */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-4">Signal Timing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Current</div>
                <div className="text-sm font-mono text-text-primary">N-S: {junction.currentTiming.ns}s</div>
                <div className="text-sm font-mono text-text-primary">E-W: {junction.currentTiming.ew}s</div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1">AI Recommended</div>
                <div className="text-sm font-mono text-accent-primary">N-S: {junction.recommendedTiming.ns}s</div>
                <div className="text-sm font-mono text-accent-primary">E-W: {junction.recommendedTiming.ew}s</div>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              disabled={aiMode !== 'supervised'}
              title={aiMode !== 'supervised' ? 'Switch to Supervised mode to apply recommendations' : ''}
            >
              Apply Recommended Timing
            </Button>
            {aiMode !== 'supervised' && (
              <p className="text-xs text-text-tertiary mt-2 text-center">Requires Supervised AI mode</p>
            )}
          </div>
        </div>
      </div>

      {/* Circular Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Card 1: Queue Load Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Leg Queue Distribution</h3>
              <Badge variant="red">Active Congestion</Badge>
            </div>
            <p className="text-xs text-text-secondary">Proportion of queued vehicles waiting at each directional approach leg.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'North Leg (Vijay Nagar)', value: 42, fill: '#FF3B30' },
                      { name: 'South Leg (BRTS link)', value: 28, fill: '#0071E3' },
                      { name: 'East Leg (Ring Road)', value: 18, fill: '#FF9500' },
                      { name: 'West Leg (Palasia)', value: 12, fill: '#34C759' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { fill: '#FF3B30' },
                      { fill: '#0071E3' },
                      { fill: '#FF9500' },
                      { fill: '#34C759' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Total Queue</span>
                <span className="text-sm font-mono font-bold text-text-primary leading-none mt-0.5">100 vehicles</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { name: 'North Leg', value: 42, fill: '#FF3B30' },
                { name: 'South Leg', value: 28, fill: '#0071E3' },
                { name: 'East Leg', value: 18, fill: '#FF9500' },
                { name: 'West Leg', value: 12, fill: '#34C759' },
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
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Timing Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <Lightbulb size={14} className="text-accent-amber shrink-0 mt-0.5" />
              <p>
                Heaviest load detected on <strong className="font-bold">North Leg</strong>. AI timing has extended the green phase by 14s to clear backlogged traffic.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Flow Clearance Efficiency Bar Chart */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Flow Clearance efficiency</h3>
              <Badge variant="green">Auto-Optimized</Badge>
            </div>
            <p className="text-xs text-text-secondary">Clearance speed efficiency rating computed at each directional approach leg.</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'North Leg', value: 90, fill: '#34C759' },
                  { name: 'South Leg', value: 78, fill: '#0071E3' },
                  { name: 'East Leg', value: 65, fill: '#FF9500' },
                  { name: 'West Leg', value: 55, fill: '#FF3B30' },
                ]}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={26}>
                  {[
                    { fill: '#34C759' },
                    { fill: '#0071E3' },
                    { fill: '#FF9500' },
                    { fill: '#FF3B30' },
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
              <ShieldAlert size={14} className="text-accent-primary shrink-0 mt-0.5" />
              <p>
                West Leg efficiency is throttled to accommodate a predicted ambulance arriving via Vijay Nagar in 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Disable AI Control">
        <p className="text-sm text-text-secondary mb-6">
          Taking this junction off AI control means timing reverts to fixed schedule. Are you sure?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setConfirmModal(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={confirmDisableAi} className="flex-1">Confirm</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default JunctionDetail;
