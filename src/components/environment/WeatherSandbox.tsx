import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, CloudFog, CloudLightning, Sunrise, Moon, Sparkles, Thermometer, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { useEnvironmentStore, WeatherCondition, TimeOfDay } from '../../store/useEnvironmentStore';
import { cn } from '../../theme/cn';

const weatherOptions: { value: WeatherCondition; label: string; icon: React.ReactNode; color: string; bgGradient: string }[] = [
  { value: 'sunny', label: 'Clear', icon: <Sun size={16} />, color: 'text-amber-500', bgGradient: 'from-amber-50 to-orange-50 border-amber-200' },
  { value: 'rain', label: 'Rain', icon: <CloudRain size={16} />, color: 'text-blue-500', bgGradient: 'from-blue-50 to-cyan-50 border-blue-200' },
  { value: 'fog', label: 'Fog', icon: <CloudFog size={16} />, color: 'text-zinc-500', bgGradient: 'from-zinc-100 to-slate-100 border-zinc-300' },
  { value: 'storm', label: 'Storm', icon: <CloudLightning size={16} />, color: 'text-purple-500', bgGradient: 'from-purple-50 to-violet-50 border-purple-200' },
];

const timeOptions: { value: TimeOfDay; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'day', label: 'Day', icon: <Sun size={14} />, color: 'text-amber-500' },
  { value: 'golden', label: 'Golden Hour', icon: <Sunrise size={14} />, color: 'text-orange-500' },
  { value: 'night', label: 'Night', icon: <Moon size={14} />, color: 'text-indigo-500' },
];

const weatherMetrics: Record<WeatherCondition, { temp: string; wind: string; humidity: string; visibility: string }> = {
  sunny: { temp: '34°C', wind: '8 km/h', humidity: '42%', visibility: '15 km' },
  rain: { temp: '26°C', wind: '22 km/h', humidity: '89%', visibility: '4 km' },
  fog: { temp: '19°C', wind: '3 km/h', humidity: '96%', visibility: '0.8 km' },
  storm: { temp: '22°C', wind: '45 km/h', humidity: '94%', visibility: '2 km' },
};

// Rain particle overlay
const RainOverlay: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden opacity-30">
    {Array.from({ length: 60 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[1px] bg-gradient-to-b from-transparent to-blue-400"
        style={{
          left: `${(i * 1.7) % 100}%`,
          height: `${15 + (i % 3) * 8}px`,
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{
          duration: 0.4 + (i % 5) * 0.12,
          repeat: Infinity,
          delay: (i * 0.03) % 1,
          ease: 'linear',
        }}
      />
    ))}
  </div>
);

// Fog overlay
const FogOverlay: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[90]">
    <motion.div
      className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent"
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/25 to-transparent"
      animate={{ opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// Storm overlay with flashes
const StormOverlay: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
    {/* Rain */}
    {Array.from({ length: 80 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[1.5px] bg-gradient-to-b from-transparent to-blue-300"
        style={{
          left: `${(i * 1.25) % 100}%`,
          height: `${20 + (i % 4) * 10}px`,
          transform: 'rotate(10deg)',
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{
          duration: 0.25 + (i % 4) * 0.08,
          repeat: Infinity,
          delay: (i * 0.02) % 0.8,
          ease: 'linear',
        }}
      />
    ))}
    {/* Lightning flash */}
    <motion.div
      className="absolute inset-0 bg-white"
      animate={{ opacity: [0, 0, 0, 0.3, 0, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

export const WeatherSandbox: React.FC<{ className?: string }> = ({ className }) => {
  const { weather, timeOfDay, congestionModifier, setWeather, setTimeOfDay } = useEnvironmentStore();
  const metrics = weatherMetrics[weather];

  return (
    <>
      {/* Weather visual overlays */}
      <AnimatePresence>
        {weather === 'rain' && <RainOverlay key="rain" />}
        {weather === 'fog' && <FogOverlay key="fog" />}
        {weather === 'storm' && <StormOverlay key="storm" />}
      </AnimatePresence>

      <div className={cn('bg-bg-surface border border-border-subtle rounded-3xl p-5 shadow-sm', className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent-primary" />
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Environment Sandbox</h3>
          </div>
          {congestionModifier > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-amber-soft border border-amber-200"
            >
              <AlertTriangle size={10} className="text-accent-amber" />
              <span className="text-[10px] font-bold text-accent-amber">+{congestionModifier}% Congestion</span>
            </motion.div>
          )}
        </div>

        {/* Weather selector */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest block mb-2">Weather Condition</span>
          <div className="grid grid-cols-4 gap-2">
            {weatherOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setWeather(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300',
                  weather === opt.value
                    ? `bg-gradient-to-b ${opt.bgGradient} shadow-sm scale-[1.02]`
                    : 'border-border-subtle hover:bg-bg-canvas/50 hover:border-border-strong'
                )}
              >
                <span className={cn('transition-colors', weather === opt.value ? opt.color : 'text-text-tertiary')}>
                  {opt.icon}
                </span>
                <span className={cn('text-[10px] font-bold', weather === opt.value ? 'text-text-primary' : 'text-text-secondary')}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time of day */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest block mb-2">Time of Day</span>
          <div className="flex items-center gap-2 bg-bg-canvas p-1 rounded-xl border border-border-subtle">
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeOfDay(opt.value)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all duration-300',
                  timeOfDay === opt.value
                    ? 'bg-bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <span className={timeOfDay === opt.value ? opt.color : ''}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated live metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-bg-canvas border border-border-subtle/60 rounded-xl p-2.5 flex items-center gap-2">
            <Thermometer size={13} className="text-accent-red shrink-0" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Temp</span>
              <span className="text-[11px] font-mono font-bold text-text-primary">{metrics.temp}</span>
            </div>
          </div>
          <div className="bg-bg-canvas border border-border-subtle/60 rounded-xl p-2.5 flex items-center gap-2">
            <Wind size={13} className="text-accent-blue shrink-0" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Wind</span>
              <span className="text-[11px] font-mono font-bold text-text-primary">{metrics.wind}</span>
            </div>
          </div>
          <div className="bg-bg-canvas border border-border-subtle/60 rounded-xl p-2.5 flex items-center gap-2">
            <Droplets size={13} className="text-cyan-500 shrink-0" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Humidity</span>
              <span className="text-[11px] font-mono font-bold text-text-primary">{metrics.humidity}</span>
            </div>
          </div>
          <div className="bg-bg-canvas border border-border-subtle/60 rounded-xl p-2.5 flex items-center gap-2">
            <Sun size={13} className="text-amber-400 shrink-0" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-text-tertiary font-bold">Visibility</span>
              <span className="text-[11px] font-mono font-bold text-text-primary">{metrics.visibility}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
