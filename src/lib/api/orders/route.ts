import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ORDER_API_BASE_URL = process.env.ORDER_API_BASE_URL;

export async function POST(request: Request) {
  if (!ORDER_API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "ORDER_API_BASE_URL is missing" },
      { status: 500 },
    );
  }

  try {
    const payload = await request.json();

    const upstream = await fetch(`${ORDER_API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }

    const text = await upstream.text();

    return NextResponse.json(
      {
        success: upstream.ok,
        message: text || "Unexpected upstream response",
      },
      { status: upstream.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to proxy order request",
      },
      { status: 500 },
    );
  }
}