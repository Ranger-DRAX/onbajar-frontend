import { notFound } from "next/navigation";
import {
  getKeyringById,
  getKeyrings,
  normalizeKeyring,
} from "@/lib/api/keyrings";
import ImageGallery from "@/components/products/ImageGallery";
import KeyringPurchaseSection from "@/components/keyrings/KeyringPurchaseSection";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import ProductAccordion from "@/components/products/details/ProductAccordion";

type Props = { params: Promise<{ id: string }> };

function formatMoney(amount: number, currency: string) {
  return `${currency}. ${Math.round(amount).toLocaleString("en-BD")}`;
}

export default async function KeyringDetailPage({ params }: Props) {
  const { id } = await params;

  const raw = await getKeyringById(id);
  if (!raw) return notFound();

  const keyring = normalizeKeyring(raw?.data ?? raw);

  const discountedPrice = keyring.discount
    ? Math.round(keyring.price * (1 - keyring.discount.value / 100))
    : keyring.price;

  const relatedRes = await getKeyrings({ page: 1, limit: 5 });
  const related = relatedRes.data
    .filter((k) => k.isActive && k._id !== id)
    .slice(0, 4)
    .map(normalizeKeyring);

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-8 xl:px-12">
      <section className="grid items-start gap-8 xl:grid-cols-[minmax(320px,430px)_minmax(420px,1fr)_minmax(320px,647px)] xl:gap-12">
        {/* Left — Info */}
        <div className="relative max-w-[430px] xl:pt-4">
          {keyring.categoryName && (
            <p className="mb-3 text-xs tracking-widest text-black/40 uppercase">
              {keyring.categoryName}
            </p>
          )}

          <h1 className="text-4xl leading-none font-normal tracking-tight md:text-6xl">
            {keyring.title}
          </h1>

          {/* Price */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-normal">
              {formatMoney(discountedPrice, keyring.currency)}৳
            </span>

            {keyring.discount && (
              <>
                <span className="text-2xl text-black/55 line-through">
                  {formatMoney(keyring.price, keyring.currency)}৳
                </span>
                <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                  -{keyring.discount.value}% OFF
                </span>
              </>
            )}
          </div>

          <div className="my-8 border-t border-black/15" />

          {/* Description */}
          {keyring.description && (
            <div>
              <h2 className="mb-4 text-2xl font-medium">Details</h2>
              <p className="text-[15px] leading-7 whitespace-pre-line text-black/95">
                {keyring.description}
              </p>
            </div>
          )}

          {/* Specs */}
          <div className="mt-6 space-y-2 text-[15px] text-black/70">
            {keyring.material && (
              <p>
                <span className="font-medium text-black">Material:</span>{" "}
                {keyring.material}
              </p>
            )}
            {keyring.dimensions && (
              <p>
                <span className="font-medium text-black">Dimensions:</span>{" "}
                {keyring.dimensions}
              </p>
            )}
            {keyring.weight > 0 && (
              <p>
                <span className="font-medium text-black">Weight:</span>{" "}
                {keyring.weight}g
              </p>
            )}
          </div>

          {/* Colors */}
          {keyring.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-[22px] font-medium">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {keyring.colors.map((color) => (
                  <span
                    key={color}
                    className="border border-black/20 px-3 py-1.5 text-sm text-black/60"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {keyring.features.length > 0 && (
            <ul className="mt-6 space-y-2 text-[15px] leading-7 text-black/90">
              {keyring.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-[1px] text-base">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Center — Gallery */}
        <div className="flex w-full justify-center xl:sticky xl:top-6">
          <div className="w-full max-w-[760px]">
            <ImageGallery images={keyring.images} title={keyring.title} />
          </div>
        </div>

        {/* Right — Purchase */}
        <aside className="xl:pt-8">
          <KeyringPurchaseSection keyring={keyring} />
          <ProductAccordion />
        </aside>
      </section>

      {/* Related Keyrings */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-black/10 pt-10">
          <h2 className="mb-6 text-lg font-medium tracking-[0.16em] uppercase">
            Related Keyrings
          </h2>
          <ProductGrid cols={4}>
            {related.map((k) => (
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
        </section>
      )}
    </main>
  );
}
