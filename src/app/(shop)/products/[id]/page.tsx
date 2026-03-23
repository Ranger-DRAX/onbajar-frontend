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

  const relatedRes = await getProducts({ page: 1, limit: 5 });
  const related = relatedRes.data
    .filter((p) => p.isActive && p._id !== id)
    .slice(0, 4)
    .map(normalizeProduct);

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount.value / 100))
    : product.price;

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-8 xl:px-12">
      <section className="grid items-start gap-8 xl:grid-cols-[minmax(320px,430px)_minmax(420px,1fr)_minmax(320px,540px)] xl:gap-12">
        {/* Left */}
        <div className="relative max-w-[430px] xl:pt-4">
          <h1 className="text-4xl leading-none font-normal tracking-tight md:text-6xl">
            {product.title}
          </h1>
          <div
            className="mt-5 flex items-center gap-3"
            style={{
              fontFamily: "Inter, Noto Sans Bengali, Arial, sans-serif",
            }}
          >
            <span className="text-2xl font-normal">
              {discountedPrice.toLocaleString("en-BD")}৳
            </span>

            {product.discount && (
              <span className="text-2xl text-black/55 line-through">
                {product.price.toLocaleString("en-BD")}৳
              </span>
            )}
          </div>

          <div className="my-8 border-t border-black/15" />

          {product.description && (
            <div>
              <h2 className="mb-4 text-2xl font-medium">Details</h2>
              <p className="text-[15px] leading-7 whitespace-pre-line text-black/95">
                {product.description}
              </p>
            </div>
          )}

          {product.bullets.length > 0 && (
            <ul className="mt-6 space-y-2 text-[15px] leading-7 text-black/90">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-[1p x] text-base">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Center */}
        <div className="flex w-full justify-center xl:sticky xl:top-6">
          <div className="w-full max-w-[760px]">
            <ImageGallery images={product.images} title={product.title} />
          </div>
        </div>

        {/* Right */}
        <aside className="xl:pt-8">
          {product.sizeChart && (
            <div>
              <h3 className="text-[22px] font-medium">Size Chart</h3>

              <div className="mt-3 overflow-x-auto rounded-md border border-gray-200 bg-gray-50">
                <table className="w-full text-center text-xs text-black">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border-r border-b border-gray-300 px-4 py-3 font-medium text-black">
                        Size
                      </th>
                      {product.sizeChart.columns.map((col) => (
                        <th
                          key={col}
                          className="border-r border-b border-gray-300 px-4 py-3 font-medium text-black last:border-r-0"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {product.sizeChart.rows.map((row) => (
                      <tr key={row.label} className="bg-white">
                        <td className="border-r border-b border-gray-300 px-4 py-3 font-medium text-black">
                          {row.label}
                        </td>

                        {row.values.map((v, i) => (
                          <td
                            key={`${row.label}-${i}`}
                            className="border-r border-b border-gray-300 px-4 py-3 text-gray-700 last:border-r-0"
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-2 text-xs text-black/35">
                {product.sizeChart.unit
                  ? `${product.sizeChart.unit}*`
                  : "Inches*"}
              </p>
            </div>
          )}

          <div className="mt-10">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-6 border-t border-black/15">
            {[
              "Quality Assurance",
              "Shipping and Easy Returns or Exchange",
              "Care Instructions",
            ].map((item) => (
              <details key={item} className="border-b border-black/15">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px]">
                  <span>{item}</span>
                  <svg
                    className="h-4 w-4 text-black/50 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="pb-5 text-sm leading-7 text-black/55">
                  Content coming soon.
                </p>
              </details>
            ))}
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mt-20 border-t border-black/10 pt-10">
          <h2 className="mb-6 text-lg font-medium tracking-[0.16em] uppercase">
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
