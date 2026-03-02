"use client";

type Props = {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
  outOfStock?: string[];
};

export default function SizeSelector({
  sizes,
  selected,
  onChange,
  outOfStock = [],
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const oos = outOfStock.includes(s);
        const active = selected === s;
        return (
          <button
            key={s}
            disabled={oos}
            onClick={() => onChange(s)}
            className={[
              "h-9 min-w-[44px] border px-3 text-sm transition-colors",
              active
                ? "border-black bg-black text-white"
                : oos
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300 line-through"
                  : "border-gray-300 bg-white text-black hover:border-black",
            ].join(" ")}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
