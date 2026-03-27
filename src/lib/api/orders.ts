import type { CartItem } from "@/types/cart";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://on-bazar-backend.vercel.app";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderItem = {
  product: string;
  quantity: number;
  size?: string; // omitted when hasSize === false (size stored as "one-size" in cart)
};

export type DeliveryInfo = {
  fullName: string;
  email: string; // required by backend
  phone: string;
  address: string;
  zilla: string;
  thana: string;
  city?: string; // optional
  district?: string; // optional
  postCode?: string; // optional
  note?: string; // optional
};

export type BillingInfo = {
  sameAsDelivery: boolean;
  fullName?: string;
  email?: string;
  phone?: string;
};

export type PaymentInfo =
  | { method: "COD" }
  | {
      method: "Bkash";
      bkash: { customerPhone: string; transactionId: string };
    };

export type OrderPayload = {
  items: OrderItem[];
  delivery: DeliveryInfo;
  billing: BillingInfo;
  payment: PaymentInfo;
  promoCode?: string;
  saveAddress?: boolean;
  addressLabel?: string;
};

export type OrderResponse = {
  success: true;
  data: {
    _id: string;
    orderNumber: string;
    status: string;
    pricing: {
      itemsSubtotal: number;
      addonsSubtotal: number;
      subtotalBeforePromo: number;
      promoDiscount: number;
      subtotal: number;
      deliveryCharge: number;
      grandTotal: number;
      currency: string;
    };
    delivery: DeliveryInfo;
    billing: BillingInfo;
    payment: {
      method: string;
      cod?: { confirmed: boolean };
      bkash?: { customerPhone: string | null; transactionId: string | null };
      paidAt?: string | null;
    };
    promo?: {
      promoId: string;
      code: string;
      discountType: string;
      discountValue: number;
      discountAmount: number;
    } | null;
    createdAt: string;
  };
};

export type OrderErrorResponse = {
  success: false;
  message: string;
  errors?: string[];
};

// ─── buildOrderPayload ────────────────────────────────────────────────────────

/**
 * Converts cart items + form state into the exact shape the backend expects.
 * Size rule: include `size` only when item.size is not null and not "one-size"
 *            ("one-size" is the internal sentinel used when hasSize=false).
 * Empty-string rule: optional delivery/billing fields must be omitted entirely
 *                    when blank — the backend Joi schema rejects empty strings.
 */
/** Strips keys whose value is an empty string — only call on objects with optional fields. */
function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== ""),
  ) as Partial<T>;
}

/**
 * Cleans delivery: keeps required fields as-is, strips optional fields that are empty strings.
 * Required: fullName, email, phone, address, zilla, thana
 * Optional: city, district, postCode, note
 */
function cleanDelivery(d: DeliveryInfo): DeliveryInfo {
  const required = {
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    address: d.address,
    zilla: d.zilla,
    thana: d.thana,
  };
  const optional = stripEmpty({
    city: d.city ?? "",
    district: d.district ?? "",
    postCode: d.postCode ?? "",
    note: d.note ?? "",
  });
  return { ...required, ...optional };
}

export function buildOrderPayload(
  cartItems: CartItem[],
  delivery: DeliveryInfo,
  billing: BillingInfo,
  payment: PaymentInfo,
  options?: {
    promoCode?: string;
    saveAddress?: boolean;
    addressLabel?: string;
  },
): OrderPayload {
  const items: OrderItem[] = cartItems.map((item) => {
    const orderItem: OrderItem = {
      product: item.id,
      quantity: item.qty,
    };
    if (item.size !== null && item.size !== "one-size") {
      orderItem.size = item.size;
    }
    return orderItem;
  });

  const cleanedDelivery = cleanDelivery(delivery);

  const cleanBilling: BillingInfo = billing.sameAsDelivery
    ? { sameAsDelivery: true }
    : (stripEmpty(billing) as BillingInfo);

  return {
    items,
    delivery: cleanedDelivery,
    billing: cleanBilling,
    payment,
    ...options,
  };
}

// ─── placeOrder ───────────────────────────────────────────────────────────────

export async function placeOrder(
  payload: OrderPayload,
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody: OrderErrorResponse = await res.json().catch(() => ({
      success: false,
      message: "Failed to place order",
    }));
    throw new Error(
      errBody.errors?.join(", ") ?? errBody.message ?? "Failed to place order",
    );
  }

  return res.json() as Promise<OrderResponse>;
}
