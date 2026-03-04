"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import {
  buildOrderPayload,
  placeOrder,
  type DeliveryInfo,
  type BillingInfo,
  type PaymentInfo,
} from "@/lib/api/orders";
import { getZillas, getThanas } from "@/lib/locations";

// ─── helpers ─────────────────────────────────────────────────────────────────────────────────

const inputCls =
  "h-11 w-full border border-gray-300 bg-white px-4 text-sm placeholder-gray-400 transition-colors focus:border-black focus:outline-none";

const selectCls =
  "h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-700 transition-colors focus:border-black focus:outline-none cursor-pointer appearance-none";

const ZILLAS = getZillas();

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutClient() {
  const router = useRouter();
  const { items, updateQty, removeItem, totalPrice, clearCart } =
    useCartStore();

  const currency = items[0]?.currency ?? "BDT";

  // ── Delivery state ──────────────────────────────────────────────────────────
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    zilla: "",
    thana: "",
    note: "",
  });

  // ── Billing state ───────────────────────────────────────────────────────────
  const [billing, setBilling] = useState<BillingInfo>({
    sameAsDelivery: true,
    fullName: "",
    email: "",
    phone: "",
  });

  // ── Payment state ───────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Bkash">("COD");
  const [bkash, setBkash] = useState({
    customerPhone: "",
    transactionId: "",
  });

  // ── Submission state ────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // ── Empty cart guard ────────────────────────────────────────────────────────
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
  const deliveryFee = 60; // backend-calculated; 60 BDT is the standard rate
  const total = subtotal + deliveryFee;

  // ── Validation ──────────────────────────────────────────────────────────────
  const deliveryValid =
    delivery.fullName.trim() !== "" &&
    delivery.email.trim() !== "" &&
    delivery.phone.trim() !== "" &&
    delivery.address.trim() !== "" &&
    delivery.zilla.trim() !== "" &&
    delivery.thana.trim() !== "";

  const billingValid =
    billing.sameAsDelivery ||
    (billing.fullName!.trim() !== "" && billing.phone!.trim() !== "");

  const paymentValid =
    paymentMethod === "COD" ||
    (bkash.customerPhone.trim() !== "" && bkash.transactionId.trim() !== "");

  const canSubmit = deliveryValid && billingValid && paymentValid;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }

    const resolvedPayment: PaymentInfo =
      paymentMethod === "Bkash"
        ? { method: "Bkash", bkash }
        : { method: "COD" };

    const resolvedBilling: BillingInfo = billing.sameAsDelivery
      ? { sameAsDelivery: true }
      : {
          sameAsDelivery: false,
          fullName: billing.fullName,
          email: billing.email,
          phone: billing.phone,
        };

    const payload = buildOrderPayload(
      items,
      delivery,
      resolvedBilling,
      resolvedPayment,
    );

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await placeOrder(payload);
      clearCart();
      router.push(`/order-success/${response.data.orderNumber}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        {/* ── LEFT col ─────────────────────────────────────────────────────── */}
        <div className="space-y-10">
          {/* ── DELIVERY ─────────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-5 text-xl font-semibold">Delivery Information</h2>
            <div className="space-y-3">
              <input
                required
                name="fullName"
                value={delivery.fullName}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="Full Name"
                className={inputCls}
              />
              {showErrors && !delivery.fullName.trim() && (
                <p className="-mt-1 text-xs text-red-500">
                  Full name is required
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  name="email"
                  type="email"
                  value={delivery.email}
                  onChange={(e) =>
                    setDelivery((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  className={inputCls}
                />
                {showErrors && !delivery.email.trim() && (
                  <p className="text-xs text-red-500">Email is required</p>
                )}
                <input
                  required
                  name="phone"
                  value={delivery.phone}
                  onChange={(e) =>
                    setDelivery((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Phone No"
                  className={inputCls}
                />
                {showErrors && !delivery.phone.trim() && (
                  <p className="text-xs text-red-500">
                    Phone number is required
                  </p>
                )}
              </div>

              <input
                required
                name="address"
                value={delivery.address}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Full Address"
                className={inputCls}
              />
              {showErrors && !delivery.address.trim() && (
                <p className="-mt-1 text-xs text-red-500">
                  Address is required
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Zilla select */}
                <div className="relative">
                  <select
                    required
                    name="zilla"
                    value={delivery.zilla}
                    onChange={(e) =>
                      setDelivery((p) => ({
                        ...p,
                        zilla: e.target.value,
                        thana: "", // reset thana when zilla changes
                      }))
                    }
                    className={selectCls}
                  >
                    <option value="" disabled>
                      Zilla
                    </option>
                    {ZILLAS.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 select-none">
                    ↓
                  </span>
                  {showErrors && !delivery.zilla.trim() && (
                    <p className="text-xs text-red-500">Zilla is required</p>
                  )}
                </div>

                {/* Thana select — filtered by chosen Zilla */}
                <div className="relative">
                  <select
                    required
                    name="thana"
                    value={delivery.thana}
                    disabled={!delivery.zilla}
                    onChange={(e) =>
                      setDelivery((p) => ({ ...p, thana: e.target.value }))
                    }
                    className={selectCls + (!delivery.zilla ? " opacity-50 cursor-not-allowed" : "")}
                  >
                    <option value="" disabled>
                      {delivery.zilla ? "Thana" : "Select Zilla first"}
                    </option>
                    {getThanas(delivery.zilla).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 select-none">
                    ↓
                  </span>
                  {showErrors && !delivery.thana.trim() && (
                    <p className="text-xs text-red-500">Thana is required</p>
                  )}
                </div>
              </div>

              <input
                name="note"
                value={delivery.note}
                onChange={(e) =>
                  setDelivery((p) => ({ ...p, note: e.target.value }))
                }
                placeholder="Note"
                className={inputCls}
              />
            </div>
          </section>

          {/* ── BILLING ──────────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-5 text-xl font-semibold">Billing Information</h2>

            {/* Toggle */}
            <div className="mb-4 flex overflow-hidden border border-gray-300">
              <button
                type="button"
                onClick={() =>
                  setBilling((p) => ({ ...p, sameAsDelivery: true }))
                }
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-colors ${
                  billing.sameAsDelivery
                    ? "bg-white text-gray-800"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    billing.sameAsDelivery
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                >
                  {billing.sameAsDelivery && (
                    <span className="h-2 w-2 rounded-full bg-gray-800" />
                  )}
                </span>
                Same as delivery information
              </button>

              <button
                type="button"
                onClick={() =>
                  setBilling((p) => ({ ...p, sameAsDelivery: false }))
                }
                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm transition-colors ${
                  !billing.sameAsDelivery
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    !billing.sameAsDelivery ? "border-white" : "border-gray-300"
                  }`}
                >
                  {!billing.sameAsDelivery && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                Use a different billing information
              </button>
            </div>

            {/* Different billing fields */}
            {!billing.sameAsDelivery && (
              <div className="space-y-3">
                <input
                  required={!billing.sameAsDelivery}
                  name="billingFullName"
                  value={billing.fullName}
                  onChange={(e) =>
                    setBilling((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Full Name"
                  className={inputCls}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    name="billingEmail"
                    type="email"
                    value={billing.email}
                    onChange={(e) =>
                      setBilling((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Email"
                    className={inputCls}
                  />
                  <input
                    required={!billing.sameAsDelivery}
                    name="billingPhone"
                    value={billing.phone}
                    onChange={(e) =>
                      setBilling((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="Phone No"
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </section>

          {/* ── PAYMENT ──────────────────────────────────────────────────── */}
          <section>
            <h2 className="mb-5 text-xl font-semibold">Payment Options</h2>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center gap-2 border px-5 py-3 text-sm font-medium transition-colors ${
                  paymentMethod === "COD"
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cash on Delivery <span className="text-xs">→</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Bkash")}
                className={`flex items-center gap-2 border px-5 py-3 text-sm font-medium transition-colors ${
                  paymentMethod === "Bkash"
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                bKash <span className="text-xs">→</span>
              </button>
            </div>

            {paymentMethod === "Bkash" && (
              <div className="mt-4 space-y-3">
                <input
                  required
                  name="bkashPhone"
                  value={bkash.customerPhone}
                  onChange={(e) =>
                    setBkash((p) => ({ ...p, customerPhone: e.target.value }))
                  }
                  placeholder="bKash Account Number"
                  className={inputCls}
                />
                <input
                  required
                  name="bkashTxn"
                  value={bkash.transactionId}
                  onChange={(e) =>
                    setBkash((p) => ({ ...p, transactionId: e.target.value }))
                  }
                  placeholder="Transaction ID"
                  className={inputCls}
                />
              </div>
            )}
          </section>

          {/* ── Error ────────────────────────────────────────────────────── */}
          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* ── Confirm Order ─────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full bg-black text-sm font-medium tracking-widest text-white uppercase transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            {isSubmitting ? "Placing Order…" : "Confirm Order"}
          </button>
        </div>

        {/* ── RIGHT col — Order Summary ─────────────────────────────────────── */}
        <div className="h-fit space-y-4 border border-gray-200 bg-[#fafafa] p-6">
          <h2 className="border-b pb-3 text-sm font-semibold tracking-wide uppercase">
            Order Summary
          </h2>

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
                      type="button"
                      onClick={() =>
                        updateQty(item.id, item.size, item.qty - 1)
                      }
                      className="flex h-5 w-5 items-center justify-center border text-xs hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-xs">{item.qty}</span>
                    <button
                      type="button"
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
                    type="button"
                    onClick={() => removeItem(item.id, item.size)}
                    className="mt-1 text-[10px] text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

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
        </div>
      </form>
    </main>
  );
}
