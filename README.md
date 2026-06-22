# UrbanHive — Intelligent City Mobility OS

UrbanHive is a premium, real-time metropolitan mobility orchestration system designed to monitor, simulate, and balance urban infrastructure. Adhering to Apple's design principles, the UI leverages glassmorphism, responsive spring animations, Outfit/SF Pro typography, and a coordinated dark/light aesthetic designed to maximize cognitive clarity under critical control-room scenarios.

The platform simulates detailed telemetry for three major zones in India: **Indore (Vijay Nagar)**, **Bhopal (MP Nagar)**, and **Pune (Hinjewadi)**, with high-fidelity routing, transit tracking, and grid load-balancing simulation.

---

## 🚀 Advanced Core Features

### 1. 🔍 Spotlight Command Bar (`Cmd+K` or `Ctrl+K`)
*   **Fuzzy Navigation & Control**: An Apple-inspired search bar matching page shortcuts, active cities, and system states.
*   **Integrated AI Copilot**: A built-in virtual assistant designed to explain grid stats, simulate congestion metrics, and trigger automated routing procedures.
*   **Dynamic Soundless Audio Wave**: Visualizes AI "thinking" using Framer Motion spring-animated waveform states.

### 🌧️ 2. Environment Simulation Engine & Sandbox
*   **Dynamic Weather Sandbox**: Live weather overlays (`Sunny`, `Rain`, `Fog`, `Storm`) rendering custom CSS particles (raindrops, fog gradients, lightning flashes) across the viewport.
*   **Atmospheric Time-of-Day Modes**: Real-time styling mapping `Day`, `Golden Hour`, and `Night` presets to customized Leaflet map tile colors (light, hybrid voyager, and dark maps).
*   **Congestion & Traffic Modifiers**: Dynamic modifiers (e.g., Rain increases baseline traffic delays by `+25%`; Storm triggers weather-warning protocols, paused EV charging, and `+40%` traffic lag).

### ⚡ 3. V2G (Vehicle-to-Grid) Smart Charging Controller
*   **Bidirectional Power Orchestration**: Active demand-slider to simulate city grid stress (from low to peak 100% capacity).
*   **EV Connected Fleet Node Array**: Simulates an active 8-vehicle EV fleet, showing state, capacity, and current power flow.
*   **Pulse & Shimmer Feedback Loop**: Spring-animated energy transfer pathways rendering green back-flow pulses from parked EVs when V2G is toggled on to offset peak city demand.

### 🚨 4. Green-Wave Priority Corridor Dispatcher
*   **Automated Override Sequences**: Instantly clears transit routes for emergency response teams.
*   **Live Console Log Terminal**: Displays step-by-step telemetry logs of junction signal overrides, green-phase holds, and vehicle count rerouting.
*   **Visual Progressive Timeline**: Multi-node timeline showing the status of each metropolitan intersection as the dispatch team clears the path.

### 📹 5. Camera AI HUD & Mode Selector
*   **Multi-Spectrum Analytics**: Toggles between 3 custom AI models:
    *   **Detection Mode**: Generates 2D bounding boxes over tracked vehicles and pedestrians.
    *   **Heatmap Mode**: Radially gradients density hotspots to show congestion zones.
    *   **Velocity Mode**: Animates direction and speed vectors (in km/h) for vehicles passing through target cameras.
*   **Unified AI Toggle**: Globally control AI overlays to conserve processing bandwidth.

### 🗺️ 6. Intricate Indore Transit Network
*   **30 Real-World Intersections**: Detailed coordinate mapping from Vijay Nagar Square, Sapna Sangeeta, and Khajrana, to Sarafa Bazaar, Regal Square, and Ring Road (MR-10) Flyover.
*   **iBus BRTS Corridor**: Plots the full Indore Bus Rapid Transit route with interactive transit station markers showing average daily ridership.
*   **Metropolitan Landmarks**: Spots major landmarks (hospitals, stadiums, shopping centers, temples) with descriptive info boxes.
*   **Dynamic Map Boundary**: Renders the Indore Municipal Corporation limit as a clean dashed polygon.
*   **Google-style Zoom Interface**: Floating custom map zoom widgets integrated with custom layers (toggles for boundaries, landmarks, and BRTS overlays).

---

## 🛠️ Technology Stack

*   **Core Engine**: React 18, Vite, TypeScript
*   **Styling**: Vanilla CSS, Tailwind CSS Utility Tokens, Outfit Font
*   **Map Visualization**: React-Leaflet, Leaflet.js
*   **Motion & Physics**: Framer Motion
*   **Analytics**: Recharts (Customized Area, Bar, Pie, and Sparkline primitives)
*   **Icons**: Lucide React

---

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
