// import { API_BASE_URL } from "@/lib/config";

import type { ProductsResponse, ProductApi, Product } from "@/types/product";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is missing in .env.local");
}

export function normalizeProduct(p: any) {
  return {
    id: p._id ?? p.id,
    title: p.name ?? p.title ?? "Untitled",
    price: p.pricing?.sellingPrice ?? p.price ?? 0,
    currency: p.pricing?.currency ?? "BDT",
    images: Array.isArray(p.images)
      ? p.images.map((img: any) =>
          typeof img === "string" ? img : img?.url ?? ""
        )
      : [],
    isActive: p.isActive ?? true,
  };
}

export async function getProducts(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;

  const url = `${BASE}/api/products?page=${page}&limit=${limit}`;

  const res = await fetch(url, {
    // dev friendly, always fresh:
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

  return (await res.json()) as ProductsResponse;
}