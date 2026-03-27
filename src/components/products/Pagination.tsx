"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 py-12">
      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium text-white"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goTo(page)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs text-black transition-colors hover:bg-zinc-100"
          >
            {page}
          </button>
        ),
      )}

      {/* Next arrow */}
      <button
        onClick={() => goTo(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
