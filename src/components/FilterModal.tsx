import React from 'react';

export interface FilterSettings {
  maxDistanceKm: number;
  maxPrice: number;
  inStockOnly: boolean;
  paymentUPI: boolean;
  paymentCoins: boolean;
  freeVoucherOnly: boolean;
  open24_7Only: boolean;
  groundAccessOnly: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterSettings;
  onApplyFilters: (filters: FilterSettings) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterSettings>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden border border-[#613b52]/15 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#613b52]/10 bg-[#fff7fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#934461] text-[22px]">
              tune
            </span>
            <h3 className="text-[18px] font-bold text-[#1f1a20]">
              Filter Dispensers
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] text-[#534347] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filters content */}
        <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Max Distance Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#1f1a20]">
                Maximum Distance
              </label>
              <span className="text-[13px] font-bold text-[#934461] bg-[#ffd9e2] px-2 py-0.5 rounded-full">
                {localFilters.maxDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="5.0"
              step="0.2"
              value={localFilters.maxDistanceKm}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, maxDistanceKm: parseFloat(e.target.value) })
              }
              className="accent-[#934461] w-full cursor-pointer h-2 bg-[#efe5ed] rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-[#857277]">
              <span>300m (Walkable)</span>
              <span>2.5 km</span>
              <span>5 km</span>
            </div>
          </div>

          {/* Price Cap */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1f1a20]">
              Price Range
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Free Only', max: 0 },
                { label: 'Up to ₹3', max: 3 },
                { label: 'Any (₹5 max)', max: 10 }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setLocalFilters({ ...localFilters, maxPrice: opt.max })}
                  className={`h-10 rounded-xl text-[12px] font-bold transition-all border ${
                    localFilters.maxPrice === opt.max
                      ? 'bg-[#613b52] text-white border-[#613b52]'
                      : 'bg-[#fff7fc] text-[#534347] border-[#613b52]/15 hover:bg-[#efe5ed]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1f1a20]">
              Accepted Payment
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setLocalFilters({ ...localFilters, paymentUPI: !localFilters.paymentUPI })
                }
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 transition-all ${
                  localFilters.paymentUPI
                    ? 'bg-[#006e25] text-white border-[#006e25]'
                    : 'bg-[#fff7fc] text-[#534347] border-[#613b52]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">contactless</span>
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() =>
                  setLocalFilters({ ...localFilters, paymentCoins: !localFilters.paymentCoins })
                }
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 transition-all ${
                  localFilters.paymentCoins
                    ? 'bg-[#613b52] text-white border-[#613b52]'
                    : 'bg-[#fff7fc] text-[#534347] border-[#613b52]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">monetization_on</span>
                <span>Coins Accepted</span>
              </button>

              <button
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    freeVoucherOnly: !localFilters.freeVoucherOnly
                  })
                }
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 transition-all ${
                  localFilters.freeVoucherOnly
                    ? 'bg-[#934461] text-white border-[#934461]'
                    : 'bg-[#fff7fc] text-[#534347] border-[#613b52]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                <span>Dignity Voucher</span>
              </button>
            </div>
          </div>

          {/* Accessibility & Features */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-[13px] font-bold text-[#1f1a20]">
              Operational Availability
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#fff7fc] border border-[#613b52]/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006e25]" />
                <span className="text-[13px] text-[#1f1a20] font-medium">In Stock Only</span>
              </div>
              <input
                type="checkbox"
                checked={localFilters.inStockOnly}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, inStockOnly: e.target.checked })
                }
                className="w-4 h-4 accent-[#934461] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#fff7fc] border border-[#613b52]/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#613b52]">schedule</span>
                <span className="text-[13px] text-[#1f1a20] font-medium">24/7 Access Nodes</span>
              </div>
              <input
                type="checkbox"
                checked={localFilters.open24_7Only}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, open24_7Only: e.target.checked })
                }
                className="w-4 h-4 accent-[#934461] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#fff7fc] border border-[#613b52]/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#613b52]">accessible</span>
                <span className="text-[13px] text-[#1f1a20] font-medium">Wheelchair & Ground Floor</span>
              </div>
              <input
                type="checkbox"
                checked={localFilters.groundAccessOnly}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, groundAccessOnly: e.target.checked })
                }
                className="w-4 h-4 accent-[#934461] rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#613b52]/10 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="h-12 px-5 rounded-full border border-[#613b52]/20 text-[#534347] font-semibold text-[13px] hover:bg-[#efe5ed]"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-12 rounded-full bg-[#934461] hover:bg-[#762d49] text-white font-bold text-[14px] shadow-md active:scale-98 transition-transform"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
