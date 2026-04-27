import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import SortSelect from "@/components/products/SortSelect";
import Pagination from "@/components/products/Pagination";
import { getProducts, normalizeProduct } from "@/lib/api/products";
import { getKeyrings, normalizeKeyring } from "@/lib/api/keyrings";
import { Suspense } from "react";

type UnifiedItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  isBestProduct: boolean;
  discount: any;
  purchaseCount: number;
  href: string;
};

function sortItems(items: UnifiedItem[], sort: string): UnifiedItem[] {
  const sorted = [...items];
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

  // Fetch both in parallel
  const [productsRes, keyringsRes] = await Promise.all([
    getProducts({ page, limit: 12 }),
    getKeyrings({ page: 1, limit: 50 }),
  ]);

  const products: UnifiedItem[] = productsRes.data
    .filter((p) => {
      const isAddonCat =
        p.category?.name?.toLowerCase().includes("addon") ||
        p.category?.slug?.toLowerCase().includes("addon");
      return p.isActive && !isAddonCat;
    })
    .map((p) => {
      const n = normalizeProduct(p);
      return {
        id: n.id,
        title: n.title,
        price: n.price,
        currency: n.currency,
        images: n.images,
        isBestProduct: n.isBestProduct,
        discount: n.discount,
        purchaseCount: n.purchaseCount,
        href: `/products/${n.id}`,
      };
    });

  const keyrings: UnifiedItem[] = keyringsRes.data
    .filter((k) => k.isActive)
    .map((k) => {
      const n = normalizeKeyring(k);
      return {
        id: n.id,
        title: n.title,
        price: n.price,
        currency: n.currency,
        images: n.images,
        isBestProduct: n.isBestProduct,
        discount: n.discount,
        purchaseCount: n.purchaseCount,
        href: `/keyrings/${n.id}`,
      };
    });

  const allItems = sortItems([...products, ...keyrings], sort);
  const totalCount = productsRes.meta.total + keyringsRes.meta.total;

  return (
    <main className="w-full px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between px-6 py-8">
        <p className="text-xs tracking-widest text-gray-500 uppercase">
          {totalCount} Products
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
        {allItems.map((item) => (
          <ProductCard
            key={item.id}
            href={item.href}
            title={item.title}
            price={item.price}
            currency={item.currency}
            imageUrl={item.images?.[0] ?? "https://placehold.co/479x599"}
            isBestProduct={item.isBestProduct}
            discount={item.discount}
          />
        ))}
      </ProductGrid>

      <Suspense>
        <Pagination
          currentPage={page}
          totalPages={productsRes.meta.totalPages}
        />
      </Suspense>
    </main>
  );
}
