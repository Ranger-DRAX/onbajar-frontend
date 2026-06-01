import { getZillas } from "@/lib/locations";

export const inputCls =
  "h-10 w-full border-none outline-none bg-[#f5f5f5] px-3 py-2 text-base placeholder-neutral-400 transition-colors focus:bg-[#ebebeb] rounded-none";

export const selectCls =
  "h-10 w-full border-none outline-none bg-[#f5f5f5] px-3 py-2 text-base text-neutral-900 transition-colors focus:bg-[#ebebeb] cursor-pointer appearance-none rounded-none";

export const ZILLAS = getZillas();

export const UPSELL_PRICES = {
  giftCard: 30,
  eidCard: 100,
  giftBox: 100,
};
