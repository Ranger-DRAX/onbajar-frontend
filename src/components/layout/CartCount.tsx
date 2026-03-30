"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";

export default function CartCount() {
  const total = useCartStore((s) => s.totalItems());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated to true when component mounts on client
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (total === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] leading-none font-bold text-white">
      {total > 99 ? "99+" : total}
    </span>
  );
}
