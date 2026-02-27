import { notFound } from "next/navigation";
import { getProductById, getProducts, normalizeProduct } from "@/lib/api/products";
import ImageGallery from "@/components/products/ImageGallery";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  const raw = await getProductById(id);
  if (!raw) return notFound();

  const product = normalizeProduct(raw?.data ?? raw);

  // Related products — same category, excluding current
  const relatedRes = await getProducts({ page: 1, limit: 5 });
  const related = relatedRes.data
    .filter((p) => p.isActive && p._id !== id)
    .slice(0, 4)
    .map(normalizeProduct);

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount.value / 100))
    : product.price;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* === TOP SECTION === */}
      <div className="grid gap-10 lg:grid-cols-2">

        {/* Left — Image gallery */}
        <ImageGallery images={product.images} title={product.title} />

        {/* Right — Product info */}
        <div className="flex flex-col gap-4">

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {product.categoryName}
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-medium">
              {product.currency}. {discountedPrice.toLocaleString("en-BD")}
            </span>
            {product.discount && (
              <>
                <span className="text-sm line-through text-gray-400">
                  {product.currency}. {product.price.toLocaleString("en-BD")}
                </span>
                <span className="text-sm text-red-500 font-medium">
                  -{product.discount.value}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-sm font-medium mb-1">Details</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Bullets */}
          {product.bullets.length > 0 && (
            <ul className="space-y-1">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Size Chart table */}
          {product.sizeChart && (
            <div>
              <p className="text-sm font-medium mb-2">Size Chart ({product.sizeChart.unit})</p>
              <div className="overflow-x-auto">
                <table className="text-xs w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 border-r border-gray-200">Size</th>
                      {product.sizeChart.columns.map((col) => (
                        <th key={col} className="px-3 py-2 text-center border-r border-gray-200 last:border-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.rows.map((row) => (
                      <tr key={row.label} className="border-t border-gray-200">
                        <td className="px-3 py-2 font-medium border-r border-gray-200">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td key={i} className="px-3 py-2 text-center border-r border-gray-200 last:border-0">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add to cart — client component */}
          <AddToCartButton product={product} />

          {/* Accordion stubs */}
          <div className="border-t pt-4 space-y-3">
            {["Quality Assurance", "Shipping and Easy Returns or Exchange", "Care Instructions"].map((item) => (
              <details key={item} className="group">
                <summary className="flex justify-between items-center cursor-pointer text-sm py-2 select-none">
                  {item}
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-xs text-gray-500 pb-2 pt-1 pl-1">
                  Content coming soon.
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* === RELATED PRODUCTS === */}
      {related.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">
            Related Products
          </h2>
          <ProductGrid cols={4}>
            {related.map((p) => (
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
    </main>
  );
}
