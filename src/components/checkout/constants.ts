import { getZillas } from "@/lib/locations";

export const inputCls =
  "h-10 w-full outline outline-[1px] outline-neutral-900 bg-white px-3 py-2 text-base placeholder-neutral-400 transition-colors focus:outline-2 focus:outline-black rounded-none";

export const selectCls =
  "h-10 w-full outline outline-[1px] outline-neutral-900 bg-white px-3 py-2 text-base text-neutral-900 transition-colors focus:outline-2 focus:outline-black cursor-pointer appearance-none rounded-none";

export const ZILLAS = getZillas();

export const UPSELL_PRICES = {
  giftCard: 30,
  eidCard: 100,
  giftBox: 100,
};
