// ============================================================
// BV Robotik Cafe — Type Definitions
// ============================================================

// --- Product & Menu ---

export interface LocalizedText {
  en: string;
  tr: string;
}

export interface Product {
  productId: string;
  name: LocalizedText;
  image: string;
  unit: string | null;
}

export interface PreferenceValue {
  value: string;
  label: LocalizedText;
  additional_price: number;
}

export interface Preference {
  name: string;
  label: LocalizedText;
  values: PreferenceValue[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  preferreds: Preference[] | null;
  quantity: number;
  note: string;
}

// --- Order ---

export interface OrderEntry {
  target_uid: string;
  pickup_uid: string;
  note: string;
  items: CartItem[];
}

export interface OrderPayload {
  orders: OrderEntry[];
  total: number;
  language: string;
  idempotency_key: string;
}

export interface OrderRequest {
  latitude: number;
  longitude: number;
  proxyToken: string;
  orders: OrderEntry[];
  note: string;
  language: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
}

// --- QR Session ---

export interface QrSession {
  sessionId: string;
  proxyToken: string;
  tableNumber: number;
  createdAt: string;
  expiresAt: string;
  remainingSeconds: number;
}

// --- Geolocation ---

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error';

// --- Admin (Demo) ---

export interface DemoOrder {
  id: string;
  tableNumber: number;
  items: { name: string; quantity: number }[];
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  createdAt: string;
  deliveryTime?: number; // seconds
}

export interface DemoStats {
  todayOrders: number;
  activeTables: number;
  robotStatus: 'idle' | 'delivering' | 'returning' | 'charging';
  avgDeliveryTime: number; // seconds
}

// --- Robot Tracking (Demo) ---

export interface RobotPosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface DeliveryStep {
  key: string;
  label: LocalizedText;
  completed: boolean;
  active: boolean;
}

// --- Language ---

export type Language = 'tr' | 'en';
