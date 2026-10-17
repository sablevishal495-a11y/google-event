import React, { useState } from 'react';
import { DispenserNode } from '../types';

interface DirectionsModalProps {
  dispenser: DispenserNode | null;
  onClose: () => void;
  onArrived: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  dispenser,
  onClose,
  onArrived
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!dispenser) return null;

  const steps = [
    {
      instruction: 'Head south on Janpath Road towards Tolstoy Marg',
      distance: '120m',
      icon: 'straight'
    },
    {
      instruction: `Turn right towards ${dispenser.name} main approach`,
      distance: '80m',
      icon: 'turn_right'
    },
    {
      instruction: 'Pass through the pedestrian wellness entrance gate',
      distance: '50m',
      icon: 'door_front'
    },
    {
      instruction: dispenser.locationDescription,
      distance: '20m',
      icon: 'pin_drop'
    },
    {
      instruction: dispenser.indoorDirections,
      distance: 'Target',
      icon: 'check_circle'
    }
  ];

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onArrived();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Banner Header */}
        <div className="bg-[#613b52] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e98baa] text-[#301025] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[24px]">
                {steps[currentStepIdx].icon}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#ffd8ec] tracking-wider">
                Walking Guidance • {steps[currentStepIdx].distance}
              </span>
              <h3 className="text-[17px] font-bold leading-snug max-w-xs">
                {steps[currentStepIdx].instruction}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* ETA & Distance strip */}
        <div className="bg-[#ffd8ec]/40 px-5 py-2.5 flex items-center justify-between border-b border-[#613b52]/10">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-[#934461]">
              {dispenser.walkTimeMin} min
            </span>
            <span className="text-[13px] text-[#534347]">
              ({dispenser.distanceKm} km walk)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#006e25] bg-white px-2.5 py-1 rounded-full border border-[#006e25]/20">
            <span className="w-2 h-2 rounded-full bg-[#006e25] animate-ping" />
            Stock: {dispenser.stockCount} pads available
          </div>
        </div>

        {/* Steps overview list */}
        <div className="p-5 flex flex-col gap-3 max-h-60 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase font-bold text-[#857277] tracking-wider">
              Route Steps ({currentStepIdx + 1}/{steps.length})
            </span>
            <span className="text-[11px] text-[#934461] font-semibold">
              Step-by-step
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {steps.map((st, idx) => {
              const isActive = idx === currentStepIdx;
              const isPassed = idx < currentStepIdx;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 border ${
                    isActive
                      ? 'bg-[#fbf1f9] border-[#934461] shadow-sm'
                      : isPassed
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[12px] font-bold ${
                      isActive
                        ? 'bg-[#934461] text-white'
                        : isPassed
                        ? 'bg-[#006e25] text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isPassed ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-[13px] leading-tight ${
                        isActive ? 'font-bold text-[#1f1a20]' : 'text-[#534347]'
                      }`}
                    >
                      {st.instruction}
                    </p>
                    <span className="text-[11px] text-[#857277]">{st.distance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#fff7fc] border-t border-[#613b52]/10 flex items-center gap-3">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIdx === 0}
            className={`h-12 px-4 rounded-full border border-[#613b52]/20 text-[13px] font-semibold ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-white text-[#534347] hover:bg-[#efe5ed]'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNextStep}
            className="flex-1 h-12 rounded-full bg-[#934461] hover:bg-[#762d49] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
          >
            {currentStepIdx === steps.length - 1 ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Arrived at Dispenser</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
