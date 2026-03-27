"use client";

type Props = {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
};

export default function QuantityControl({
  qty,
  onChange,
  min = 1,
  max = 99,
}: Props) {
  return (
    <div className="inline-flex h-11 items-center border border-gray-300">
      <button
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="flex h-full w-10 items-center justify-center text-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-medium select-none">
        {qty}
      </span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        className="flex h-full w-10 items-center justify-center text-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
