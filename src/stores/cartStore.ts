import { create } from 'zustand';
import type { CartItem, Product, Preference } from '../types';

interface CartState {
  items: CartItem[];
  note: string;
  addItem: (product: Product, preferreds?: Preference[] | null) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItemNote: (cartItemId: string, note: string) => void;
  setNote: (note: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const getCartItemId = (prod: Product, prefs: Preference[] | null): string => {
  if (!prefs || prefs.length === 0) return prod.productId;
  const sortedPrefsString = [...prefs]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(p => `${p.name}:${p.values.map(v => v.value).join(',')}`)
    .join('|');
  return `${prod.productId}-${sortedPrefsString}`;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  note: '',

  addItem: (product, preferreds = null) => {
    const { items } = get();
    const cartItemId = getCartItemId(product, preferreds);
    
    const existingIndex = items.findIndex(
      (item) => item.cartItemId === cartItemId
    );

    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      set({ items: updated });
    } else {
      set({
        items: [...items, { cartItemId, product, preferreds, quantity: 1, note: '' }],
      });
    }
  },

  removeItem: (cartItemId) => {
    set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ),
    });
  },

  updateItemNote: (cartItemId, note) => {
    set({
      items: get().items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, note } : item
      ),
    });
  },

  setNote: (note) => set({ note }),

  clearCart: () => set({ items: [], note: '' }),

  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
