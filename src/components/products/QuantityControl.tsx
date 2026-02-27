"use client";

type Props = {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
};

export default function QuantityControl({ qty, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="inline-flex items-center border border-gray-300 h-9">
      <button
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="w-9 h-full flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center text-sm select-none">{qty}</span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        className="w-9 h-full flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
