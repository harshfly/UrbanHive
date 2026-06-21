export type AIMode = 'autonomous' | 'supervised' | 'manual';

export interface Junction {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'green' | 'amber' | 'red';
  avgWaitSeconds: number;
  aiOverridesToday: number;
  zone: string;
  congestionHistory: { time: string; congestion: number }[];
  currentTiming: { ns: number; ew: number };
  recommendedTiming: { ns: number; ew: number };
  city?: string;
}

export interface Alert {
  id: string;
  type: 'predicted' | 'active' | 'resolved';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Charger {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  currentLoad: number;
  waitTimeMins: number;
  distanceKm: number;
  city?: string;
}

export interface ParkingZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  polygon: [number, number][];
  totalSpots: number;
  availableSpots: number;
  city?: string;
}

export interface TransitVehicle {
  id: string;
  route: string;
  lat: number;
  lng: number;
  status: 'on-time' | 'delayed';
  nextStopEta: number; // in seconds
  city?: string;
}

export interface TimelineData {
  minuteOfDay: number;
  congestionLevel: number; // 0-100
}
