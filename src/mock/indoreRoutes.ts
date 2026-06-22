/**
 * Indore city road network data — actual routes, BRTS corridors, and landmarks.
 * Coordinates are approximate real-world positions for Indore, MP.
 */

// ─── Junction-to-junction road connections ───
// Each tuple is [sourceJunctionId, targetJunctionId]
export const indoreRoadConnections: [string, string][] = [
  // AB Road corridor (north-south spine)
  ['j-14', 'j-1'],   // Bombay Hospital → Vijay Nagar
  ['j-1', 'j-24'],   // Vijay Nagar → Scheme 54
  ['j-24', 'j-4'],   // Scheme 54 → LIG
  ['j-4', 'j-15'],   // LIG → Lantern
  ['j-15', 'j-2'],   // Lantern → Palasia
  ['j-2', 'j-6'],    // Palasia → Geeta Bhawan
  ['j-6', 'j-3'],    // Geeta Bhawan → Bhawarkua
  ['j-3', 'j-7'],    // Bhawarkua → Rajiv Gandhi

  // Ring Road (MR-10) corridor
  ['j-28', 'j-18'],  // C21 Mall → MR-10 Flyover
  ['j-18', 'j-25'],  // MR-10 → Pipliyahana
  ['j-25', 'j-17'],  // Pipliyahana → Sapna Sangeeta

  // MG Road / Old City spine
  ['j-9', 'j-21'],   // Rajwada → Sarafa Bazaar
  ['j-21', 'j-23'],  // Sarafa → MG Road
  ['j-23', 'j-20'],  // MG Road → Bhanwar Kuwa
  ['j-20', 'j-5'],   // Bhanwar Kuwa → Regal

  // East-West links
  ['j-1', 'j-8'],    // Vijay Nagar → Radisson
  ['j-8', 'j-27'],   // Radisson → Silicon City (Bypass)
  ['j-8', 'j-10'],   // Radisson → Khajrana
  ['j-10', 'j-11'],  // Khajrana → Bengali
  ['j-4', 'j-10'],   // LIG → Khajrana
  ['j-6', 'j-11'],   // Geeta Bhawan → Bengali
  ['j-11', 'j-26'],  // Bengali → Sudama Nagar

  // Central mesh
  ['j-2', 'j-12'],   // Palasia → Yeshwant Club
  ['j-12', 'j-29'],  // Yeshwant Club → Chappan Dukan
  ['j-29', 'j-19'],  // Chappan Dukan → Treasure Island
  ['j-19', 'j-4'],   // Treasure Island → LIG
  ['j-15', 'j-29'],  // Lantern → Chappan Dukan
  ['j-5', 'j-17'],   // Regal → Sapna Sangeeta
  ['j-17', 'j-19'],  // Sapna Sangeeta → Treasure Island
  ['j-12', 'j-5'],   // Yeshwant Club → Regal

  // South and Old City links
  ['j-5', 'j-9'],    // Regal → Rajwada
  ['j-9', 'j-30'],   // Rajwada → Nandlalpura
  ['j-30', 'j-16'],  // Nandlalpura → Mhow Naka
  ['j-16', 'j-13'],  // Mhow Naka → Annapurna
  ['j-9', 'j-16'],   // Rajwada → Mhow Naka
  ['j-3', 'j-16'],   // Bhawarkua → Mhow Naka
  ['j-13', 'j-22'],  // Annapurna → Holkar Stadium
  ['j-22', 'j-17'],  // Holkar Stadium → Sapna Sangeeta

  // Northern links
  ['j-14', 'j-28'],  // Bombay Hospital → C21 Mall
  ['j-1', 'j-28'],   // Vijay Nagar → C21 Mall
  ['j-2', 'j-26'],   // Palasia → Sudama Nagar
];

// ─── BRTS (Bus Rapid Transit System) Corridor ───
// iBus Indore BRTS runs primarily on AB Road corridor
export const brtsRoute: [number, number][] = [
  [22.7640, 75.8980], // Airport Road terminal
  [22.7625, 75.8970], // Bombay Hospital
  [22.7533, 75.8937], // Vijay Nagar
  [22.7400, 75.8880], // Scheme 54
  [22.7350, 75.8860], // LIG
  [22.7275, 75.8820], // Lantern
  [22.7244, 75.8790], // Palasia
  [22.7210, 75.8750], // Geeta Bhawan
  [22.7155, 75.8700], // Bhanwar Kuwa
  [22.7090, 75.8650], // Near Bhawarkua
  [22.6916, 75.8572], // Bhawarkua
  [22.6850, 75.8500], // Rajiv Gandhi Square
];

