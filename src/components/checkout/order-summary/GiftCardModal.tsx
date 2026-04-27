"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Addon } from "@/types/addon";

interface GiftCardModalProps {
  addon: Addon;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function GiftCardModal({
  addon,
  initialNote,
  onSave,
  onClose,
}: GiftCardModalProps) {
  const [note, setNote] = useState(initialNote);
  const overlayRef = useRef<HTMLDivElement>(null);
  const words = countWords(note);
  const overLimit = words > 60;

  /* close on backdrop click */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (overLimit) return;
    onSave(note.trim());
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4"
    >
      {/* Exact Figma size: 365 × 519 */}
      <div
        className="relative flex flex-col overflow-hidden bg-white shadow-2xl"
        style={{ width: 365, height: 519 }}
      >
        {/* Card image — takes the top portion */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={addon.image}
            alt={addon.name}
            fill
            unoptimized
            className="object-cover"
            sizes="365px"
          />
        </div>

        {/* Writing section — fixed-height bottom panel */}
        <div
          className="flex shrink-0 flex-col gap-0 bg-white px-5 pt-4 pb-5"
          style={{ height: 175 }}
        >
          {/* Prompt label */}
          <p className="mb-3 text-[11px] tracking-wide text-neutral-400 uppercase">
            {addon.note
              ? addon.note.replace(/"/g, "")
              : "What would you like written on the card?"}
          </p>

          {/* Message textarea */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type here..."
            rows={3}
            className="w-full resize-none border-b border-neutral-300 bg-transparent text-[13px] leading-relaxed text-neutral-800 placeholder-neutral-300 outline-none focus:border-black"
          />

          {/* Word count */}
          <p
            className={`mt-1 text-right text-[11px] ${
              overLimit ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {words}/60 words
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 flex-1 items-center justify-center border border-neutral-300 text-[13px] text-neutral-600 transition-colors hover:border-black hover:text-black"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={overLimit}
              className="flex h-9 flex-1 items-center justify-center bg-black text-[13px] tracking-wide text-white transition-colors hover:bg-neutral-800 disabled:opacity-40"
            >
              SAVE
            </button>
          </div>
        </div>

        {/* Close × */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-white/80 text-neutral-600 shadow-sm hover:bg-white hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
