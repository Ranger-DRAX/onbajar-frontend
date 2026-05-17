import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts, normalizeProduct } from "@/lib/api/products";
import { getKeyrings, normalizeKeyring } from "@/lib/api/keyrings";
import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/assets/image/HeroSectionImage.svg";
import RightArrowIcon from "@/assets/image/RightArrowIcon.svg";
import ReviewSection from "@/components/home/ReviewSection";
import AboutScrollSection from "@/components/home/AboutScrollSection";

// Skip static prerendering — page fetches live data from the backend API
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [productsRes, keyringsRes] = await Promise.all([
    getProducts({ page: 1, limit: 12 }),
    getKeyrings({ page: 1, limit: 12 }),
  ]);

  const allProducts = productsRes.data
    .filter((p) => {
      const isAddonCat =
        p.category?.name?.toLowerCase().includes("addon") ||
        p.category?.slug?.toLowerCase().includes("addon");
      return p.isActive && !isAddonCat;
    })
    .map((p) => ({ ...normalizeProduct(p), href: `/products/${p._id}` }));

  const allKeyrings = keyringsRes.data
    .filter((k) => k.isActive)
    .map((k) => ({ ...normalizeKeyring(k), href: `/keyrings/${k._id}` }));

  // Merge for display
  const allItems = [...allProducts, ...allKeyrings];

  const bestSellers = allItems.filter((p) => p.isBestProduct).slice(0, 4);
  const newArrivals = allItems.slice(0, 8);

  return (
    <main>
      {/* Hero Section */}
      <div className="w-full">
        <Image
          src={HeroImage}
          alt="Hero section image"
          priority
          className="h-auto w-full object-cover"
        />
      </div>
      {/* New Arrivals */}
      <section className="w-full border-t px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Image
              src={RightArrowIcon}
              alt="Right arrow icon"
              priority
              className="h-20 w-20"
            />

            <span
              style={{
                width: "540px",
                height: "100px",
                fontFamily: "'Satoshi'",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "96px",
                lineHeight: "130px",
                display: "flex",
                alignItems: "center",
                letterSpacing: "-0.04em",
                color: "#121212",
                flex: "none",
                order: 1,
                flexGrow: 0,
              }}
            >
              New Arrivals
            </span>
          </h2>

          <Link
            href="/products"
            className="text-xs text-gray-500 underline underline-offset-4 hover:text-black"
          >
            View All
          </Link>
        </div>
        <ProductGrid cols={4}>
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              href={p.href}
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
      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="w-full px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2">
              <Image
                src={RightArrowIcon}
                alt="Right arrow icon"
                priority
                className="h-20 w-20"
              />

              <span
                style={{
                  width: "540px",
                  height: "100px",
                  fontFamily: "'Satoshi'",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "96px",
                  lineHeight: "130px",
                  display: "flex",
                  alignItems: "center",
                  letterSpacing: "-0.04em",
                  color: "#121212",
                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}
              >
                Best Sellers
              </span>
            </h2>
            <Link
              href="/products"
              className="text-xs text-gray-500 underline underline-offset-4 hover:text-black"
            >
              View All
            </Link>
          </div>
          <ProductGrid cols={4}>
            {bestSellers.map((p) => (
              <ProductCard
                key={p.id}
                href={p.href}
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

      {/* ─── About Scroll Section ─── */}
      <AboutScrollSection />

      {/* ─── Review Section ─── */}
      <ReviewSection />
    </main>
  );
}
