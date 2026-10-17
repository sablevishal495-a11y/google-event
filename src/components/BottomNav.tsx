import React from 'react';

export type NavTab = 'home' | 'explore' | 'saved' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount
}) => {
  const navItems: { tab: NavTab; label: string; icon: string; count?: number }[] = [
    { tab: 'home', label: 'Home', icon: 'map' },
    { tab: 'explore', label: 'Explore', icon: 'explore' },
    { tab: 'saved', label: 'Saved', icon: 'bookmark', count: savedCount },
    { tab: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(97,59,82,0.08)] border-t border-[#613b52]/10">
      <div className="flex justify-around items-center h-16 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => onChangeTab(item.tab)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#1f1a20]' : 'text-[#534347] hover:text-[#1f1a20]'
              }`}
            >
              <div
                className={`relative w-16 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#e98baa] text-[#613b52]'
                    : 'text-[#534347] group-hover:bg-[#eae0e8]/50'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  {item.icon}
                </span>

                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 right-2 bg-[#934461] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.count}
                  </span>
                )}
              </div>

              <span
                className={`text-[12px] transition-all leading-tight mt-0.5 ${
                  isActive ? 'font-bold text-[#1f1a20]' : 'font-medium text-[#534347]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
