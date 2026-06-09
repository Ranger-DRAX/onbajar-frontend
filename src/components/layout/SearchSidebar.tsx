"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { Trie, type SearchableItem } from "@/lib/trie";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://on-bazar-backend.vercel.app";

type SearchSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function formatMoney(amount: number, currency = "BDT") {
  const n = Math.round(amount);
  return `${currency}. ${n.toLocaleString("en-BD")}`;
}

// ─── Module-level cache so we only fetch once per page session ───────────────
let cachedTrie: Trie | null = null;
let cacheLoading = false;
let cacheCallbacks: Array<(trie: Trie) => void> = [];

async function getOrBuildTrie(): Promise<Trie> {
  if (cachedTrie) return cachedTrie;

  if (cacheLoading) {
    return new Promise((resolve) => {
      cacheCallbacks.push(resolve);
    });
  }

  cacheLoading = true;

  const [productsRes, keyringsRes] = await Promise.allSettled([
    fetch(`${BASE}/api/products?page=1&limit=200`).then((r) => r.json()),
    fetch(`${BASE}/api/keyrings?page=1&limit=200`).then((r) => r.json()),
  ]);

  const trie = new Trie();

  if (productsRes.status === "fulfilled") {
    const data: any[] = productsRes.value?.data ?? [];
    for (const p of data) {
      if (!p.isActive) continue;
      const price = p?.pricing?.sellingPrice ?? p?.price ?? 0;
      const currency = p?.pricing?.currency ?? "BDT";
      const images: string[] = Array.isArray(p?.images)
        ? p.images.map((img: any) =>
            typeof img === "string" ? img : (img?.url ?? ""),
          )
        : [];
      // Filter out addon categories
      const catName: string = p?.category?.name ?? "";
      const catSlug: string = p?.category?.slug ?? "";
      if (
        catName.toLowerCase().includes("addon") ||
        catSlug.toLowerCase().includes("addon")
      )
        continue;

      trie.insert({
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

      trie.insert({
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

  cachedTrie = trie;
  cacheLoading = false;
  for (const cb of cacheCallbacks) cb(trie);
  cacheCallbacks = [];

  return trie;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SearchSidebar({ open, onClose }: SearchSidebarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [trie, setTrie] = useState<Trie | null>(cachedTrie);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data when sidebar first opens
  useEffect(() => {
    if (!open) return;
    if (trie) return; // already loaded

    setIsLoading(true);
    getOrBuildTrie().then((t) => {
      setTrie(t);
      setIsLoading(false);
    });
  }, [open, trie]);

  // Auto-focus input when opened
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [open]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Debounced Trie search
  const handleInput = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        if (trie) {
          const found = trie.search(value.trim());
          setResults(found);
          setHasSearched(true);
        }
      }, 250);
    },
    [trie],
  );

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const noResults = hasSearched && query.trim() !== "" && results.length === 0;
  const showResults = hasSearched && results.length > 0;

  return (
    <div
      className={`fixed inset-0 z-90 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search sidebar"
        className={`absolute inset-0 bg-black/30 transition-all duration-300 ${
          open
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 backdrop-blur-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`absolute top-0 right-0 flex h-screen w-screen transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[668px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Product search"
      >
        {/* ── Search Input Header ── */}
        <div className="flex items-center gap-3 border-b border-[#D9D9D9] px-5 py-4">
          {/* Search Icon */}
          <svg
            className="h-5 w-5 shrink-0 text-[#0A0A0A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-[16px] font-normal text-[#0A0A0A] outline-none placeholder:text-[#A0A0A0]"
            aria-label="Search products"
            id="search-sidebar-input"
            autoComplete="off"
          />

          {/* Clear query or close */}
          {query ? (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Clear search"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#E6E6E6] text-[18px] leading-none text-black transition hover:bg-[#DCDCDC]"
            >
              ×
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#E6E6E6] text-[18px] leading-none text-black transition hover:bg-[#DCDCDC]"
            >
              ×
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E6E6E6] border-t-[#0A0A0A]" />
                <p className="text-[12px] tracking-widest text-[#A0A0A0] uppercase">
                  Loading…
                </p>
              </div>
            </div>
          )}

          {/* Empty / initial state */}
          {!isLoading && !hasSearched && (
            <div className="flex h-full items-center justify-center px-8">
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-[#D9D9D9]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-[13px] tracking-widest text-[#A0A0A0] uppercase">
                  Start typing to search
                </p>
              </div>
            </div>
          )}

          {/* No results state — matches reference image 2 */}
          {!isLoading && noResults && (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <p className="mb-4 text-[11px] tracking-[0.2em] text-[#A0A0A0] uppercase">
                Search
              </p>
              <h2 className="mb-6 text-[28px] font-normal leading-tight text-[#0A0A0A] sm:text-[32px]">
                Your search did not yield any result
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="border border-[#0A0A0A] px-8 py-3 text-[11px] tracking-[0.15em] text-[#0A0A0A] uppercase transition hover:bg-[#0A0A0A] hover:text-white"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Results grid — matches reference image 1 */}
          {!isLoading && showResults && (
            <div className="px-5 pt-5 pb-8">
              {/* Section label */}
              <p className="mb-4 border-b border-[#E6E6E6] pb-2 text-[12px] font-medium tracking-widest text-[#0A0A0A] uppercase">
                Products
                <span className="ml-2 text-[#A0A0A0]">({results.length})</span>
              </p>

              {/* 2-column grid */}
              <div className="grid grid-cols-2 gap-4">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="group block"
                    aria-label={item.title}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F3F3]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 668px) 45vw, 290px"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#CCCCCC]">
                          <svg
                            className="h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.isBestProduct && (
                          <span className="bg-black px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase">
                            Best Seller
                          </span>
                        )}
                        {item.discount && (
                          <span className="bg-red-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
                            -{item.discount.value}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="pt-2">
                      <p className="line-clamp-1 text-[13px] font-normal text-[#0A0A0A] transition-colors group-hover:text-[#444444]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12px] font-medium text-[#0A0A0A]">
                        {formatMoney(item.price, item.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
