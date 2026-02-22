import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">ONBAJAR</Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/products">Shop</Link>
          <Link href="/products">New Drop</Link>
          <Link href="/">About</Link>
          <Link href="/">Bulk Order</Link>
        </nav>

        <div className="text-sm text-gray-600">Search / Cart</div>
      </div>
    </header>
  );
}