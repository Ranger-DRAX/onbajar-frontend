import type { CartItem } from "@/types/cart";

const API_BASE = "https://on-bazar-backend.vercel.app";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderItem = {
  itemType?: "product" | "keyring";
  quantity: number;
  size?: string;             // omitted when hasSize === false
  product?: string;
  keyring?: string;
  color?: string;            // for keyrings only
  personalisationText?: string;
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

export type AddonPayloadEntry = {
  addon: string;
  quantity: number;
  customerNote?: string;   // omitted entirely when not provided
};

export type SelectedKeyringPayloadEntry = {
  keyring: string;
  color: string;
  personalisationText: string;
  quantity: number;
};

export type OrderPayload = {
  items: OrderItem[];
  addons?: AddonPayloadEntry[];
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

function normalizeItemType(itemType?: string): "product" | "keyring" {
  return itemType === "keyring" ? "keyring" : "product";
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
    addons?: AddonPayloadEntry[];
    checkoutKeyring?: SelectedKeyringPayloadEntry;
  },
): OrderPayload {
  const items: OrderItem[] = cartItems.map((item) => {
    const type = normalizeItemType(item.itemType);
    const orderItem: Partial<OrderItem> = {
      itemType: type,
      quantity: item.qty,
    };

    if (type === "keyring") {
      orderItem.keyring = item.id;
      // Send the raw personalisation value when the user provided one.
      // Checkout pre-validates that keyring items always have a value before submit,
      // so this path is only hit when a value is genuinely present.
      // DO NOT fall back to "" — the backend rejects empty strings.
      if (item.personalisationText?.trim()) {
        orderItem.personalisationText = item.personalisationText.trim();
      }
    } else {
      orderItem.product = item.id;
    }

    if (item.size !== null && item.size !== "one-size") {
      orderItem.size = item.size;
    }
    return orderItem as OrderItem;
  });

  const cleanedDelivery = cleanDelivery(delivery);

  const cleanBilling: BillingInfo = billing.sameAsDelivery
    ? { sameAsDelivery: true }
    : (stripEmpty(billing) as BillingInfo);

  // If a keyring was chosen from the checkout keyring-picker, add it as a
  // cart item with itemType="keyring" so the backend processes it correctly.
  if (options?.checkoutKeyring) {
    const ck = options.checkoutKeyring;
    const ckItem: OrderItem = {
      itemType: "keyring",
      keyring: ck.keyring,
      quantity: ck.quantity,
    };
    if (ck.color) ckItem.color = ck.color;
    if (ck.personalisationText) ckItem.personalisationText = ck.personalisationText;
    items.push(ckItem);
  }

  // Strip null customerNote — backend Joi rejects null; omit the field entirely
  const addonEntries = (options?.addons ?? [])
    .filter((a) => a.quantity > 0)
    .map((a) => ({
      addon: a.addon,
      quantity: a.quantity,
      ...(a.customerNote ? { customerNote: a.customerNote } : {}),
    }));

  return {
    items,
    ...(addonEntries.length > 0 ? { addons: addonEntries } : {}),
    delivery: cleanedDelivery,
    billing: cleanBilling,
    payment,
    ...(options?.promoCode ? { promoCode: options.promoCode } : {}),
    ...(options?.saveAddress !== undefined ? { saveAddress: options.saveAddress } : {}),
    ...(options?.addressLabel ? { addressLabel: options.addressLabel } : {}),
  };
}

// ─── placeOrder ───────────────────────────────────────────────────────────────

export async function placeOrder(
  payload: OrderPayload,
): Promise<OrderResponse> {
  // 👇 Change this to fetch from your local route instead of API_BASE
  const res = await fetch(`/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({
      success: false,
      message: "Failed to place order",
    }));
    throw new Error(
      errBody.errors?.join(", ") ?? errBody.message ?? "Failed to place order",
    );
  }

  return res.json() as Promise<OrderResponse>;
}
