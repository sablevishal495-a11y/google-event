import React from 'react';
import { DispenserNode, CategoryType } from '../types';

interface NearbySheetProps {
  dispensers: DispenserNode[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onVoiceSearch: () => void;
  onOpenFilter: () => void;
  currentArea: string;
  onOpenAreaSelector: () => void;
  onSelectDispenser: (dispenser: DispenserNode) => void;
  onStartDirections: (dispenser: DispenserNode) => void;
  onOpenEmergencyVoucher: () => void;
  sortBy: 'distance' | 'price' | 'stock';
  onToggleSort: () => void;
}

export const NearbySheet: React.FC<NearbySheetProps> = ({
  dispensers,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onVoiceSearch,
  onOpenFilter,
  currentArea,
  onOpenAreaSelector,
  onSelectDispenser,
  onStartDirections,
  onOpenEmergencyVoucher,
  sortBy,
  onToggleSort
}) => {
  const liveCount = dispensers.filter((d) => d.status !== 'empty').length;

  return (
    <div className="flex flex-col w-full relative">
      {/* Top Location & Search Overlay Layer */}
      <div className="px-4 pt-1 pb-2 flex flex-col gap-2 z-30 bg-[#fff7fc]">
        {/* Subtitle / Location Selector Trigger */}
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenAreaSelector}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] transition-colors active:scale-95 text-left border border-[#613b52]/10"
          >
            <span className="material-symbols-outlined text-[#934461] text-[18px]">
              near_me
            </span>
            <span className="text-[12px] text-[#1f1a20] font-semibold">
              {currentArea}
            </span>
            <span className="material-symbols-outlined text-[#534347] text-[16px]">
              expand_more
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-[#534347] text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#006e25] animate-ping" />
            <span className="font-semibold text-[#006e25]">Live Telemetry</span>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center h-[50px] rounded-full bg-white shadow-[0_4px_18px_rgba(97,59,82,0.08)] px-4 border border-[#613b52]/10">
            <span className="material-symbols-outlined text-[#934461] text-[20px] mr-2.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search area, metro, PIN code..."
              className="w-full bg-transparent border-0 focus:outline-none text-[14px] text-[#1f1a20] placeholder:text-[#857277]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[#857277] hover:text-[#1f1a20] p-1 mr-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onVoiceSearch}
              aria-label="Voice search"
              className="text-[#857277] hover:text-[#1f1a20] transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          <button
            onClick={onOpenFilter}
            aria-label="Filter machines"
            className="relative w-[50px] h-[50px] rounded-full bg-white shadow-[0_4px_18px_rgba(97,59,82,0.08)] flex items-center justify-center text-[#534347] active:scale-95 hover:bg-[#fff7fc] transition-transform border border-[#613b52]/10 shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">tune</span>
            <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-[#934461]" />
          </button>
        </div>

        {/* Category & Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          <button
            onClick={() => onSelectCategory('all')}
            className={`shrink-0 h-9 px-4 rounded-full font-semibold text-[12px] shadow-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#613b52] text-white'
                : 'bg-white text-[#1f1a20] border border-[#613b52]/10 hover:bg-[#fbf1f9]'
            }`}
          >
            <span>All</span>
          </button>

          <button
            onClick={() => onSelectCategory('instock')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12px] font-medium shadow-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === 'instock'
                ? 'bg-[#613b52] text-white'
                : 'bg-white text-[#1f1a20] border border-[#613b52]/10 hover:bg-[#fbf1f9]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#006e25]" />
            <span>In Stock</span>
          </button>

          <button
            onClick={() => onSelectCategory('campus')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12px] font-medium shadow-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === 'campus'
                ? 'bg-[#613b52] text-white'
                : 'bg-white text-[#1f1a20] border border-[#613b52]/10 hover:bg-[#fbf1f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#934461]">
              school
            </span>
            <span>College & Campus</span>
          </button>

          <button
            onClick={() => onSelectCategory('metro')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12px] font-medium shadow-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === 'metro'
                ? 'bg-[#613b52] text-white'
                : 'bg-white text-[#1f1a20] border border-[#613b52]/10 hover:bg-[#fbf1f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#613b52]">
              subway
            </span>
            <span>Metro Stations</span>
          </button>

          <button
            onClick={() => onSelectCategory('budget')}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12px] font-medium shadow-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === 'budget'
                ? 'bg-[#613b52] text-white'
                : 'bg-white text-[#1f1a20] border border-[#613b52]/10 hover:bg-[#fbf1f9]'
            }`}
          >
            <span>Under ₹5</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet Container */}
      <div className="relative -mt-4 bg-white rounded-t-[28px] shadow-[0_-4px_24px_rgba(97,59,82,0.1)] px-4 pt-3 pb-8 flex flex-col gap-4 z-30 border-t border-[#613b52]/10">
        {/* Grab Pill Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-[#eae0e8] mx-auto mb-1" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#1f1a20] tracking-tight">
                Nearby Dispensers
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#ffd9e2] text-[#3e001e] text-[10px] font-bold">
                {liveCount} Live
              </span>
            </div>
            <span className="text-[12px] text-[#534347] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[#006e25]">
                check_circle
              </span>
              Verified inventory • Updated 2m ago
            </span>
          </div>

          <button
            onClick={onToggleSort}
            className="flex items-center gap-1 text-[#613b52] text-[12px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#ffd8ec]/40 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">sort</span>
            <span className="capitalize">{sortBy}</span>
          </button>
        </div>

        {/* Vertical List of Vending Machine Cards */}
        <div className="flex flex-col gap-3.5">
          {dispensers.length === 0 ? (
            <div className="p-8 text-center bg-[#fbf1f9] rounded-2xl border border-dashed border-[#d8c1c6]">
              <span className="material-symbols-outlined text-[#857277] text-[36px] mb-2">
                search_off
              </span>
              <p className="text-[14px] font-semibold text-[#1f1a20]">No dispensers matched your criteria</p>
              <p className="text-[12px] text-[#534347] mt-1">
                Try clearing search or expanding your filter radius.
              </p>
            </div>
          ) : (
            dispensers.map((dispenser) => {
              const isCollege = dispenser.id === 'college';
              const isBus = dispenser.id === 'terminal';
              const isHealth = dispenser.id === 'health';
              const isEmpty = dispenser.status === 'empty';

              return (
                <div
                  key={dispenser.id}
                  className="p-4 rounded-2xl bg-[#fbf1f9] transition-all hover:bg-[#f5ebf3] flex flex-col gap-3 border border-[#613b52]/10 shadow-[0_2px_8px_-2px_rgba(97,59,82,0.06)]"
                >
                  {/* Top row: Status & Distance */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {isEmpty ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                            Out of Stock
                          </span>
                        ) : dispenser.status === 'low-stock' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Low Stock ({dispenser.stockCount} left)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#94f99a] text-[#004715] text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#006e25] animate-pulse" />
                            In Stock ({dispenser.stockCount} pads)
                          </span>
                        )}

                        {dispenser.isSubsidized && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffd8ec] text-[#301025] text-[10px] font-semibold">
                            Subsidized
                          </span>
                        )}

                        {dispenser.is24_7 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#eae0e8] text-[#534347] text-[10px]">
                            24/7 Open
                          </span>
                        )}

                        {!dispenser.isSubsidized && !dispenser.is24_7 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#eae0e8] text-[#534347] text-[10px]">
                            Sanitary Pads
                          </span>
                        )}
                      </div>

                      <h3 className="text-[18px] text-[#1f1a20] font-bold leading-tight">
                        {dispenser.name}
                      </h3>
                      <span className="text-[12px] text-[#534347] mt-0.5">
                        {dispenser.locationDescription}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`text-[22px] font-bold leading-tight ${
                          isEmpty
                            ? 'text-[#857277]'
                            : dispenser.price === 0
                            ? 'text-[#006e25]'
                            : 'text-[#934461]'
                        }`}
                      >
                        {dispenser.price === 0 ? 'FREE' : `₹${dispenser.price}`}
                      </span>
                      <span className="text-[10px] text-[#857277]">
                        {dispenser.price === 0 ? 'community kit' : 'per pad'}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry & Amenities Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <div className="flex items-center gap-1 text-[12px] text-[#534347] bg-white px-2.5 py-1 rounded-full border border-[#613b52]/10">
                      <span className="material-symbols-outlined text-[16px] text-[#934461]">
                        directions_walk
                      </span>
                      <span className="font-semibold text-[#1f1a20]">
                        {dispenser.distanceKm} km
                      </span>
                      <span>({dispenser.walkTimeMin} min)</span>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-[#534347] bg-white px-2.5 py-1 rounded-full border border-[#613b52]/10">
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          dispenser.paymentMethods.includes('UPI')
                            ? 'text-[#006e25]'
                            : 'text-[#613b52]'
                        }`}
                      >
                        {dispenser.paymentMethods.includes('UPI') ? 'contactless' : 'monetization_on'}
                      </span>
                      <span>{dispenser.paymentNote}</span>
                    </div>

                    {dispenser.amenities[0] && (
                      <div className="flex items-center gap-1 text-[12px] text-[#534347] bg-white px-2.5 py-1 rounded-full border border-[#613b52]/10">
                        <span className="material-symbols-outlined text-[16px] text-[#613b52]">
                          {dispenser.amenities[0].toLowerCase().includes('ground') ||
                          dispenser.amenities[0].toLowerCase().includes('wheelchair')
                            ? 'accessible'
                            : 'verified'}
                        </span>
                        <span>{dispenser.amenities[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => onSelectDispenser(dispenser)}
                      className="h-11 rounded-full bg-white text-[#613b52] text-[14px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eae0e8] active:scale-95 transition-all border border-[#613b52]/15 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">info</span>
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onStartDirections(dispenser)}
                      className="h-11 rounded-full bg-[#613b52] hover:bg-[#4b2c3f] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">navigation</span>
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footnote & Dignity Pledge Notice */}
        <div
          onClick={onOpenEmergencyVoucher}
          role="button"
          tabIndex={0}
          className="mt-2 p-3.5 rounded-2xl bg-[#efe5ed]/60 hover:bg-[#ffd8ec]/40 border border-[#613b52]/15 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-[#934461] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">
              volunteer_activism
            </span>
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-[#534347] leading-snug">
              <strong className="text-[#934461] font-semibold">
                Need emergency supplies without cash?
              </strong>{' '}
              Tap here to request a free subsidized emergency cycle voucher or find blue community tokens.
            </p>
          </div>
          <span className="material-symbols-outlined text-[#934461] text-[20px] shrink-0">
            chevron_right
          </span>
        </div>

        {/* Network Disclaimer */}
        <div className="text-center pt-1 pb-4">
          <span className="text-[10px] text-[#857277] leading-relaxed block">
            SHE-ACCESS Public Health Network • Sample demonstration data. Verify before visiting.
          </span>
        </div>
      </div>
    </div>
  );
};
