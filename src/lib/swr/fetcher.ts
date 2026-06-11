const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

export async function swrFetcher<T>(url: string): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${BASE}${url}`;
  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`SWR fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
