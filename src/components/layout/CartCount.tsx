"use client";

import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";

export default function CartCount() {
  const [mounted, setMounted] = useState(false);
  const total = useCartStore((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (total === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] leading-none font-bold text-white">
      {total > 99 ? "99+" : total}
    </span>
  );
}
