import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartStore } from "@/types/cart";

const key = (id: string, size: string | null) => `${id}__${size ?? "one-size"}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const k = key(item.id, item.size);
          const existing = state.items.find(
            (i) => key(i.id, i.size) === k
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                key(i.id, i.size) === k ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        });
      },

      updateQty: (id, size, qty) => {
        if (qty < 1) return get().removeItem(id, size);
        set((state) => ({
          items: state.items.map((i) =>
            key(i.id, i.size) === key(id, size) ? { ...i, qty } : i
          ),
        }));
      },

      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => key(i.id, i.size) !== key(id, size)
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "onbajar-cart" }
  )
);
