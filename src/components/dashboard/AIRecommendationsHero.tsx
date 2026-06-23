import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Leaf, ShieldAlert, Cpu, Check, RefreshCw } from 'lucide-react';
import { useEnvironmentStore } from '../../store/useEnvironmentStore';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../theme/cn';
import { Badge } from '../ui/Badge';

export const AIRecommendationsHero: React.FC = () => {
  const { weather, congestionModifier } = useEnvironmentStore();
  const { aiMode } = useAppStore();

  // Local state for actions
  const [appliedSignal, setAppliedSignal] = useState(false);
  const [appliedWeather, setAppliedWeather] = useState(false);
  const [appliedEvVan, setAppliedEvVan] = useState(false);

  // Sync state if autonomous
  useEffect(() => {
    if (aiMode === 'autonomous') {
      setAppliedSignal(true);
      setAppliedWeather(true);
      setAppliedEvVan(true);
    } else if (aiMode === 'manual') {
      setAppliedSignal(false);
      setAppliedWeather(false);
      setAppliedEvVan(false);
    }
  }, [aiMode]);

  // Weather-specific recommendations
  const getWeatherAdvisory = () => {
    switch (weather) {
      case 'rain':
        return {
          id: 'weather',
          category: 'Weather Protocol',
          severity: 'amber' as const,
          description: 'Hydroplaning risk elevated on AB Road. Reduce speed limit to 40km/h & extend green phases +8s for safer stopping distances.',
          icon: <ShieldAlert size={16} className="text-accent-amber" />,
          applied: appliedWeather,
          setApplied: setAppliedWeather,
        };
      case 'fog':
        return {
          id: 'weather',
          category: 'Weather Protocol',
          severity: 'amber' as const,
          description: 'Dense fog (visibility <800m). Engage thermal camera feeds & reduce BRTS bus speeds to 30km/h to avoid rear-end collisions.',
          icon: <ShieldAlert size={16} className="text-accent-amber" />,
          applied: appliedWeather,
          setApplied: setAppliedWeather,
        };
      case 'storm':
        return {
          id: 'weather',
          category: 'Weather Protocol',
          severity: 'red' as const,
          description: 'Severe weather protocol. Activate stormwater flood barriers at central parking garages & temporarily pause open-air EV chargers.',
          icon: <ShieldAlert size={16} className="text-accent-red" />,
          applied: appliedWeather,
          setApplied: setAppliedWeather,
        };
      case 'sunny':
      default:
        return {
          id: 'weather',
          category: 'Energy Optimization',
          severity: 'green' as const,
          description: 'Peak solar generation active. Suggest scheduling V2G vehicle-to-grid battery discharge for heavy transit corridors at 02:00 PM.',
          icon: <Leaf size={16} className="text-accent-green" />,
          applied: appliedWeather,
          setApplied: setAppliedWeather,
        };
    }
  };

  const weatherAdvisory = getWeatherAdvisory();

  const recommendations = [
    {
      id: 'signal',
      category: 'Traffic flow',
      severity: appliedSignal ? ('green' as const) : ('amber' as const),
      description: 'Congestion spike detected at AB Road. Retime Geeta Bhawan signals (+12s green phase) to flush incoming queues and lower bus delay.',
      icon: <Cpu size={16} className={appliedSignal ? 'text-accent-green' : 'text-accent-amber'} />,
      applied: appliedSignal,
      setApplied: setAppliedSignal,
    },
    weatherAdvisory,
    {
      id: 'ev',
      category: 'Fleet & Carbon',
      severity: 'green' as const,
      description: 'EV segment adoption prevents 12.4t of daily carbon emissions. Dispatch mobile charging van to Vijay Nagar Square to support peak EV demand.',
      icon: <Leaf size={16} className="text-accent-green" />,
      applied: appliedEvVan,
      setApplied: setAppliedEvVan,
    }
  ];

  // AI Mode badge details
  const getModeBadge = () => {
    switch (aiMode) {
      case 'autonomous':
        return <Badge variant="green" dot>AI Autonomous (Fully Auto)</Badge>;
      case 'supervised':
        return <Badge variant="amber" dot>AI Supervised (Approval Required)</Badge>;
      case 'manual':
        return <Badge variant="neutral" dot>Manual Mode (AI Diagnostics Only)</Badge>;
    }
  };

  return (
    <div className="relative overflow-hidden bg-bg-surface border border-border-subtle rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Background glow linking to AI Mode */}
      <div 
        className={cn(
          "absolute -right-24 -top-24 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-500",
          aiMode === 'autonomous' ? 'bg-accent-green' : 
          aiMode === 'supervised' ? 'bg-accent-amber' : 'bg-text-secondary'
        )} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-border-subtle/60 pb-3 md:pb-4 mb-3 md:mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-primary-soft flex items-center justify-center text-accent-primary shadow-inner">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-text-primary flex items-center gap-2">
              AI Command & Optimization Hub
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Live transit efficiency and environmental safety recommendations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {getModeBadge()}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec) => {
            const isPending = !rec.applied && aiMode !== 'manual';
            const showActionButton = aiMode === 'supervised' && !rec.applied;
            const isManualMode = aiMode === 'manual';

            // Determine status outline/border
            let cardBorder = 'border-border-subtle hover:border-border-strong/60';
            let cardBg = 'bg-bg-canvas/30';
            
            if (rec.applied) {
              cardBorder = 'border-accent-green/30 bg-accent-green-soft/10';
              cardBg = 'bg-accent-green-soft/5';
            } else if (rec.severity === 'red') {
              cardBorder = 'border-accent-red/25 bg-accent-red-soft/10';
              cardBg = 'bg-accent-red-soft/5';
            } else if (rec.severity === 'amber') {
              cardBorder = 'border-accent-amber/25 bg-accent-amber-soft/10';
              cardBg = 'bg-accent-amber-soft/5';
            }

            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "border rounded-xl md:rounded-2xl p-2.5 md:p-4.5 flex flex-col justify-between transition-all duration-200",
                  cardBorder,
                  cardBg
                )}
              >
                <div>
                  {/* Category and Severity Indicators */}
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <span className="text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest text-text-tertiary">
                      {rec.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {rec.applied ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent-green uppercase tracking-wide">
                          <Check size={10} className="stroke-[3]" /> Applied
                        </span>
                      ) : isManualMode ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-text-secondary uppercase tracking-wide">
                          Recommended
                        </span>
                      ) : rec.severity === 'red' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent-red uppercase tracking-wide animate-pulse">
                          Critical Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent-amber uppercase tracking-wide">
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Text */}
                  <div className="flex gap-2.5 md:gap-3 items-start">
                    <div className="p-1.5 md:p-2 rounded-xl bg-bg-surface border border-border-subtle shrink-0 shadow-sm mt-0.5">
                      {rec.icon}
                    </div>
                    <p className="text-[10px] md:text-xs text-text-primary font-medium leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {/* Actions Button Panel */}
                <div className="mt-3 md:mt-4 pt-2.5 md:pt-3.5 border-t border-border-subtle/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      rec.applied ? "bg-accent-green" : 
                      isManualMode ? "bg-text-secondary" :
                      rec.severity === 'red' ? "bg-accent-red animate-pulse" : "bg-accent-amber"
                    )} />
                    <span className="text-[10px] font-bold text-text-secondary font-mono">
                      {rec.applied ? 'Optimization Active' : isManualMode ? 'Manual Control' : 'Awaiting Action'}
                    </span>
                  </div>

                  {showActionButton && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => rec.setApplied(true)}
                      className="px-3 py-1.5 bg-accent-primary hover:bg-accent-primary/95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      Apply <ArrowRight size={10} />
                    </motion.button>
                  )}

                  {aiMode === 'autonomous' && (
                    <span className="text-[10px] font-extrabold text-accent-green uppercase tracking-wider flex items-center gap-1">
                      Auto-Executed
                    </span>
                  )}

                  {isManualMode && (
                    <button 
                      onClick={() => rec.setApplied(!rec.applied)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer",
                        rec.applied
                          ? "border-accent-red/40 text-accent-red bg-accent-red-soft/25 hover:bg-accent-red-soft/40"
                          : "border-border-strong text-text-primary hover:bg-bg-canvas"
                      )}
                    >
                      {rec.applied ? 'Revert' : 'Force Apply'}
                    </button>
                  )}

                  {rec.applied && aiMode === 'supervised' && (
                    <button
                      onClick={() => rec.setApplied(false)}
                      className="text-[9px] font-bold text-text-secondary hover:text-accent-red uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Revert
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
