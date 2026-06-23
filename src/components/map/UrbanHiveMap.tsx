import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AnimatePresence } from 'framer-motion';
import { Layers, Siren } from 'lucide-react';
import { useEnvironmentStore } from '../../store/useEnvironmentStore';
import { mapTileUrls } from '../../mock/indoreRoutes';
import { JunctionMarker } from './JunctionMarker';

// Types and Context
interface MapContextType {
  layers: {
    road: boolean;
    parking: boolean;
    ev: boolean;
    petrol: boolean;
    emergency: boolean;
  };
  toggleLayer: (layer: keyof MapContextType['layers']) => void;
  triggerEmergency: () => void;
}

const MapContext = React.createContext<MapContextType | null>(null);

const useMapContext = () => {
  const ctx = React.useContext(MapContext);
  if (!ctx) throw new Error('Layer components must be used within <UrbanHiveMap>');
  return ctx;
};

// Utilities
const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const MapZoomControls: React.FC = () => {
  const map = useMap();
  return (
    <div className="hidden md:flex absolute bottom-[185px] right-4 z-[1000] flex-col gap-1.5 shadow-lg">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 flex items-center justify-center bg-bg-surface/90 hover:bg-bg-surface text-text-primary hover:text-accent-primary border border-border-subtle rounded-t-xl active:scale-95 transition-all font-bold text-lg cursor-pointer backdrop-blur-md"
      >+</button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 flex items-center justify-center bg-bg-surface/90 hover:bg-bg-surface text-text-primary hover:text-accent-primary border border-border-subtle border-t-0 rounded-b-xl active:scale-95 transition-all font-bold text-lg cursor-pointer backdrop-blur-md"
      >−</button>
    </div>
  );
};

