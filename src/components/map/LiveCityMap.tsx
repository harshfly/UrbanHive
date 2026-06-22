import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Junction } from '../../types';
import { JunctionMarker } from './JunctionMarker';
import { CameraFeedOverlay } from './CameraFeedOverlay';
import { MapLegend } from './MapLegend';
import { Search, Layers, Compass, Landmark as LandmarkIcon, Bus, AlertTriangle, Eye } from 'lucide-react';
import { fetchJunctions } from '../../api/junctions.api';
import { useAppStore } from '../../store/useAppStore';
import { useEnvironmentStore } from '../../store/useEnvironmentStore';
import {
  indoreRoadConnections,
  brtsRoute,
  brtsStops,
  indoreLandmarks,
  mapTileUrls,
  Landmark,
  BRTSStop
} from '../../mock/indoreRoutes';

interface LiveCityMapProps {
  className?: string;
  showCamera?: boolean;
  showLegend?: boolean;
  showSearch?: boolean;
  ghostMode?: boolean;
  junctionsOverride?: Junction[];
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
}

// Dynamic map settings based on city selection
const cityConfig: Record<string, { center: [number, number]; zoom: number }> = {
  'Indore (Vijay Nagar)': { center: [22.7250, 75.8720], zoom: 13 },
  'Bhopal (MP Nagar)': { center: [23.2340, 77.4320], zoom: 14 },
  'Pune (Hinjewadi)': { center: [18.5880, 73.7320], zoom: 14 },
};

// Indore boundary coordinates polygon
const indoreBoundary: [number, number][] = [
  [22.7950, 75.8650],
  [22.7850, 75.9100],
  [22.7650, 75.9380],
  [22.7350, 75.9420],
  [22.7050, 75.9300],
  [22.6650, 75.8850],
  [22.6600, 75.8350],
  [22.6850, 75.8100],
  [22.7150, 75.8050],
  [22.7550, 75.8150],
  [22.7800, 75.8350],
  [22.7950, 75.8650],
];

// Fallback legacy road network for Bhopal and Pune
const legacyConnections: [string, string][] = [
  // Bhopal road network
  ['j-b1', 'j-b2'],
  ['j-b1', 'j-b4'],
  ['j-b2', 'j-b3'],
  ['j-b3', 'j-b4'],
  // Pune road network
  ['j-p1', 'j-p2'],
  ['j-p1', 'j-p4'],
  ['j-p2', 'j-p3'],
  ['j-p3', 'j-p4'],
];

const statusColors: Record<string, string> = {
  green: '#10B981', // emerald-500
  amber: '#F59E0B', // amber-500
  red: '#EF4444',   // red-500
};

// Component to handle dynamic map panning/zooming when city changes
const MapViewUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// Custom Google-style zoom controls
const MapZoomControls: React.FC = () => {
  const map = useMap();
  return (
    <div className="absolute bottom-20 right-4 z-[1000] flex flex-col gap-1.5 shadow-lg">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 flex items-center justify-center bg-bg-surface/90 hover:bg-bg-surface text-text-primary hover:text-accent-primary border border-border-subtle rounded-t-xl active:scale-95 transition-all font-bold text-lg cursor-pointer backdrop-blur-md"
        title="Zoom In"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 flex items-center justify-center bg-bg-surface/90 hover:bg-bg-surface text-text-primary hover:text-accent-primary border border-border-subtle border-t-0 rounded-b-xl active:scale-95 transition-all font-bold text-lg cursor-pointer backdrop-blur-md"
        title="Zoom Out"
      >
        −
      </button>
    </div>
  );
};

