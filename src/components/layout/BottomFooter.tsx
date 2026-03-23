export default function BottomFooter() {
  return (
    <div className="flex h-[61px] items-center justify-center bg-[#D9D9D9] px-4 text-center">
      <div className="flex items-center gap-2 text-[14px] font-normal leading-none text-[#121212]">
        <span>Developed in Bangladesh</span>

        <span
          className="relative inline-block h-[12px] w-[16px] overflow-hidden rounded-[1px]"
          aria-label="Bangladesh flag"
        >
          <span className="absolute inset-0 bg-[#006A4E]" />
          <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F42A41]" />
        </span>
      </div>
    </div>
  );
}