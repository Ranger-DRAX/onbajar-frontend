"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";

export default function CartCount() {
  const total = useCartStore((s) => s.totalItems());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Show a plain filled dot badge (no number) — matches design reference
  const visible = hydrated && total > 0;

  return (
    <span
      aria-label={visible ? `${total} items in cart` : undefined}
      className={`absolute -top-2 -right-2 h-[14px] w-[14px] rounded-full bg-[#1C1B1F] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
  );
}
