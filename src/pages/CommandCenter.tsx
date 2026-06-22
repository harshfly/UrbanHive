import React from 'react';
import {
  TrendingDown, Activity, Zap, ParkingCircle, Leaf,
  Cone, ShieldAlert, Clock,
} from 'lucide-react';
import { KpiCard } from '../components/cards/KpiCard';
import { StatCard } from '../components/cards/StatCard';
import { SparklineCard } from '../components/charts/SparklineCard';
import { TrafficBarChart } from '../components/charts/TrafficBarChart';
import { VehicleAreaChart } from '../components/charts/VehicleAreaChart';
import { TimelineScrubber } from '../components/charts/TimelineScrubber';
import { LiveCityMap } from '../components/map/LiveCityMap';
import { AlertCard } from '../components/cards/AlertCard';
import { useAlertStore } from '../store/useAlertStore';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

// Sparkline data
const junctionSparkline = [
  { label: 'Mon', value: 42 }, { label: 'Tue', value: 55 }, { label: 'Wed', value: 78 },
  { label: 'Thu', value: 62 }, { label: 'Fri', value: 85 }, { label: 'Sat', value: 70 },
  { label: 'Sun', value: 45 }, { label: 'Mon', value: 50 }, { label: 'Tue', value: 65 },
  { label: 'Wed', value: 72 }, { label: 'Thu', value: 58 }, { label: 'Fri', value: 80 },
  { label: 'Sat', value: 55 }, { label: 'Sun', value: 40 }, { label: 'Mon', value: 48 },
  { label: 'Tue', value: 68 }, { label: 'Wed', value: 75 }, { label: 'Thu', value: 62 },
];

const citySparkline = [
  { label: 'W1', value: 30 }, { label: 'W2', value: 45 }, { label: 'W3', value: 60 },
  { label: 'W4', value: 52 }, { label: 'W5', value: 72 }, { label: 'W6', value: 55 },
  { label: 'W7', value: 68 }, { label: 'W8', value: 75 }, { label: 'W9', value: 58 },
  { label: 'W10', value: 65 }, { label: 'W11', value: 80 }, { label: 'W12', value: 70 },
  { label: 'W13', value: 62 }, { label: 'W14', value: 55 }, { label: 'W15', value: 48 },
  { label: 'W16', value: 72 }, { label: 'W17', value: 78 }, { label: 'W18', value: 65 },
  { label: 'W19', value: 58 }, { label: 'W20', value: 70 }, { label: 'W21', value: 75 },
  { label: 'W22', value: 82 }, { label: 'W23', value: 68 }, { label: 'W24', value: 55 },
  { label: 'W25', value: 60 }, { label: 'W26', value: 72 }, { label: 'W27', value: 78 },
  { label: 'W28', value: 85 }, { label: 'W29', value: 70 }, { label: 'W30', value: 65 },
];

const monthlyTrend = [
  { label: 'Jan', value: 45 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 60 },
  { label: 'Apr', value: 55 }, { label: 'May', value: 68 }, { label: 'Jun', value: 75 },
  { label: 'Jul', value: 72 }, { label: 'Aug', value: 80 },
];

const CommandCenter: React.FC = () => {
  const alerts = useAlertStore((s) => s.alerts);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard label="Avg Travel Time" value="15 min" delta="-40% vs baseline" deltaType="positive" icon={<TrendingDown size={20} />} iconColor="text-accent-primary" />
        <KpiCard label="Active Vehicles" value="4,812" icon={<Activity size={20} />} iconColor="text-accent-blue" />
        <KpiCard label="EV Charger Load" value="68%" icon={<Zap size={20} />} iconColor="text-accent-primary" />
        <KpiCard label="Parking Occupancy" value="82%" delta="Near capacity" deltaType="negative" icon={<ParkingCircle size={20} />} iconColor="text-accent-amber" />
        <KpiCard label="CO₂ Saved Today" value="1.2t" icon={<Leaf size={20} />} iconColor="text-accent-primary" />
      </div>

      {/* Main Row: Live Map & Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-9" style={{ minHeight: 520 }}>
          <LiveCityMap className="h-full" />
        </div>

        {/* Alert Feed */}
        <div className="lg:col-span-3">
          <div className="bg-bg-surface border border-border-subtle rounded-3xl shadow-sm h-full flex flex-col overflow-hidden max-h-[520px]">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-gradient-to-r from-bg-surface to-bg-canvas/10">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Active Alerts</h3>
              <Badge variant="red">{alerts.filter(a => a.type !== 'resolved').length}</Badge>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCard alert={alert} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Quick Stats (Closures, Incidents, Delays) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Road Closures" value="9" icon={<Cone size={20} />} tint="amber" to="/traffic" />
        <StatCard label="Incidents" value="4" icon={<ShieldAlert size={20} />} tint="red" to="/emergency-corridor" />
        <StatCard label="Avg Delay" value="11m" icon={<Clock size={20} />} tint="primary" />
      </div>

      {/* Bottom Row: Charts & Sparkline Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Charts Side */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm">
              <TrafficBarChart />
            </div>
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm">
              <VehicleAreaChart />
            </div>
          </div>
        </div>

        {/* Sparklines Side */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <SparklineCard
              title="Vijay Nagar + AB Road"
              data={junctionSparkline}
              linkTo="/traffic/j-1"
              valueType="percent"
              subtitle="Congestion Level"
              color="#FF3B30"
            />
            <SparklineCard
              title="City Overview"
              data={citySparkline}
              color="#0071E3"
              valueType="percent"
              subtitle="Overall Mobility Index"
            />
            <SparklineCard
              title="Monthly Trend"
              data={monthlyTrend}
              color="#34C759"
              valueType="percent"
              subtitle="Efficiency Growth"
            />
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <TimelineScrubber />
    </motion.div>
  );
};

export default CommandCenter;
