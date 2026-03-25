import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";

type Props = {
  products: Product[];
};

export default function ProductRelated({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-black/10 pt-10">
      <h2 className="mb-6 text-lg font-medium tracking-[0.16em] uppercase">
        Related Products
      </h2>

      <ProductGrid cols={4}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            href={`/products/${p.id}`}
            title={p.title}
            price={p.price}
            currency={p.currency}
            imageUrl={p.images?.[0] ?? "https://placehold.co/479x599"}
            isBestProduct={p.isBestProduct}
            discount={p.discount}
          />
        ))}
      </ProductGrid>
    </section>
  );
}
