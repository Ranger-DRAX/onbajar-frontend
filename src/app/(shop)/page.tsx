import { getProducts, normalizeProduct } from "@/lib/api/products";

export default async function ProductsPage() {
  const res = await getProducts({ page: 1, limit: 12 });

  const products = res.data
    .filter((p) => p.isActive) // show only active products
    .map(normalizeProduct);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {res.meta.total} PRODUCTS
        </h1>
        <div className="text-sm text-gray-600">Filter / Sort (later)</div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="border p-3">
            <img
              src={p.images[0]}
              alt={p.title}
              className="aspect-square w-full object-cover"
            />
            <p className="mt-2 text-sm font-medium">{p.title}</p>
            <p className="text-sm text-gray-600">
              {p.currency} {p.price}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}