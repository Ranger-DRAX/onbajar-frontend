interface QuantityControlProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  className?: string;
}

const wrapCls =
  "flex h-[35px] w-[117px] shrink-0 items-center border-[0.5px] border-[#8E8E8E] bg-transparent";

const buttonCls =
  "flex h-full w-[35px] items-center justify-center text-[16px] leading-none text-black transition-colors hover:bg-black/[0.04] disabled:opacity-40";

export default function QuantityControl({
  value,
  onDecrease,
  onIncrease,
  min = 0,
  className = "",
}: QuantityControlProps) {
  return (
    <div className={`${wrapCls} ${className}`.trim()}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        className={buttonCls}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="flex-1 select-none text-center text-[15px] leading-[20px] text-black">
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className={buttonCls}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}