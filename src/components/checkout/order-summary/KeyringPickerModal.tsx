"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Keyring, KeyringPersonalisationField } from "@/types/keyring";
import type { SelectedKeyring } from "./types";

interface KeyringPickerModalProps {
  keyrings: Keyring[];
  initial: SelectedKeyring | null;
  onSave: (selected: SelectedKeyring) => void;
  onClose: () => void;
}

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function getWordLimit(field: KeyringPersonalisationField): number {
  return field.maxWords ?? 60;
}

export default function KeyringPickerModal({
  keyrings,
  initial,
  onSave,
  onClose,
}: KeyringPickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"pick" | "personalise">(
    initial ? "personalise" : "pick",
  );
  const [chosen, setChosen] = useState<Keyring | null>(
    initial ? (keyrings.find((k) => k.id === initial.id) ?? null) : null,
  );
  const [color, setColor] = useState(initial?.color ?? "");
  const [qty, setQty] = useState(initial?.quantity ?? 1);

  /* Personalisation field values keyed by field label */
  const [personalisationValues, setPersonalisationValues] = useState<
    Record<string, string>
  >(initial ? { text: initial.personalisationText } : {});

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const selectKeyring = (k: Keyring) => {
    setChosen(k);
    setColor(k.colors[0] ?? "");
    setPersonalisationValues({});
    setQty(1);
    setStep("personalise");
  };

  /* Validate: all required fields must have a value within word limit */
  const canSave = (() => {
    if (!chosen) return false;
    for (const field of chosen.personalisation) {
      const val = personalisationValues[field.label] ?? "";
      if (field.required && !val.trim()) return false;
      const limit = getWordLimit(field);
      if (field.type === "text" && countWords(val) > limit) return false;
    }
    return true;
  })();

  /* Build a single personalisationText from all text fields (join with space) */
  const buildPersonalisationText = (): string => {
    if (!chosen) return "";
    return chosen.personalisation
      .filter((f) => f.type === "text")
      .map((f) => (personalisationValues[f.label] ?? "").trim())
      .filter(Boolean)
      .join(" ");
  };

  const handleSave = () => {
    if (!chosen || !canSave) return;
    onSave({
      id: chosen.id,
      title: chosen.title,
      imageUrl: chosen.images[0] ?? "",
      price: chosen.effectivePrice,
      currency: chosen.currency,
      colors: chosen.colors,
      color,
      personalisationText: buildPersonalisationText(),
      quantity: qty,
    });
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
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-3">
          <div className="flex items-center gap-2">
            {step === "personalise" && (
              <button
                type="button"
                onClick={() => setStep("pick")}
                className="text-neutral-500 hover:text-black"
                aria-label="Back"
              >
                ←
              </button>
            )}
            <p className="text-[13px] font-medium uppercase tracking-wider text-black">
              {step === "pick" ? "Choose a Keyring" : chosen?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Step 1: keyring grid ── */}
        {step === "pick" && (
          <div className="flex-1 overflow-y-auto p-4">
            {keyrings.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-400">
                No keyrings available.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {keyrings.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => selectKeyring(k)}
                    className="group flex flex-col overflow-hidden border border-neutral-200 text-left transition-all hover:border-black"
                  >
                    <div className="relative h-[110px] w-full bg-neutral-100">
                      <Image
                        src={
                          k.images[0] ?? "https://placehold.co/160x110"
                        }
                        alt={k.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="160px"
                      />
                    </div>
                    <div className="px-2 py-2">
                      <p className="line-clamp-2 text-[12px] font-medium leading-tight text-black uppercase">
                        {k.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {k.currency}. {Math.round(k.effectivePrice)}৳
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: personalise ── */}
        {step === "personalise" && chosen && (
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Keyring image banner */}
            <div className="relative h-[140px] w-full shrink-0 bg-neutral-100">
              <Image
                src={chosen.images[0] ?? "https://placehold.co/365x140"}
                alt={chosen.title}
                fill
                unoptimized
                className="object-cover"
                sizes="365px"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
              {/* Color selector */}
              {chosen.colors.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-500">
                    Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chosen.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`border px-3 py-1 text-[12px] transition-all ${
                          color === c
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-600 hover:border-black"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalisation fields — driven by keyring.personalisation[] from API */}
              {chosen.personalisation.length > 0 ? (
                chosen.personalisation.map((field) => {
                  const val = personalisationValues[field.label] ?? "";
                  const wordCount = countWords(val);
                  const limit = getWordLimit(field);
                  const over = wordCount > limit;

                  return (
                    <div key={field.label}>
                      <p className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500">
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-400">*</span>
                        )}
                      </p>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          setPersonalisationValues((prev) => ({
                            ...prev,
                            [field.label]: e.target.value,
                          }))
                        }
                        placeholder={`e.g. Your text`}
                        className="w-full border-b border-neutral-300 bg-transparent pb-1 text-[13px] text-neutral-800 outline-none placeholder-neutral-300 focus:border-black"
                      />
                      {field.maxWords && (
                        <span
                          className={`mt-0.5 block text-right text-[11px] ${
                            over ? "text-red-500" : "text-neutral-400"
                          }`}
                        >
                          {wordCount}/{limit} words
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                /* Fallback if API has no personalisation fields defined */
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500">
                    Personalisation Text
                    <span className="ml-1 text-red-400">*</span>
                  </p>
                  <input
                    type="text"
                    value={personalisationValues["text"] ?? ""}
                    onChange={(e) =>
                      setPersonalisationValues({ text: e.target.value })
                    }
                    placeholder="e.g. Fahad"
                    className="w-full border-b border-neutral-300 bg-transparent pb-1 text-[13px] text-neutral-800 outline-none placeholder-neutral-300 focus:border-black"
                  />
                  <span
                    className={`mt-0.5 block text-right text-[11px] ${
                      countWords(personalisationValues["text"] ?? "") > 60
                        ? "text-red-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {countWords(personalisationValues["text"] ?? "")}/60 words
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-500">
                  Quantity
                </p>
                <div className="flex h-9 w-[120px] items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-full w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-[13px]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-full w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <p className="text-[13px] text-neutral-500">
                Price:{" "}
                <span className="font-medium text-black">
                  {chosen.currency}. {Math.round(chosen.effectivePrice * qty)}৳
                </span>
              </p>

              {/* Actions */}
              <div className="flex gap-2 pb-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 flex-1 items-center justify-center border border-neutral-300 text-[13px] text-neutral-600 hover:border-black hover:text-black"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex h-9 flex-1 items-center justify-center bg-black text-[13px] tracking-wide text-white hover:bg-neutral-800 disabled:opacity-40"
                >
                  ADD KEYRING
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
