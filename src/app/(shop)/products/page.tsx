import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import SortSelect from "@/components/products/SortSelect";
import Pagination from "@/components/products/Pagination";
import CallToAction from "@/components/layout/CallToAction";
import { getProducts, normalizeProduct } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { Suspense } from "react";

function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "best-sellers":
      return sorted.sort((a, b) => b.purchaseCount - a.purchaseCount);
    case "newest":
    default:
      return sorted;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort = "newest", page: pageParam = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam, 10) || 1);

  const res = await getProducts({ page, limit: 12 });

  const products = sortProducts(
    res.data.filter((p) => p.isActive).map(normalizeProduct),
    sort,
  );

  return (
    <main className="w-full px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between px-6 py-8">
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          {res.meta.total} Products
        </p>
        <div className="flex items-center gap-0.5 uppercase">
          <button className="flex h-8 items-center gap-1 px-1 text-xs tracking-wide uppercase transition-colors hover:border-black">
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
            Filter By
          </button>

          <Suspense>
            <SortSelect current={sort} />
          </Suspense>
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

      <Suspense>
        <Pagination currentPage={page} totalPages={res.meta.totalPages} />
      </Suspense>

      <CallToAction />
    </main>
  );
}