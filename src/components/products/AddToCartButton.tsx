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
    // add qty > 1 by calling addItem multiple extra times
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
    <div className="space-y-4">
      {/* Size selector */}
      {product.hasSize && product.sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Select Size</p>
            {!selectedSize && (
              <p className="text-xs text-red-500">Please select a size</p>
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
      <div className="flex items-center gap-3">
        <QuantityControl qty={qty} onChange={setQty} />
        <button
          onClick={handleAdd}
          disabled={product.hasSize && !selectedSize}
          className="h-9 flex-1 bg-black text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-zinc-800 disabled:opacity-40"
        >
          Add to Cart
        </button>
      </div>

      {/* Order now */}
      <button className="h-9 w-full border border-black text-sm font-medium tracking-wide uppercase transition-colors hover:bg-black hover:text-white">
        Order Now
      </button>
    </div>
  );
}
