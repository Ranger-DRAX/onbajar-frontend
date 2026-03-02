"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";

export default function CheckoutClient() {
  const { items, updateQty, removeItem, totalPrice } = useCartStore();
  const currency = items[0]?.currency ?? "BDT";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-gray-600 underline underline-offset-4 hover:text-black"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const subtotal = totalPrice();
  const deliveryFee = 80;
  const total = subtotal + deliveryFee;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* LEFT — Delivery Form */}
        <div className="space-y-4">
          <h2 className="mb-4 border-b pb-3 text-sm font-semibold tracking-wide uppercase">
            Delivery Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Full Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="h-10 w-full border border-gray-300 px-3 text-sm transition-colors focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Phone *
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="h-10 w-full border border-gray-300 px-3 text-sm transition-colors focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Address *
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House, Road, Area"
              className="h-10 w-full border border-gray-300 px-3 text-sm transition-colors focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Dhaka"
              className="h-10 w-full border border-gray-300 px-3 text-sm transition-colors focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Order Note (optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions..."
              className="w-full resize-none border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="h-fit space-y-4 border border-gray-200 bg-[#fafafa] p-6">
          <h2 className="border-b pb-3 text-sm font-semibold tracking-wide uppercase">
            Order Summary
          </h2>

          {/* Cart items */}
          <ul className="max-h-80 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className="flex items-start gap-3"
              >
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#efefef]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium">
                    {item.title}
                  </p>
                  {item.size && item.size !== "one-size" && (
                    <p className="text-[11px] text-gray-400">
                      Size: {item.size}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQty(item.id, item.size, item.qty - 1)
                      }
                      className="flex h-5 w-5 items-center justify-center border text-xs hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-xs">{item.qty}</span>
                    <button
                      onClick={() =>
                        updateQty(item.id, item.size, item.qty + 1)
                      }
                      className="flex h-5 w-5 items-center justify-center border text-xs hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">
                    {currency}.{" "}
                    {(item.price * item.qty).toLocaleString("en-BD")}
                  </p>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="mt-1 text-[10px] text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                {currency}. {subtotal.toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>
                {currency}. {deliveryFee}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>
                {currency}. {total.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Place order */}
          <button
            disabled={!form.name || !form.phone || !form.address || !form.city}
            className="h-11 w-full bg-black text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            Place Order
          </button>
          <p className="text-center text-[11px] text-gray-400">
            Cash on delivery only
          </p>
        </div>
      </div>
    </main>
  );
}
