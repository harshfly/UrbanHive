import React, { useState, useEffect } from 'react';
import { PageHeader } from '../layouts/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { fetchChargers } from '../api/chargers.api';
import { Charger } from '../types';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../store/useAppStore';
import { showToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BatteryCharging, ShieldAlert } from 'lucide-react';

const cityConfig: Record<string, { center: [number, number]; zoom: number }> = {
  'Indore (Vijay Nagar)': { center: [22.7250, 75.8720], zoom: 13 },
  'Bhopal (MP Nagar)': { center: [23.2340, 77.4320], zoom: 14 },
  'Pune (Hinjewadi)': { center: [18.5880, 73.7320], zoom: 14 },
};

const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const EvCharging: React.FC = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const aiMode = useAppStore((s) => s.aiMode);
  const activeCity = useAppStore((s) => s.city);
  const [showRebalance, setShowRebalance] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
    });
    let active = true;
    fetchChargers().then((data) => {
      if (active) {
        setChargers(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [activeCity]);

  const getColor = (load: number) => {
    if (load >= 80) return '#D6364F';
    if (load >= 50) return '#C77D12';
    return '#0F8B6C';
  };

  const getRadius = (load: number) => {
    return Math.max(8, load / 5);
  };

  const overloaded = chargers.filter((c) => c.currentLoad > 90);
  const lowLoad = chargers.filter((c) => c.currentLoad < 30);

  if (loading) {
    return (
      <div>
        <PageHeader title="EV & Charging" />
        <div className="h-96 bg-bg-surface-alt rounded-xl animate-pulse" />
      </div>
    );
  }

  const activeConfig = cityConfig[activeCity] || cityConfig['Indore (Vijay Nagar)'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader title="EV & Charging" />

      {/* AI Rebalance suggestion */}
      {showRebalance && overloaded.length > 0 && lowLoad.length > 0 && (
        <div className="bg-accent-primary-soft border border-accent-primary/20 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-text-primary">
              Redirect 4 incoming vehicles from {overloaded[0].name} → {lowLoad[0].name} ({lowLoad[0].currentLoad}% load, 3 min further)
            </div>
            <div className="text-xs text-text-secondary mt-0.5">AI Rebalance Suggestion</div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              showToast('Rebalance approved — routing updated', 'success');
              setShowRebalance(false);
            }}
            disabled={aiMode === 'manual'}
          >
            Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowRebalance(false)}>Dismiss</Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-border-subtle shadow-sm" style={{ height: 480 }}>
          <MapContainer
            center={activeConfig.center}
            zoom={activeConfig.zoom}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapViewUpdater center={activeConfig.center} zoom={activeConfig.zoom} />
            {chargers.map((c) => (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={getRadius(c.currentLoad)}
                pathOptions={{
                  fillColor: getColor(c.currentLoad),
                  fillOpacity: 0.7,
                  color: getColor(c.currentLoad),
                  weight: 2,
                }}
              >
                <Tooltip>
                  <div className="p-1">
                    <div className="font-bold text-xs text-text-primary">{c.name}</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">Load: {c.currentLoad}% | Wait: {c.waitTimeMins}m</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Station table */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl shadow-sm overflow-hidden flex flex-col h-[480px]">
          <div className="px-6 py-4 border-b border-border-subtle bg-gradient-to-r from-bg-surface to-bg-canvas/10">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Charging Stations</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {chargers.map((c) => (
              <div key={c.id} className="px-6 py-4 border-b border-border-subtle last:border-0 hover:bg-bg-canvas/40 transition-colors flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-text-primary truncate">{c.name}</span>
                  <Badge variant={c.currentLoad > 80 ? 'red' : c.currentLoad > 50 ? 'amber' : 'green'}>
                    {c.currentLoad}%
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-text-secondary font-mono font-semibold">
                  <span>Cap: {c.capacity} bays</span>
                  <span>Wait: {c.waitTimeMins}m</span>
                  <span>{c.distanceKm} km</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circular Charging Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Card 1: Grid Load Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Charging Grid Split</h3>
              <Badge variant="green">Load Stable</Badge>
            </div>
            <p className="text-xs text-text-secondary">Active utilization breakdown across all charging standard speeds.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Fast Charging', value: 50, fill: '#0071E3' },
                      { name: 'Supercharging', value: 25, fill: '#34C759' },
                      { name: 'Slow Charging', value: 15, fill: '#FF9500' },
                      { name: 'Idle Bays', value: 10, fill: '#AEAEB2' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { fill: '#0071E3' },
                      { fill: '#34C759' },
                      { fill: '#FF9500' },
                      { fill: '#AEAEB2' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Total Power</span>
                <span className="text-xs font-mono font-bold text-text-primary leading-none mt-0.5">850 kW</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { name: 'Fast Charging', value: 50, fill: '#0071E3' },
                { name: 'Supercharging', value: 25, fill: '#34C759' },
                { name: 'Slow Charging', value: 15, fill: '#FF9500' },
                { name: 'Idle Bays', value: 10, fill: '#AEAEB2' },
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
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Energy Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <BatteryCharging size={14} className="text-accent-primary shrink-0 mt-0.5" />
              <p>
                Supercharger hubs at Vijay Nagar are held at <strong className="font-bold text-accent-primary">90% load</strong>. Grid recommends secondary slow charging incentives.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Sector Occupancy Bar Chart */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Sector Occupancy</h3>
              <Badge variant="blue">Grid Density</Badge>
            </div>
            <p className="text-xs text-text-secondary">Average charging bay occupancy ratings segmented by municipal zones.</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'North Zone', value: 88, fill: '#FF3B30' },
                  { name: 'Central Hubs', value: 65, fill: '#0071E3' },
                  { name: 'South Sector', value: 42, fill: '#34C759' },
                ]}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                  {[
                    { fill: '#FF3B30' },
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
                High grid loads in North Zone are mitigated by dynamic rebalance triggers routing drivers to South stations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EvCharging;
