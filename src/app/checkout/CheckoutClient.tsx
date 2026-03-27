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
} from "@/lib/api/orders";
import CheckoutHeader from "@/components/layout/CheckoutHeader";
import DeliveryForm from "@/components/checkout/DeliveryForm";
import BillingForm from "@/components/checkout/BillingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { UPSELL_PRICES } from "@/components/checkout/constants";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Footer from "@/components/layout/Footer";

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

  const [upsells, setUpsells] = useState({
    giftCard: 0,
    eidCard: 0,
    giftBox: 0,
  });

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
  const [bkash, setBkash] = useState({
    customerPhone: "",
    transactionId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

  const subtotal = totalPrice();
  const deliveryFee = 60;
  const upsellTotal =
    upsells.giftCard * UPSELL_PRICES.giftCard +
    upsells.eidCard * UPSELL_PRICES.eidCard +
    upsells.giftBox * UPSELL_PRICES.giftBox;

  const total = Math.max(0, subtotal + deliveryFee + upsellTotal - discount);

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

  const canSubmit = deliveryValid && billingValid && paymentValid;

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
      { promoCode: promoCode || undefined },
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
          </div>

          <OrderSummary
            items={items}
            updateQty={updateQty}
            onRemoveItem={removeItem}
            upsells={upsells}
            setUpsells={setUpsells}
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
