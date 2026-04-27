"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import type { Keyring } from "@/types/keyring";

type Props = {
  keyring: Keyring;
  personalisationData?: Record<string, string>;
};

export default function KeyringAddToCart({
  keyring,
  personalisationData,
}: Props) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const itemPrice = keyring.discount
    ? Math.round(keyring.price * (1 - keyring.discount.value / 100))
    : keyring.price;

  const handleAdd = () => {
    // Collect the raw user value (not "Label: value") — backend expects the
    // bare value only (e.g. "A" for an initial, not "Letter Of Your Choice: A").
    let rawPersonalisation = "";
    if (personalisationData && keyring.personalisation) {
      for (const field of keyring.personalisation) {
        const val = (personalisationData[field.label] || "").trim();
        if (field.required && !val) {
          alert(`${field.label} is required.`);
          return;
        }
        if (val) {
          const lowerLabel = field.label.toLowerCase();
          if (lowerLabel.includes("initial")) {
            // Backend: exactly 1 A–Z letter (case-insensitive)
            const letter = val
              .replace(/[^a-zA-Z]/g, "")
              .slice(0, 1)
              .toUpperCase();
            if (!letter) {
              alert(`${field.label} must be a letter A–Z.`);
              return;
            }
            rawPersonalisation = letter;
          } else if (lowerLabel.includes("single word")) {
            if (val.split(/\s+/).length > 1) {
              alert(`${field.label} must be a single word.`);
              return;
            }
            if (val.length > 10) {
              alert(`${field.label} cannot exceed 10 letters.`);
              return;
            }
            rawPersonalisation = val;
          } else if (
            lowerLabel.includes("double word") ||
            lowerLabel.includes("two word")
          ) {
            const words = val.split(/\s+/);
            if (words.length > 2) {
              alert(`${field.label} must be a maximum of 2 words.`);
              return;
            }
            if (val.replace(/\s+/g, "").length > 20) {
              alert(`${field.label} cannot exceed 20 letters in total.`);
              return;
            }
            rawPersonalisation = val;
          } else {
            rawPersonalisation = val;
          }
        }
      }
    }

    // Personalisation is optional — omit the field entirely when not provided
    const personalisationText = rawPersonalisation || undefined;

    for (let i = 0; i < qty; i += 1) {
      addItem({
        id: keyring.id,
        itemType: "keyring",
        title: keyring.title,
        price: itemPrice,
        currency: keyring.currency,
        imageUrl: keyring.images?.[0] ?? "https://placehold.co/479x599",
        size: null,
        personalisationText,
      });
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-[110px_151px] gap-3">
        <div className="flex h-11 items-center justify-between border border-black/20 px-3">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="text-xl leading-none"
          >
            −
          </button>
          <span className="text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="text-xl leading-none"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="h-11 bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Add to Cart
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="h-11 w-full bg-black px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Order Now
      </button>
    </div>
  );
}
