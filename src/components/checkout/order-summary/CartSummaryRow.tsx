import Image from "next/image";
import { CartItem } from "@/types/cart";
import QuantityControl from "./QuantityControl";

interface CartSummaryRowProps {
  item: CartItem;
  currency: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove?: () => void;
}

function formatPrice(amount: number, currency = "BDT") {
  const formatted = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `${currency} ${formatted}৳`;
}

export default function CartSummaryRow({
  item,
  currency,
  onDecrease,
  onIncrease,
  onRemove,
}: CartSummaryRowProps) {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-[88px_minmax(180px,1fr)_117px_120px] sm:items-center sm:gap-x-[26px]">
      <div className="relative h-[110px] w-[88px] overflow-hidden bg-[#E8E8E8]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="88px"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[15px] font-normal uppercase leading-[20px] text-black">
          {item.title}
        </p>

        <p className="mt-[10px] text-[15px] font-normal leading-[20px] text-[#505050]">
          SIZE: {item.size}
        </p>

        <button
          type="button"
          onClick={onRemove}
          className="mt-[10px] text-[13px] leading-[18px] text-[#666666] underline underline-offset-4 transition-colors hover:text-black"
        >
          Remove
        </button>
      </div>

      <QuantityControl
        value={item.qty}
        min={1}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        className="sm:justify-self-center"
      />

      <p className="w-[120px] text-left text-[15px] font-normal leading-[20px] text-black sm:text-right">
        {formatPrice(item.price, currency)}
      </p>
    </div>
  );
}