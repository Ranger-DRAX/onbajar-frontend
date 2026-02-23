import Image from "next/image";
import Link from "next/link";

type Props = {
  href: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
};

function formatMoney(amount: number, currency: string) {
  const n = Math.round(amount);
  return `${currency}. ${n.toLocaleString("en-BD")}`;
}

export default function ProductCard({ href, title, price, currency, imageUrl }: Props) {
  return (
    <Link href={href} className="group block" aria-label={title}>

      {/* Card image area */}
      <div className="relative w-full aspect-[4/5] bg-[#efefef]">



        {/* Product image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4"
          priority={false}
        />
      </div>

      {/* Text below card */}
      <div className="pt-2 pb-4">
        <p className="text-[13px] font-normal text-black leading-tight line-clamp-1">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] font-light text-zinc-400 tracking-wide">
          {formatMoney(price, currency)}
        </p>
      </div>

    </Link>
  );
}