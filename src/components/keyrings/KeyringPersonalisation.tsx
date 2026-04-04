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

  const handleChange = (label: string, value: string) => {
    const next = { ...values, [label]: value };
    setValues(next);
    onChange?.(next);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-[22px] font-medium">Personalise</h3>
      {fields.map((field) => (
        <div key={field.label}>
          <label
            htmlFor={`personalisation-${field.label}`}
            className="mb-1.5 block text-sm text-black/60"
          >
            {field.label}
            {field.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
          <input
            id={`personalisation-${field.label}`}
            type="text"
            value={values[field.label] ?? ""}
            onChange={(e) => handleChange(field.label, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}…`}
            required={field.required}
            className="h-11 w-full border border-black/20 bg-transparent px-4 text-sm text-black outline-none placeholder:text-black/30 focus:border-black transition"
          />
        </div>
      ))}
    </div>
  );
}
