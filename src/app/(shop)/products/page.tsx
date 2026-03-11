import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import CallToAction from "@/components/layout/CallToAction";
import { getProducts, normalizeProduct } from "@/lib/api/products";

export default async function ProductsPage() {
  const res = await getProducts({ page: 1, limit: 12 });

  const products = res.data.filter((p) => p.isActive).map(normalizeProduct);

  return (
    <main className="w-full">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between  px-6 py-8">
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          {res.meta.total} Products
        </p>
        <div className="flex items-center gap-0.5 ">
          {/* Filter btn — UI only */}
          <button className="flex h-8 items-center gap-1  px-1 text-xs tracking-wide uppercase transition-colors hover:border-black">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M6 8h12M9 12h6M12 16h0"
              />
            </svg>
            Filter
          </button>

          {/* Sort dropdown — UI only */}
          <select className="h-8 cursor-pointer  bg-white px-2 text-xs tracking-wide uppercase transition-colors hover:border-black">
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
      <CallToAction />
    </main>
  );
}
