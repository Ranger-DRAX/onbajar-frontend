"use client";

import { useCartStore } from "@/store/cart.store";

export default function CartCount() {
  const total = useCartStore((s) => s.totalItems());
  if (total === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
      {total > 99 ? "99+" : total}
    </span>
  );
}
