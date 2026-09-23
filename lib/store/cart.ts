"use client";

import { create } from "zustand";
import type { CartLine } from "@/lib/queries/cart";

interface CartState {
  items: CartLine[];
  isLoading: boolean;
  hydrated: boolean;

  /** Total count for the navbar badge. */
  count: () => number;

  /** Subtotal in rupees. */
  subtotal: () => number;

  /** Replace the entire cart (after fetch or refresh). */
  setItems: (items: CartLine[]) => void;

  /** Add or increment an item optimistically. */
  addOptimistic: (line: CartLine) => void;

  /** Change quantity. If qty = 0, remove. */
  updateQuantityOptimistic: (id: string, quantity: number) => void;

  /** Remove a line. */
  removeOptimistic: (id: string) => void;

  /** Clear everything. */
  clear: () => void;

  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  hydrated: false,

  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  setItems: (items) => set({ items, hydrated: true, isLoading: false }),

  addOptimistic: (line) =>
    set((s) => {
      const existing = s.items.find((i) => i.product_id === line.product_id);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.product_id === line.product_id
              ? { ...i, quantity: i.quantity + line.quantity }
              : i
          ),
        };
      }
      return { items: [line, ...s.items] };
    }),

  updateQuantityOptimistic: (id, quantity) =>
    set((s) => {
      if (quantity <= 0) {
        return { items: s.items.filter((i) => i.id !== id) };
      }
      return {
        items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }),

  removeOptimistic: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  clear: () => set({ items: [], hydrated: true }),

  setLoading: (isLoading) => set({ isLoading }),
}));