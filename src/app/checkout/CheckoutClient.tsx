"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import {
  buildOrderPayload,
  placeOrder,
  type DeliveryInfo,
  type BillingInfo,
  type PaymentInfo,
  type AddonPayloadEntry,
  type SelectedKeyringPayloadEntry,
} from "@/lib/api/orders";
import CheckoutHeader from "@/components/layout/CheckoutHeader";
import DeliveryForm from "@/components/checkout/DeliveryForm";
import BillingForm from "@/components/checkout/BillingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Footer from "@/components/layout/Footer";
import type { Addon } from "@/types/addon";
import type { Keyring } from "@/types/keyring";
import type {
  AddonCartEntry,
  SelectedKeyring,
} from "@/components/checkout/order-summary/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

export default function CheckoutClient() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {
    items,
    updateQty,
    removeItem,
    totalPrice,
    clearCart,
    promoCode,
    discount,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  /* ── Addons fetched from API ── */
  const [addons, setAddons] = useState<Addon[]>([]);
  const [addonEntries, setAddonEntries] = useState<AddonCartEntry[]>([]);

  /* ── Keyrings for the checkout keyring section ── */
  const [keyrings, setKeyrings] = useState<Keyring[]>([]);
  const [selectedKeyring, setSelectedKeyring] =
    useState<SelectedKeyring | null>(null);

  /* ── Delivery / billing / payment ── */
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    zilla: "",
    thana: "",
    note: "",
  });

  const [billing, setBilling] = useState<BillingInfo>({
    sameAsDelivery: true,
    fullName: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Bkash">("COD");
  const [bkash, setBkash] = useState({ customerPhone: "", transactionId: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  /* Mount guard */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Fetch addons + keyrings client-side (OrderSummary is in the right panel) */
  useEffect(() => {
    if (!mounted) return;

    // Addons
    fetch(`${API_BASE}/api/addons`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const active: Addon[] = res.data.filter((a: Addon) => a.isActive);
          setAddons(active);
          setAddonEntries(
            active.map((a) => ({
              addon: a._id,
              quantity: 0,
              customerNote: null,
            })),
          );
        }
      })
      .catch(() => {
        /* silently ignore - addons are optional */
      });

    // Keyrings
    fetch(`${API_BASE}/api/keyrings?page=1&limit=100`)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res.data)) {
          // normalise to minimal shape needed for the picker
          const normalised: Keyring[] = res.data
            .filter((k: any) => k.isActive !== false)
            .map((k: any) => ({
              id: k._id ?? k.id,
              slug: k.slug ?? "",
              title: k.name ?? k.title ?? "Untitled",
              keyringType: k.keyringType ?? "",
              colors: Array.isArray(k.colors) ? k.colors : [],
              categoryName: k.category?.name ?? "",
              categorySlug: k.category?.slug ?? "",
              price: k.pricing?.sellingPrice ?? 0,
              effectivePrice: k.effectivePrice ?? k.pricing?.sellingPrice ?? 0,
              currency: k.pricing?.currency ?? "BDT",
              images: Array.isArray(k.images)
                ? k.images.map((img: any) =>
                    typeof img === "string" ? img : (img?.url ?? ""),
                  )
                : [],
              video: k.video ?? null,
              description: k.details?.description ?? "",
              features: Array.isArray(k.details?.features)
                ? k.details.features
                : [],
              material: k.details?.material ?? "",
              dimensions: k.details?.dimensions ?? "",
              weight: k.details?.weight ?? 0,
              discount: k.discount ?? null,
              isActive: k.isActive ?? true,
              isBestProduct: k.isBestProduct ?? false,
              personalisation: Array.isArray(k.personalisation)
                ? k.personalisation
                : [],
              purchaseCount: k.purchaseCount ?? 0,
            }));
          setKeyrings(normalised);
        }
      })
      .catch(() => {
        /* silently ignore */
      });
  }, [mounted]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="w-full px-6 py-20 text-center font-sans">
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

  /* ── Totals ── */
  const subtotal = totalPrice();
  const deliveryFee = 60;

  const addonTotal = addonEntries.reduce((sum, e) => {
    const addon = addons.find((a) => a._id === e.addon);
    return sum + (addon ? addon.price * e.quantity : 0);
  }, 0);

  const keyringTotal = selectedKeyring
    ? selectedKeyring.price * selectedKeyring.quantity
    : 0;

  const total = Math.max(
    0,
    subtotal + deliveryFee + addonTotal + keyringTotal - discount,
  );

  /* ── Validation ── */
  const deliveryValid =
    delivery.fullName.trim() !== "" &&
    delivery.email.trim() !== "" &&
    delivery.phone.trim() !== "" &&
    delivery.address.trim() !== "" &&
    delivery.zilla.trim() !== "" &&
    delivery.thana.trim() !== "";

  const billingValid =
    billing.sameAsDelivery ||
    (billing.fullName!.trim() !== "" &&
      billing.email!.trim() !== "" &&
      billing.phone!.trim() !== "");

  const paymentValid =
    paymentMethod === "COD" ||
    (bkash.customerPhone.trim() !== "" && bkash.transactionId.trim() !== "");

  const keyringsMissingText = items.filter(
    (item) => item.itemType === "keyring" && !item.personalisationText?.trim(),
  );
  const keyringPersonalisationValid = keyringsMissingText.length === 0;

  const canSubmit =
    deliveryValid &&
    billingValid &&
    paymentValid &&
    keyringPersonalisationValid;

  /* ── Submit ── */
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

    /* Build addons array — only entries with qty > 0 */
    const addonsPayload: AddonPayloadEntry[] = addonEntries
      .filter((e) => e.quantity > 0)
      .map((e) => {
        const payloadEntry: AddonPayloadEntry = {
          addon: e.addon,
          quantity: e.quantity,
        };
        if (e.customerNote) {
          payloadEntry.customerNote = e.customerNote;
        }
        return payloadEntry;
      });

    /* Build checkout-keyring payload if one was chosen */
    const checkoutKeyringPayload: SelectedKeyringPayloadEntry | undefined =
      selectedKeyring
        ? {
            keyring: selectedKeyring.id,
            color: selectedKeyring.color,
            personalisationText: selectedKeyring.personalisationText,
            quantity: selectedKeyring.quantity,
          }
        : undefined;

    const payload = buildOrderPayload(
      items,
      delivery,
      resolvedBilling,
      resolvedPayment,
      {
        promoCode: promoCode || undefined,
        addons: addonsPayload.length > 0 ? addonsPayload : undefined,
        checkoutKeyring: checkoutKeyringPayload,
      },
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

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <CheckoutHeader />

      <form onSubmit={handleSubmit} className="pt-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full px-6 py-8 lg:w-[55%] lg:px-20 lg:py-10 xl:pr-32">
            <DeliveryForm
              delivery={delivery}
              setDelivery={setDelivery}
              showErrors={showErrors}
            />

            <BillingForm
              billing={billing}
              setBilling={setBilling}
              showErrors={showErrors}
            />

            <PaymentForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              bkash={bkash}
              setBkash={setBkash}
              showErrors={showErrors}
            />

            <div className="-mt-2">
              <PrimaryButton
                type="submit"
                loading={isSubmitting}
                loadingText="Processing..."
                fullWidth
                className="max-w-[703px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-md active:translate-y-0"
              >
                Confirm Order
              </PrimaryButton>
            </div>

            {error && <p className="mt-4 text-red-600">{error}</p>}

            {/* Keyring personalisation warning */}
            {!keyringPersonalisationValid && (
              <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">Personalisation required for:</p>
                <ul className="mt-1 list-inside list-disc">
                  {keyringsMissingText.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong> — please go back and enter a
                      personalisation letter/word.
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <OrderSummary
            items={items}
            updateQty={updateQty}
            onRemoveItem={removeItem}
            addons={addons}
            addonEntries={addonEntries}
            setAddonEntries={setAddonEntries}
            keyrings={keyrings}
            selectedKeyring={selectedKeyring}
            setSelectedKeyring={setSelectedKeyring}
            deliveryFee={deliveryFee}
            total={total}
            promoCode={promoCode}
            discount={discount}
            onApplyPromo={applyPromoCode}
            onRemovePromo={removePromoCode}
          />
        </div>
      </form>

      <Footer />
    </div>
  );
}
