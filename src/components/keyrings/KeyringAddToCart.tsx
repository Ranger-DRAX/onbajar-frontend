"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import type { Keyring } from "@/types/keyring";

type Props = { keyring: Keyring };

export default function KeyringAddToCart({ keyring }: Props) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const itemPrice = keyring.discount
    ? Math.round(keyring.price * (1 - keyring.discount.value / 100))
    : keyring.price;

  const handleAdd = () => {
    for (let i = 0; i < qty; i += 1) {
      addItem({
        id: keyring.id,
        title: keyring.title,
        price: itemPrice,
        currency: keyring.currency,
        imageUrl: keyring.images?.[0] ?? "https://placehold.co/479x599",
        size: null,
      });
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-[110px_151px] gap-3">
        <div className="flex h-11 items-center justify-between border border-black/20 px-3">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="text-xl leading-none"
          >
            −
          </button>
          <span className="text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="text-xl leading-none"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="h-11 bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Add to Cart
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="h-11 w-full bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Order Now
      </button>
    </div>
  );
}
