import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts, normalizeProduct } from "@/lib/api/products";

export default async function ProductsPage() {
  const res = await getProducts({ page: 1, limit: 12 });

  const products = res.data
    .filter((p) => p.isActive)
    .map(normalizeProduct);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {res.meta.total} Products
        </p>
        <div className="flex items-center gap-3">
          {/* Filter btn — UI only */}
          <button className="flex items-center gap-1.5 text-xs uppercase tracking-wide border border-gray-300 px-3 h-8 hover:border-black transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h18M6 8h12M9 12h6M12 16h0" />
            </svg>
            Filter
          </button>

          {/* Sort dropdown — UI only */}
          <select className="text-xs uppercase tracking-wide border border-gray-300 px-3 h-8 hover:border-black transition-colors bg-white cursor-pointer">
            <option>Price: Low–High</option>
            <option>Price: High–Low</option>
            <option>Newest</option>
            <option>Best Sellers</option>
          </select>
        </div>
      </div>

      <ProductGrid>
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
    </main>
  );
}
