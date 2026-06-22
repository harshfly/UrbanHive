import React, { useState, useEffect } from 'react';
import { PageHeader } from '../layouts/PageHeader';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Camera, Search, Play, Check, Cpu, Eye, EyeOff, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../components/ui/Toast';
import { useAppStore } from '../store/useAppStore';
import { CameraHUDOverlay, OverlayModeSelector, OverlayMode } from '../components/cameras/CameraHUDOverlay';

interface CameraDevice {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'warning';
  vehiclesCount: number;
  pedestriansCount: number;
  avgSpeed: number;
  streamUrl: string;
  resolution: string;
  fps: number;
  aiAnalytics: boolean;
  ipAddress: string;
  city: string;
}

const cityConfig: Record<string, { center: [number, number]; zoom: number }> = {
  'Indore (Vijay Nagar)': { center: [22.7250, 75.8720], zoom: 13 },
  'Bhopal (MP Nagar)': { center: [23.2340, 77.4320], zoom: 14 },
  'Pune (Hinjewadi)': { center: [18.5880, 73.7320], zoom: 14 },
};

const initialCameras: CameraDevice[] = [
  {
    id: 'cam-1',
    name: 'IND-Vijay Nagar Main Crossing',
    lat: 22.7533,
    lng: 75.8937,
    status: 'active',
    vehiclesCount: 14,
    pedestriansCount: 2,
    avgSpeed: 42,
    streamUrl: 'vijay-nagar-main',
    resolution: '3840x2160 (4K)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.14.89.201',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-2',
    name: 'IND-Geeta Bhawan Square East',
    lat: 22.7210,
    lng: 75.8750,
    status: 'active',
    vehiclesCount: 8,
    pedestriansCount: 5,
    avgSpeed: 35,
    streamUrl: 'geeta-bhawan-east',
    resolution: '1920x1080 (FHD)',
    fps: 25,
    aiAnalytics: true,
    ipAddress: '10.14.89.202',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-3',
    name: 'IND-AB Road Transit Corridor',
    lat: 22.7350,
    lng: 75.8890,
    status: 'warning',
    vehiclesCount: 23,
    pedestriansCount: 0,
    avgSpeed: 18,
    streamUrl: 'ab-road-corridor',
    resolution: '3840x2160 (4K)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.14.89.203',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-4',
    name: 'IND-Palasia Junction South',
    lat: 22.7244,
    lng: 75.8839,
    status: 'active',
    vehiclesCount: 11,
    pedestriansCount: 3,
    avgSpeed: 38,
    streamUrl: 'palasia-south',
    resolution: '1920x1080 (FHD)',
    fps: 25,
    aiAnalytics: false,
    ipAddress: '10.14.89.204',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-5',
    name: 'IND-Radisson Square North',
    lat: 22.7480,
    lng: 75.9050,
    status: 'active',
    vehiclesCount: 17,
    pedestriansCount: 1,
    avgSpeed: 45,
    streamUrl: 'radisson-north',
    resolution: '3840x2160 (4K)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.14.89.205',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-6',
    name: 'IND-LIG Crossing Ring Road',
    lat: 22.7445,
    lng: 75.8885,
    status: 'inactive',
    vehiclesCount: 0,
    pedestriansCount: 0,
    avgSpeed: 0,
    streamUrl: 'lig-ring-road',
    resolution: '1920x1080 (FHD)',
    fps: 0,
    aiAnalytics: false,
    ipAddress: '10.14.89.206',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-7',
    name: 'IND-Bhawarkua Square South',
    lat: 22.6916,
    lng: 75.8672,
    status: 'active',
    vehiclesCount: 19,
    pedestriansCount: 4,
    avgSpeed: 32,
    streamUrl: 'bhawarkua-south',
    resolution: '1920x1080 (FHD)',
    fps: 25,
    aiAnalytics: true,
    ipAddress: '10.14.89.207',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-8',
    name: 'IND-Regal Crossing West',
    lat: 22.7196,
    lng: 75.8577,
    status: 'active',
    vehiclesCount: 15,
    pedestriansCount: 1,
    avgSpeed: 40,
    streamUrl: 'regal-west',
    resolution: '1920x1080 (FHD)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.14.89.208',
    city: 'Indore (Vijay Nagar)',
  },
  {
    id: 'cam-b1',
    name: 'BPL-Board Office Crossing',
    lat: 23.2324,
    lng: 77.4285,
    status: 'active',
    vehiclesCount: 18,
    pedestriansCount: 3,
    avgSpeed: 38,
    streamUrl: 'board-office',
    resolution: '1920x1080 (FHD)',
    fps: 25,
    aiAnalytics: true,
    ipAddress: '10.15.90.201',
    city: 'Bhopal (MP Nagar)',
  },
  {
    id: 'cam-b2',
    name: 'BPL-Jyoti Talkies Square',
    lat: 23.2300,
    lng: 77.4330,
    status: 'warning',
    vehiclesCount: 28,
    pedestriansCount: 6,
    avgSpeed: 22,
    streamUrl: 'jyoti-talkies',
    resolution: '3840x2160 (4K)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.15.90.202',
    city: 'Bhopal (MP Nagar)',
  },
  {
    id: 'cam-p1',
    name: 'PUN-Shivaji Chowk West',
    lat: 18.5913,
    lng: 73.7386,
    status: 'active',
    vehiclesCount: 22,
    pedestriansCount: 1,
    avgSpeed: 45,
    streamUrl: 'shivaji-chowk',
    resolution: '3840x2160 (4K)',
    fps: 30,
    aiAnalytics: true,
    ipAddress: '10.16.91.201',
    city: 'Pune (Hinjewadi)',
  },
  {
    id: 'cam-p2',
    name: 'PUN-Wipro Circle South',
    lat: 18.5800,
    lng: 73.7380,
    status: 'active',
    vehiclesCount: 16,
    pedestriansCount: 4,
    avgSpeed: 36,
    streamUrl: 'wipro-circle',
    resolution: '1920x1080 (FHD)',
    fps: 25,
    aiAnalytics: false,
    ipAddress: '10.16.91.202',
    city: 'Pune (Hinjewadi)',
  },
];

