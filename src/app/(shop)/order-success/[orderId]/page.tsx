import Link from "next/link";

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderSuccessPage({ params }: Props) {
  const { orderId: orderNumber } = await params;

  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      {/* Check icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
        <svg
          className="h-8 w-8 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-semibold">Order Placed!</h1>
      <p className="mb-1 text-sm text-gray-500">Thank you for your order.</p>
      <p className="mb-8 text-xs text-gray-400">
        Order Number:{" "}
        <span className="font-mono font-medium text-gray-700">
          {orderNumber}
        </span>
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="flex h-11 w-full max-w-50 items-center justify-center border border-black text-sm font-medium tracking-wide uppercase transition-colors hover:bg-black hover:text-white"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="flex h-11 w-full max-w-50 items-center justify-center bg-black text-sm font-medium tracking-wide text-white uppercase transition-colors hover:bg-zinc-800"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
