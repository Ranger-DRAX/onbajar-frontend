import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts, normalizeProduct } from "@/lib/api/products";
import Link from "next/link";

export default async function HomePage() {
  const res = await getProducts({ page: 1, limit: 12 });

  const allProducts = res.data
    .filter((p) => p.isActive)
    .map(normalizeProduct);

  const bestSellers = allProducts.filter((p) => p.isBestProduct).slice(0, 4);
  const newArrivals = allProducts.slice(0, 8);

  return (
    <main>
      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold uppercase tracking-wide">Best Sellers</h2>
            <Link href="/products" className="text-xs underline underline-offset-4 text-gray-500 hover:text-black">
              View All
            </Link>
          </div>
          <ProductGrid cols={4}>
            {bestSellers.map((p) => (
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
      )}

      {/* New Arrivals */}
      <section className="mx-auto max-w-6xl px-4 py-10 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold uppercase tracking-wide">New Arrivals</h2>
          <Link href="/products" className="text-xs underline underline-offset-4 text-gray-500 hover:text-black">
            View All
          </Link>
        </div>
        <ProductGrid cols={4}>
          {newArrivals.map((p) => (
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
    </main>
  );
}
