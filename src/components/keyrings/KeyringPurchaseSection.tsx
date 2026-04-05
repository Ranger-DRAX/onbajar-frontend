"use client";

import { useState } from "react";
import type { Keyring } from "@/types/keyring";
import KeyringPersonalisation from "./KeyringPersonalisation";
import KeyringAddToCart from "./KeyringAddToCart";

type Props = {
  keyring: Keyring;
};

export default function KeyringPurchaseSection({ keyring }: Props) {
  const [personalisationData, setPersonalisationData] = useState<
    Record<string, string>
  >({});

  // 1. Synthesize fields if backend didn't provide them but keyringType expects them
  let fields = keyring.personalisation || [];
  if (fields.length === 0) {
    if (keyring.keyringType === "singleWord" || keyring.keyringType === "singleword") {
      fields = [{ type: "text", label: "Single Word", required: true, maxLength: 10, maxWords: 1 }];
    } else if (keyring.keyringType === "doubleWord" || keyring.keyringType === "doubleword") {
      fields = [{ type: "text", label: "Double Word", required: true, maxLength: 21, maxWords: 2 }];
    } else if (keyring.keyringType === "initial" || keyring.keyringType === "singleLetter" || keyring.keyringType === "singleletter") {
      fields = [{ type: "text", label: "Single Letter", required: true, maxLength: 1, maxWords: 1 }];
    }
  }

  // Generate a friendly display name for the keyring type
  const typeLabels: Record<string, string> = {
    singleWord: "Single Word",
    singleword: "Single Word",
    doubleWord: "Double Word",
    doubleword: "Double Word",
    initial: "Initial (1 Letter)",
    singleLetter: "Single Letter",
    singleletter: "Single Letter",
  };
  const typeDisplay = keyring.keyringType ? typeLabels[keyring.keyringType] : null;

  return (
    <>
      {typeDisplay && (
        <div className="mb-4 inline-flex items-center gap-2 rounded border border-black/10 bg-black/5 px-3 py-1.5 text-sm font-medium text-black/80">
          <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Personalisation Type: {typeDisplay}
        </div>
      )}
      <KeyringPersonalisation
        fields={fields}
        onChange={setPersonalisationData}
      />
      <KeyringAddToCart
        keyring={{ ...keyring, personalisation: fields }}
        personalisationData={personalisationData}
      />
    </>
  );
}
