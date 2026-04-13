// Legacy – kept so existing callers don't break (quantity counters removed)
export type UpsellKey = "giftCard" | "eidCard" | "giftBox";
export type UpsellsState = Record<UpsellKey, number>;
export interface UpsellItemConfig {
  key: UpsellKey;
  title: string;
  image: string;
  alt: string;
}

// ── Dynamic addon entries ──────────────────────────────────────────────────
export type AddonCartEntry = {
  addon: string;      // addon _id
  quantity: number;
  customerNote: string | null; // null = not yet written; stripped from POST payload
};

// ── Keyring chosen in the checkout keyring picker ─────────────────────────
export type SelectedKeyring = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  currency: string;
  colors: string[];
  personalisationText: string;
  color: string;
  quantity: number;
};
