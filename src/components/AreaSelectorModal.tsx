import React from 'react';
import { AVAILABLE_AREAS } from '../data/dispensers';

interface AreaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArea: string;
  onSelectArea: (area: string) => void;
}

export const AreaSelectorModal: React.FC<AreaSelectorModalProps> = ({
  isOpen,
  onClose,
  currentArea,
  onSelectArea
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#613b52]/10 bg-[#fff7fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#934461] text-[22px]">
              location_on
            </span>
            <h3 className="text-[17px] font-bold text-[#1f1a20]">
              Switch Coverage Zone
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] text-[#534347] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2 max-h-72 overflow-y-auto no-scrollbar">
          {AVAILABLE_AREAS.map((area) => {
            const isSelected = area === currentArea;
            return (
              <button
                key={area}
                onClick={() => {
                  onSelectArea(area);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl text-left flex items-center justify-between transition-all border ${
                  isSelected
                    ? 'bg-[#ffd8ec]/50 border-[#934461] font-bold text-[#1f1a20]'
                    : 'bg-[#fff7fc] border-[#613b52]/10 text-[#534347] hover:bg-[#efe5ed]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isSelected ? 'text-[#934461]' : 'text-[#857277]'
                    }`}
                  >
                    near_me
                  </span>
                  <span className="text-[13px]">{area}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[#934461] text-[20px]">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-[#fff7fc] border-t border-[#613b52]/10 text-center">
          <span className="text-[11px] text-[#857277]">
            SHE-ACCESS active network across Delhi NCR, Bengaluru & Mumbai
          </span>
        </div>
      </div>
    </div>
  );
};
