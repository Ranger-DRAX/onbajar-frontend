import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount.value / 100))
    : product.price;

  return (
    <div className="relative max-w-[430px] xl:pt-4">
      <h1 className="text-4xl leading-none font-normal tracking-tight md:text-6xl">
        {product.title}
      </h1>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-2xl font-normal">
          BDT. {discountedPrice.toLocaleString("en-BD")}৳
        </span>

        {product.discount && (
          <span className="text-2xl text-black/55 line-through">
            {product.price.toLocaleString("en-BD")}৳
          </span>
        )}
      </div>

      <div className="my-8 border-t border-black/15" />

      {product.description && (
        <div>
          <h2 className="mb-4 text-2xl font-medium">Details</h2>
          <p className="text-[15px] leading-7 whitespace-pre-line text-black/95">
            {product.description}
          </p>
        </div>
      )}

      {product.bullets.length > 0 && (
        <ul className="mt-6 space-y-2 text-[15px] leading-7 text-black/90">
          {product.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-[1px] text-base">→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
