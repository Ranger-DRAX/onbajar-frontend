import type { AddonsResponse } from "@/types/addon";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

export async function getAddons(): Promise<AddonsResponse> {
  const res = await fetch(`${BASE}/api/addons`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch addons: ${res.status}`);
  return res.json() as Promise<AddonsResponse>;
}
