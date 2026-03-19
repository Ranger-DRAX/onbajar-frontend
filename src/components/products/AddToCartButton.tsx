"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import SizeSelector from "./SizeSelector";
import QuantityControl from "./QuantityControl";
import type { Product } from "@/types/product";

type Props = { product: Product };

export default function AddToCartButton({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.hasSize ? null : "one-size",
  );
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (product.hasSize && !selectedSize) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.discount
        ? Math.round(product.price * (1 - product.discount.value / 100))
        : product.price,
      currency: product.currency,
      imageUrl: product.images?.[0] ?? "https://placehold.co/479x599",
      size: selectedSize,
    });
    for (let i = 1; i < qty; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.discount
          ? Math.round(product.price * (1 - product.discount.value / 100))
          : product.price,
        currency: product.currency,
        imageUrl: product.images?.[0] ?? "https://placehold.co/479x599",
        size: selectedSize,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {product.hasSize && product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-normal text-black">Sizes</h3>
            {!selectedSize && (
              <span className="text-sm text-gray-400 font-light flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                True to size. We recommend ordering your usual size.
              </span>
            )}
          </div>
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
        </div>
      )}

      {/* Qty + Add to Cart */}
      <div className="flex items-center gap-4">
        <QuantityControl qty={qty} onChange={setQty} />
        <button
          onClick={handleAdd}
          disabled={product.hasSize && !selectedSize}
          className="h-11 flex-1 bg-black text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>

      {/* Order now */}
      <button className="h-11 w-full bg-black text-sm font-medium text-white transition-opacity hover:opacity-90">
        Order Now
      </button>
    </div>
  );
}