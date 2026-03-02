import Image from "next/image";
import Link from "next/link";
import type { Discount } from "@/types/product";

type Props = {
  href: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  isBestProduct?: boolean;
  discount?: Discount;
};

function formatMoney(amount: number, currency: string) {
  const n = Math.round(amount);
  return `${currency}. ${n.toLocaleString("en-BD")}`;
}

export default function ProductCard({
  href,
  title,
  price,
  currency,
  imageUrl,
  isBestProduct,
  discount,
}: Props) {
  return (
    <Link href={href} className="group block" aria-label={title}>
      {/* Image */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-[#efefef]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBestProduct && (
            <span className="bg-black px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
              Best Seller
            </span>
          )}
          {discount && (
            <span className="bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
              -{discount.value}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="pt-2 pb-4">
        <p className="line-clamp-1 text-[13px] leading-tight font-normal text-black">
          {title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {discount ? (
            <>
              <span className="text-[11px] font-medium text-black">
                {formatMoney(
                  Math.round(price * (1 - discount.value / 100)),
                  currency,
                )}
              </span>
              <span className="text-[11px] text-zinc-400 line-through">
                {formatMoney(price, currency)}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-light tracking-wide text-zinc-400">
              {formatMoney(price, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
