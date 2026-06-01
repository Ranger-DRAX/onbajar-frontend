import { notFound } from "next/navigation";
import {
  getProductById,
  getProducts,
  normalizeProduct,
} from "@/lib/api/products";
import ImageGallery from "@/components/products/ImageGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductInfo from "@/components/products/details/ProductInfo";
import ProductSizeChart from "@/components/products/details/ProductSizeChart";
import ProductAccordion from "@/components/products/details/ProductAccordion";
import ProductVideo from "@/components/products/details/ProductVideo";
import ProductRelated from "@/components/products/details/ProductRelated";

// Skip static prerendering — fetches live data from the backend API
export const dynamic = "force-dynamic";

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

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-8 xl:px-12">
      <section className="grid items-start gap-8 xl:grid-cols-[minmax(320px,430px)_minmax(420px,1fr)_minmax(320px,647px)] xl:gap-12">
        {/* Left */}
        <ProductInfo product={product} />

        {/* Center */}
        <div className="flex w-full justify-center xl:sticky xl:top-6">
          <div className="w-full max-w-[760px]">
            <ImageGallery images={product.images} title={product.title} />
          </div>
        </div>

        {/* Right */}
        <aside className="xl:pt-8">
          <ProductSizeChart sizeChart={product.sizeChart} />

          <div className="mt-10">
            <AddToCartButton product={product} />
          </div>

          <ProductAccordion />
        </aside>
      </section>

      <ProductVideo video={product.video} title={product.title} />

      {related.length > 0 && <ProductRelated products={related} />}
    </main>
  );
}
