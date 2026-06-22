import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'system';
}

interface CorridorTerminalProps {
  isActive: boolean;
  vehicleType: string;
  destination: string;
  eta: number;
  junctionCount?: number;
}

const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const CorridorTerminal: React.FC<CorridorTerminalProps> = ({
  isActive,
  vehicleType,
  destination,
  eta,
  junctionCount = 4,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentJunction, setCurrentJunction] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const junctions = [
    'Vijay Nagar Crossing',
    'LIG Square',
    'Palasia Square',
    'Geeta Bhawan Square',
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Generate realistic log entries as time progresses
  useEffect(() => {
    if (!isActive) {
      setLogs([]);
      setCurrentJunction(0);
      return;
    }

    // Initial activation logs
    const initialLogs: LogEntry[] = [
      { time: getTimestamp(), message: `▸ CORRIDOR OVERRIDE INITIATED`, type: 'system' },
      { time: getTimestamp(), message: `▸ Vehicle: ${vehicleType.toUpperCase()} — Destination: ${destination}`, type: 'info' },
      { time: getTimestamp(), message: `▸ Computing optimal green-wave path (${junctionCount} junctions)...`, type: 'info' },
      { time: getTimestamp(), message: `✓ Route computed. Estimated clear time: ${Math.floor(eta / 60)}m ${eta % 60}s`, type: 'success' },
      { time: getTimestamp(), message: `▸ Sending signal override commands to traffic controllers...`, type: 'info' },
    ];
    setLogs(initialLogs);

    // Progressive junction clearing
    const timers: ReturnType<typeof setTimeout>[] = [];

    junctions.forEach((junction, idx) => {
      // Signal override
      timers.push(setTimeout(() => {
        setLogs((prev) => [...prev,
          { time: getTimestamp(), message: `▸ [Junction ${idx + 1}/${junctionCount}] Overriding ${junction} signals...`, type: 'info' },
        ]);
      }, 2000 + idx * 4000));

      // Green phase lock
      timers.push(setTimeout(() => {
        setLogs((prev) => [...prev,
          { time: getTimestamp(), message: `✓ ${junction}: GREEN PHASE LOCKED (${40 + idx * 5}s hold)`, type: 'success' },
        ]);
        setCurrentJunction(idx + 1);
      }, 3500 + idx * 4000));

      // Side lane hold
      timers.push(setTimeout(() => {
        setLogs((prev) => [...prev,
          { time: getTimestamp(), message: `⚠ Side lanes held at RED — ${12 + idx * 3} vehicles rerouted`, type: 'warning' },
        ]);
      }, 4500 + idx * 4000));
    });

    // Final completion
    timers.push(setTimeout(() => {
      setLogs((prev) => [...prev,
        { time: getTimestamp(), message: `▸ All junctions cleared. Path efficiency: 97.4%`, type: 'system' },
        { time: getTimestamp(), message: `✓ CORRIDOR FULLY CLEARED — Vehicle approaching destination`, type: 'success' },
      ]);
    }, 3000 + junctions.length * 4000));

    return () => {
      timers.forEach(clearTimeout);
    };
    // We intentionally run only when isActive changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-emerald-400" />
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
            Green-Wave Terminal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold">LIVE</span>
        </div>
      </div>

      {/* Junction progress */}
      <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          {junctions.map((_, idx) => (
            <React.Fragment key={idx}>
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono font-bold border ${
                  idx < currentJunction
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : idx === currentJunction
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                animate={idx < currentJunction ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {idx < currentJunction ? <ShieldCheck size={10} /> : idx + 1}
              </motion.div>
              {idx < junctions.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full ${
                  idx < currentJunction ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}>
                  {idx === currentJunction - 1 && (
                    <motion.div
                      className="h-full bg-emerald-400 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[8px] font-mono text-zinc-500">
            {junctions[0]}
          </span>
          <span className="text-[8px] font-mono text-zinc-500">
            {junctions[junctions.length - 1]}
          </span>
        </div>
      </div>

      {/* Log output */}
      <div
        ref={scrollRef}
        className="p-4 max-h-[220px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1"
      >
        <AnimatePresence>
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              <span className="text-zinc-600 shrink-0">{log.time}</span>
              <span className={
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'system' ? 'text-cyan-400' :
                'text-zinc-400'
              }>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor */}
        <div className="flex items-center gap-1 mt-1">
          <ChevronRight size={10} className="text-emerald-500" />
          <motion.span
            className="w-[6px] h-[13px] bg-emerald-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
};
