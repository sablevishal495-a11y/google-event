import React from 'react';

interface HeaderProps {
  currentTab: string;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenProfile
}) => {
  const getTitle = () => {
    switch (currentTab) {
      case 'explore':
        return 'Directory';
      case 'saved':
        return 'Saved & Vouchers';
      case 'profile':
        return 'Profile & Help';
      case 'home':
      default:
        return 'Map';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#fff7fc]/90 backdrop-blur-xl border-b border-[#613b52]/10 shadow-[0_1px_8px_rgba(97,59,82,0.06)]">
      {/* Mobile OS Status Bar Simulation */}
      <div className="w-full px-4 pt-1 pb-1 flex items-center justify-between text-[#534347] font-mono text-[12px] select-none">
        <span className="font-semibold tracking-tight">09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[15px]">battery_full</span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="h-14 px-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo */}
          <div className="h-9 w-9 rounded-xl bg-[#934461] flex items-center justify-center text-white shadow-sm shrink-0 overflow-hidden">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              water_drop
            </span>
          </div>

          <div className="flex flex-col truncate">
            <span className="text-[10px] uppercase tracking-wider text-[#934461] font-bold leading-none">
              SHE-ACCESS
            </span>
            <h1 className="text-[18px] font-semibold text-[#1f1a20] truncate leading-tight">
              {getTitle()}
            </h1>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#534347] hover:bg-[#eae0e8]/50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="w-8 h-8 ml-1 rounded-full bg-[#934461] hover:bg-[#762d49] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
