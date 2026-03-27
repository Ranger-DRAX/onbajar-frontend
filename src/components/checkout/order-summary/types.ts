export type UpsellKey = "giftCard" | "eidCard" | "giftBox";

export type UpsellsState = Record<UpsellKey, number>;

export interface UpsellItemConfig {
  key: UpsellKey;
  title: string;
  image: string;
  alt: string;
}
