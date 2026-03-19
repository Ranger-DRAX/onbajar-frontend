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
    <main className="w-full px-6 py-12">
      {/* 3-Column Layout */}
      <div className="grid gap-12 lg:grid-cols-[380px_1fr_420px]">
        
        {/* Left Column: Details & Description */}
        <div className="order-2 space-y-8 lg:order-1">
          <div>
            <h1 className="text-4xl font-normal text-black mb-2">{product.title}</h1>
            <p className="text-xl text-black">
              {product.currency}. {discountedPrice.toLocaleString("en-BD")}
              {product.currency === "BDT" ? "৳" : ""} 
            </p>
             {product.discount && (
                  <p className="text-sm text-gray-400 line-through mt-1">
                    {product.currency}. {product.price.toLocaleString("en-BD")}
                  </p>
              )}
          </div>

          <div className="h-px bg-gray-200 w-full" />

          <div>
            <h3 className="text-lg font-medium mb-4">Details</h3>
            <div className="space-y-4 text-base leading-relaxed text-gray-800">
              {product.description && <p>{product.description}</p>}
              
              {product.bullets.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {product.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                       <span className="text-black">→</span> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
         </div>

        {/* Middle Column: Main Image */}
        <div className="order-1 lg:order-2">
             <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Size Chart & Actions */}
        <div className="order-3 lg:order-3 space-y-8">
           {/* Size Chart Table */}
           {product.sizeChart && (
            <div>
              <h3 className="text-lg font-normal mb-4">Size Chart</h3>
              <div className="border border-gray-200">
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                       <th className="py-2 border-r border-gray-200 font-medium">Size</th> 
                       {product.sizeChart.columns.map(c => (
                         <th key={c} className="py-2 border-r border-gray-200 font-medium last:border-0">{c}</th>
                       ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.rows.map((row) => (
                      <tr key={row.label} className="border-b border-gray-200 last:border-0">
                         <td className="py-2 border-r border-gray-200">{row.label}</td>
                         {row.values.map((v, i) => (
                           <td key={i} className="py-2 border-r border-gray-200 last:border-0">{v}</td>
                         ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-2 p-1">Inches</p>
              </div>
            </div>
           )}

           {/* Add To Cart Block */}
           <AddToCartButton product={product} />

           {/* Info Sections */}
           <div className="space-y-6 pt-6 border-t border-gray-200">
              {[
                "Quality Assurance",
                "Shipping and Easy Returns or Exchange",
                "Care Instructions"
              ].map(title => (
                <div key={title} className="border-b border-gray-200 pb-4">
                   <h4 className="text-base font-normal">{title}</h4>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20 border-t pt-10">
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