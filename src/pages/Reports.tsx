import React, { useState } from 'react';
import { PageHeader } from '../layouts/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Download, Compass, ShieldAlert, BatteryCharging, AlertTriangle } from 'lucide-react';
import { showToast, dismissToast } from '../components/ui/Toast';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { motion } from 'framer-motion';

// Mock report insights based on ranges
const getInsights = (range: string) => {
  if (range === '7 days') {
    return {
      travelTime: "Palasia Corridor reports a 12% speed increase following green wave adjustments.",
      evLoad: "Supercharger hubs experienced peak usage spikes between 14:00 and 16:00.",
      response: "Average dispatch time lowered to 4.2 minutes due to emergency automated pre-emptions.",
      incidents: "Breaking down vehicle failures constitutes 45% of total roadway blockages.",
    };
  } else if (range === '30 days') {
    return {
      travelTime: "Bypass Road delays reduced by an average of 4.8 minutes per rush hour transit.",
      evLoad: "Fast charger grids maintain a stable 62% average occupancy index across all central quadrants.",
      response: "Response goals achieved for 92% of critical dispatch requests this month.",
      incidents: "Signal failures accounted for less than 8% of delays, reflecting high hardware uptime.",
    };
  } else {
    return {
      travelTime: "City-wide average travel times show an 18.5% net improvement over the last quarter.",
      evLoad: "EV charging station load grew by 28%, aligning with the introduction of 200 new green cabs.",
      response: "Emergency corridors reduced average responder travel times by 3.2 minutes globally.",
      incidents: "Collision counts decreased by 15% due to predictive red-light violation warnings.",
    };
  }
};



const Reports: React.FC = () => {
  const [range, setRange] = useState('30 days');
  const insights = getInsights(range);

  const handleExport = () => {
    const loadId = showToast('Generating PDF report...', 'loading');
    setTimeout(() => {
      dismissToast(loadId);
      showToast('Report generated successfully', 'success');
    }, 1500);
  };

  // Data sets for circular charts
  const travelTimeData = [
    { name: 'Palasia Square', value: 85, fill: '#34C759' },
    { name: 'Bypass Road', value: 78, fill: '#0071E3' },
    { name: 'Vijay Nagar', value: 68, fill: '#FF9500' },
    { name: 'AB Road BRTS', value: 92, fill: '#30B0C7' },
  ];

  const evLoadData = [
    { name: 'Superchargers', value: 45, percent: 45, fill: '#0071E3' },
    { name: 'Fast Chargers', value: 35, percent: 35, fill: '#34C759' },
    { name: 'Slow Chargers', value: 15, percent: 15, fill: '#FF9500' },
    { name: 'Idle / Reserve', value: 5, percent: 5, fill: '#AEAEB2' },
  ];



  const incidentData = [
    { name: 'Vehicle Breakdown', value: 45, fill: '#FF9500' },
    { name: 'Minor Collision', value: 30, fill: '#FF3B30' },
    { name: 'Road Obstruction', value: 15, fill: '#0071E3' },
    { name: 'Signal Faults', value: 10, fill: '#AEAEB2' },
  ];

  const hourlyResponseData = [
    { name: '08:00', Response: 4.2, Target: 5.0 },
    { name: '10:00', Response: 4.8, Target: 5.0 },
    { name: '12:00', Response: 5.2, Target: 5.0 },
    { name: '14:00', Response: 4.5, Target: 5.0 },
    { name: '16:00', Response: 4.1, Target: 5.0 },
    { name: '18:00', Response: 4.9, Target: 5.0 },
    { name: '20:00', Response: 3.8, Target: 5.0 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader
        title="System Reports"
        actions={
          <Button onClick={handleExport} className="rounded-xl px-5 py-2.5">
            <Download size={15} className="mr-2" />
            Export PDF Report
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Tabs tabs={['7 days', '30 days', '90 days']} activeTab={range} onChange={setRange} className="max-w-xs" />
        <span className="text-xs text-text-secondary font-medium">Reporting Period: Indore Smart Hub logs</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Corridor Speed Indices (Bar Chart) */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Corridor Speed Indices</h3>
              <Badge variant="green">Optimal</Badge>
            </div>
            <p className="text-xs text-text-secondary">Average speed efficiency rating computed across key corridors.</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={24}>
                  {travelTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Performance Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <Compass size={14} className="text-accent-primary shrink-0 mt-0.5" />
              <p>{insights.travelTime}</p>
            </div>
          </div>
        </div>

        {/* Card 2: EV Load Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">EV Charging Load Split</h3>
              <Badge variant="blue">Grid Smart</Badge>
            </div>
            <p className="text-xs text-text-secondary">Distribution of current utilization rates by charging tier.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={evLoadData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={4} dataKey="value">
                    {evLoadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Usage Load</span>
                <span className="text-sm font-mono font-bold text-text-primary leading-none mt-0.5">Medium</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {evLoadData.map((item, i) => (
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

          <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Energy Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <BatteryCharging size={14} className="text-accent-primary shrink-0 mt-0.5" />
              <p>{insights.evLoad}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Emergency Response Time (Area Chart) */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Responder Target Index</h3>
              <Badge variant="red">Emergency</Badge>
            </div>
            <p className="text-xs text-text-secondary">Emergency arrival response time profile compared to target thresholds.</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyResponseData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8E8E93', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Response" stroke="#FF3B30" strokeWidth={2} fillOpacity={1} fill="url(#colorResponse)" name="Response Time" />
                <Area type="monotone" dataKey="Target" stroke="#AEAEB2" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Target (5.0m)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-bg-canvas/50 border border-border-subtle/50 rounded-2xl p-3">
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Pre-emption Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <ShieldAlert size={14} className="text-accent-red shrink-0 mt-0.5" />
              <p>{insights.response}</p>
            </div>
          </div>
        </div>

        {/* Card 4: Incident Category split Donut */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Incident Category Share</h3>
              <Badge variant="amber">Road Safety</Badge>
            </div>
            <p className="text-xs text-text-secondary">Proportion of road incident reports categorized by severity type.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-4">
            <div className="h-40 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incidentData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={4} dataKey="value">
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Incidents</span>
                <span className="text-sm font-mono font-bold text-text-primary leading-none mt-0.5">42</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {incidentData.map((item, i) => (
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
            <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-1">Safety Insight</span>
            <div className="flex items-start gap-1.5 text-xs text-text-primary font-medium">
              <AlertTriangle size={14} className="text-accent-amber shrink-0 mt-0.5" />
              <p>{insights.incidents}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
