import React from 'react';
import { X } from 'lucide-react';

interface CameraFeedOverlayProps {
  onClose?: () => void;
}

export const CameraFeedOverlay: React.FC<CameraFeedOverlayProps> = ({ onClose }) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] w-52 bg-bg-surface border border-border-subtle rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      {/* Camera visual – styled illustration */}
      <div className="h-28 bg-gradient-to-br from-bg-surface-alt to-border-subtle relative flex items-center justify-center">
        {/* Simplified street scene illustration */}
        <div className="absolute inset-0 flex flex-col justify-end px-3 pb-2">
          <div className="w-full h-6 bg-border-strong/40 rounded-sm" /> {/* road */}
          <div className="flex justify-between mt-1">
            <div className="w-4 h-10 bg-text-tertiary/30 rounded-sm" />
            <div className="w-3 h-8 bg-text-tertiary/20 rounded-sm" />
            <div className="w-5 h-12 bg-text-tertiary/25 rounded-sm" />
          </div>
        </div>
        
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
            title="Hide Camera Feed"
          >
            <X size={12} />
          </button>
        )}

        {/* LIVE badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-accent-red px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-white">LIVE</span>
        </div>
      </div>
      <div className="p-2.5 bg-bg-surface">
        <div className="text-xs font-medium text-text-primary">CAM-07</div>
        <div className="text-[10px] text-text-tertiary">Vijay Nagar Crossing</div>
      </div>
    </div>
  );
};
