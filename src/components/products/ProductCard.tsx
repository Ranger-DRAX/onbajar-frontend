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
  const discounted = discount
    ? Math.round(price * (1 - discount.value / 100))
    : price;

  return (
    <Link href={href} className="group block" aria-label={title}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isBestProduct && (
            <span className="bg-black px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
              Best Seller
            </span>
          )}

          {discount && (
            <span className="bg-red-500 px-2 py-1 text-[10px] font-medium text-white">
              -{discount.value}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="pt-3">
        <p className="line-clamp-1 text-[14px] font-normal text-black">
          {title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[12px] font-medium text-black">
            {formatMoney(discounted, currency)}
          </span>

          {discount && (
            <span className="text-[12px] text-black/40 line-through">
              {formatMoney(price, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
