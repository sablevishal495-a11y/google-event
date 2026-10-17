import React, { useState } from 'react';
import { DispenserNode } from '../types';

interface ReportIssueModalProps {
  dispenser: DispenserNode | null;
  onClose: () => void;
  onSubmitReport: (dispenserId: string, issueType: string, note: string) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  dispenser,
  onClose,
  onSubmitReport
}) => {
  const [issueType, setIssueType] = useState('empty');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!dispenser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(dispenser.id, issueType, note);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const issueOptions = [
    { id: 'empty', label: 'Machine is Completely Empty', icon: 'block' },
    { id: 'coin_jam', label: 'Coin Slot Jammed / Stuck', icon: 'money_off' },
    { id: 'qr_error', label: 'UPI QR Code Unreadable / Scratched', icon: 'qr_code_2' },
    { id: 'dispense_failure', label: 'Money deducted but pad not released', icon: 'warning' },
    { id: 'restocked', label: 'Confirm Restocked / Fully Functional', icon: 'check_circle' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex items-center justify-between border-b border-[#613b52]/10 bg-[#fff7fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#934461] text-[22px]">
              flag
            </span>
            <div>
              <h3 className="text-[17px] font-bold text-[#1f1a20]">
                Report Machine Status
              </h3>
              <p className="text-[11px] text-[#534347]">{dispenser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] text-[#534347] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#94f99a] text-[#004715] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>
            <h4 className="text-[18px] font-bold text-[#1f1a20]">Thank You!</h4>
            <p className="text-[13px] text-[#534347] max-w-xs">
              Your community status report has been logged and live telemetry updated for nearby users.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <p className="text-[12px] text-[#534347]">
              Help keep SHE-ACCESS reliable. Submissions update community inventory and notify local custodians.
            </p>

            <div className="flex flex-col gap-2">
              {issueOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    issueType === opt.id
                      ? 'bg-[#ffd8ec]/40 border-[#934461] shadow-sm'
                      : 'bg-[#fff7fc] border-[#613b52]/10 hover:bg-[#efe5ed]'
                  }`}
                >
                  <input
                    type="radio"
                    name="issueType"
                    value={opt.id}
                    checked={issueType === opt.id}
                    onChange={() => setIssueType(opt.id)}
                    className="accent-[#934461]"
                  />
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      opt.id === 'restocked' ? 'text-[#006e25]' : 'text-[#934461]'
                    }`}
                  >
                    {opt.icon}
                  </span>
                  <span className="text-[13px] font-medium text-[#1f1a20] flex-1">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1f1a20]">
                Additional note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. 5 rupees stuck in slot, or caretaker refilled from back..."
                rows={2}
                className="w-full p-3 rounded-xl bg-[#fff7fc] border border-[#613b52]/20 text-[13px] text-[#1f1a20] focus:outline-none focus:border-[#934461]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#934461] hover:bg-[#762d49] text-white font-bold text-[14px] shadow-md active:scale-98 transition-transform mt-2"
            >
              Submit Community Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
