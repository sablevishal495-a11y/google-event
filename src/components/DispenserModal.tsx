import React, { useState } from 'react';
import { DispenserNode } from '../types';

interface DispenserModalProps {
  dispenser: DispenserNode | null;
  onClose: () => void;
  onStartDirections: (dispenser: DispenserNode) => void;
  onOpenReport: (dispenser: DispenserNode) => void;
  onOpenEmergencyVoucher: () => void;
  isSaved: boolean;
  onToggleSave: (dispenserId: string) => void;
}

export const DispenserModal: React.FC<DispenserModalProps> = ({
  dispenser,
  onClose,
  onStartDirections,
  onOpenReport,
  onOpenEmergencyVoucher,
  isSaved,
  onToggleSave
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  if (!dispenser) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `SHE-ACCESS Dispenser: ${dispenser.name} at ${dispenser.locationDescription} (${dispenser.area}). Status: ${dispenser.stockCount} pads available.`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const isEmpty = dispenser.status === 'empty';
  const isLow = dispenser.status === 'low-stock';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#fff7fc] rounded-t-[28px] sm:rounded-[28px] shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar for mobile */}
        <div className="w-12 h-1.5 rounded-full bg-[#eae0e8] mx-auto mt-3 sm:hidden" />

        {/* Header bar */}
        <div className="p-4 sm:p-6 pb-2 flex items-start justify-between border-b border-[#613b52]/10 bg-white">
          <div className="flex flex-col pr-4">
            <div className="flex items-center gap-2 mb-1">
              {isEmpty ? (
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                  Out of Stock
                </span>
              ) : isLow ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Low Stock ({dispenser.stockCount} left)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-[#94f99a] text-[#004715] text-[11px] font-bold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e25] animate-pulse" />
                  Verified In Stock ({dispenser.stockCount} pads)
                </span>
              )}
              <span className="text-[11px] text-[#534347]">
                Live Sensor • Pinged {dispenser.lastVerified}
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-[#1f1a20] leading-tight">
              {dispenser.name}
            </h2>
            <p className="text-[13px] text-[#534347] mt-0.5 font-medium">
              {dispenser.locationDescription}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] flex items-center justify-center text-[#534347] shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-white border border-[#613b52]/10 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[11px] text-[#857277] uppercase tracking-wider font-semibold">
                Price
              </span>
              <span className="text-[20px] font-bold text-[#934461] mt-0.5">
                {dispenser.price === 0 ? 'FREE' : `₹${dispenser.price}`}
              </span>
              <span className="text-[10px] text-[#534347]">per sanitary pad</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#613b52]/10 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[11px] text-[#857277] uppercase tracking-wider font-semibold">
                Distance
              </span>
              <span className="text-[20px] font-bold text-[#1f1a20] mt-0.5">
                {dispenser.distanceKm} km
              </span>
              <span className="text-[10px] text-[#534347]">~{dispenser.walkTimeMin} mins walk</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#613b52]/10 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[11px] text-[#857277] uppercase tracking-wider font-semibold">
                Payment
              </span>
              <span className="text-[16px] font-bold text-[#006e25] mt-1 truncate max-w-full">
                {dispenser.paymentNote}
              </span>
              <span className="text-[10px] text-[#534347]">Auto-drop</span>
            </div>
          </div>

          {/* Available Pad Types */}
          <div className="bg-white p-4 rounded-2xl border border-[#613b52]/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold text-[#1f1a20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#934461]">
                  inventory_2
                </span>
                Dispenser Inventory
              </h4>
              <span className="text-[11px] text-[#006e25] font-semibold bg-[#94f99a]/50 px-2 py-0.5 rounded-full">
                {dispenser.stockCount} Total Available
              </span>
            </div>

            <div className="flex flex-col divide-y divide-[#613b52]/10">
              {dispenser.products.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1f1a20]">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#857277]">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#934461]">
                      {item.price === 0 ? 'FREE' : `₹${item.price}`}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.count > 0
                          ? 'bg-[#94f99a]/40 text-[#004715]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {item.count > 0 ? `${item.count} left` : 'Sold out'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indoor Directions & Location Guidance */}
          <div className="bg-white p-4 rounded-2xl border border-[#613b52]/10 shadow-sm flex flex-col gap-2">
            <h4 className="text-[14px] font-bold text-[#1f1a20] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#613b52]">
                explore
              </span>
              Indoor Finding Guide
            </h4>
            <p className="text-[13px] text-[#534347] leading-relaxed bg-[#fbf1f9] p-3 rounded-xl border border-[#613b52]/10">
              {dispenser.indoorDirections}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {dispenser.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#efe5ed] text-[#534347] text-[11px] font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#934461]">
                    check
                  </span>
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Hardware & Sensor Telemetry Health */}
          <div className="bg-[#fbf1f9] p-3.5 rounded-2xl border border-[#613b52]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#94f99a] text-[#004715] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">sensors</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-[#1f1a20]">
                  Hardware Telemetry OK
                </span>
                <span className="text-[10px] text-[#534347]">
                  Coin slot active • Motor verified • 4G Link healthy
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenReport(dispenser)}
              className="text-[11px] text-[#934461] hover:underline font-semibold"
            >
              Report Issue
            </button>
          </div>

          {/* Subsidized voucher reminder */}
          <div className="p-3 rounded-2xl bg-[#ffd8ec]/50 border border-[#934461]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#934461] text-[20px]">
                volunteer_activism
              </span>
              <span className="text-[12px] text-[#301025] font-medium">
                No coins or UPI? Use a zero-cash emergency pass.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenEmergencyVoucher();
              }}
              className="text-[12px] font-bold text-[#934461] px-2.5 py-1 rounded-full bg-white shadow-sm border border-[#934461]/20 hover:bg-[#fff7fc]"
            >
              Get Free Pass
            </button>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-6 pt-3 pb-6 sm:pb-6 bg-white border-t border-[#613b52]/10 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(dispenser.id)}
              className={`h-12 w-12 rounded-full border border-[#613b52]/20 flex items-center justify-center transition-all ${
                isSaved ? 'bg-[#ffd8ec] text-[#934461]' : 'bg-[#fff7fc] text-[#534347]'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Dispenser'}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>

            <button
              onClick={handleShare}
              className="h-12 w-12 rounded-full bg-[#fff7fc] border border-[#613b52]/20 text-[#534347] flex items-center justify-center hover:bg-[#efe5ed] transition-colors"
              title="Share Location"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copiedShare ? 'done' : 'share'}
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartDirections(dispenser);
              }}
              className="flex-1 h-12 rounded-full bg-[#613b52] hover:bg-[#4b2c3f] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">navigation</span>
              <span>Start Walking Directions</span>
            </button>
          </div>

          {copiedShare && (
            <p className="text-center text-[11px] text-[#006e25] font-semibold animate-pulse">
              Dispenser details copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
