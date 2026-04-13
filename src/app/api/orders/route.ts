import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Increase function timeout on Vercel Pro (no-op on Hobby, safe to keep)
export const maxDuration = 30;

const ORDER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

type OrderItem = {
  itemType?: string;
  product?: string;
  keyring?: string;
  quantity: number;
  size?: string;
  color?: string;             // for keyrings
  personalisationText?: string;
};

type AddonEntry = {
  addon: string;
  quantity: number;
  customerNote?: string;      // optional — omitted when null
};

export async function POST(request: Request) {
  // ── 1. Parse request body ──────────────────────────────────────────────────
  let payload: {
    items?: OrderItem[];
    addons?: AddonEntry[];
    [key: string]: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  // Sanitise items: no overrides needed here — buildOrderPayload() in
  // src/lib/api/orders.ts already handles personalisationText correctly
  // (omits the field when not provided, sends bare value when present).

  // ── 3. Forward to upstream with an explicit timeout ────────────────────────
  const controller = new AbortController();
  // 9 s — safely under Vercel Hobby's 10 s function limit
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  let upstream: Response;
  try {
    upstream = await fetch(`${ORDER_API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    const isTimeout =
      fetchErr instanceof Error && fetchErr.name === "AbortError";
    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? "Upstream request timed out. Please try again."
          : `Could not reach order service: ${(fetchErr as Error).message}`,
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // ── 4. Return upstream response ────────────────────────────────────────────
  const contentType = upstream.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    let data: unknown;
    try {
      data = await upstream.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Upstream returned malformed JSON" },
        { status: 502 },
      );
    }
    return NextResponse.json(data, { status: upstream.status });
  }

  // Non-JSON upstream response (plain text / HTML error page)
  const text = await upstream.text().catch(() => "");
  return NextResponse.json(
    { success: upstream.ok, message: text || "Unexpected upstream response" },
    { status: upstream.status },
  );
}

