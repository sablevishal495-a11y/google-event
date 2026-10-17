import React, { useState } from 'react';
import { EmergencyVoucher } from '../types';

interface EmergencyVoucherModalProps {
  onClose: () => void;
  onSaveVoucher: (voucher: EmergencyVoucher) => void;
}

export const EmergencyVoucherModal: React.FC<EmergencyVoucherModalProps> = ({
  onClose,
  onSaveVoucher
}) => {
  const [copied, setCopied] = useState(false);
  const [voucher] = useState<EmergencyVoucher>(() => {
    const randomCode = `SHE-AID-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      id: `vouch-${Date.now()}`,
      code: randomCode,
      issuedAt: 'Just now',
      expiresAt: '24 hours from now',
      status: 'active',
      qrPayload: `https://she-access.health/redeem/${randomCode}`
    };
  });

  const handleCopy = () => {
    navigator.clipboard?.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToWallet = () => {
    onSaveVoucher(voucher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dignity Ribbon */}
        <div className="bg-gradient-to-r from-[#934461] to-[#613b52] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">
                volunteer_activism
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#ffd9e2] font-bold">
                Public Health Dignity Fund
              </span>
              <h3 className="text-[18px] font-bold leading-tight">
                Emergency Zero-Cash Pass
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center gap-4 bg-[#fff7fc]">
          <p className="text-[13px] text-[#534347] max-w-sm">
            Access immediate menstrual hygiene supplies at any SHE-ACCESS machine or hospital lounge with zero payment and zero identification required.
          </p>

          {/* Interactive QR Simulation Card */}
          <div className="w-full bg-white p-5 rounded-2xl border-2 border-dashed border-[#934461]/30 shadow-sm flex flex-col items-center gap-3 relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#934461] bg-[#ffd9e2] px-3 py-0.5 rounded-full">
              Dignity Cycle Kit (2 Pads + Disposal)
            </span>

            {/* QR Code graphic */}
            <div className="w-44 h-44 bg-white p-2.5 rounded-xl border border-gray-200 shadow-inner flex flex-col items-center justify-center relative">
              <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full p-2 bg-gray-50 rounded">
                {/* Simulated QR Code patterns */}
                <div className="col-span-2 row-span-2 bg-[#613b52] rounded-sm" />
                <div className="col-span-1 row-span-1 bg-[#934461] rounded-sm" />
                <div className="col-span-1 row-span-2 bg-[#613b52] rounded-sm" />
                <div className="col-span-2 row-span-2 bg-[#613b52] rounded-sm" />
                <div className="col-span-1 row-span-1 bg-[#934461]" />
                <div className="col-span-2 row-span-1 bg-[#613b52]" />
                <div className="col-span-2 row-span-2 bg-[#613b52] rounded-sm" />
                <div className="col-span-2 row-span-1 bg-[#934461]" />
                <div className="col-span-2 row-span-1 bg-[#613b52]" />
                <div className="col-span-1 row-span-1 bg-[#934461]" />
                <div className="col-span-1 row-span-1 bg-[#613b52]" />
                <div className="col-span-2 row-span-2 bg-[#613b52] rounded-sm" />
              </div>

              {/* Center icon */}
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[#934461] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
            </div>

            {/* Alphanumeric Code */}
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-[#efe5ed] px-4 py-2 rounded-xl border border-[#613b52]/10 font-mono text-[18px] font-bold text-[#1f1a20] tracking-wider">
                {voucher.code}
              </div>
              <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-xl bg-white border border-[#613b52]/20 flex items-center justify-center text-[#534347] hover:bg-[#efe5ed] transition-colors"
                title="Copy Code"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
              </button>
            </div>

            {copied && (
              <span className="text-[11px] text-[#006e25] font-semibold animate-pulse">
                Voucher code copied!
              </span>
            )}
          </div>

          {/* Quick instructions */}
          <div className="w-full text-left bg-white p-3.5 rounded-xl border border-[#613b52]/10 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#1f1a20] uppercase tracking-wide">
              How to Redeem:
            </span>
            <ul className="text-[12px] text-[#534347] space-y-1 list-disc list-inside">
              <li>Hold QR code 10cm under the dispenser optical reader</li>
              <li>Or punch the 6-digit code on the tactile keypad</li>
              <li>Or present to the nurse/attendant at Community Health Centre</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-[#613b52]/10 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-full border border-[#613b52]/20 text-[#534347] font-semibold text-[14px] hover:bg-[#efe5ed] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveToWallet}
            className="flex-1 h-12 rounded-full bg-[#613b52] hover:bg-[#4b2c3f] text-white font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span>Save to Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