// ==========================================
// 1. Core Wrapper Component
// ==========================================
const UrbanHiveMapBase: React.FC<{
  children: React.ReactNode;
  center?: [number, number];
  zoom?: number;
  className?: string;
}> = ({ children, center = [22.7250, 75.8720], zoom = 13, className }) => {
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);
  
  const [layers, setLayers] = useState({
    road: true,
    parking: false,
    ev: false,
    petrol: false,
    emergency: false,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const triggerEmergency = () => {
    setLayers(prev => ({ ...prev, emergency: true, road: true }));
  };

  return (
    <MapContext.Provider value={{ layers, toggleLayer, triggerEmergency }}>
      <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden border border-border-subtle shadow-md ${className || ''}`} style={{ minHeight: 'max(400px, 60vh)' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          style={{ minHeight: 'max(400px, 60vh)' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={mapTileUrls[timeOfDay] || mapTileUrls.day} />
          <MapViewUpdater center={center} zoom={zoom} />
          <MapZoomControls />
          {children}
        </MapContainer>
      </div>
    </MapContext.Provider>
  );
};

// ==========================================
// 2. Road Network Layer (RL Agent Congestion)
// ==========================================
const RoadLayer: React.FC<{ junctions: any[], connections: [string, string][] }> = ({ junctions, connections }) => {
  const { layers } = useMapContext();
  if (!layers.road) return null;

  const junctionMap = Object.fromEntries(junctions.map((j) => [j.id, j]));
  const statusColors: Record<string, string> = { green: '#34C759', amber: '#FF9500', red: '#FF3B30' };

  return (
    <>
      {connections.map(([aId, bId], i) => {
        const a = junctionMap[aId];
        const b = junctionMap[bId];
        if (!a || !b) return null;
        
        const worstStatus = a.status === 'red' || b.status === 'red' ? 'red'
          : a.status === 'amber' || b.status === 'amber' ? 'amber' : 'green';
          
        return (
          <Polyline
            key={i}
            positions={[[a.lat, a.lng], [b.lat, b.lng]]}
            pathOptions={{ color: statusColors[worstStatus], weight: 4, opacity: 0.8 }}
          />
        );
      })}
      {junctions.map((j) => (
        <JunctionMarker key={j.id} junction={j} ghostMode={false} />
      ))}
    </>
  );
};

// ==========================================
// 3. Parking Zones Layer
// ==========================================
const ParkingLayer: React.FC<{ zones: any[] }> = ({ zones }) => {
  const { layers } = useMapContext();
  if (!layers.parking) return null;

  const getColor = (z: any) => {
    const ratio = z.availableSpots / z.totalSpots;
    if (ratio === 0) return '#FF3B30';
    if (ratio < 0.3) return '#FF9500';
    return '#34C759';
  };

  return (
    <>
      {zones.map((z) => (
        <Polygon
          key={z.id}
          positions={z.polygon}
          pathOptions={{ fillColor: getColor(z), fillOpacity: 0.4, color: getColor(z), weight: 2 }}
        >
          <Tooltip>
            <div className="p-1">
              <div className="font-bold text-xs text-text-primary">{z.name}</div>
              <div className="text-[10px] text-text-secondary mt-0.5">{z.availableSpots} / {z.totalSpots} spots free</div>
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
};

// ==========================================
// 4. EV Charging Stations Layer
// ==========================================
const EVLayer: React.FC<{ chargers: any[] }> = ({ chargers }) => {
  const { layers } = useMapContext();
  if (!layers.ev) return null;

  const getColor = (load: number) => {
    if (load >= 80) return '#FF3B30';
    if (load >= 50) return '#FF9500';
    return '#34C759';
  };

  return (
    <>
      {chargers.map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.lat, c.lng]}
          radius={Math.max(8, c.currentLoad / 5)}
          pathOptions={{ fillColor: getColor(c.currentLoad), fillOpacity: 0.8, color: '#ffffff', weight: 1.5 }}
        >
          <Tooltip>
            <div className="p-1">
              <div className="font-bold text-xs text-text-primary">{c.name}</div>
              <div className="text-[10px] text-text-secondary mt-0.5">Load: {c.currentLoad}%</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

// ==========================================
// 5. Petrol Pumps Layer
// ==========================================
const PetrolLayer: React.FC<{ pumps: any[] }> = ({ pumps }) => {
  const { layers } = useMapContext();
  if (!layers.petrol) return null;

  const getColor = (queue: number) => {
    if (queue >= 15) return '#FF3B30';
    if (queue >= 5) return '#FF9500';
    return '#34C759';
  };

  return (
    <>
      {pumps.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={Math.max(8, p.queueLength)}
          pathOptions={{ fillColor: getColor(p.queueLength), fillOpacity: 0.8, color: '#ffffff', weight: 1.5 }}
        >
          <Tooltip>
            <div className="p-1">
              <div className="font-bold text-xs text-text-primary">{p.name}</div>
              <div className="text-[10px] text-text-secondary mt-0.5">Queue: {p.queueLength} vehicles</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

// ==========================================
// 6. Emergency Corridor Layer
// ==========================================
const EmergencyLayer: React.FC<{ path: [number, number][] }> = ({ path }) => {
  const { layers } = useMapContext();
  if (!layers.emergency || path.length === 0) return null;

  return (
    <AnimatePresence>
      {/* Glow aura */}
      <Polyline
        positions={path}
        pathOptions={{ color: '#FF3B30', weight: 14, opacity: 0.2 }}
        className="animate-pulse"
      />
      {/* Core path */}
      <Polyline
        positions={path}
        pathOptions={{ color: '#FF3B30', weight: 4, opacity: 0.9, dashArray: '10 8' }}
      />
    </AnimatePresence>
  );
};

// ==========================================
// 7. Floating Control Panel
// ==========================================
export const ControlPanel: React.FC = () => {
  const { layers, toggleLayer, triggerEmergency } = useMapContext();

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 z-[1000] flex flex-col gap-3 md:gap-2 bg-bg-surface/95 md:bg-bg-surface/90 backdrop-blur-xl border-t md:border border-border-subtle rounded-t-3xl md:rounded-2xl p-5 md:p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-xl md:max-w-[220px]">
      <span className="text-[10px] md:text-[9px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5 mb-1 md:mb-1.5 pointer-events-none select-none">
        <Layers size={14} className="text-accent-primary" /> Map Data Layers
      </span>
      
      {Object.entries({
        road: 'Road Network',
        parking: 'Parking Zones',
        ev: 'EV Chargers',
        petrol: 'Petrol Pumps'
      }).map(([key, label]) => (
        <label key={key} className="flex items-center justify-between gap-3 text-sm md:text-xs font-bold text-text-secondary cursor-pointer hover:text-text-primary transition-colors py-1.5 md:py-0">
          <span>{label}</span>
          <input
            type="checkbox"
            checked={layers[key as keyof typeof layers]}
            onChange={() => toggleLayer(key as keyof typeof layers)}
            className="rounded text-accent-primary focus:ring-accent-primary w-5 h-5 md:w-4 md:h-4 cursor-pointer border-border-strong"
          />
        </label>
      ))}

      <div className="w-full h-px bg-border-subtle my-1.5 md:my-1" />

      <button
        onClick={triggerEmergency}
        className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-3.5 md:py-2.5 bg-accent-red-soft hover:bg-accent-red/20 text-accent-red rounded-xl text-sm md:text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
      >
        <Siren size={16} className="md:w-3.5 md:h-3.5" />
        {layers.emergency ? 'Corridor Active' : 'Dispatch Emergency'}
      </button>
    </div>
  );
};

// ==========================================
// Export Compound Component
// ==========================================
export const UrbanHiveMap = Object.assign(UrbanHiveMapBase, {
  RoadLayer,
  ParkingLayer,
  EVLayer,
  PetrolLayer,
  EmergencyLayer,
  ControlPanel,
});
