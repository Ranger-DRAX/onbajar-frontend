"use client";

import { useState } from "react";
import Image from "next/image";
import type { Addon } from "@/types/addon";
import type { AddonCartEntry } from "./types";
import GiftCardModal from "./GiftCardModal";

interface AddonRowProps {
  addon: Addon;
  entry: AddonCartEntry;
  onChange: (entry: AddonCartEntry) => void;
}

/** Addons that have a customerNote prompt — show a "Write message" button */
const NOTE_KEYWORDS = ["card", "note", "letter", "message"];

function isNoteAddon(addon: Addon) {
  const name = addon.name.toLowerCase();
  return NOTE_KEYWORDS.some((kw) => name.includes(kw));
}

export default function AddonRow({ addon, entry, onChange }: AddonRowProps) {
  const [showModal, setShowModal] = useState(false);

  const handleNoteOpen = () => {
    // First add qty=1 so the addon is counted
    if (entry.quantity === 0) {
      onChange({ ...entry, quantity: 1 });
    }
    setShowModal(true);
  };

  const handleNoteSave = (note: string) => {
    onChange({ ...entry, customerNote: note, quantity: Math.max(1, entry.quantity) });
  };

  const increment = () => onChange({ ...entry, quantity: entry.quantity + 1 });
  const decrement = () => {
    const next = entry.quantity - 1;
    onChange({ ...entry, quantity: next, customerNote: next === 0 ? null : entry.customerNote });
  };

  const showNoteBtn = isNoteAddon(addon);

  return (
    <>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-[88px_minmax(180px,1fr)_117px_120px] sm:items-center sm:gap-x-[26px]">
        {/* Image */}
        <div className="relative h-[110px] w-[88px] overflow-hidden bg-[#E8E8E8]">
          <Image
            src={addon.image}
            alt={addon.name}
            fill
            unoptimized
            className="object-cover"
            sizes="88px"
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="text-[15px] leading-[20px] font-normal text-black uppercase">
            {addon.name}
          </p>
          <p className="mt-[4px] text-[15px] leading-[20px] text-black">
            BDT. {addon.price}
          </p>

          {/* Note button — only for card-type addons */}
          {showNoteBtn && (
            <button
              type="button"
              onClick={handleNoteOpen}
              className="mt-[6px] inline-flex items-center gap-1 text-[12px] text-neutral-500 underline underline-offset-2 transition-colors hover:text-black"
            >
              {entry.customerNote
                ? "✎ Edit message"
                : "+ Add gift message"}
            </button>
          )}

          {/* Preview written message */}
          {entry.customerNote && (
            <p className="mt-1 text-[11px] leading-snug text-neutral-400 italic line-clamp-2">
              "{entry.customerNote}"
            </p>
          )}
        </div>

        {/* Quantity control */}
        <div className="sm:justify-self-center">
          <div className="flex h-[35px] w-[117px] shrink-0 items-center border-[0.5px] border-[#8E8E8E] bg-transparent">
            <button
              type="button"
              disabled={entry.quantity <= 0}
              onClick={decrement}
              aria-label="Decrease"
              className="flex h-full w-[35px] items-center justify-center text-[16px] leading-none text-black transition-colors hover:bg-black/[0.04] disabled:opacity-40"
            >
              −
            </button>
            <span className="flex-1 text-center text-[15px] leading-[20px] text-black select-none">
              {entry.quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              aria-label="Increase"
              className="flex h-full w-[35px] items-center justify-center text-[16px] leading-none text-black transition-colors hover:bg-black/[0.04]"
            >
              +
            </button>
          </div>
        </div>

        {/* Line total */}
        <p className="w-[120px] text-left text-[15px] leading-[20px] font-normal text-black sm:text-right">
          BDT {(addon.price * entry.quantity).toFixed(addon.price % 1 === 0 ? 0 : 2)}৳
        </p>
      </div>

      {showModal && (
        <GiftCardModal
          addon={addon}
          initialNote={entry.customerNote ?? ""}
          onSave={handleNoteSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
