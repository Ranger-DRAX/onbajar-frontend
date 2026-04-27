import type { Keyring, KeyringsResponse } from "@/types/keyring";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

export function normalizeKeyring(k: any): Keyring {
  const price = k?.pricing?.sellingPrice ?? 0;
  const effectivePrice = k?.effectivePrice ?? price;
  const currency = k?.pricing?.currency ?? "BDT";

  const images = Array.isArray(k?.images)
    ? k.images.map((img: any) =>
        typeof img === "string" ? img : (img?.url ?? ""),
      )
    : [];

  const discount = k?.discount ?? null;
  // Only apply discount if within active date range
  const now = Date.now();
  const activeDiscount =
    discount &&
    new Date(discount.startDate).getTime() <= now &&
    new Date(discount.endDate).getTime() >= now
      ? discount
      : null;

  return {
    id: k?._id ?? k?.id,
    slug: k?.slug ?? "",
    title: k?.name ?? k?.title ?? "Untitled",
    keyringType: k?.keyringType ?? "",
    colors: Array.isArray(k?.colors) ? k.colors : [],
    categoryName: k?.category?.name ?? "",
    categorySlug: k?.category?.slug ?? "",
    price,
    effectivePrice,
    currency,
    images,
    video: k?.video ?? null,
    description: k?.details?.description ?? "",
    features: Array.isArray(k?.details?.features) ? k.details.features : [],
    material: k?.details?.material ?? "",
    dimensions: k?.details?.dimensions ?? "",
    weight: k?.details?.weight ?? 0,
    discount: activeDiscount,
    isActive: k?.isActive ?? true,
    isBestProduct: k?.isBestProduct ?? false,
    personalisation: Array.isArray(k?.personalisation) ? k.personalisation : [],
    purchaseCount: k?.purchaseCount ?? 0,
  };
}

export async function getKeyrings(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;

  const url = `${BASE}/api/keyrings?page=${page}&limit=${limit}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error(`Failed to fetch keyrings: ${res.status}`);

  return (await res.json()) as KeyringsResponse;
}

export async function getKeyringById(id: string) {
  // 1) Try direct endpoint
  try {
    const direct = await fetch(`${BASE}/api/keyrings/${id}`, {
      next: { revalidate: 60 },
    });

    if (direct.ok) {
      const json = await direct.json();
      return json?.data ?? json;
    }
  } catch {
    // ignore, fallback below
  }

  // 2) Fallback: fetch list and find
  const list = await getKeyrings({ page: 1, limit: 200 });
  return list.data.find((k: any) => (k?._id ?? k?.id) === id) ?? null;
}