// Icon creators for Landmarks and Stops
const getLandmarkIcon = (type: string) => {
  const colors: Record<string, string> = {
    hospital: '#EF4444',
    mall: '#8B5CF6',
    temple: '#F59E0B',
    stadium: '#10B981',
    college: '#3B82F6',
    station: '#6B7280',
    lake: '#06B6D4',
  };
  const color = colors[type] || '#3B82F6';
  
  return L.divIcon({
    className: 'custom-landmark-marker',
    html: `<div style="background-color: ${color}20; border: 2px solid ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15)">
      <span style="font-size: 10px; font-weight: bold; color: ${color}; transform: translateY(-0.5px); font-family: monospace;">
        ${type.substring(0, 1).toUpperCase()}
      </span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const getBRTSIcon = () => {
  return L.divIcon({
    className: 'custom-brts-marker',
    html: `<div style="background-color: #0071E320; border: 2px solid #0071E3; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); box-shadow: 0 2px 5px rgba(0,0,0,0.1)">
      <div style="transform: rotate(-45deg); font-size: 8px; font-weight: 800; color: #0071E3; font-family: sans-serif;">B</div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

export const LiveCityMap: React.FC<LiveCityMapProps> = ({
  className,
  showCamera = true,
  showLegend = true,
  showSearch = true,
  ghostMode = false,
  junctionsOverride,
  children,
  center,
  zoom,
}) => {
  const [junctions, setJunctions] = useState<Junction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Layer visibility states
  const [showBoundary, setShowBoundary] = useState(true);
  const [showBRTS, setShowBRTS] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [cameraFeedOpen, setCameraFeedOpen] = useState(true);

  const selectedCityName = useAppStore((state) => state.city);
  const timeOfDay = useEnvironmentStore((state) => state.timeOfDay);

  const activeConfig = cityConfig[selectedCityName] || cityConfig['Indore (Vijay Nagar)'];
  const finalCenter = center || activeConfig.center;
  const finalZoom = zoom || activeConfig.zoom;

  const isIndore = selectedCityName === 'Indore (Vijay Nagar)';

  useEffect(() => {
    if (junctionsOverride) {
      setJunctions(junctionsOverride);
      setLoading(false);
      return;
    }
    setLoading(true);
    let active = true;
    fetchJunctions().then((data) => {
      if (active) {
        setJunctions(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [junctionsOverride, selectedCityName]);

  const junctionMap = useMemo(() => {
    return Object.fromEntries(junctions.map((j) => [j.id, j]));
  }, [junctions]);

  // Filter junctions based on search query
  const filteredJunctions = useMemo(() => {
    if (!searchQuery.trim()) return junctions;
    return junctions.filter(j => j.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [junctions, searchQuery]);

  if (loading) {
    return (
      <div className={`bg-bg-surface-alt rounded-3xl animate-pulse flex items-center justify-center ${className || ''}`} style={{ minHeight: 450 }}>
        <div className="flex flex-col items-center gap-2">
          <Compass className="animate-spin text-accent-primary" size={32} />
          <span className="text-xs font-semibold text-text-secondary">Loading Map Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-border-subtle shadow-md ${className || ''}`} style={{ minHeight: 450 }}>
      <MapContainer
        center={finalCenter}
        zoom={finalZoom}
        className="h-full w-full"
        style={{ minHeight: 450 }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={mapTileUrls[timeOfDay] || mapTileUrls.day} />
        <MapViewUpdater center={finalCenter} zoom={finalZoom} />
        <MapZoomControls />

        {/* 1. Indore boundary overlay */}
        {isIndore && showBoundary && (
          <Polygon
            positions={indoreBoundary}
            pathOptions={{
              color: '#0071E3',
              weight: 2,
              fillColor: '#0071E3',
              fillOpacity: 0.03,
              dashArray: '8 6',
              lineCap: 'round',
            }}
          >
            <Tooltip sticky className="!bg-bg-surface !border-border-subtle !rounded-lg !shadow-md !px-2.5 !py-1.5 !text-text-primary">
              <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">Indore Corporation Limit</span>
            </Tooltip>
          </Polygon>
        )}

        {/* 2. BRTS corridor line */}
        {isIndore && showBRTS && (
          <>
            <Polyline
              positions={brtsRoute}
              pathOptions={{
                color: '#0071E3',
                weight: 6,
                opacity: 0.15,
              }}
            />
            <Polyline
              positions={brtsRoute}
              pathOptions={{
                color: '#0071E3',
                weight: 2.5,
                opacity: 0.85,
                dashArray: '10 8',
              }}
            />
          </>
        )}

        {/* 3. BRTS Stop Markers */}
        {isIndore && showBRTS && brtsStops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={getBRTSIcon()}
          >
            <Tooltip direction="top" offset={[0, -10]} className="!bg-bg-surface !border-border-subtle !rounded-lg !shadow-md !px-3 !py-2 !text-text-primary">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-accent-primary uppercase tracking-widest flex items-center gap-1">
                  <Bus size={10} /> iBus BRTS Station
                </span>
                <span className="text-xs font-semibold">{stop.name}</span>
                <span className="text-[10px] text-text-tertiary">Daily Ridership: {stop.ridership.toLocaleString()}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* 4. Indore Landmarks */}
        {isIndore && showLandmarks && indoreLandmarks.map((landmark) => (
          <Marker
            key={landmark.id}
            position={[landmark.lat, landmark.lng]}
            icon={getLandmarkIcon(landmark.type)}
          >
            <Tooltip direction="top" offset={[0, -12]} className="!bg-bg-surface !border-border-subtle !rounded-lg !shadow-md !px-3 !py-2 !text-text-primary !max-w-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                  <LandmarkIcon size={10} /> {landmark.type.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-text-primary">{landmark.name}</span>
                <span className="text-[10px] text-text-secondary leading-normal mt-0.5">{landmark.description}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* 5. Road network connections */}
        {showRoads && (isIndore ? indoreRoadConnections : legacyConnections).map(([aId, bId], i) => {
          const a = junctionMap[aId];
          const b = junctionMap[bId];
          if (!a || !b) return null;
          
          const worstStatus = a.status === 'red' || b.status === 'red' ? 'red'
            : a.status === 'amber' || b.status === 'amber' ? 'amber' : 'green';
            
          return (
            <Polyline
              key={i}
              positions={[[a.lat, a.lng], [b.lat, b.lng]]}
              pathOptions={{
                color: statusColors[worstStatus],
                weight: 3,
                opacity: ghostMode ? 0.3 : 0.7,
              }}
            />
          );
        })}

        {/* 6. Junction markers */}
        {filteredJunctions.map((j) => (
          <JunctionMarker key={j.id} junction={j} ghostMode={ghostMode} />
        ))}

        {children}
      </MapContainer>

      {/* Floating Layer Visibility Widgets */}
      <div 
        className={`absolute z-[1000] flex flex-col gap-2 bg-bg-surface/90 backdrop-blur-md border border-border-subtle rounded-2xl p-3.5 shadow-lg max-w-[180px] transition-all duration-300 left-4 ${
          showCamera && cameraFeedOpen ? 'top-[185px]' : 'top-4'
        }`}
      >
        <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <Layers size={10} className="text-accent-primary" /> Map Layers
        </span>
        <label className="flex items-center justify-between gap-3 text-[10px] font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
          <span>Boundary</span>
          <input
            type="checkbox"
            checked={showBoundary}
            onChange={() => setShowBoundary(!showBoundary)}
            className="rounded text-accent-primary focus:ring-accent-primary w-3 h-3 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-[10px] font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
          <span>BRTS Corridor</span>
          <input
            type="checkbox"
            checked={showBRTS}
            onChange={() => setShowBRTS(!showBRTS)}
            className="rounded text-accent-primary focus:ring-accent-primary w-3 h-3 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-[10px] font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
          <span>Landmarks</span>
          <input
            type="checkbox"
            checked={showLandmarks}
            onChange={() => setShowLandmarks(!showLandmarks)}
            className="rounded text-accent-primary focus:ring-accent-primary w-3 h-3 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-[10px] font-semibold text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
          <span>Road Network</span>
          <input
            type="checkbox"
            checked={showRoads}
            onChange={() => setShowRoads(!showRoads)}
            className="rounded text-accent-primary focus:ring-accent-primary w-3 h-3 cursor-pointer"
          />
        </label>
      </div>

      {showCamera && cameraFeedOpen && (
        <CameraFeedOverlay onClose={() => setCameraFeedOpen(false)} />
      )}
      {showLegend && <MapLegend />}

      {showSearch && (
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search square or area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-bg-surface/90 backdrop-blur-md border border-border-subtle rounded-xl text-xs text-text-primary placeholder-text-tertiary shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-primary w-52 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};
