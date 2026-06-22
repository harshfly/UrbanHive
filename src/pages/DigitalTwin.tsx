import React, { useState, useMemo } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LiveCityMap } from '../components/map/LiveCityMap';
import { PageHeader } from '../layouts/PageHeader';
import { runSimulation } from '../api/simulation.api';
import { fetchJunctions } from '../api/junctions.api';
import { Junction } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

const scenarios = [
  { id: 'add-vehicles', label: '+ Add 200 vehicles (north zone)' },
  { id: 'close-junction', label: '+ Close Junction 7' },
  { id: 'heavy-rain', label: '+ Heavy rain event' },
];

const DigitalTwin: React.FC = () => {
  const [tab, setTab] = useState('Live View');
  const [forecastMin, setForecastMin] = useState(0);
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
  const [simResult, setSimResult] = useState<{ withoutAi: number; withAi: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [junctions, setJunctions] = useState<Junction[]>([]);

  React.useEffect(() => {
    fetchJunctions().then(setJunctions);
  }, []);

  // Forecast junctions: simulate 2 junctions going amber/red as slider increases
  const forecastJunctions = useMemo(() => {
    if (forecastMin === 0) return junctions;
    return junctions.map((j) => {
      if (j.id === 'j-4' && forecastMin >= 20) {
        return { ...j, status: forecastMin >= 40 ? 'red' as const : 'amber' as const, avgWaitSeconds: j.avgWaitSeconds + forecastMin };
      }
      if (j.id === 'j-6' && forecastMin >= 30) {
        return { ...j, status: 'amber' as const, avgWaitSeconds: j.avgWaitSeconds + forecastMin / 2 };
      }
      return j;
    });
  }, [junctions, forecastMin]);

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setSimResult(null);
  };

  const handleRunSimulation = async () => {
    setRunning(true);
    const result = await runSimulation(Array.from(selectedScenarios));
    setSimResult(result);
    setRunning(false);
  };

  const handleReset = () => {
    setSelectedScenarios(new Set());
    setSimResult(null);
  };

  // Generate chart data from simulation result using a deterministic function
  const simChartData = useMemo(() => {
    if (!simResult) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const t = i * 5;
      const fluctuationWithout = Math.sin(i * 1.5) * 2.5;
      const fluctuationWith = Math.cos(i * 1.5) * 1.5;
      return {
        time: `${t}m`,
        without: Math.max(0, Math.round((simResult.withoutAi + fluctuationWithout) * 10) / 10),
        with: Math.max(0, Math.round((simResult.withAi + fluctuationWith) * 10) / 10),
      };
    });
  }, [simResult]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader title="Digital Twin" />
      <Tabs tabs={['Live View', 'Simulation Mode']} activeTab={tab} onChange={setTab} className="max-w-md mb-6" />

      {tab === 'Live View' && (
        <div>
          {/* Forecast slider */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-display font-semibold text-text-primary">Forecast Horizon</h3>
              <span className="text-sm font-mono font-semibold text-accent-primary">+{forecastMin} min</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={forecastMin}
              onChange={(e) => setForecastMin(Number(e.target.value))}
              className="w-full h-2 bg-bg-surface-alt rounded-full appearance-none cursor-pointer accent-accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-tertiary font-mono mt-1">
              <span>Now</span><span>+15m</span><span>+30m</span><span>+45m</span><span>+60m</span>
            </div>
          </div>

          {/* Map */}
          <div style={{ height: 500 }} className="relative">
            <LiveCityMap
              className="h-full"
              junctionsOverride={forecastJunctions}
              ghostMode={forecastMin > 0}
              showCamera={false}
            />
            {forecastMin > 0 && (
              <div className="absolute top-4 left-4 z-[1000] bg-accent-amber-soft border border-accent-amber/30 rounded-lg px-3 py-1.5">
                <span className="text-xs font-mono font-semibold text-accent-amber">Forecast: +{forecastMin} min</span>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'Simulation Mode' && (
        <div>
          {/* Scenario builder */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm mb-4">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-3">Scenario Builder</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleScenario(s.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedScenarios.has(s.id)
                      ? 'bg-accent-primary text-white border-accent-primary'
                      : 'bg-bg-surface-alt text-text-secondary border-border-subtle hover:border-border-strong'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRunSimulation}
                disabled={selectedScenarios.size === 0 || running}
              >
                {running ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
              <Button variant="ghost" onClick={handleReset}>Reset Scenario</Button>
            </div>
          </div>

          {/* Results */}
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-accent-red-soft border border-accent-red/20 rounded-xl p-6 text-center">
                  <div className="text-xs font-medium uppercase tracking-wider text-accent-red mb-2">Without UrbanHive AI</div>
                  <div className="text-4xl font-mono font-bold text-accent-red">{simResult.withoutAi} min</div>
                  <div className="text-xs text-text-secondary mt-1">average travel time, scenario simulated</div>
                </div>
                <div className="bg-accent-primary-soft border border-accent-primary/20 rounded-xl p-6 text-center">
                  <div className="text-xs font-medium uppercase tracking-wider text-accent-primary mb-2">With UrbanHive AI</div>
                  <div className="text-4xl font-mono font-bold text-accent-primary">{simResult.withAi} min</div>
                  <div className="text-xs text-text-secondary mt-1">signals retimed pre-emptively, 18 min ahead</div>
                </div>
              </div>

              {/* Dual Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Simulation Efficacy Rings */}
                <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Simulation Efficiency Rings</h3>
                      <Badge variant="blue">Model Results</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">Simulated performance gains across core mobility efficiency metrics.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
                    <div className="h-40 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="25%"
                          outerRadius="100%"
                          barSize={8}
                          data={[
                            { name: 'Travel Time Saved', value: 38, fill: '#34C759' },
                            { name: 'Green Wave Lock', value: 82, fill: '#0071E3' },
                            { name: 'Delay Abatement', value: 65, fill: '#FF9500' },
                          ]}
                        >
                          <RadialBar background={{ fill: '#F5F5F7' }} dataKey="value" cornerRadius={12} />
                          <Tooltip />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute w-4 h-4 bg-bg-canvas border border-border-subtle rounded-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        { name: 'Travel Saved', value: '38%', fill: '#34C759' },
                        { name: 'Green Wave Lock', value: '82%', fill: '#0071E3' },
                        { name: 'Delay Abatement', value: '65%', fill: '#FF9500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-border-subtle/50 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                            <span className="text-xs font-bold text-text-primary truncate">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-text-secondary">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
                    <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">AI Simulation Insight</span>
                    <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
                      <Cpu size={14} className="text-accent-primary shrink-0 mt-0.5" />
                      <p>
                        Applying pre-emptive signal synchronization on corridor intersections decreases the travel time index by <strong className="font-bold text-accent-primary">38%</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Line Chart Comparison */}
                <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
                  <div>
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Travel Time Comparison</h3>
                    <p className="text-xs text-text-secondary">Simulated path travel time trend over a 60-minute duration window.</p>
                  </div>
                  <div className="h-44 my-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9098AC' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#9098AC' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: '#FFFFFF',
                            border: '1px solid #E5E5EA',
                            borderRadius: 12,
                            fontSize: 11,
                          }}
                        />
                        <Line type="monotone" dataKey="without" stroke="#FF3B30" strokeWidth={2} dot={false} name="Without AI" />
                        <Line type="monotone" dataKey="with" stroke="#34C759" strokeWidth={2} dot={false} name="With AI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
                    <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Queue Prediction</span>
                    <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
                      <Zap size={14} className="text-accent-amber shrink-0 mt-0.5" />
                      <p>
                        UrbanHive AI model acts <strong className="font-bold">18 minutes ahead</strong> of the simulated vehicle surge to bypass queuing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DigitalTwin;
