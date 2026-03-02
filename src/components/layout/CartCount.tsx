"use client";

import { useCartStore } from "@/store/cart.store";

export default function CartCount() {
  const total = useCartStore((s) => s.totalItems());
  if (total === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] leading-none font-bold text-white">
      {total > 99 ? "99+" : total}
    </span>
  );
}