// Helper component to center map dynamically when camera selected
const ChangeMapView: React.FC<{ coords: [number, number]; zoom?: number }> = ({ coords, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, zoom, { animate: true, duration: 0.8 });
  }, [coords, zoom, map]);
  return null;
};

// SVG Animated Live Traffic Stream Simulator
const LiveStreamVisualizer: React.FC<{ id: string; active: boolean; aiOverlay: boolean }> = ({ id, active, aiOverlay }) => {
  if (!active) {
    return (
      <div className="absolute inset-0 bg-bg-surface-alt flex flex-col items-center justify-center gap-2 text-text-tertiary">
        <EyeOff size={32} strokeWidth={1.5} />
        <span className="text-xs font-semibold">Feed Offline / Standby</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-zinc-950 overflow-hidden select-none">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
      
      {/* Simulated Road Lines */}
      <svg className="w-full h-full" viewBox="0 0 300 160">
        <path d="M 0,80 L 300,80" stroke="#3f3f46" strokeWidth="24" />
        <path d="M 150,0 L 150,160" stroke="#3f3f46" strokeWidth="24" />
        
        {/* Dash lines */}
        <path d="M 0,80 L 300,80" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 6" />
        <path d="M 150,0 L 150,160" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 6" />

        {/* Intersection center Box */}
        <rect x="135" y="65" width="30" height="30" fill="none" stroke="#52525b" strokeWidth="2" />
        
        {/* Animated Vehicles */}
        <g>
          {/* Horizontal Vehicle 1 */}
          <circle cx="0" cy="74" r="5" fill="#0071E3">
            <animate attributeName="cx" from="-10" to="310" dur="4.2s" repeatCount="indefinite" />
          </circle>
          {/* Horizontal Vehicle 2 */}
          <rect x="0" y="82" width="10" height="5" fill="#34C759" rx="1">
            <animate attributeName="x" from="310" to="-20" dur="5.1s" repeatCount="indefinite" />
          </rect>
          {/* Vertical Vehicle 1 */}
          <circle cx="144" cy="0" r="5.5" fill="#FF3B30">
            <animate attributeName="cy" from="-10" to="170" dur="3.5s" repeatCount="indefinite" />
          </circle>
          {/* Vertical Vehicle 2 */}
          <rect x="152" y="0" width="6" height="11" fill="#FF9500" rx="1.5">
            <animate attributeName="y" from="170" to="-20" dur="6.5s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Bounding Box Overlays (AI Overlay) */}
        {aiOverlay && (
          <g>
            {/* Box 1 following Horiz Vehicle 1 */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="-15 67"
                to="305 67"
                dur="4.2s"
                repeatCount="indefinite"
              />
              <rect width="12" height="14" fill="none" stroke="#0071E3" strokeWidth="1.2" />
              <text x="0" y="-2" fill="#0071E3" fontSize="5" fontFamily="monospace" fontWeight="bold">CAR: 98%</text>
            </g>
            {/* Box 2 following Horiz Vehicle 2 */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="310 80"
                to="-20 80"
                dur="5.1s"
                repeatCount="indefinite"
              />
              <rect width="14" height="9" fill="none" stroke="#34C759" strokeWidth="1.2" />
              <text x="0" y="-2" fill="#34C759" fontSize="5" fontFamily="monospace" fontWeight="bold">BUS: 94%</text>
            </g>
            {/* Box 3 following Vert Vehicle 1 */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="137 -15"
                to="137 175"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <rect width="14" height="14" fill="none" stroke="#FF3B30" strokeWidth="1.2" />
              <text x="0" y="-2" fill="#FF3B30" fontSize="5" fontFamily="monospace" fontWeight="bold">SUV: 99%</text>
            </g>
          </g>
        )}
      </svg>

      {/* Stream indicators overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
        <span className="text-[10px] text-zinc-200 font-mono uppercase tracking-wider font-bold">LIVE</span>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-zinc-300 font-mono">
        <span>{id.includes('1') || id.includes('3') || id.includes('5') ? '4K' : 'FHD'}</span>
        <span>•</span>
        <span>30 FPS</span>
      </div>
    </div>
  );
};

const Cameras: React.FC = () => {
  const activeCity = useAppStore((s) => s.city);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCam, setSelectedCam] = useState<CameraDevice | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'warning' | 'inactive'>('all');
  const [aiOverlayActive, setAiOverlayActive] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.7533, 75.8937]);
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('detection');

  useEffect(() => {
    const filtered = initialCameras.filter((c) => c.city === activeCity);
    const activeConfig = cityConfig[activeCity] || cityConfig['Indore (Vijay Nagar)'];
    Promise.resolve().then(() => {
      setCameras(filtered);
      setSelectedCam(null);
      setMapCenter(activeConfig.center);
    });
  }, [activeCity]);

  // Leaflet custom camera icon generator
  const createCameraMarker = (cam: CameraDevice, isSelected: boolean) => {
    const color = cam.status === 'active' ? '#34C759' : cam.status === 'warning' ? '#FF9500' : '#86868B';
    const border = isSelected ? '#0071E3' : '#FFFFFF';
    const size = isSelected ? 32 : 26;

    return L.divIcon({
      className: 'camera-map-icon',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid ${border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const filteredCams = cameras.filter((cam) => {
    const matchesSearch = cam.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'all' || cam.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCameraSelect = (cam: CameraDevice) => {
    setSelectedCam(cam);
    setMapCenter([cam.lat, cam.lng]);
  };

  const toggleCameraStatus = (id: string) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'inactive' : 'active';
          showToast(
            `Camera feed ${c.name} is now ${nextStatus === 'active' ? 'Online' : 'Offline'}`,
            nextStatus === 'active' ? 'success' : 'error'
          );
          return {
            ...c,
            status: nextStatus,
            vehiclesCount: nextStatus === 'active' ? 12 : 0,
            pedestriansCount: nextStatus === 'active' ? 2 : 0,
            avgSpeed: nextStatus === 'active' ? 40 : 0,
          };
        }
        return c;
      })
    );
    if (selectedCam?.id === id) {
      setSelectedCam((prev) => prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 h-full overflow-hidden"
    >
      <PageHeader
        title="Live Traffic Feeds"
        breadcrumbs={[
          { label: 'Overview', to: '/' },
          { label: 'Cameras & Video Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <OverlayModeSelector mode={overlayMode} onChange={setOverlayMode} />
            <button
              onClick={() => setAiOverlayActive(!aiOverlayActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                aiOverlayActive
                  ? 'bg-accent-primary-soft text-accent-primary border-accent-primary/20'
                  : 'bg-bg-surface text-text-secondary border-border-subtle hover:bg-bg-surface-alt'
              }`}
            >
              {aiOverlayActive ? <Eye size={14} /> : <EyeOff size={14} />}
              AI Overlays: {aiOverlayActive ? 'On' : 'Off'}
            </button>
          </div>
        }
      />

      {/* Main split screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden min-h-0">
        
        {/* Left Side: Filter and Camera Feeds list (Scrollable) */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto pr-1">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-bg-surface border border-border-subtle rounded-2xl shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search camera nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-canvas border border-border-subtle rounded-xl text-xs font-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-1 bg-bg-canvas p-0.5 rounded-xl border border-border-subtle">
              {(['all', 'active', 'warning', 'inactive'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-bg-surface text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Grids */}
          {filteredCams.length === 0 ? (
            <div className="flex-1 bg-bg-surface border border-border-subtle rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-sm">
              <Camera size={48} className="text-text-tertiary opacity-30 mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-text-primary">No camera nodes found</h3>
              <p className="text-xs text-text-tertiary mt-1">Try adjusting your search query or status filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCams.map((cam) => {
                const isSelected = selectedCam?.id === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => handleCameraSelect(cam)}
                    className={`bg-bg-surface border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col min-w-0 ${
                      isSelected ? 'ring-2 ring-accent-primary border-transparent' : 'border-border-subtle'
                    }`}
                  >
                    {/* Simulated live video */}
                    <div className="aspect-[16/9] w-full relative">
                      <LiveStreamVisualizer id={cam.id} active={cam.status !== 'inactive'} aiOverlay={aiOverlayActive && overlayMode === 'detection'} />
                      <CameraHUDOverlay
                        mode={overlayMode}
                        isActive={aiOverlayActive && cam.status !== 'inactive' && overlayMode !== 'detection'}
                        vehicleCount={cam.vehiclesCount}
                        pedestrianCount={cam.pedestriansCount}
                        avgSpeed={cam.avgSpeed}
                      />
                    </div>

                    {/* Camera Info */}
                    <div className="p-4 flex flex-col gap-3 min-w-0">
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-xs font-bold text-text-primary truncate break-words leading-snug group-hover:text-accent-primary transition-colors">
                            {cam.name}
                          </h3>
                          <span className="text-[10px] text-text-tertiary font-mono mt-0.5 truncate">{cam.ipAddress}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize shrink-0 ${
                          cam.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : cam.status === 'warning'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {cam.status}
                        </span>
                      </div>

                      {/* Stats telemetry */}
                      {cam.status !== 'inactive' ? (
                        <div className="grid grid-cols-3 gap-2 bg-bg-canvas/50 border border-border-subtle/50 rounded-xl p-2.5 text-center">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-text-tertiary font-semibold">Vehicles</span>
                            <span className="text-xs font-mono font-bold text-text-primary">{cam.vehiclesCount}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-text-tertiary font-semibold">People</span>
                            <span className="text-xs font-mono font-bold text-text-primary">{cam.pedestriansCount}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-text-tertiary font-semibold">Avg Speed</span>
                            <span className="text-xs font-mono font-bold text-accent-primary">{cam.avgSpeed} km/h</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-5 text-center text-[11px] text-text-tertiary italic">
                          Telemetry feed offline
                        </div>
                      )}

                      {/* Action buttons inside card */}
                      <div className="flex items-center justify-between border-t border-border-subtle pt-3 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCameraStatus(cam.id);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            cam.status === 'inactive'
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-150'
                              : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-150'
                          }`}
                        >
                          <Radio size={11} className="animate-pulse" />
                          {cam.status === 'inactive' ? 'Power ON' : 'Shut Down'}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCam(cam);
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-accent-primary hover:text-accent-primary/80 transition-colors"
                        >
                          <Play size={11} /> Expand Stream
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Map showing camera positions (Sticky / Scroll Lock) */}
        <div className="lg:col-span-4 h-full flex flex-col gap-4 min-h-[300px]">
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-4 flex flex-col h-full shadow-sm overflow-hidden min-w-0">
            <div className="flex items-center justify-between mb-3 min-w-0">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Camera Location Matrix</h3>
              <span className="text-[10px] text-text-secondary font-semibold shrink-0">Indore Metro Hub</span>
            </div>
            
            {/* Map Container */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-border-subtle relative min-h-[250px]">
              <MapContainer
                center={mapCenter}
                zoom={14}
                className="h-full w-full"
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <ChangeMapView coords={mapCenter} />

                {cameras.map((c) => (
                  <Marker
                    key={c.id}
                    position={[c.lat, c.lng]}
                    icon={createCameraMarker(c, selectedCam?.id === c.id)}
                    eventHandlers={{
                      click: () => handleCameraSelect(c),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -12]} className="!bg-bg-surface !border-border-subtle !rounded-xl !shadow-md !px-3 !py-2">
                      <div className="min-w-[120px] max-w-[200px] break-words">
                        <div className="text-xs font-bold text-text-primary leading-tight">{c.name}</div>
                        <div className="text-[10px] text-text-secondary mt-1 font-semibold flex items-center gap-1 capitalize">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'active' ? 'bg-emerald-500' : c.status === 'warning' ? 'bg-amber-500' : 'bg-zinc-400'
                          }`} />
                          {c.status}
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Selected Camera Details Sidebar Card */}
            {selectedCam && (
              <div className="mt-4 p-3 bg-bg-canvas border border-border-subtle rounded-2xl flex flex-col gap-2 min-w-0">
                <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider truncate">Selected Sensor Node</h4>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-text-primary truncate break-words leading-tight">{selectedCam.name}</span>
                  <span className="text-[9px] font-mono text-text-tertiary mt-0.5">{selectedCam.ipAddress}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-bg-surface border border-border-subtle rounded-xl p-2">
                    <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Resolution</span>
                    <span className="text-[10px] font-mono font-bold text-text-primary">{selectedCam.resolution}</span>
                  </div>
                  <div className="bg-bg-surface border border-border-subtle rounded-xl p-2">
                    <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Analytics Mode</span>
                    <span className="text-[10px] font-bold text-accent-primary flex items-center gap-1">
                      <Cpu size={10} />
                      {selectedCam.aiAnalytics ? 'AI Edge Active' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Camera Live Feed Overlay Dialog Modal (Apple-style Sheets) */}
      <AnimatePresence>
        {selectedCam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
            
            {/* Backdrop click closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCam(null)}
              className="absolute inset-0"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-3xl bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row min-w-0 max-h-[90vh]"
            >
              {/* Left Side: Video visualization */}
              <div className="flex-1 aspect-video md:aspect-auto md:w-[60%] bg-zinc-950 relative min-h-[250px]">
                <LiveStreamVisualizer id={selectedCam.id} active={selectedCam.status !== 'inactive'} aiOverlay={aiOverlayActive} />
              </div>

              {/* Right Side: Advanced Controls & Telemetry */}
              <div className="w-full md:w-[40%] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-subtle bg-gradient-to-b from-bg-surface to-bg-canvas/20 overflow-y-auto">
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="flex justify-between items-start gap-2 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-bold text-text-primary truncate break-words leading-tight">
                        {selectedCam.name}
                      </h3>
                      <span className="text-[10px] text-text-tertiary font-mono mt-0.5">{selectedCam.ipAddress}</span>
                    </div>
                    <button
                      onClick={() => setSelectedCam(null)}
                      className="w-6 h-6 rounded-full bg-bg-surface-alt hover:bg-border-subtle flex items-center justify-center text-text-secondary font-bold text-xs shrink-0 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="border-t border-border-subtle pt-3">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Device Telemetry</span>
                    <ul className="mt-2 space-y-2 text-xs text-text-secondary">
                      <li className="flex justify-between">
                        <span>Node Status</span>
                        <span className={`font-semibold capitalize ${selectedCam.status === 'active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {selectedCam.status}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Framerates</span>
                        <span className="font-mono">{selectedCam.fps} FPS</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Resolution</span>
                        <span className="font-mono">{selectedCam.resolution}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>AI Inference Model</span>
                        <span className="font-semibold text-accent-primary">YOLOv8x-Custom-Road</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-border-subtle pt-3">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">AI Inference Overlay</span>
                    <div className="mt-2 flex flex-col gap-2">
                      <button
                        onClick={() => setAiOverlayActive(!aiOverlayActive)}
                        className={`flex items-center justify-between w-full p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          aiOverlayActive
                            ? 'bg-accent-primary-soft text-accent-primary border-accent-primary/20 shadow-sm'
                            : 'bg-bg-surface text-text-secondary border-border-subtle hover:bg-bg-surface-alt'
                        }`}
                      >
                        <span>Bounding Boxes & Labels</span>
                        {aiOverlayActive ? <Check size={14} /> : null}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border-subtle pt-4 mt-6">
                  <button
                    onClick={() => {
                      showToast(`Diagnostic query sent to ${selectedCam.ipAddress}`, 'success');
                      setSelectedCam(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary/95 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} /> Run Node Diagnostics
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cameras;
