import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore } from "@/types/cart";

const key = (id: string, size: string | null) => `${id}__${size ?? "one-size"}`;

function normalizeItemType(itemType?: string): "product" | "keyring" {
  return itemType === "keyring" ? "keyring" : "product";
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (item) => {
        set((state) => {
          const k = key(item.id, item.size);
          const existing = state.items.find((i) => key(i.id, i.size) === k);
          if (existing) {
            return {
              items: state.items.map((i) =>
                key(i.id, i.size) === k ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, itemType: normalizeItemType(item.itemType), qty: 1 },
            ],
          };
        });
      },

      updateQty: (id, size, qty) => {
        if (qty < 1) return get().removeItem(id, size);
        set((state) => ({
          items: state.items.map((i) =>
            key(i.id, i.size) === key(id, size) ? { ...i, qty } : i,
          ),
        }));
      },

      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter((i) => key(i.id, i.size) !== key(id, size)),
        }));
      },

      applyPromoCode: async (code) => {
        try {
          const subtotal = get().totalPrice();
          const productIds = get().items.map((i) => i.id);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://on-bazar-backend.vercel.app"}/api/promocodes/apply`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, subtotal, productIds }),
            },
          );

          const data = await res.json();
          if (!res.ok || !data.success) {
            set({ promoCode: null, discount: 0 });
            throw new Error(data.message || "Invalid promo code");
          }

          set({
            promoCode: data.data.code,
            discount: data.data.discountAmount,
          });
        } catch (error) {
          set({ promoCode: null, discount: 0 });
          throw error;
        }
      },

      removePromoCode: () => {
        set({ promoCode: null, discount: 0 });
      },

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "onbajar-cart",
      onRehydrateStorage: () => (state, action) => {
        // onRehydrateStorage is called before hydration completes
      },
    },
  ),
);
