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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm underline underline-offset-4 text-gray-600 hover:text-black"
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
      <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

        {/* LEFT — Delivery Form */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide border-b pb-3 mb-4">
            Delivery Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Address *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House, Road, Area"
              className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Dhaka"
              className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Order Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions..."
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="bg-[#fafafa] border border-gray-200 p-6 h-fit space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide border-b pb-3">
            Order Summary
          </h2>

          {/* Cart items */}
          <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className="flex gap-3 items-start"
              >
                <div className="relative w-14 h-16 bg-[#efefef] shrink-0 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                  {item.size && item.size !== "one-size" && (
                    <p className="text-[11px] text-gray-400">Size: {item.size}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                      className="w-5 h-5 border text-xs flex items-center justify-center hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-xs">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                      className="w-5 h-5 border text-xs flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">
                    {currency}. {(item.price * item.qty).toLocaleString("en-BD")}
                  </p>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-[10px] text-red-400 hover:text-red-600 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{currency}. {subtotal.toLocaleString("en-BD")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{currency}. {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Total</span>
              <span>{currency}. {total.toLocaleString("en-BD")}</span>
            </div>
          </div>

          {/* Place order */}
          <button
            disabled={!form.name || !form.phone || !form.address || !form.city}
            className="w-full h-11 bg-black text-white text-sm font-medium uppercase tracking-wide disabled:opacity-40 hover:bg-zinc-800 transition-colors"
          >
            Place Order
          </button>
          <p className="text-[11px] text-center text-gray-400">
            Cash on delivery only
          </p>
        </div>
      </div>
    </main>
  );
}
