import { notFound } from "next/navigation";
import {
  getProductById,
  getProducts,
  normalizeProduct,
} from "@/lib/api/products";
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
    <main className="w-full px-6 py-8">
      {/* === TOP SECTION === */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left — Image gallery */}
        <ImageGallery images={product.images} title={product.title} />

        {/* Right — Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              {product.categoryName}
            </p>
            <h1 className="mt-1 text-2xl leading-snug font-semibold">
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
                <span className="text-sm text-gray-400 line-through">
                  {product.currency}. {product.price.toLocaleString("en-BD")}
                </span>
                <span className="text-sm font-medium text-red-500">
                  -{product.discount.value}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="mb-1 text-sm font-medium">Details</p>
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Bullets */}
          {product.bullets.length > 0 && (
            <ul className="space-y-1">
              {product.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Size Chart table */}
          {product.sizeChart && (
            <div>
              <p className="mb-2 text-sm font-medium">
                Size Chart ({product.sizeChart.unit})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-r border-gray-200 px-3 py-2 text-left">
                        Size
                      </th>
                      {product.sizeChart.columns.map((col) => (
                        <th
                          key={col}
                          className="border-r border-gray-200 px-3 py-2 text-center last:border-0"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.rows.map((row) => (
                      <tr key={row.label} className="border-t border-gray-200">
                        <td className="border-r border-gray-200 px-3 py-2 font-medium">
                          {row.label}
                        </td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className="border-r border-gray-200 px-3 py-2 text-center last:border-0"
                          >
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
          <div className="space-y-3 border-t pt-4">
            {[
              "Quality Assurance",
              "Shipping and Easy Returns or Exchange",
              "Care Instructions",
            ].map((item) => (
              <details key={item} className="group">
                <summary className="flex cursor-pointer items-center justify-between py-2 text-sm select-none">
                  {item}
                  <svg
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="pt-1 pb-2 pl-1 text-xs text-gray-500">
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
          <h2 className="mb-6 text-xl font-semibold tracking-wide uppercase">
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
