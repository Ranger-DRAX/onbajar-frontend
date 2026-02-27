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
              "min-w-[44px] h-9 px-3 text-sm border transition-colors",
              active
                ? "bg-black text-white border-black"
                : oos
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                : "bg-white text-black border-gray-300 hover:border-black",
            ].join(" ")}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
