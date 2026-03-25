import { Dispatch, SetStateAction } from "react";
import { CartItem } from "@/types/cart";
import { UPSELL_PRICES } from "./constants";
import CartSummaryRow from "./order-summary/CartSummaryRow";
import OrderSummaryTotals from "./order-summary/OrderSummaryTotals";
import UpsellSummaryRow from "./order-summary/UpsellSummaryRow";
import { UPSELL_ITEMS } from "./order-summary/data";
import type { UpsellsState } from "./order-summary/types";

interface OrderSummaryProps {
  items: CartItem[];
  updateQty: (id: string, size: string | null, qty: number) => void;
  onRemoveItem?: (id: string, size: string | null) => void;
  upsells: UpsellsState;
  setUpsells: Dispatch<SetStateAction<UpsellsState>>;
  deliveryFee: number;
  total: number;
}

export default function OrderSummary({
  items,
  updateQty,
  onRemoveItem,
  upsells,
  setUpsells,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  const currency = items[0]?.currency ?? "BDT";

  const decrementUpsell = (key: keyof UpsellsState) => {
    setUpsells((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] - 1),
    }));
  };

  const incrementUpsell = (key: keyof UpsellsState) => {
    setUpsells((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  return (
    <aside className="w-full bg-[#F5F5F5] px-6 py-10 lg:min-h-screen lg:w-[45%] lg:border-l-[0.5px] lg:border-[#8E8E8E] lg:px-[78px] lg:pt-[99px] lg:pb-[36px]">
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

      <div className="mt-[54px]">
        <h3 className="mb-[21px] text-[15px] font-medium uppercase leading-[20px] tracking-[-0.03em] text-black">
          MAKE THE GIFT MORE SPECIAL
        </h3>

        <div className="space-y-[12px]">
          {UPSELL_ITEMS.map((item) => (
            <UpsellSummaryRow
              key={item.key}
              title={item.title}
              image={item.image}
              alt={item.alt}
              value={upsells[item.key]}
              price={UPSELL_PRICES[item.key]}
              onDecrease={() => decrementUpsell(item.key)}
              onIncrease={() => incrementUpsell(item.key)}
            />
          ))}
        </div>
      </div>

      <OrderSummaryTotals deliveryFee={deliveryFee} total={total} />

      <div className="mt-[36px] text-center">
        <p className="text-[32px] font-medium leading-[43px] text-black">
          Thank you for choosing us!
        </p>
      </div>
    </aside>
  );
}