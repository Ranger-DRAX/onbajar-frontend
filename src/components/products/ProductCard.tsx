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

export default function ProductCard({ href, title, price, currency, imageUrl, isBestProduct, discount }: Props) {
  return (
    <Link href={href} className="group block" aria-label={title}>

      {/* Image */}
      <div className="relative w-full aspect-4/5 bg-[#efefef] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBestProduct && (
            <span className="bg-black text-white text-[10px] font-medium px-2 py-0.5 uppercase tracking-wide">
              Best Seller
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5">
              -{discount.value}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="pt-2 pb-4">
        <p className="text-[13px] font-normal text-black leading-tight line-clamp-1">
          {title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {discount ? (
            <>
              <span className="text-[11px] font-medium text-black">
                {formatMoney(Math.round(price * (1 - discount.value / 100)), currency)}
              </span>
              <span className="text-[11px] line-through text-zinc-400">
                {formatMoney(price, currency)}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-light text-zinc-400 tracking-wide">
              {formatMoney(price, currency)}
            </span>
          )}
        </div>
      </div>

    </Link>
  );
}