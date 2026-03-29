import type { Product, ProductsResponse } from "@/types/product";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

export function normalizeProduct(p: any): Product {
  const price = p?.pricing?.sellingPrice ?? p?.price ?? 0;
  const effectivePrice = p?.effectivePrice ?? price;
  const currency = p?.pricing?.currency ?? "BDT";

  const images = Array.isArray(p?.images)
    ? p.images.map((img: any) =>
        typeof img === "string" ? img : (img?.url ?? ""),
      )
    : [];

  const categoryName = p?.category?.name ?? "";
  const categorySlug = p?.category?.slug ?? "";

  const description = p?.details?.description ?? "";
  const bullets = Array.isArray(p?.details?.bullets) ? p.details.bullets : [];

  // safer "hasSize" (handles bad API where hasSize false but sizes exist)
  const sizes = Array.isArray(p?.sizes) ? p.sizes : [];
  const hasSize = Boolean(p?.hasSize) && sizes.length > 0;

  const discount = p?.discount ?? null;

  return {
    id: p?._id ?? p?.id,
    slug: p?.slug ?? "",
    title: p?.name ?? p?.title ?? "Untitled",
    categoryName,
    categorySlug,
    price,
    effectivePrice,
    currency,
    images,
    video: p?.video,
    description,
    bullets,
    hasSize,
    sizes,
    sizeChart: p?.sizeChart ?? null,
    discount,
    isActive: p?.isActive ?? true,
    isBestProduct: p?.isBestProduct ?? false,
    purchaseCount: p?.purchaseCount ?? 0,
    stockSummary: p?.stockSummary,
  };
}

export async function getProducts(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;

  const url = `${BASE}/api/products?page=${page}&limit=${limit}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

  return (await res.json()) as ProductsResponse;
}

/**
 * Tries to fetch a single product by id.
 * - First tries /api/products/:id (if your backend supports it)
 * - If not supported, falls back to list+find by _id
 */
export async function getProductById(id: string) {
  // 1) Try direct endpoint
  try {
    const direct = await fetch(`${BASE}/api/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (direct.ok) {
      const json = await direct.json();
      // backend might return {success, data} or just product
      return json?.data ?? json;
    }
  } catch {
    // ignore, fallback below
  }

  // 2) Fallback: fetch list and find
  const list = await getProducts({ page: 1, limit: 200 });
  return list.data.find((p: any) => (p?._id ?? p?.id) === id) ?? null;
}
