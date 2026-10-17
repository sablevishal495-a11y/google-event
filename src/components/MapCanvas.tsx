import React, { useState, useRef } from 'react';
import { DispenserNode } from '../types';

interface MapCanvasProps {
  dispensers: DispenserNode[];
  selectedDispenserId: string | null;
  onSelectDispenser: (dispenser: DispenserNode) => void;
  activeRouteToId: string | null;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  dispensers,
  selectedDispenserId,
  onSelectDispenser,
  activeRouteToId
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapLayer, setMapLayer] = useState<'standard' | 'contrast' | 'satellite'>('standard');
  const [showRecenterPing, setShowRecenterPing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // User coordinate in SVG space
  const userCoords = { x: 175, y: 165 };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: Math.max(-100, Math.min(100, e.clientX - dragStart.x)),
      y: Math.max(-100, Math.min(100, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: Math.max(-100, Math.min(100, e.touches[0].clientX - dragStart.x)),
      y: Math.max(-100, Math.min(100, e.touches[0].clientY - dragStart.y))
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.4, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.85, prev - 0.15));
  };

  const handleRecenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
    setShowRecenterPing(true);
    setTimeout(() => setShowRecenterPing(false), 2000);
  };

  const toggleLayer = () => {
    const layers: ('standard' | 'contrast' | 'satellite')[] = ['standard', 'contrast', 'satellite'];
    const nextIdx = (layers.indexOf(mapLayer) + 1) % layers.length;
    setMapLayer(layers[nextIdx]);
  };

  // Find active route target
  const activeTarget = dispensers.find((d) => d.id === activeRouteToId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-[410px] overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors ${
        mapLayer === 'contrast'
          ? 'bg-[#1e1b22]'
          : mapLayer === 'satellite'
          ? 'bg-[#29352e]'
          : 'bg-[#e8ecf1]'
      }`}
    >
      {/* Zoom and Pan Wrapper */}
      <div
        className="w-full h-full relative origin-center transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
        }}
      >
        {/* Map Vector Ground Graphic */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 420 420"
        >
          <defs>
            <pattern height="35" id="urbanGrid" patternUnits="userSpaceOnUse" width="35">
              <path
                d="M 35 0 L 0 0 0 35"
                fill="none"
                stroke={mapLayer === 'contrast' ? '#2e2833' : '#d5dde5'}
                strokeWidth="0.8"
              />
            </pattern>
            <linearGradient id="parkGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={mapLayer === 'contrast' ? '#183823' : '#d4edda'}
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor={mapLayer === 'contrast' ? '#112919' : '#c3e6cb'}
                stopOpacity="0.8"
              />
            </linearGradient>
            <linearGradient id="navRouteGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#934461" />
              <stop offset="100%" stopColor="#006e25" />
            </linearGradient>
          </defs>

          {/* Base map tiles */}
          <rect
            fill={
              mapLayer === 'contrast'
                ? '#19151e'
                : mapLayer === 'satellite'
                ? '#243029'
                : '#edf1f5'
            }
            height="100%"
            width="100%"
          />
          <rect fill="url(#urbanGrid)" height="100%" width="100%" />

          {/* Metro Line track */}
          <path
            d="M-10,230 Q140,220 230,120 T440,70"
            fill="none"
            stroke={mapLayer === 'contrast' ? '#ffd8ec' : '#613b52'}
            strokeDasharray="1 6"
            strokeLinecap="round"
            strokeWidth="5"
          />

          {/* Parks & Open Green Spaces */}
          <path
            d="M 30,50 Q 80,40 120,70 T 150,140 Q 90,160 50,130 Z"
            fill="url(#parkGrad)"
          />
          <path
            d="M 270,250 Q 340,240 370,290 T 310,380 Q 240,360 250,290 Z"
            fill="url(#parkGrad)"
          />

          {/* Major Roads */}
          <path
            d="M-20,110 L440,190"
            stroke={mapLayer === 'contrast' ? '#372d36' : '#ffffff'}
            strokeWidth="16"
          />
          <path
            d="M-20,110 L440,190"
            stroke={mapLayer === 'contrast' ? '#69233f' : '#f2d7e2'}
            strokeDasharray="10 8"
            strokeWidth="4"
          />
          <path
            d="M190,-20 L210,440"
            stroke={mapLayer === 'contrast' ? '#372d36' : '#ffffff'}
            strokeWidth="18"
          />
          <path
            d="M190,-20 L210,440"
            stroke={mapLayer === 'contrast' ? '#534347' : '#e1d7df'}
            strokeWidth="2"
          />
          <path
            d="M40,350 Q 180,310 390,360"
            stroke={mapLayer === 'contrast' ? '#372d36' : '#ffffff'}
            strokeWidth="14"
          />

          {/* Secondary streets */}
          <path
            d="M90,125 L100,430"
            stroke={mapLayer === 'contrast' ? '#2c242d' : '#ffffff'}
            strokeWidth="8"
          />
          <path
            d="M290,10 L300,260"
            stroke={mapLayer === 'contrast' ? '#2c242d' : '#ffffff'}
            strokeWidth="8"
          />
          <path
            d="M10,270 L400,260"
            stroke={mapLayer === 'contrast' ? '#2c242d' : '#ffffff'}
            strokeWidth="9"
          />

          {/* Landmarks Text */}
          <text
            fill={mapLayer === 'contrast' ? '#94f99a' : '#2b6b3e'}
            fontFamily="Inter"
            fontSize="9"
            fontWeight="700"
            letterSpacing="0.5"
            x="65"
            y="100"
          >
            CENTRAL PARK
          </text>
          <text
            fill={mapLayer === 'contrast' ? '#94f99a' : '#2b6b3e'}
            fontFamily="Inter"
            fontSize="9"
            fontWeight="700"
            letterSpacing="0.5"
            x="280"
            y="295"
          >
            COLLEGE QUAD
          </text>
          <text
            fill={mapLayer === 'contrast' ? '#ffd9e2' : '#613b52'}
            fontFamily="Inter"
            fontSize="8"
            fontWeight="600"
            x="12"
            y="195"
          >
            Janpath Road
          </text>
          <text
            fill={mapLayer === 'contrast' ? '#d8c1c6' : '#534347'}
            fontFamily="Inter"
            fontSize="8"
            fontWeight="600"
            x="120"
            y="325"
          >
            Barakhamba Ave
          </text>
          <text
            fill={mapLayer === 'contrast' ? '#d8c1c6' : '#534347'}
            fontFamily="Inter"
            fontSize="8"
            fontWeight="600"
            x="215"
            y="45"
          >
            Sansad Marg
          </text>

          {/* Active Navigation Route Line */}
          {activeTarget && (
            <g>
              <line
                x1={userCoords.x}
                y1={userCoords.y}
                x2={activeTarget.coords.x}
                y2={activeTarget.coords.y}
                stroke="#934461"
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.4"
              />
              <line
                x1={userCoords.x}
                y1={userCoords.y}
                x2={activeTarget.coords.x}
                y2={activeTarget.coords.y}
                stroke="#613b52"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>

        {/* User Current Position Beacon */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
          style={{ top: `${userCoords.y}px`, left: `${userCoords.x}px` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-[#934461]/25 animate-ping absolute" />
            <span className="w-6 h-6 rounded-full bg-[#934461]/40 animate-pulse absolute" />
            <span
              className={`w-4 h-4 rounded-full bg-[#934461] shadow-lg border-2 border-white transition-transform ${
                showRecenterPing ? 'scale-150 ring-4 ring-[#e98baa]' : ''
              }`}
            />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-white/95 shadow-sm text-[#1f1a20] text-[10px] font-semibold flex items-center gap-1 border border-[#613b52]/10 backdrop-blur-sm">
            <span>You (Janpath Rd)</span>
          </div>
        </div>

        {/* Dynamic Dispensers Pins */}
        {dispensers.map((dispenser) => {
          const isSelected = selectedDispenserId === dispenser.id;
          const isTargetRoute = activeRouteToId === dispenser.id;

          // Visual styles based on status & category
          let pinBg = 'bg-[#006e25]';
          let pinIcon = 'water_drop';
          let statusDotColor = 'bg-[#006e25]';
          let badgeText = `₹${dispenser.price} • ${dispenser.stockCount} pads`;
          let badgeTextColor = 'text-[#1f1a20]';

          if (dispenser.status === 'empty') {
            pinBg = 'bg-[#ba1a1a]';
            pinIcon = 'block';
            statusDotColor = 'bg-[#ba1a1a]';
            badgeText = 'Empty';
            badgeTextColor = 'text-[#ba1a1a]';
          } else if (dispenser.status === 'low-stock') {
            pinBg = 'bg-[#e68a00]';
            pinIcon = 'water_drop';
            statusDotColor = 'bg-[#e68a00]';
            badgeText = `₹${dispenser.price} • ${dispenser.stockCount} pads`;
          } else if (dispenser.category === 'health' || dispenser.isSubsidized) {
            pinBg = 'bg-[#934461]';
            pinIcon = dispenser.price === 0 ? 'volunteer_activism' : 'sanitizer';
            statusDotColor = 'bg-[#006e25]';
            badgeText = dispenser.price === 0 ? 'Free • Cycle Kit' : `₹${dispenser.price} • ${dispenser.stockCount} pads`;
          } else if (dispenser.category === 'metro') {
            pinBg = 'bg-[#613b52]';
            pinIcon = 'subway';
            statusDotColor = 'bg-[#006e25]';
            badgeText = `₹${dispenser.price} • ${dispenser.stockCount} pads`;
          }

          return (
            <div
              key={dispenser.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectDispenser(dispenser);
              }}
              className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer group z-20 transition-all duration-200 ${
                isSelected || isTargetRoute ? 'scale-110 z-30' : ''
              }`}
              style={{
                top: `${dispenser.coords.y}px`,
                left: `${dispenser.coords.x}px`
              }}
            >
              <div className="flex flex-col items-center">
                {/* Floating Tooltip Preview */}
                <div
                  className={`mb-1 px-2 py-0.5 rounded-md bg-white shadow-md flex items-center gap-1.5 whitespace-nowrap transition-transform border ${
                    isSelected ? 'border-[#934461] ring-2 ring-[#e98baa]/50' : 'border-[#613b52]/10'
                  } ${dispenser.status === 'empty' ? 'opacity-90' : ''}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusDotColor} ${
                      dispenser.status === 'in-stock' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className={`text-[10px] font-bold ${badgeTextColor}`}>
                    {badgeText}
                  </span>
                </div>

                {/* Vending Custom Pin Icon */}
                <div
                  className={`w-9 h-9 rounded-full ${pinBg} text-white flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1 ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#934461]' : ''
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {pinIcon}
                  </span>
                </div>
                {/* Pin pointer tip */}
                <div className={`w-1.5 h-2 ${pinBg} rounded-b-full -mt-0.5`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Floating Utility Controls */}
      <div className="absolute right-4 bottom-5 flex flex-col gap-2.5 z-20">
        {/* Recenter GPS Action Button */}
        <button
          onClick={handleRecenter}
          aria-label="Recenter Map"
          className="w-12 h-12 rounded-full bg-white text-[#934461] shadow-[0_4px_14px_rgba(147,68,97,0.22)] flex items-center justify-center active:scale-90 hover:bg-[#fff7fc] transition-transform border border-[#613b52]/10"
        >
          <span className="material-symbols-outlined text-[24px]">my_location</span>
        </button>

        {/* Zoom In / Zoom Out Controls */}
        <div className="flex flex-col rounded-full bg-white shadow-md overflow-hidden border border-[#613b52]/10">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom In"
            className="w-11 h-10 flex items-center justify-center text-[#534347] hover:bg-[#eae0e8]/40 active:scale-95 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="h-[1px] w-full bg-[#d8c1c6]/40" />
          <button
            onClick={handleZoomOut}
            aria-label="Zoom Out"
            className="w-11 h-10 flex items-center justify-center text-[#534347] hover:bg-[#eae0e8]/40 active:scale-95 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        {/* Layer Toggle */}
        <button
          onClick={toggleLayer}
          aria-label="Toggle Layer"
          title={`Layer: ${mapLayer}`}
          className="w-11 h-11 rounded-full bg-white text-[#534347] shadow-md flex items-center justify-center active:scale-95 hover:bg-[#fff7fc] transition-colors border border-[#613b52]/10"
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>
      </div>

      {/* Active Navigation Indicator pill */}
      {activeTarget && (
        <div className="absolute top-3 left-4 right-16 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-[#934461]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#934461] text-white flex items-center justify-center shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-[16px]">navigation</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-bold text-[#934461] tracking-wide leading-none">
                Navigating to
              </span>
              <span className="text-[12px] font-semibold text-[#1f1a20] truncate">
                {activeTarget.name} ({activeTarget.distanceKm} km • {activeTarget.walkTimeMin}m)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
