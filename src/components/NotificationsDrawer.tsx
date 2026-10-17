import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col border-l border-[#613b52]/15 animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 pt-12 sm:pt-6 flex items-center justify-between border-b border-[#613b52]/10 bg-[#fff7fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#934461] text-[22px]">
              notifications
            </span>
            <h3 className="text-[17px] font-bold text-[#1f1a20]">
              Telemetry & Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#efe5ed] hover:bg-[#eae0e8] text-[#534347] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-[#fbf1f9] border-b border-[#613b52]/10 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#857277]">
            {notifications.filter((n) => !n.read).length} unread updates
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-[#934461] font-bold hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#857277]">
              <span className="material-symbols-outlined text-[36px] mb-2 text-[#d8c1c6]">
                notifications_off
              </span>
              <p className="text-[13px] font-semibold">No recent alerts</p>
              <p className="text-[11px] mt-1">
                You will be notified when machines are restocked in your area.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  notif.read
                    ? 'bg-[#fff7fc] border-[#613b52]/10 opacity-75'
                    : 'bg-white border-[#934461]/30 shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === 'stock'
                      ? 'bg-[#94f99a] text-[#004715]'
                      : notif.type === 'voucher'
                      ? 'bg-[#ffd8ec] text-[#934461]'
                      : 'bg-[#e98baa] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {notif.type === 'stock'
                      ? 'inventory_2'
                      : notif.type === 'voucher'
                      ? 'volunteer_activism'
                      : 'info'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[12px] font-bold text-[#1f1a20]">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#857277]">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-[#534347] mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                <button
                  onClick={() => onClearNotification(notif.id)}
                  className="text-[#857277] hover:text-[#ba1a1a] p-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#fff7fc] border-t border-[#613b52]/10 text-center">
          <span className="text-[10px] text-[#857277]">
            Telemetry feeds sync every 30 seconds with IoT dispensers
          </span>
        </div>
      </div>
    </div>
  );
};
