"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import type { Product } from "@/types/product";

type Props = { product: Product };

export default function AddToCartButton({ product }: Props) {
  const sizes = product.hasSize ? (product.sizes ?? []) : [];
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.hasSize ? null : "one-size",
  );
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const itemPrice = product.discount
    ? Math.round(product.price * (1 - product.discount.value / 100))
    : product.price;

  const handleAdd = () => {
    if (product.hasSize && !selectedSize) return;

    for (let i = 0; i < qty; i += 1) {
      addItem({
        id: product.id,
        itemType: "product",
        title: product.title,
        price: itemPrice,
        currency: product.currency,
        imageUrl: product.images?.[0] ?? "https://placehold.co/479x599",
        size: selectedSize,
      });
    }
  };

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <div>
          <h3 className="text-[22px] font-medium">Sizes</h3>

          <div className="mt-3 flex items-center gap-2 text-sm text-black/35">
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>True to size. We recommend ordering your usual size.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] border px-4 py-2 text-sm transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/20 bg-transparent text-black/45 hover:border-black/40 hover:text-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
          disabled={product.hasSize && !selectedSize}
          className="h-11 bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={product.hasSize && !selectedSize}
        className="h-11 w-full bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Order Now
      </button>
    </div>
  );
}
