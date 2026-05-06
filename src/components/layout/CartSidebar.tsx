"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QuantityControl from "@/components/checkout/order-summary/QuantityControl";
import { useCartStore } from "@/store/cart.store";

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(amount: number, currency = "BDT") {
  const value = Number.isInteger(amount)
    ? amount.toLocaleString("en-BD")
    : amount.toFixed(2);

  return `${currency}. ${value}৳`;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const {
    items,
    totalPrice,
    totalItems,
    updateQty,
    applyPromoCode,
    removePromoCode,
    promoCode,
    discount,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    setPromoInput(promoCode ?? "");
  }, [promoCode]);

  const currency = items[0]?.currency ?? "BDT";
  const cartCount = totalItems();
  const subtotal = totalPrice();
  const deliveryFee = items.length > 0 ? 60 : 0;

  const total = useMemo(
    () => Math.max(0, subtotal + deliveryFee - discount),
    [subtotal, deliveryFee, discount],
  );

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) {
      setPromoError("Enter a promo code first.");
      return;
    }

    setPromoError(null);
    setIsApplyingPromo(true);

    try {
      await applyPromoCode(code);
    } catch (error) {
      setPromoError(
        error instanceof Error ? error.message : "Failed to apply promo code.",
      );
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-90 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close cart sidebar"
        className={`absolute inset-0 bg-black/35 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-190 transform flex-col bg-[#F3F3F3] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="border-b border-[#8E8E8E] px-4 pt-4 pb-3 sm:px-8 sm:pt-6 sm:pb-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[20px] leading-none font-medium text-black uppercase sm:text-[34px]">
              YOUR CART ({cartCount})
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full bg-[#E6E6E6] text-[24px] leading-none text-black transition hover:bg-[#DCDCDC] sm:h-10 sm:w-10 sm:text-[28px]"
            >
              ×
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8">
            <p className="text-[22px] leading-7.5 font-medium text-black">
              Your cart is empty
            </p>
            <Link
              href="/products"
              className="mt-4 text-[16px] leading-5.5 text-[#5A5A5A] underline underline-offset-4 hover:text-black"
              onClick={onClose}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-3 rounded-sm bg-white/70 p-3 sm:grid-cols-[80px_minmax(0,1fr)_117px_auto] sm:items-center sm:gap-x-5 sm:bg-transparent sm:p-0"
                  >
                    <div className="relative h-25.5 w-20 overflow-hidden bg-[#DFDFDF]">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[14px] leading-5 font-medium text-black uppercase sm:text-[18px] sm:leading-7">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-4.5 text-[#525252] uppercase sm:mt-2 sm:text-[15px] sm:leading-5">
                        SIZE: {item.size ?? "ONE SIZE"}
                      </p>
                    </div>

                    <div className="col-span-2 mt-1 flex items-center justify-between sm:col-auto sm:mt-0 sm:block">
                      <QuantityControl
                        value={item.qty}
                        min={0}
                        onDecrease={() =>
                          updateQty(item.id, item.size, item.qty - 1)
                        }
                        onIncrease={() =>
                          updateQty(item.id, item.size, item.qty + 1)
                        }
                      />

                      <p className="text-[15px] leading-6 font-medium whitespace-nowrap text-black sm:hidden">
                        {formatPrice(item.price, currency)}
                      </p>
                    </div>

                    <p className="hidden text-[18px] leading-7 font-medium whitespace-nowrap text-black sm:block">
                      {formatPrice(item.price, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#8E8E8E] bg-[#F3F3F3] px-4 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <label
                  htmlFor="cart-promo"
                  className="text-[15px] leading-5 text-[#3A3A3A] sm:text-[18px] sm:leading-6"
                >
                  Promo Code
                </label>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <input
                    id="cart-promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Promo Code"
                    className="h-10 w-full border border-[#B1B1B1] bg-transparent px-3 text-[14px] outline-none placeholder:text-[#A0A0A0] sm:w-52.5"
                  />

                  {promoCode ? (
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="h-10 shrink-0 border border-[#B1B1B1] px-3 text-[13px] text-black transition hover:bg-black hover:text-white"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={isApplyingPromo}
                      className="h-10 shrink-0 border border-[#B1B1B1] px-3 text-[13px] text-black transition hover:bg-black hover:text-white disabled:opacity-60"
                    >
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
              </div>

              {promoError && (
                <p className="mt-2 text-right text-[13px] text-red-600">
                  {promoError}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-[20px] leading-7 text-[#3A3A3A] sm:text-[24px] sm:leading-10">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discount > 0 && (
                <div className="mt-2 flex items-center justify-between text-[16px] leading-6 text-[#2D7A35] sm:text-[20px] sm:leading-9">
                  <span>Discount</span>
                  <span>-{formatPrice(discount, currency)}</span>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between text-[24px] leading-8 text-[#3A3A3A] sm:text-[30px] sm:leading-10">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="mt-4 flex h-12 w-full items-center justify-center bg-[#0A0A0A] text-[16px] leading-6 font-medium text-white transition hover:bg-black/90 sm:h-14 sm:text-[18px] sm:leading-7"
              >
                Buy Now
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
