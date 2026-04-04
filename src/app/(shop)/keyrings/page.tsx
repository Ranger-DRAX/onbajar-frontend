import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import SortSelect from "@/components/products/SortSelect";
import Pagination from "@/components/products/Pagination";
import { getKeyrings, normalizeKeyring } from "@/lib/api/keyrings";
import type { Keyring } from "@/types/keyring";
import { Suspense } from "react";

function sortKeyrings(keyrings: Keyring[], sort: string): Keyring[] {
  const sorted = [...keyrings];
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

export default async function KeyringsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort = "newest", page: pageParam = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam, 10) || 1);

  const res = await getKeyrings({ page, limit: 12 });

  const keyrings = sortKeyrings(
    res.data.filter((k) => k.isActive).map(normalizeKeyring),
    sort,
  );

  return (
    <main className="w-full px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between px-6 py-8">
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          {res.meta.total} Keyrings
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
        {keyrings.map((k) => (
          <ProductCard
            key={k.id}
            href={`/keyrings/${k.id}`}
            title={k.title}
            price={k.price}
            currency={k.currency}
            imageUrl={k.images?.[0] ?? "https://placehold.co/479x599"}
            isBestProduct={k.isBestProduct}
            discount={k.discount}
          />
        ))}
      </ProductGrid>

      <Suspense>
        <Pagination currentPage={page} totalPages={res.meta.totalPages} />
      </Suspense>
    </main>
  );
}
