import React, { useState } from 'react';
import { DispenserNode } from '../types';

interface ExploreViewProps {
  dispensers: DispenserNode[];
  onSelectDispenser: (dispenser: DispenserNode) => void;
  onStartDirections: (dispenser: DispenserNode) => void;
  onOpenEmergencyVoucher: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  dispensers,
  onSelectDispenser,
  onStartDirections,
  onOpenEmergencyVoucher
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'campus' | 'metro' | 'transit' | 'health'>('all');
  const [search, setSearch] = useState('');

  const filteredDispensers = dispensers.filter((d) => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.locationDescription.toLowerCase().includes(search.toLowerCase()) ||
      d.area.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Nodes', icon: 'grid_view' },
    { id: 'campus', label: 'Colleges & Universities', icon: 'school' },
    { id: 'metro', label: 'Metro Stations', icon: 'subway' },
    { id: 'transit', label: 'Bus Terminals', icon: 'directions_bus' },
    { id: 'health', label: 'Community Health', icon: 'health_and_safety' }
  ];

  return (
    <div className="flex flex-col w-full pb-28 pt-4 px-4 max-w-xl mx-auto gap-5">
      {/* Search Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold text-[#1f1a20]">Public Health Directory</h2>
        <p className="text-[13px] text-[#534347]">
          Browse verified automated dispensers, hospital wellness suites, and zero-cash dignity counters.
        </p>

        <div className="relative flex items-center h-12 rounded-full bg-white shadow-sm px-4 border border-[#613b52]/15 mt-1">
          <span className="material-symbols-outlined text-[#934461] text-[20px] mr-2">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations, institutions, streets..."
            className="w-full bg-transparent border-0 focus:outline-none text-[14px] text-[#1f1a20] placeholder:text-[#857277]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id as any)}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
              activeCategory === c.id
                ? 'bg-[#613b52] text-white shadow-sm'
                : 'bg-white text-[#534347] border border-[#613b52]/15 hover:bg-[#fbf1f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Dignity Spotlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ffd8ec] to-[#fbf1f9] border border-[#934461]/25 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#934461] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              volunteer_activism
            </span>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#1f1a20]">
              Zero-Cash Emergency Access
            </h4>
            <p className="text-[12px] text-[#534347]">
              Need supplies right away without coins or UPI?
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEmergencyVoucher}
          className="px-3.5 py-1.5 rounded-full bg-[#934461] hover:bg-[#762d49] text-white text-[12px] font-bold shrink-0 transition-colors"
        >
          Get Pass
        </button>
      </div>

      {/* List of Dispensers */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#1f1a20]">
            Dispensers in Delhi NCR ({filteredDispensers.length})
          </span>
          <span className="text-[11px] text-[#006e25] font-semibold">
            ● Live IoT Status
          </span>
        </div>

        {filteredDispensers.map((dispenser) => (
          <div
            key={dispenser.id}
            className="p-4 rounded-2xl bg-white border border-[#613b52]/10 shadow-sm hover:border-[#934461]/30 transition-all flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      dispenser.status === 'in-stock'
                        ? 'bg-[#94f99a] text-[#004715]'
                        : dispenser.status === 'low-stock'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {dispenser.status === 'in-stock'
                      ? `${dispenser.stockCount} in stock`
                      : dispenser.status === 'low-stock'
                      ? `Low (${dispenser.stockCount} left)`
                      : 'Empty'}
                  </span>
                  <span className="text-[11px] text-[#857277]">
                    {dispenser.distanceKm} km away
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[#1f1a20] leading-tight">
                  {dispenser.name}
                </h3>
                <p className="text-[12px] text-[#534347] mt-0.5">
                  {dispenser.locationDescription}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[20px] font-bold text-[#934461] block leading-tight">
                  {dispenser.price === 0 ? 'FREE' : `₹${dispenser.price}`}
                </span>
                <span className="text-[10px] text-[#857277]">per pad</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
              <span className="text-[11px] text-[#534347] bg-[#fbf1f9] px-2.5 py-1 rounded-full border border-[#613b52]/10">
                {dispenser.paymentNote}
              </span>
              <div className="flex-1" />
              <button
                onClick={() => onSelectDispenser(dispenser)}
                className="px-3 py-1.5 rounded-full bg-[#efe5ed] text-[#613b52] text-[12px] font-semibold hover:bg-[#eae0e8] transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => onStartDirections(dispenser)}
                className="px-3.5 py-1.5 rounded-full bg-[#613b52] text-white text-[12px] font-semibold hover:bg-[#4b2c3f] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>Directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Menstrual Hygiene Health Guide */}
      <div className="bg-white p-5 rounded-2xl border border-[#613b52]/15 shadow-sm flex flex-col gap-3 mt-2">
        <h3 className="text-[16px] font-bold text-[#1f1a20] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#934461]">health_and_safety</span>
          Public Health & Safe Disposal Guide
        </h3>
        <p className="text-[13px] text-[#534347] leading-relaxed">
          SHE-ACCESS promotes dignified, hygienic, and eco-conscious menstrual care in public transit nodes and educational spaces.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-[#fbf1f9] border border-[#613b52]/10">
            <span className="text-[12px] font-bold text-[#1f1a20] block mb-1">
              Safe Disposal
            </span>
            <p className="text-[11px] text-[#534347]">
              Wrap used pads in the provided biodegradable envelope before using incinerator bins. Never flush.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf1f9] border border-[#613b52]/10">
            <span className="text-[12px] font-bold text-[#1f1a20] block mb-1">
              Change Frequency
            </span>
            <p className="text-[11px] text-[#534347]">
              Health guidelines recommend changing sanitary pads every 4 to 6 hours to prevent bacterial infections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