// ─── BRTS Stops (for markers) ───
export interface BRTSStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ridership: number; // avg daily passengers
}

export const brtsStops: BRTSStop[] = [
  { id: 'brts-1', name: 'Airport Road Terminal', lat: 22.7640, lng: 75.8980, ridership: 2400 },
  { id: 'brts-2', name: 'Bombay Hospital', lat: 22.7625, lng: 75.8970, ridership: 4200 },
  { id: 'brts-3', name: 'Vijay Nagar', lat: 22.7533, lng: 75.8937, ridership: 8500 },
  { id: 'brts-4', name: 'Scheme 54', lat: 22.7400, lng: 75.8880, ridership: 3800 },
  { id: 'brts-5', name: 'LIG Square', lat: 22.7350, lng: 75.8860, ridership: 5100 },
  { id: 'brts-6', name: 'Palasia', lat: 22.7244, lng: 75.8790, ridership: 7200 },
  { id: 'brts-7', name: 'Geeta Bhawan', lat: 22.7210, lng: 75.8750, ridership: 6000 },
  { id: 'brts-8', name: 'Bhawarkua', lat: 22.6916, lng: 75.8572, ridership: 5500 },
  { id: 'brts-9', name: 'Rajiv Gandhi', lat: 22.6850, lng: 75.8500, ridership: 3200 },
];

// ─── Landmarks (hospitals, malls, temples, stadiums) ───
export interface Landmark {
  id: string;
  name: string;
  type: 'hospital' | 'mall' | 'temple' | 'stadium' | 'college' | 'station' | 'lake';
  lat: number;
  lng: number;
  description: string;
}

export const indoreLandmarks: Landmark[] = [
  { id: 'lm-1', name: 'MY Hospital', type: 'hospital', lat: 22.7167, lng: 75.8569, description: 'Maharaja Yeshwantrao Hospital — largest govt. hospital' },
  { id: 'lm-2', name: 'Bombay Hospital', type: 'hospital', lat: 22.7625, lng: 75.8975, description: 'Multi-specialty private hospital' },
  { id: 'lm-3', name: 'CHL Hospital', type: 'hospital', lat: 22.7488, lng: 75.8935, description: 'Choithram Hospital & Research Centre' },
  { id: 'lm-4', name: 'Treasure Island Mall', type: 'mall', lat: 22.7320, lng: 75.8700, description: "Indore's premium shopping mall" },
  { id: 'lm-5', name: 'C21 Mall', type: 'mall', lat: 22.7570, lng: 75.8855, description: 'Century 21 Mall — entertainment hub' },
  { id: 'lm-6', name: 'Rajwada Palace', type: 'temple', lat: 22.7189, lng: 75.8540, description: 'Historic Holkar dynasty palace (7 stories)' },
  { id: 'lm-7', name: 'Annapurna Temple', type: 'temple', lat: 22.7015, lng: 75.8345, description: 'Famous Annapurna Devi Temple' },
  { id: 'lm-8', name: 'Khajrana Ganesh Temple', type: 'temple', lat: 22.7300, lng: 75.9050, description: 'Historic Ganesh temple — pilgrimage site' },
  { id: 'lm-9', name: 'Holkar Cricket Stadium', type: 'stadium', lat: 22.7240, lng: 75.8380, description: 'International cricket venue — 30,000 capacity' },
  { id: 'lm-10', name: 'IIM Indore', type: 'college', lat: 22.6755, lng: 75.8455, description: 'Indian Institute of Management Indore' },
  { id: 'lm-11', name: 'Indore Railway Station', type: 'station', lat: 22.7193, lng: 75.8360, description: 'Indore Junction — major railway hub' },
  { id: 'lm-12', name: 'Pipliyapala Lake (Regional Park)', type: 'lake', lat: 22.7390, lng: 75.8550, description: 'Musical fountain park — major tourist attraction' },
  { id: 'lm-13', name: 'Devi Ahilya University', type: 'college', lat: 22.7220, lng: 75.8680, description: 'DAVV — Takshshila Campus' },
];

// ─── Map tile styles for time-of-day ───
export const mapTileUrls: Record<string, string> = {
  day: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  golden: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  night: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
