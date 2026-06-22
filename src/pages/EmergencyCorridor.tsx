import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../layouts/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { LiveCityMap } from '../components/map/LiveCityMap';
import { CorridorRouteLayer } from '../components/map/CorridorRouteLayer';
import { showToast } from '../components/ui/Toast';
import { Siren, MapPin, Flame, ShieldCheck, Compass, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CorridorTerminal } from '../components/emergency/CorridorTerminal';

const corridorPath: [number, number][] = [
  [22.7533, 75.8937],
  [22.7350, 75.8890],
  [22.7244, 75.8839],
  [22.7210, 75.8750],
];

const EmergencyCorridor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [vehicleType, setVehicleType] = useState('ambulance');
  const [destination, setDestination] = useState('MY Hospital');
  const [eta, setEta] = useState(360); // 6 minutes in seconds
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setEta((prev) => {
          if (prev <= 1) {
            if (timerRef.current !== undefined) clearInterval(timerRef.current);
            setIsActive(false);
            showToast('Vehicle arrived — corridor closed, signals restored', 'success');
            return 360;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current !== undefined) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleActivate = () => {
    setIsActive(true);
    setEta(360);
  };

  const handleDeactivate = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setEta(360);
    showToast('Corridor deactivated — signals restored', 'success');
  };

  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };



  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {!isActive ? (
        <>
          <PageHeader title="Emergency Dispatch Control" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Request New Emergency Green Corridor</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Vehicle Dispatch ID</label>
                    <input
                      type="text"
                      defaultValue="AMB-104"
                      className="w-full px-3 py-2.5 bg-bg-surface border border-border-subtle rounded-xl text-xs font-mono font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5">Emergency Type Tier</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'ambulance', label: 'Ambulance', icon: <Siren size={14} /> },
                        { value: 'fire', label: 'Fire Engine', icon: <Flame size={14} /> },
                        { value: 'police', label: 'Police Rescue', icon: <ShieldCheck size={14} /> },
                      ].map((v) => (
                        <button
                          key={v.value}
                          onClick={() => setVehicleType(v.value)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                            vehicleType === v.value
                              ? 'border-accent-red bg-accent-red-soft text-accent-red'
                              : 'border-border-subtle text-text-secondary hover:bg-bg-canvas/50'
                          }`}
                        >
                          {v.icon} {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Current Coordinates</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-canvas border border-border-subtle rounded-xl text-xs font-semibold text-text-secondary">
                      <MapPin size={14} className="text-text-tertiary" />
                      <span>Auto-Assigned: Vijay Nagar Crossing</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Hospital Destination</label>
                    <Select
                      value={destination}
                      options={[
                        { label: 'MY Hospital', value: 'MY Hospital' },
                        { label: 'Bombay Hospital', value: 'Bombay Hospital' },
                        { label: 'CHL Hospital', value: 'CHL Hospital' },
                      ]}
                      onChange={setDestination}
                      className="w-full text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="danger"
                size="lg"
                className="w-full mt-6 py-3 rounded-xl animate-pulse-box-red text-xs uppercase tracking-wider font-bold"
                onClick={handleActivate}
              >
                <Siren size={18} className="mr-2" />
                Activate Override Corridor
              </Button>
            </div>

            {/* Historical Emergency Chart (Circular) */}
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[420px]">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Historical Dispatch Split</h3>
                  <Badge variant="red">Indore Logs</Badge>
                </div>
                <p className="text-xs text-text-secondary">Distribution of triggered signal pre-emptions by emergency vehicle category.</p>
              </div>

              <div className="h-40 flex items-center justify-center relative my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Ambulance', value: 60, fill: '#FF3B30' },
                        { name: 'Fire Engine', value: 25, fill: '#FF9500' },
                        { name: 'Police Rescue', value: 15, fill: '#0071E3' },
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
                        { fill: '#FF9500' },
                        { fill: '#0071E3' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Locks</span>
                  <span className="text-sm font-mono font-bold text-text-primary leading-none mt-0.5">582</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { name: 'Ambulance Priority', value: 60, fill: '#FF3B30' },
                  { name: 'Fire Engine Override', value: 25, fill: '#FF9500' },
                  { name: 'Police Corridor Link', value: 15, fill: '#0071E3' },
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

              <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3 mt-4">
                <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Pre-emption Safeguard</span>
                <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
                  <Compass size={14} className="text-accent-primary shrink-0 mt-0.5" />
                  <p>
                    Corridor routing has achieved a <strong className="font-bold">99.2% zero-delay lock rate</strong> with no cross-traffic safety warnings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Active Corridor State */
        <div>
          {/* Status banner */}
          <div className="bg-accent-red-soft border border-accent-red/20 rounded-3xl p-5 mb-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-accent-red flex items-center justify-center animate-pulse">
              <Siren size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-accent-red uppercase tracking-wider">Corridor #04 Actively Locked</h2>
              <p className="text-xs text-text-secondary font-semibold capitalize mt-0.5">{vehicleType} → {destination}</p>
            </div>
            <Button variant="ghost" onClick={handleDeactivate} size="sm" className="rounded-xl border border-accent-red/10 text-xs">
              Deactivate Override
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map with corridor */}
            <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-border-subtle shadow-sm" style={{ height: 500 }}>
              <LiveCityMap className="h-full" showCamera={false} showSearch={false}>
                <CorridorRouteLayer path={corridorPath} />
              </LiveCityMap>
            </div>

            {/* Active stats & wave lock indicator */}
            <div className="flex flex-col gap-6">
              {/* Timing */}
              <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Live Dispatch Telemetry</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-bg-canvas border border-border-subtle rounded-2xl p-3">
                    <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold block mb-1">ETA</span>
                    <span className="text-lg font-mono font-bold text-accent-red">{formatEta(eta)}</span>
                  </div>
                  <div className="bg-bg-canvas border border-border-subtle rounded-2xl p-3">
                    <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold block mb-1">Junctions</span>
                    <span className="text-lg font-mono font-bold text-accent-primary">4 / 4</span>
                  </div>
                  <div className="bg-bg-canvas border border-border-subtle rounded-2xl p-3">
                    <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold block mb-1">Rerouted</span>
                    <span className="text-lg font-mono font-bold text-accent-primary">127</span>
                  </div>
                </div>
              </div>

              {/* Wave lock bar chart */}
              <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-1 min-h-[290px]">
                <div>
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Green Wave Priority Lock</h3>
                  <p className="text-xs text-text-secondary">Intersection signal reservation lock index along the emergency path.</p>
                </div>

                <div className="h-32 my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Route Lock', value: 100, fill: '#FF3B30' },
                        { name: 'Cleared Junc', value: 66, fill: '#34C759' },
                        { name: 'Path Clear', value: 88, fill: '#0071E3' },
                      ]}
                      margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                        {[
                          { fill: '#FF3B30' },
                          { fill: '#34C759' },
                          { fill: '#0071E3' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Safety Override</span>
                  <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
                    <ShieldAlert size={14} className="text-accent-red shrink-0 mt-0.5" />
                    <p>
                      Automated signal override active. Side lanes are held at red phases to prevent crossway path conflicts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Green-Wave Terminal */}
          <CorridorTerminal
            isActive={isActive}
            vehicleType={vehicleType}
            destination={destination}
            eta={eta}
          />
        </div>
      )}
    </motion.div>
  );
};

export default EmergencyCorridor;
