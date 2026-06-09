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
  const formatted = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2);

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
    <div className="flex items-center gap-3">
      {/* Image */}
      <div className="relative h-[110px] w-[88px] shrink-0 overflow-hidden bg-[#E8E8E8]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="88px"
        />
      </div>

      {/* Title + Size */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[13px] leading-[18px] font-normal text-black uppercase">
          {item.title}
        </p>
        <p className="mt-[6px] text-[12px] leading-[16px] font-normal text-[#505050]">
          SIZE: {item.size}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="mt-[6px] text-[11px] leading-[15px] text-[#666666] underline underline-offset-2 transition-colors hover:text-black"
        >
          Remove
        </button>
      </div>

      {/* Qty control */}
      <div className="shrink-0">
        <QuantityControl
          value={item.qty}
          min={1}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>

      {/* Price */}
      <p className="w-[72px] shrink-0 text-right text-[13px] leading-[18px] font-normal text-black">
        {formatPrice(item.price, currency)}
      </p>
    </div>
  );
}
