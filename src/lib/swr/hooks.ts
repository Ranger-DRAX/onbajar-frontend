import useSWR from "swr";
import { swrKeys } from "./keys";
import type { ProductsResponse } from "@/types/product";
import type { KeyringsResponse, Keyring } from "@/types/keyring";
import type { AddonsResponse } from "@/types/addon";

/* ── Products ──────────────────────────────────────────────────────────────── */

export function useProducts(page = 1, limit = 12) {
  return useSWR<ProductsResponse>(swrKeys.products(page, limit), {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });
}

export function useProduct(id: string | null) {
  return useSWR(id ? swrKeys.product(id) : null);
}

/* ── Keyrings ──────────────────────────────────────────────────────────────── */

export function useKeyrings(page = 1, limit = 12) {
  return useSWR<KeyringsResponse>(swrKeys.keyrings(page, limit), {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });
}

export function useKeyring(id: string | null) {
  return useSWR<{ data: Keyring }>(id ? swrKeys.keyring(id) : null);
}

/* ── Addons ────────────────────────────────────────────────────────────────── */

export function useAddons() {
  return useSWR<AddonsResponse>(swrKeys.addons(), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
}

/* ── Search Data (products + keyrings for Trie) ───────────────────────────── */

type SearchProduct = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  href: string;
  type: "product" | "keyring";
  isBestProduct: boolean;
  discount: any;
};

type SearchData = {
  products: SearchProduct[];
  keyrings: SearchProduct[];
};

export function useSearchData() {
  return useSWR<SearchData>(swrKeys.searchAll(), {
    fetcher: async () => {
      const BASE =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://on-bazar-backend.vercel.app";

      const [productsRes, keyringsRes] = await Promise.allSettled([
        fetch(`${BASE}/api/products?page=1&limit=200`).then((r) => r.json()),
        fetch(`${BASE}/api/keyrings?page=1&limit=200`).then((r) => r.json()),
      ]);

      const products: SearchProduct[] = [];
      if (productsRes.status === "fulfilled") {
        const data: any[] = productsRes.value?.data ?? [];
        for (const p of data) {
          if (!p.isActive) continue;
          const catName: string = p?.category?.name ?? "";
          const catSlug: string = p?.category?.slug ?? "";
          if (
            catName.toLowerCase().includes("addon") ||
            catSlug.toLowerCase().includes("addon")
          )
            continue;

          const price = p?.pricing?.sellingPrice ?? p?.price ?? 0;
          const currency = p?.pricing?.currency ?? "BDT";
          const images: string[] = Array.isArray(p?.images)
            ? p.images.map((img: any) =>
                typeof img === "string" ? img : (img?.url ?? ""),
              )
            : [];

          products.push({
            id: p._id ?? p.id,
            title: p.name ?? p.title ?? "Untitled",
            price,
            currency,
            imageUrl: images[0] ?? "",
            href: `/products/${p._id ?? p.id}`,
            type: "product",
            isBestProduct: p.isBestProduct ?? false,
            discount: p.discount ?? null,
          });
        }
      }

      const keyrings: SearchProduct[] = [];
      if (keyringsRes.status === "fulfilled") {
        const data: any[] = keyringsRes.value?.data ?? [];
        for (const k of data) {
          if (!k.isActive) continue;
          const price = k?.pricing?.sellingPrice ?? 0;
          const currency = k?.pricing?.currency ?? "BDT";
          const images: string[] = Array.isArray(k?.images)
            ? k.images.map((img: any) =>
                typeof img === "string" ? img : (img?.url ?? ""),
              )
            : [];

          keyrings.push({
            id: k._id ?? k.id,
            title: k.name ?? k.title ?? "Untitled",
            price,
            currency,
            imageUrl: images[0] ?? "",
            href: `/keyrings/${k._id ?? k.id}`,
            type: "keyring",
            isBestProduct: k.isBestProduct ?? false,
            discount: k.discount ?? null,
          });
        }
      }

      return { products, keyrings };
    },
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

/* ── Checkout Keyrings (larger limit for checkout picker) ─────────────────── */

export function useCheckoutKeyrings() {
  return useSWR<KeyringsResponse>(swrKeys.keyrings(1, 100), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
}
