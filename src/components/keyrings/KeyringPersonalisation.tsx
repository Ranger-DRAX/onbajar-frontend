"use client";

import { useState } from "react";
import type { KeyringPersonalisationField } from "@/types/keyring";

type Props = {
  fields: KeyringPersonalisationField[];
  onChange?: (values: Record<string, string>) => void;
};

export default function KeyringPersonalisation({ fields, onChange }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  if (!fields || fields.length === 0) return null;

  const handleChange = (
    label: string,
    value: string,
    field: KeyringPersonalisationField,
  ) => {
    let finalValue = value;
    const lowerLabel = field.label.toLowerCase();

    // 1. Enforce Initial / Single Letter Logic
    if (
      lowerLabel.includes("initial") ||
      lowerLabel.includes("single letter")
    ) {
      // Strictly 1 A-Z letter, uppercased
      const matched = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
      finalValue = matched.slice(0, 1);
    }

    // 2. Enforce Word Limit (for others)
    if (
      field.maxWords &&
      !(lowerLabel.includes("initial") || lowerLabel.includes("single letter"))
    ) {
      const words =
        finalValue.trim() === "" ? [] : finalValue.trim().split(/\s+/);
      if (words.length > field.maxWords) {
        return; // Block input if it exceeds word count
      }
    }

    const next = { ...values, [label]: finalValue };
    setValues(next);
    onChange?.(next);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-[22px] font-medium">Personalise</h3>
      {fields.map((field) => {
        const currentValue = values[field.label] ?? "";
        const words =
          currentValue.trim() === "" ? [] : currentValue.trim().split(/\s+/);
        const maxWords =
          field.maxWords ??
          (field.label.toLowerCase().includes("initial")
            ? 1
            : field.label.toLowerCase().includes("single word")
              ? 1
              : field.label.toLowerCase().includes("double word") ||
                  field.label.toLowerCase().includes("two word")
                ? 2
                : undefined);
        const maxLength =
          field.maxLength ??
          (field.label.toLowerCase().includes("initial")
            ? 1
            : field.label.toLowerCase().includes("single word")
              ? 10
              : field.label.toLowerCase().includes("double word") ||
                  field.label.toLowerCase().includes("two word")
                ? 21
                : undefined);

        return (
          <div key={field.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor={`personalisation-${field.label}`}
                className="block text-sm text-black/60"
              >
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <div className="text-[10px] tracking-tighter text-black/30 uppercase">
                {words.length} / {maxWords} Words
              </div>
            </div>

            <input
              id={`personalisation-${field.label}`}
              type="text"
              value={currentValue}
              onChange={(e) => handleChange(field.label, e.target.value, field)}
              placeholder={`Enter ${field.label.toLowerCase()}…`}
              required={field.required}
              maxLength={maxLength}
              className="h-11 w-full border border-black/20 bg-transparent px-4 text-sm text-black transition outline-none placeholder:text-black/30 focus:border-black"
            />
            {maxLength && (
              <div className="mt-1 flex justify-end">
                <span className="text-[10px] text-black/20">
                  {currentValue.length} / {maxLength}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
