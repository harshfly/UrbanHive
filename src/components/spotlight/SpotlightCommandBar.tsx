import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Command, Network, Camera, Cpu, Siren, Zap, MapPin,
  BarChart3, Home, ArrowRight, Sparkles, CornerDownLeft, Hash,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { showToast } from '../ui/Toast';

interface SpotlightAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'navigate' | 'command' | 'search';
  action: () => void;
  keywords: string[];
}

// AI Siri-style wave bars
const AIWaveIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div className="flex items-center gap-[2px] h-4">
      {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((delay, i) => (
        <motion.div
          key={i}
          className="w-[2.5px] rounded-full"
          style={{
            background: `linear-gradient(180deg, #0071E3 0%, #34C759 100%)`,
          }}
          animate={{
            height: active ? [4, 14 + delay * 2, 4] : 4,
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.07,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const SpotlightCommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setCity = useAppStore((s) => s.setCity);
  const setAiMode = useAppStore((s) => s.setAiMode);

  const actions: SpotlightAction[] = useMemo(() => [
    // Navigation
    { id: 'nav-home', label: 'Overview', description: 'Go to Command Center', icon: <Home size={16} />, category: 'navigate', action: () => navigate('/'), keywords: ['home', 'dashboard', 'overview', 'command center'] },
    { id: 'nav-traffic', label: 'Traffic Network', description: 'View traffic junctions', icon: <Network size={16} />, category: 'navigate', action: () => navigate('/traffic'), keywords: ['traffic', 'junctions', 'network', 'signals'] },
    { id: 'nav-cameras', label: 'Camera Feeds', description: 'Live traffic camera streams', icon: <Camera size={16} />, category: 'navigate', action: () => navigate('/cameras'), keywords: ['cameras', 'feeds', 'video', 'live', 'stream'] },
    { id: 'nav-twin', label: 'Digital Twin', description: 'AI simulation sandbox', icon: <Cpu size={16} />, category: 'navigate', action: () => navigate('/digital-twin'), keywords: ['digital twin', 'simulation', 'ai', 'sandbox'] },
    { id: 'nav-emergency', label: 'Emergency Corridor', description: 'Dispatch emergency vehicles', icon: <Siren size={16} />, category: 'navigate', action: () => navigate('/emergency-corridor'), keywords: ['emergency', 'corridor', 'ambulance', 'dispatch', 'siren'] },
    { id: 'nav-ev', label: 'EV & Charging', description: 'EV charging network', icon: <Zap size={16} />, category: 'navigate', action: () => navigate('/ev-charging'), keywords: ['ev', 'charging', 'electric', 'vehicle', 'battery'] },
    { id: 'nav-parking', label: 'Parking Map', description: 'Smart parking locator', icon: <MapPin size={16} />, category: 'navigate', action: () => navigate('/parking'), keywords: ['parking', 'spots', 'park', 'lot'] },
    { id: 'nav-reports', label: 'System Reports', description: 'Analytics & reports', icon: <BarChart3 size={16} />, category: 'navigate', action: () => navigate('/reports'), keywords: ['reports', 'analytics', 'stats', 'data'] },
    // Commands
    { id: 'cmd-indore', label: 'Switch to Indore', description: 'Change city zone to Indore', icon: <Hash size={16} />, category: 'command', action: () => { setCity('Indore (Vijay Nagar)'); showToast('Switched to Indore (Vijay Nagar)', 'success'); }, keywords: ['indore', 'city', 'switch'] },
    { id: 'cmd-bhopal', label: 'Switch to Bhopal', description: 'Change city zone to Bhopal', icon: <Hash size={16} />, category: 'command', action: () => { setCity('Bhopal (MP Nagar)'); showToast('Switched to Bhopal (MP Nagar)', 'success'); }, keywords: ['bhopal', 'city', 'switch'] },
    { id: 'cmd-pune', label: 'Switch to Pune', description: 'Change city zone to Pune', icon: <Hash size={16} />, category: 'command', action: () => { setCity('Pune (Hinjewadi)'); showToast('Switched to Pune (Hinjewadi)', 'success'); }, keywords: ['pune', 'city', 'switch'] },
    { id: 'cmd-ai-auto', label: 'AI Mode: Autonomous', description: 'Set AI to full autonomous control', icon: <Sparkles size={16} />, category: 'command', action: () => { setAiMode('autonomous'); showToast('AI Mode set to Autonomous', 'success'); }, keywords: ['ai', 'autonomous', 'auto', 'mode'] },
    { id: 'cmd-ai-supervised', label: 'AI Mode: Supervised', description: 'Set AI to supervised mode', icon: <Sparkles size={16} />, category: 'command', action: () => { setAiMode('supervised'); showToast('AI Mode set to Supervised', 'success'); }, keywords: ['ai', 'supervised', 'mode'] },
    { id: 'cmd-dispatch', label: 'Dispatch Emergency', description: 'Open emergency corridor dispatch', icon: <Siren size={16} />, category: 'command', action: () => { navigate('/emergency-corridor'); showToast('Opening Emergency Dispatch...', 'success'); }, keywords: ['dispatch', 'emergency', 'corridor', 'ambulance'] },
    { id: 'cmd-rebalance', label: 'Rebalance EV Grid', description: 'Trigger AI EV load rebalancing', icon: <Zap size={16} />, category: 'command', action: () => { showToast('EV grid rebalancing initiated by AI', 'success'); }, keywords: ['rebalance', 'ev', 'grid', 'charging'] },
  ], [navigate, setCity, setAiMode]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const lower = query.toLowerCase();
    return actions.filter((a) =>
      a.label.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower) ||
      a.keywords.some((k) => k.includes(lower))
    );
  }, [query, actions]);

  // Handle AI query for unmatched queries
  const handleAIQuery = useCallback(() => {
    if (filtered.length === 0 && query.trim()) {
      setIsAIThinking(true);
      setAiResponse(null);
      setTimeout(() => {
        const responses: Record<string, string> = {
          'congestion': '📊 Current congestion index: 67%. Hotspots: Palasia Square (95%), Radisson Square (90%). AI recommends signal retiming at Geeta Bhawan (+12s green phase).',
          'accident': '🚨 No active incidents reported. Last incident: 2h ago at AB Road Corridor. Emergency response time: 4m 12s (below 5m target).',
          'weather': '🌤 Current: 34°C, Clear sky. Forecast: Light rain expected at 16:00 IST. Congestion may increase +18% during evening peak.',
          'ev': '⚡ EV Grid Status: 68% avg load. Peak station: Vijay Nagar Hub (92% load). 4 vehicles queued. Rebalance recommendation: redirect to Bhawarkua station.',
          'parking': '🅿 Parking occupancy: 82% city-wide. Available: MR-10 Lot (45 spots), Bengali Square Lot (22 spots). Predicted full by 14:30.',
        };

        const matchKey = Object.keys(responses).find((k) => query.toLowerCase().includes(k));
        setAiResponse(matchKey ? responses[matchKey] : `🤖 UrbanHive AI analyzed your query "${query}". System metrics are nominal. Average travel time: 15 min (-40% vs baseline). 4,812 active vehicles tracked across all corridors.`);
        setIsAIThinking(false);
      }, 1200);
    }
  }, [filtered.length, query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setAiResponse(null);
      setIsAIThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
    setAiResponse(null);
  }, [query]);

  const executeAction = useCallback((action: SpotlightAction) => {
    action.action();
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        executeAction(filtered[selectedIndex]);
      } else {
        handleAIQuery();
      }
    }
  }, [filtered, selectedIndex, executeAction, handleAIQuery]);

  const categoryLabels: Record<string, string> = {
    navigate: 'Navigation',
    command: 'Commands',
    search: 'Search',
  };

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, SpotlightAction[]>();
    filtered.forEach((a) => {
      const arr = map.get(a.category) || [];
      arr.push(a);
      map.set(a.category, arr);
    });
    return map;
  }, [filtered]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-text-primary/25 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />

          {/* Spotlight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-[580px] mx-4 bg-bg-surface/95 backdrop-blur-2xl border border-border-subtle rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden z-10"
          >
            {/* Input Area */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
              <Search size={18} className="text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, pages, or ask AI..."
                className="flex-1 bg-transparent text-sm font-medium text-text-primary placeholder-text-tertiary focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <AIWaveIndicator active={isAIThinking} />
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-bg-canvas border border-border-subtle text-[10px] font-mono font-bold text-text-tertiary">
                <Command size={10} /> K
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-[360px] overflow-y-auto">
              {filtered.length > 0 ? (
                <div className="py-2">
                  {Array.from(grouped.entries()).map(([category, items]) => {
                    return (
                      <div key={category}>
                        <div className="px-5 py-1.5">
                          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                            {categoryLabels[category] || category}
                          </span>
                        </div>
                        {items.map((item) => {
                          const globalIndex = filtered.indexOf(item);
                          const isSelected = globalIndex === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              onClick={() => executeAction(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                                isSelected
                                  ? 'bg-accent-primary-soft'
                                  : 'hover:bg-bg-canvas/60'
                              }`}
                            >
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-accent-primary text-white' : 'bg-bg-canvas border border-border-subtle text-text-secondary'
                              }`}>
                                {item.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-bold truncate ${isSelected ? 'text-accent-primary' : 'text-text-primary'}`}>
                                  {item.label}
                                </div>
                                <div className="text-[10px] text-text-tertiary truncate mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                              {isSelected && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-accent-primary shrink-0">
                                  <CornerDownLeft size={10} /> Enter
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-6 flex flex-col items-center gap-3">
                  {isAIThinking ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <AIWaveIndicator active />
                      <span className="text-xs font-semibold text-text-secondary">UrbanHive AI is analyzing...</span>
                    </div>
                  ) : aiResponse ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-gradient-to-br from-accent-primary-soft to-bg-canvas border border-accent-primary/15 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-accent-primary" />
                        <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">AI Response</span>
                      </div>
                      <p className="text-xs text-text-primary font-medium leading-relaxed">{aiResponse}</p>
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles size={24} className="text-text-tertiary opacity-40" />
                      <span className="text-xs text-text-tertiary font-medium">
                        No commands found. Press <strong>Enter</strong> to ask AI.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-border-subtle bg-bg-canvas/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-text-tertiary font-semibold">
                  <ArrowRight size={9} className="rotate-[-90deg]" /> <ArrowRight size={9} className="rotate-90" /> Navigate
                </span>
                <span className="flex items-center gap-1 text-[10px] text-text-tertiary font-semibold">
                  <CornerDownLeft size={9} /> Select
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-text-tertiary font-semibold">
                <Sparkles size={9} /> AI-powered
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
