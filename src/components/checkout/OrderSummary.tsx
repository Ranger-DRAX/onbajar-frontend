import { Dispatch, SetStateAction } from "react";
import { CartItem } from "@/types/cart";
import { Addon } from "@/types/addon";
import { Keyring } from "@/types/keyring";
import CartSummaryRow from "./order-summary/CartSummaryRow";
import OrderSummaryTotals from "./order-summary/OrderSummaryTotals";
import AddonRow from "./order-summary/AddonRow";
import KeyringSection from "./order-summary/KeyringSection";
import type { AddonCartEntry, SelectedKeyring } from "./order-summary/types";

interface OrderSummaryProps {
  items: CartItem[];
  updateQty: (id: string, size: string | null, qty: number) => void;
  onRemoveItem?: (id: string, size: string | null) => void;
  /* dynamic addons from API */
  addons: Addon[];
  addonEntries: AddonCartEntry[];
  setAddonEntries: Dispatch<SetStateAction<AddonCartEntry[]>>;
  /* checkout keyring section */
  keyrings: Keyring[];
  selectedKeyring: SelectedKeyring | null;
  setSelectedKeyring: Dispatch<SetStateAction<SelectedKeyring | null>>;
  deliveryFee: number;
  total: number;
  promoCode: string | null;
  discount: number;
  onApplyPromo: (code: string) => Promise<void>;
  onRemovePromo: () => void;
  className?: string;
}

export default function OrderSummary({
  items,
  updateQty,
  onRemoveItem,
  addons,
  addonEntries,
  setAddonEntries,
  keyrings,
  selectedKeyring,
  setSelectedKeyring,
  deliveryFee,
  total,
  promoCode,
  discount,
  onApplyPromo,
  onRemovePromo,
  className = "",
}: OrderSummaryProps) {
  const currency = items[0]?.currency ?? "BDT";

  const updateAddonEntry = (addonId: string, updated: AddonCartEntry) => {
    setAddonEntries((prev) =>
      prev.map((e) => (e.addon === addonId ? updated : e)),
    );
  };

  return (
    <aside className={`w-full bg-[#F5F5F5] py-6 lg:py-0 lg:min-h-screen lg:w-full lg:border-l-[0.5px] lg:border-[#8E8E8E] lg:px-[78px] lg:pt-[99px] lg:pb-[36px] ${className}`}>
      {/* ── Mobile white card ── */}
      <div className="mx-auto w-full max-w-[366px] bg-white px-4 py-6 lg:max-w-none lg:bg-transparent lg:p-0">
        {/* Mobile-only title */}
        <h2 className="mb-6 text-[22px] font-bold leading-tight tracking-[-0.02em] text-black lg:hidden">
          Your order summary
        </h2>

        {/* Cart items */}
        <div className="space-y-[12px]">
          {items.map((item) => (
            <CartSummaryRow
              key={`${item.id}-${item.size}`}
              item={item}
              currency={currency}
              onDecrease={() =>
                updateQty(item.id, item.size, Math.max(1, item.qty - 1))
              }
              onIncrease={() => updateQty(item.id, item.size, item.qty + 1)}
              onRemove={() => onRemoveItem?.(item.id, item.size)}
            />
          ))}
        </div>

        {/* ── Make the gift more special ── */}
        <div className="mt-[54px]">
          <h3 className="mb-[21px] text-[15px] leading-[20px] font-medium tracking-[-0.03em] text-black uppercase">
            MAKE THE GIFT MORE SPECIAL
          </h3>

          {addons.length === 0 ? (
            <p className="text-[13px] text-neutral-400">Loading add-ons…</p>
          ) : (
            <div className="space-y-[12px]">
              {addons.map((addon) => {
                const entry = addonEntries.find((e) => e.addon === addon._id)!;
                return (
                  <AddonRow
                    key={addon._id}
                    addon={addon}
                    entry={entry}
                    onChange={(updated) => updateAddonEntry(addon._id, updated)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ── Customised Keyrings section ── */}
        <KeyringSection
          keyrings={keyrings}
          selected={selectedKeyring}
          onSelect={setSelectedKeyring}
        />

        <OrderSummaryTotals
          deliveryFee={deliveryFee}
          total={total}
          promoCode={promoCode}
          discount={discount}
          onApplyPromo={onApplyPromo}
          onRemovePromo={onRemovePromo}
        />

        <div className="mt-[36px] text-center hidden lg:block">
          <p className="text-[32px] leading-[43px] font-medium text-black">
            Thank you for choosing us!
          </p>
        </div>
      </div>
    </aside>
  );
}
