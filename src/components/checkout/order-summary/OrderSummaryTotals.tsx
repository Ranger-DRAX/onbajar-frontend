import { formatPrice } from "./utils";

interface OrderSummaryTotalsProps {
  deliveryFee: number;
  total: number;
}

export default function OrderSummaryTotals({
  deliveryFee,
  total,
}: OrderSummaryTotalsProps) {
  return (
    <div className="mt-[39px] border-t-[0.5px] border-[#8E8E8E] pt-[18px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium leading-[20px] text-black">
          Shipping Fee
        </p>
        <p className="text-[15px] leading-[20px] text-black">
          {formatPrice(deliveryFee)}
        </p>
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <p className="text-[15px] font-medium leading-[20px] text-black">
          Promo Code
        </p>

        <button
          type="button"
          className="flex h-[26px] w-[121px] items-center justify-center border-[0.5px] border-[#505050] bg-white px-[8px] py-[7px] text-[10px] leading-none text-[#969696] transition-colors hover:bg-black/[0.02]"
        >
          Enter Promo Code
        </button>
      </div>

      <div className="mt-[34px] flex items-center justify-between">
        <p className="text-[20px] font-medium leading-[24px] text-black">
          Total
        </p>
        <p className="text-[20px] font-medium leading-[27px] text-black">
          {formatPrice(total)}
        </p>
      </div>
    </div>
  );
}