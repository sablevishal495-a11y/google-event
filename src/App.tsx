/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DispenserNode, CategoryType, EmergencyVoucher, NotificationItem } from './types';
import { INITIAL_DISPENSERS, INITIAL_NOTIFICATIONS } from './data/dispensers';
import { Header } from './components/Header';
import { MapCanvas } from './components/MapCanvas';
import { NearbySheet } from './components/NearbySheet';
import { BottomNav, NavTab } from './components/BottomNav';
import { DispenserModal } from './components/DispenserModal';
import { DirectionsModal } from './components/DirectionsModal';
import { EmergencyVoucherModal } from './components/EmergencyVoucherModal';
import { FilterModal, FilterSettings } from './components/FilterModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { AreaSelectorModal } from './components/AreaSelectorModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ExploreView } from './views/ExploreView';
import { SavedView } from './views/SavedView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Dispensers state
  const [dispensers, setDispensers] = useState<DispenserNode[]>(INITIAL_DISPENSERS);
  const [selectedDispenser, setSelectedDispenser] = useState<DispenserNode | null>(null);
  const [activeRouteDispenser, setActiveRouteDispenser] = useState<DispenserNode | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [currentArea, setCurrentArea] = useState('Connaught Place, New Delhi');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'stock'>('distance');

  // Advanced Filters
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    maxDistanceKm: 3.0,
    maxPrice: 10,
    inStockOnly: false,
    paymentUPI: false,
    paymentCoins: false,
    freeVoucherOnly: false,
    open24_7Only: false,
    groundAccessOnly: false
  });

  // Saved Bookmarks & Vouchers
  const [savedDispenserIds, setSavedDispenserIds] = useState<string[]>(['college', 'health']);
  const [vouchers, setVouchers] = useState<EmergencyVoucher[]>([
    {
      id: 'vouch-default',
      code: 'SHE-AID-4982',
      issuedAt: 'Today, 09:15 AM',
      expiresAt: 'Tomorrow, 09:15 AM',
      status: 'active',
      qrPayload: 'https://she-access.health/redeem/SHE-AID-4982'
    }
  ]);

  // Modals
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reportingDispenser, setReportingDispenser] = useState<DispenserNode | null>(null);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Filtered and Sorted Dispensers list
  const filteredDispensers = useMemo(() => {
    let result = dispensers.filter((d) => {
      // Category filter
      if (selectedCategory === 'instock' && d.status === 'empty') return false;
      if (selectedCategory === 'campus' && d.category !== 'campus') return false;
      if (selectedCategory === 'metro' && d.category !== 'metro') return false;
      if (selectedCategory === 'budget' && d.price > 4) return false;

      // Advanced filter modal criteria
      if (d.distanceKm > filterSettings.maxDistanceKm) return false;
      if (filterSettings.inStockOnly && d.status === 'empty') return false;
      if (filterSettings.freeVoucherOnly && d.price !== 0 && !d.isSubsidized) return false;
      if (filterSettings.open24_7Only && !d.is24_7) return false;
      if (
        filterSettings.groundAccessOnly &&
        !d.amenities.some((a) => a.toLowerCase().includes('ground') || a.toLowerCase().includes('wheelchair'))
      )
        return false;
      if (filterSettings.paymentUPI && !d.paymentMethods.includes('UPI')) return false;
      if (filterSettings.paymentCoins && !d.paymentMethods.includes('Coins')) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesDesc = d.locationDescription.toLowerCase().includes(query);
        const matchesArea = d.area.toLowerCase().includes(query);
        const matchesAmenities = d.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesArea && !matchesAmenities) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return b.stockCount - a.stockCount;
      return 0;
    });

    return result;
  }, [dispensers, selectedCategory, filterSettings, searchQuery, sortBy]);

  // Handlers
  const handleToggleSave = (dispenserId: string) => {
    setSavedDispenserIds((prev) =>
      prev.includes(dispenserId) ? prev.filter((id) => id !== dispenserId) : [...prev, dispenserId]
    );
  };

  const handleStartDirections = (dispenser: DispenserNode) => {
    setActiveRouteDispenser(dispenser);
    // Ensure on home tab so map and route are visible
    setCurrentTab('home');
  };

  const handleToggleSort = () => {
    if (sortBy === 'distance') setSortBy('price');
    else if (sortBy === 'price') setSortBy('stock');
    else setSortBy('distance');
  };

  const handleVoiceSearch = () => {
    setVoiceToast('Listening for location or metro station...');
    setTimeout(() => {
      setSearchQuery('College');
      setVoiceToast('Recognized "College" — filtered nearby dispensers');
      setTimeout(() => setVoiceToast(null), 2500);
    }, 1200);
  };

  const handleSaveVoucher = (voucher: EmergencyVoucher) => {
    setVouchers((prev) => [voucher, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Emergency Pass Saved',
        message: `Pass ${voucher.code} is available offline in your Saved tab.`,
        time: 'Just now',
        type: 'voucher',
        read: false
      },
      ...prev
    ]);
  };

  const handleSubmitReport = (dispenserId: string, issueType: string, note: string) => {
    setDispensers((prev) =>
      prev.map((d) => {
        if (d.id === dispenserId) {
          if (issueType === 'empty') {
            return { ...d, status: 'empty', stockCount: 0 };
          } else if (issueType === 'restocked') {
            return { ...d, status: 'in-stock', stockCount: Math.max(d.stockCount, 30) };
          }
          return { ...d, reportedIssuesCount: d.reportedIssuesCount + 1 };
        }
        return d;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Status Report Received',
        message: `Community verification logged for ${dispensers.find((d) => d.id === dispenserId)?.name}.`,
        time: 'Just now',
        type: 'system',
        read: false
      },
      ...prev
    ]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const savedDispensers = dispensers.filter((d) => savedDispenserIds.includes(d.id));

  return (
    <div className="bg-[#fff7fc] text-[#1f1a20] min-h-screen flex flex-col font-sans selection:bg-[#ffd8ec] selection:text-[#613b52]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-[76px] relative">
        {voiceToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#613b52] text-white px-4 py-2 rounded-full text-[12px] font-semibold shadow-lg animate-bounce flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#ffd8ec]">mic</span>
            <span>{voiceToast}</span>
          </div>
        )}

        {/* Tab 1: Home Map View (Matches screenshot) */}
        {currentTab === 'home' && (
          <div className="flex flex-col w-full">
            {/* Interactive Simulation Map Canvas Section */}
            <MapCanvas
              dispensers={filteredDispensers}
              selectedDispenserId={selectedDispenser?.id || null}
              onSelectDispenser={(dispenser) => setSelectedDispenser(dispenser)}
              activeRouteToId={activeRouteDispenser?.id || null}
            />

            {/* Draggable Bottom Sheet Layer */}
            <NearbySheet
              dispensers={filteredDispensers}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onVoiceSearch={handleVoiceSearch}
              onOpenFilter={() => setIsFilterModalOpen(true)}
              currentArea={currentArea}
              onOpenAreaSelector={() => setIsAreaModalOpen(true)}
              onSelectDispenser={(dispenser) => setSelectedDispenser(dispenser)}
              onStartDirections={(dispenser) => handleStartDirections(dispenser)}
              onOpenEmergencyVoucher={() => setIsVoucherModalOpen(true)}
              sortBy={sortBy}
              onToggleSort={handleToggleSort}
            />
          </div>
        )}

        {/* Tab 2: Explore Directory & Public Health Resources */}
        {currentTab === 'explore' && (
          <ExploreView
            dispensers={dispensers}
            onSelectDispenser={(dispenser) => setSelectedDispenser(dispenser)}
            onStartDirections={(dispenser) => handleStartDirections(dispenser)}
            onOpenEmergencyVoucher={() => setIsVoucherModalOpen(true)}
          />
        )}

        {/* Tab 3: Saved Locations & Emergency Vouchers */}
        {currentTab === 'saved' && (
          <SavedView
            savedDispensers={savedDispensers}
            vouchers={vouchers}
            onSelectDispenser={(dispenser) => setSelectedDispenser(dispenser)}
            onStartDirections={(dispenser) => handleStartDirections(dispenser)}
            onRemoveSaved={(id) => handleToggleSave(id)}
            onOpenEmergencyVoucher={() => setIsVoucherModalOpen(true)}
          />
        )}

        {/* Tab 4: Profile, Privacy & Helplines */}
        {currentTab === 'profile' && (
          <ProfileView onOpenEmergencyVoucher={() => setIsVoucherModalOpen(true)} />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        savedCount={savedDispensers.length + vouchers.length}
      />

      {/* Modals & Overlays */}
      <DispenserModal
        dispenser={selectedDispenser}
        onClose={() => setSelectedDispenser(null)}
        onStartDirections={(d) => handleStartDirections(d)}
        onOpenReport={(d) => setReportingDispenser(d)}
        onOpenEmergencyVoucher={() => setIsVoucherModalOpen(true)}
        isSaved={selectedDispenser ? savedDispenserIds.includes(selectedDispenser.id) : false}
        onToggleSave={handleToggleSave}
      />

      <DirectionsModal
        dispenser={activeRouteDispenser}
        onClose={() => setActiveRouteDispenser(null)}
        onArrived={() => {
          setActiveRouteDispenser(null);
          alert('You have arrived at the dispenser location! Verify slot on the indoor machine.');
        }}
      />

      {isVoucherModalOpen && (
        <EmergencyVoucherModal
          onClose={() => setIsVoucherModalOpen(false)}
          onSaveVoucher={handleSaveVoucher}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filterSettings}
        onApplyFilters={(newFilters) => setFilterSettings(newFilters)}
        onResetFilters={() =>
          setFilterSettings({
            maxDistanceKm: 3.0,
            maxPrice: 10,
            inStockOnly: false,
            paymentUPI: false,
            paymentCoins: false,
            freeVoucherOnly: false,
            open24_7Only: false,
            groundAccessOnly: false
          })
        }
      />

      <ReportIssueModal
        dispenser={reportingDispenser}
        onClose={() => setReportingDispenser(null)}
        onSubmitReport={handleSubmitReport}
      />

      <AreaSelectorModal
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        currentArea={currentArea}
        onSelectArea={(area) => setCurrentArea(area)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearNotification={handleClearNotification}
      />
    </div>
  );
}
