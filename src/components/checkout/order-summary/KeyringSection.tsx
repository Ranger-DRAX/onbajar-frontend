"use client";

import { useState } from "react";
import Image from "next/image";
import type { Keyring } from "@/types/keyring";
import type { SelectedKeyring } from "./types";
import KeyringPickerModal from "./KeyringPickerModal";

interface KeyringSectionProps {
  keyrings: Keyring[];
  selected: SelectedKeyring | null;
  onSelect: (k: SelectedKeyring | null) => void;
}

export default function KeyringSection({
  keyrings,
  selected,
  onSelect,
}: KeyringSectionProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      {/* Section header */}
      <div className="mt-[40px]">
        <h3 className="mb-[21px] text-[15px] leading-[20px] font-medium tracking-[-0.03em] text-black uppercase">
          Customised Keyrings
        </h3>

        {!selected ? (
          /* "Add Keyring" trigger row */
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-[88px_minmax(180px,1fr)] sm:items-center sm:gap-x-[26px]">
            <div className="h-[110px] w-[88px] overflow-hidden border border-dashed border-neutral-300 bg-[#F5F5F5] flex items-center justify-center">
              <span className="text-[28px] text-neutral-300">＋</span>
            </div>
            <div>
              <p className="text-[14px] leading-snug font-normal text-black uppercase">
                Add a Customised Keyring
              </p>
              <p className="mt-1 text-[12px] text-neutral-400">
                Pick any keyring &amp; personalise it
              </p>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="mt-[10px] inline-flex items-center gap-1 border border-black bg-black px-4 py-[6px] text-[12px] leading-none text-white transition-colors hover:bg-neutral-800"
              >
                + Add Keyring
              </button>
            </div>
          </div>
        ) : (
          /* Selected keyring preview row */
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-[88px_minmax(180px,1fr)_117px_120px] sm:items-center sm:gap-x-[26px]">
            {/* Image */}
            <div className="relative h-[110px] w-[88px] overflow-hidden bg-[#E8E8E8]">
              <Image
                src={selected.imageUrl || "https://placehold.co/88x110"}
                alt={selected.title}
                fill
                unoptimized
                className="object-cover"
                sizes="88px"
              />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-[15px] leading-[20px] font-normal text-black uppercase">
                {selected.title}
              </p>
              {selected.color && (
                <p className="mt-[4px] text-[13px] text-neutral-500">
                  Color: {selected.color}
                </p>
              )}
              {selected.personalisationText && (
                <p className="mt-[2px] text-[12px] italic text-neutral-400 line-clamp-1">
                  "{selected.personalisationText}"
                </p>
              )}
              <p className="mt-[4px] text-[15px] text-black">
                BDT. {Math.round(selected.price)}
              </p>

              <div className="mt-[8px] flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="text-[12px] text-neutral-500 underline underline-offset-2 hover:text-black"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(null)}
                  className="text-[12px] text-neutral-500 underline underline-offset-2 hover:text-black"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Qty (read-only — set inside modal) */}
            <div className="sm:justify-self-center">
              <div className="flex h-[35px] w-[117px] items-center border-[0.5px] border-[#8E8E8E] bg-transparent">
                <button
                  type="button"
                  disabled={selected.quantity <= 1}
                  onClick={() =>
                    onSelect({ ...selected, quantity: Math.max(1, selected.quantity - 1) })
                  }
                  aria-label="Decrease"
                  className="flex h-full w-[35px] items-center justify-center text-[16px] text-black hover:bg-black/[0.04] disabled:opacity-40"
                >
                  −
                </button>
                <span className="flex-1 text-center text-[15px] text-black select-none">
                  {selected.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onSelect({ ...selected, quantity: selected.quantity + 1 })
                  }
                  aria-label="Increase"
                  className="flex h-full w-[35px] items-center justify-center text-[16px] text-black hover:bg-black/[0.04]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Line total */}
            <p className="w-[120px] text-left text-[15px] font-normal text-black sm:text-right">
              BDT {Math.round(selected.price * selected.quantity)}৳
            </p>
          </div>
        )}
      </div>

      {/* Picker modal */}
      {showPicker && (
        <KeyringPickerModal
          keyrings={keyrings}
          initial={selected}
          onSave={(k) => {
            onSelect(k);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
