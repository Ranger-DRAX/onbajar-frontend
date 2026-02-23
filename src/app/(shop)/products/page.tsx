import ProductCard from "@/components/products/ProductCard";
import { getProducts, normalizeProduct } from "@/lib/api/products";

export default async function ProductsPage() {
  const res = await getProducts({ page: 1, limit: 12 });

  const products = res.data
    .filter((p) => p.isActive)
    .map(normalizeProduct);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{res.meta.total} PRODUCTS</h1>
        <div className="text-sm text-gray-600">Filter / Sort</div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            href={`/products/${p.id}`}
            title={p.title}
            price={p.price}
            currency={p.currency}
            imageUrl={p.images?.[0] ?? "https://placehold.co/479x599"}
          />
        ))}
      </div>
    </main>
  );
}