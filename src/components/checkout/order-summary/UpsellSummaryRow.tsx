import Image from "next/image";
import QuantityControl from "./QuantityControl";

interface UpsellSummaryRowProps {
  title: string;
  image: string;
  alt: string;
  value: number;
  price: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function formatPrice(amount: number, currency = "BDT") {
  const formatted = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2);

  return `${currency} ${formatted}৳`;
}

export default function UpsellSummaryRow({
  title,
  image,
  alt,
  value,
  price,
  onDecrease,
  onIncrease,
}: UpsellSummaryRowProps) {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-[88px_minmax(180px,1fr)_117px_120px] sm:items-center sm:gap-x-[26px]">
      <div className="relative h-[110px] w-[88px] overflow-hidden bg-[#E8E8E8]">
        <Image
          src={image}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          sizes="88px"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[15px] leading-[20px] font-normal text-black uppercase">
          {title}
        </p>

        <p className="mt-[4px] text-[15px] leading-[20px] text-black">
          BDT. {price}
        </p>
      </div>

      <div className="sm:justify-self-center">
        <QuantityControl
          value={value}
          min={0}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>

      <p className="w-[120px] text-left text-[15px] leading-[20px] font-normal text-black sm:text-right">
        {formatPrice(price)}
      </p>
    </div>
  );
}
