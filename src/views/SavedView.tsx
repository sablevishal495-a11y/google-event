import React, { useState } from 'react';
import { DispenserNode, EmergencyVoucher } from '../types';

interface SavedViewProps {
  savedDispensers: DispenserNode[];
  vouchers: EmergencyVoucher[];
  onSelectDispenser: (dispenser: DispenserNode) => void;
  onStartDirections: (dispenser: DispenserNode) => void;
  onRemoveSaved: (dispenserId: string) => void;
  onOpenEmergencyVoucher: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedDispensers,
  vouchers,
  onSelectDispenser,
  onStartDirections,
  onRemoveSaved,
  onOpenEmergencyVoucher
}) => {
  const [offlineMode, setOfflineMode] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<EmergencyVoucher | null>(null);

  return (
    <div className="flex flex-col w-full pb-28 pt-4 px-4 max-w-xl mx-auto gap-5">
      {/* Header */}
      <div>
        <h2 className="text-[22px] font-bold text-[#1f1a20]">Saved & Emergency Wallet</h2>
        <p className="text-[13px] text-[#534347]">
          Quick-access dispensers for your daily commute and zero-cash emergency passes.
        </p>
      </div>

      {/* Offline Mode Banner */}
      <div className="p-4 rounded-2xl bg-[#efe5ed] border border-[#613b52]/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#613b52] shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              {offlineMode ? 'cloud_done' : 'cloud_off'}
            </span>
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#1f1a20]">
              Offline Emergency Cache
            </h4>
            <p className="text-[11px] text-[#534347]">
              {offlineMode
                ? 'Connaught Place dispensers & voucher saved offline'
                : 'Offline data disabled'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOfflineMode(!offlineMode)}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            offlineMode ? 'bg-[#934461]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
              offlineMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Emergency Vouchers Wallet Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#934461] text-[20px]">
              volunteer_activism
            </span>
            <h3 className="text-[16px] font-bold text-[#1f1a20]">
              Active Zero-Cash Passes ({vouchers.length})
            </h3>
          </div>
          <button
            onClick={onOpenEmergencyVoucher}
            className="text-[12px] font-bold text-[#934461] hover:underline"
          >
            + Get New Pass
          </button>
        </div>

        {vouchers.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#d8c1c6] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#857277]">
              receipt_long
            </span>
            <p className="text-[13px] font-semibold text-[#1f1a20]">
              No active vouchers in wallet
            </p>
            <p className="text-[11px] text-[#534347]">
              Generate a free subsidized cycle token anytime you are caught without coins or digital payments.
            </p>
            <button
              onClick={onOpenEmergencyVoucher}
              className="mt-1 px-4 py-2 rounded-full bg-[#934461] text-white text-[12px] font-bold hover:bg-[#762d49] transition-colors"
            >
              Request Free Emergency Pass
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {vouchers.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVoucher(selectedVoucher?.id === v.id ? null : v)}
                className="p-4 rounded-2xl bg-gradient-to-r from-white to-[#fff7fc] border border-[#934461]/25 shadow-sm hover:border-[#934461] transition-all cursor-pointer flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006e25] animate-pulse" />
                    <span className="font-mono text-[16px] font-bold text-[#1f1a20] tracking-wider">
                      {v.code}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#934461] bg-[#ffd9e2] px-2.5 py-0.5 rounded-full">
                    Active • 2 Pads Kit
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#534347]">
                  <span>Expires: {v.expiresAt}</span>
                  <span className="text-[#934461] font-semibold">
                    {selectedVoucher?.id === v.id ? 'Tap to hide QR' : 'Tap to show QR'}
                  </span>
                </div>

                {selectedVoucher?.id === v.id && (
                  <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-2 animate-fade-in">
                    <div className="w-36 h-36 bg-gray-50 p-2 rounded-xl border border-gray-200 flex items-center justify-center relative">
                      <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full p-2 bg-white rounded">
                        <div className="bg-[#613b52] rounded-sm" />
                        <div className="bg-[#934461] rounded-sm" />
                        <div className="bg-[#613b52] rounded-sm" />
                        <div className="bg-[#613b52] rounded-sm" />
                        <div className="bg-[#934461] rounded-sm" />
                        <div className="bg-[#613b52] rounded-sm" />
                        <div className="bg-[#934461] rounded-sm" />
                        <div className="bg-[#613b52] rounded-sm" />
                      </div>
                      <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#934461] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">water_drop</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#534347]">
                      Hold near dispenser camera or enter code on tactile keypad
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Dispensers Section */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#613b52] text-[20px]">
              bookmark
            </span>
            <h3 className="text-[16px] font-bold text-[#1f1a20]">
              Bookmarked Locations ({savedDispensers.length})
            </h3>
          </div>
        </div>

        {savedDispensers.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#d8c1c6] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#857277]">
              bookmark_border
            </span>
            <p className="text-[13px] font-semibold text-[#1f1a20]">
              No saved dispensers yet
            </p>
            <p className="text-[11px] text-[#534347]">
              Bookmark machines near your workplace, college, or daily metro stop for rapid 1-tap navigation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedDispensers.map((dispenser) => (
              <div
                key={dispenser.id}
                className="p-4 rounded-2xl bg-white border border-[#613b52]/10 shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[16px] font-bold text-[#1f1a20]">
                      {dispenser.name}
                    </h4>
                    <p className="text-[12px] text-[#534347]">
                      {dispenser.locationDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-[#006e25]">
                        {dispenser.stockCount} pads available
                      </span>
                      <span className="text-[11px] text-[#857277]">
                        • {dispenser.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveSaved(dispenser.id)}
                    className="text-[#857277] hover:text-[#ba1a1a] p-1"
                    title="Remove Bookmark"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => onSelectDispenser(dispenser)}
                    className="h-10 rounded-full bg-[#efe5ed] text-[#613b52] text-[13px] font-semibold hover:bg-[#eae0e8] transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartDirections(dispenser)}
                    className="h-10 rounded-full bg-[#613b52] text-white text-[13px] font-semibold hover:bg-[#4b2c3f] transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
