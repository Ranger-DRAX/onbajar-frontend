import { useState } from "react";
import { formatPrice } from "./utils";

interface OrderSummaryTotalsProps {
  deliveryFee: number;
  total: number;
  promoCode: string | null;
  discount: number;
  onApplyPromo: (code: string) => Promise<void>;
  onRemovePromo: () => void;
}

export default function OrderSummaryTotals({
  deliveryFee,
  total,
  promoCode,
  discount,
  onApplyPromo,
  onRemovePromo,
}: OrderSummaryTotalsProps) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    try {
      if (inputCode.trim()) {
        setIsApplying(true);
        await onApplyPromo(inputCode.trim());
        setInputCode("");
        setError("");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid promo code");
      }
    } finally {
      setIsApplying(false);
    }
  };
  return (
    <div className="mt-[39px] border-t-[0.5px] border-[#8E8E8E] pt-[18px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] leading-[20px] font-medium text-black">
          Shipping Fee
        </p>
        <p className="text-[15px] leading-[20px] text-black">
          {formatPrice(deliveryFee)}
        </p>
      </div>

      <div className="mt-[13px] flex items-center justify-between">
        <p className="text-[15px] leading-[20px] font-medium text-black">
          Promo Code
        </p>

        {promoCode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">
              {promoCode}
            </span>
            <button
              type="button"
              onClick={onRemovePromo}
              className="text-[11px] text-red-500 underline hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setError(""); // clear error when typing
                }}
                placeholder="Enter Promo Code"
                className="flex h-[26px] w-[121px] items-center border-[0.5px] border-[#505050] bg-white px-[8px] py-[7px] text-[10px] uppercase outline-none"
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="flex h-[26px] items-center justify-center border-[0.5px] border-[#505050] bg-black px-3 py-[7px] text-[10px] leading-none text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
              >
                {isApplying ? "Applying..." : "Apply"}
              </button>
            </div>
            {error && (
              <span className="mt-1 text-[10px] text-red-500">{error}</span>
            )}
          </div>
        )}
      </div>

      {discount > 0 && (
        <div className="mt-[13px] flex items-center justify-between">
          <p className="text-[15px] leading-[20px] font-medium text-green-600">
            Discount
          </p>
          <p className="text-[15px] leading-[20px] text-green-600">
            -{formatPrice(discount)}
          </p>
        </div>
      )}

      <div className="mt-[34px] flex items-center justify-between">
        <p className="text-[20px] leading-[24px] font-medium text-black">
          Total
        </p>
        <p className="text-[20px] leading-[27px] font-medium text-black">
          {formatPrice(total)}
        </p>
      </div>
    </div>
  );
}
