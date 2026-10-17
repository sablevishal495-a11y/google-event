export type DispenserStatus = 'in-stock' | 'low-stock' | 'empty' | 'maintenance';

export type CategoryType = 'all' | 'instock' | 'campus' | 'metro' | 'budget' | '24_7';

export interface ProductItem {
  id: string;
  name: string;
  type: string;
  price: number;
  inStock: boolean;
  count: number;
}

export interface DispenserNode {
  id: string;
  name: string;
  locationDescription: string;
  area: string;
  coords: {
    x: number; // SVG map coordinate
    y: number; // SVG map coordinate
    lat: number;
    lng: number;
  };
  status: DispenserStatus;
  stockCount: number;
  price: number;
  isSubsidized?: boolean;
  is24_7?: boolean;
  category: 'campus' | 'metro' | 'health' | 'transit' | 'market';
  distanceKm: number;
  walkTimeMin: number;
  paymentMethods: ('UPI' | 'Coins' | 'Free' | 'Card')[];
  paymentNote: string;
  amenities: string[];
  products: ProductItem[];
  lastVerified: string;
  telemetryLive: boolean;
  floorLevel: string;
  indoorDirections: string;
  custodianName: string;
  custodianPhone: string;
  reportedIssuesCount: number;
}

export interface EmergencyVoucher {
  id: string;
  code: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'redeemed';
  dispenserId?: string;
  qrPayload: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'stock' | 'system' | 'voucher';
  read: boolean;
}
