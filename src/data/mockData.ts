import type { Product, Preference, DemoOrder, DemoStats } from '../types';

// ============================================================
// Product catalog — extracted from the original BV Robotik page
// ============================================================

export const PRODUCTS: Product[] = [
  {
    productId: '7503',
    name: { en: 'Caffè Americano', tr: 'Caffè Americano' },
    image: '/images/americano-1779448755166.png',
    unit: null,
  },
  {
    productId: '7504',
    name: { en: 'Espresso', tr: 'Espresso' },
    image: '/images/espresso-1779448779005.png',
    unit: null,
  },
  {
    productId: '7500',
    name: { en: 'Tea', tr: 'Çay' },
    image: '/images/cay-1779448624383.png',
    unit: null,
  },
  {
    productId: '7502',
    name: { en: 'Turkish Coffee', tr: 'Türk Kahvesi' },
    image: '/images/turkkahvesi-1779448709513.png',
    unit: null,
  },
  {
    productId: '7501',
    name: { en: 'Water', tr: 'Su' },
    image: '/images/su-1779448652674.png',
    unit: null,
  },
];

// ============================================================
// Product preferences — Turkish coffee has sugar preference
// ============================================================

export const PRODUCT_PREFERENCES: Record<string, Preference[]> = {
  '7502': [
    {
      name: 'opt-btmdva',
      label: { en: 'Sugar Preference', tr: 'Şeker Tercihi' },
      values: [
        { value: 'val-79jsz', label: { en: 'Plain', tr: 'Sade' }, additional_price: 0 },
        { value: 'val-az1ks', label: { en: 'Mild', tr: 'Az Şekerli' }, additional_price: 0 },
        { value: 'val-orta1', label: { en: 'Medium', tr: 'Orta' }, additional_price: 0 },
        { value: 'val-seker', label: { en: 'Sweet', tr: 'Şekerli' }, additional_price: 0 },
      ],
    },
  ],
};

// ============================================================
// Category data — from the original page
// ============================================================

export const CATEGORIES = [
  {
    id: 'drinks',
    name: { en: 'Drinks', tr: 'İçecekler' },
    image: '/images/icecekler-1777556512800.png',
  },
];

// ============================================================
// Table / Station UIDs
// ============================================================

export const PICKUP_UID = 'BV-Cafe_0_Mutfak';

export function getTargetUid(tableNumber: number): string {
  return `BV-Cafe_0_${tableNumber}`;
}

// ============================================================
// Demo data for admin panel and robot tracking
// ============================================================

export const DEMO_STATS: DemoStats = {
  todayOrders: 24,
  activeTables: 3,
  robotStatus: 'delivering',
  avgDeliveryTime: 180,
};

export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'ORD-1001',
    tableNumber: 16,
    items: [
      { name: 'Türk Kahvesi', quantity: 2 },
      { name: 'Su', quantity: 1 },
    ],
    status: 'delivered',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    deliveryTime: 165,
  },
  {
    id: 'ORD-1002',
    tableNumber: 15,
    items: [
      { name: 'Espresso', quantity: 1 },
      { name: 'Caffè Americano', quantity: 1 },
    ],
    status: 'delivering',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'ORD-1003',
    tableNumber: 12,
    items: [{ name: 'Çay', quantity: 3 }],
    status: 'preparing',
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'ORD-1004',
    tableNumber: 14,
    items: [
      { name: 'Su', quantity: 2 },
      { name: 'Çay', quantity: 2 },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-1005',
    tableNumber: 11,
    items: [{ name: 'Caffè Americano', quantity: 2 }],
    status: 'delivered',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deliveryTime: 195,
  },
];

// ============================================================
// Demo: Office floor plan table positions (for robot map)
// ============================================================

export const TABLE_POSITIONS: Record<number, { x: number; y: number; label: string }> = {
  11: { x: 120, y: 100, label: '11' },
  12: { x: 280, y: 100, label: '12' },
  13: { x: 440, y: 100, label: '13' },
  14: { x: 120, y: 260, label: '14' },
  15: { x: 280, y: 260, label: '15' },
  16: { x: 440, y: 260, label: '16' },
};

export const KITCHEN_POSITION = { x: 280, y: 420, label: 'Mutfak' };
